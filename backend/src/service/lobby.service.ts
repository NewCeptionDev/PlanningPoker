import { Inject, Injectable, forwardRef } from '@nestjs/common'
import { Role, roleFromString } from 'src/model/Role'
import { Lobby } from 'src/model/Lobby'
import { LobbyGateway } from 'src/gateway/lobby.gateway'
import { LobbyState } from 'src/model/LobbyState'
import { ManagementService } from './management.service'
import { Socket } from 'socket.io'
import { User } from 'src/model/User'

@Injectable()
export class LobbyService {
  constructor(
    @Inject(forwardRef(() => LobbyGateway))
    private lobbyGateway: LobbyGateway,
    private managementService: ManagementService,
  ) {
    // Dependency Injection
  }

  addUserToLobby(lobbyId: string, id: string, name: string, role: string, client: Socket) {
    // Get Lobby if existing
    if (!this.managementService.hasLobby(lobbyId)) {
      return
    }
    const lobby = this.managementService.getLobby(lobbyId)

    // Create User and join lobby and websocket room
    const user = User.fromRequest(id, name, roleFromString(role), client)
    lobby!.addUser(user)
    this.lobbyGateway.joinRoom(client, lobbyId)

    // Send updated lobby information to everyone
    this.sendLobbyInformationToEveryone(lobby!)
  }

  removeUserFromLobby(lobbyId: string, client: Socket) {
    // Get Lobby if existing
    if (!this.managementService.hasLobby(lobbyId)) {
      return
    }
    const lobby = this.managementService.getLobby(lobbyId)

    // Remove User and leave websocket room
    const userRemoved = lobby!.removeUser(client)
    if (!userRemoved) {
      return
    }
    this.lobbyGateway.leaveRoom(client, lobbyId)

    // If lobby is empty, discard it
    if (lobby!.users.length === 0) {
      this.managementService.discardLobby(lobbyId)
      return
    }

    // Send updated lobby information to everyone
    this.sendLobbyInformationToEveryone(lobby!)
  }

  removeDifferentUserFromLobby(lobbyId: string, userId: string, client: Socket) {
    // Get Lobby if existing
    if (!this.managementService.hasLobby(lobbyId)) {
      return
    }
    const lobby = this.managementService.getLobby(lobbyId)

    // Validate calling user is admin
    if (!this.validateUserIsInLobbyAndIsAdmin(lobby!, client)) {
      return
    }

    // Find user to be removed
    const user = lobby!.users.find((u) => u.id === userId)
    if (!user) {
      return
    }

    // Remove User and leave websocket room
    const userRemoved = lobby!.removeUser(client)
    if (!userRemoved) {
      return
    }
    this.lobbyGateway.leaveRoom(client, lobbyId)

    // Inform user that he has been kicked
    this.lobbyGateway.sendKickedMessageToUser(user)

    // Send updated lobby information to everyone
    this.sendLobbyInformationToEveryone(lobby!)
  }

  selectCardForUser(lobbyId: string, socket: Socket, cardId: string | undefined) {
    // Get Lobby if existing
    if (!this.managementService.hasLobby(lobbyId)) {
      return
    }
    const lobby = this.managementService.getLobby(lobbyId)

    // Find user
    const user = lobby!.users.find((u) => u.socketId === socket.id)
    if (!user) {
      return
    }

    // Validate user is player and can select a card
    if (!this.validateUserIsPlayer(user)) {
      return
    }

    // Validate card is in card deck or undefined
    if (cardId !== undefined && !lobby!.cardCollection.includes(cardId)) {
      return
    }

    // Update selected card for user
    user.selectCard(cardId)

    // Send updated lobby information to everyone
    this.sendLobbyInformationToEveryone(lobby!)
  }

  showCards(lobbyId: string, socket: Socket) {
    // Get Lobby if existing
    if (!this.managementService.hasLobby(lobbyId)) {
      return
    }
    const lobby = this.managementService.getLobby(lobbyId)

    // Validate user is in lobby and is admin
    if (!this.validateUserIsInLobbyAndIsAdmin(lobby!, socket)) {
      return
    }

    // Validate lobby is not already in OVERVIEW state
    if (lobby!.state === LobbyState.OVERVIEW) {
      return
    }

    // Update Lobby State to OVERVIEW and send full lobby information to everyone
    lobby!.state = LobbyState.OVERVIEW
    this.lobbyGateway.sendFullLobbyInformationToLobby(lobby!, true)
  }

  resetLobby(lobbyId: string, socket: Socket) {
    // Get Lobby if existing
    if (!this.managementService.hasLobby(lobbyId)) {
      return
    }
    const lobby = this.managementService.getLobby(lobbyId)

    // Validate user is in lobby and is admin
    if (!this.validateUserIsInLobbyAndIsAdmin(lobby!, socket)) {
      return
    }

    // Update Lobby State to VOTING, reset selected cards and send full lobby information to everyone
    lobby!.state = LobbyState.VOTING
    lobby!.resetSelectedCards()
    this.lobbyGateway.sendFullLobbyInformationToLobby(lobby!, false)
  }

  removeUserFromAllLobbies(socket: Socket) {
    // Run through all lobbies and try to remove the user
    this.managementService.getLobbies().forEach((lobby) => {
      const userRemoved = lobby.removeUser(socket)
      // If the user was removed, leave the websocket room and send updated lobby information to everyone
      if (userRemoved) {
        this.lobbyGateway.leaveRoom(socket, lobby.id)
        this.sendLobbyInformationToEveryone(lobby)
      }
    })
  }

  private validateUserIsInLobbyAndIsAdmin(lobby: Lobby, socket: Socket) {
    const user = lobby.users.find((u) => u.socketId === socket.id)
    if (!user) {
      return false
    }

    if (!user.roles.includes(Role.ADMIN)) {
      return false
    }

    return true
  }

  private validateUserIsPlayer(user: User): boolean {
    if (!user.roles.includes(Role.PLAYER)) {
      return false
    }

    return true
  }

  private sendLobbyInformationToEveryone(lobby: Lobby) {
    lobby!.users.forEach((u) => {
      this.lobbyGateway.sendLobbyInformationToUser(lobby!, u)
    })
  }
}
