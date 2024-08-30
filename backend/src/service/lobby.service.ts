import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { ManagementService } from './management.service';
import { Socket } from 'socket.io';
import { LobbyGateway } from 'src/gateway/lobby.gateway';
import { Role, roleFromString } from 'src/model/Role';
import { LobbyState } from 'src/model/LobbyState';
import { Lobby } from 'src/model/Lobby';
import { User } from 'src/model/User';

@Injectable()
export class LobbyService {
  constructor(
    @Inject(forwardRef(() => LobbyGateway))
    private lobbyGateway: LobbyGateway,
  ) {}

  addUserToLobby(
    lobbyId: string,
    id: string,
    name: string,
    role: string,
    client: Socket,
  ) {
    if (!ManagementService.activeLobbies.has(lobbyId)) {
      return;
    }

    const lobby = ManagementService.activeLobbies.get(lobbyId);
    const user = User.fromRequest(id, name, roleFromString(role), client);
    lobby!.addUser(user);
    this.lobbyGateway.joinRoom(client, lobbyId);
    this.lobbyGateway.sendFullLobbyInformationToLobby(lobby!, false);
  }

  removeUserFromLobby(lobbyId: string, client: Socket) {
    if (!ManagementService.activeLobbies.has(lobbyId)) {
      return;
    }

    const lobby = ManagementService.activeLobbies.get(lobbyId);
    lobby!.removeUser(client);
    this.lobbyGateway.leaveRoom(client, lobbyId);
    this.lobbyGateway.sendFullLobbyInformationToLobby(lobby!, false);
  }

  selectCardForUser(lobbyId: string, socket: Socket, cardId: string) {
    if (!ManagementService.activeLobbies.has(lobbyId)) {
      return;
    }

    const lobby = ManagementService.activeLobbies.get(lobbyId);
    const user = lobby!.users.find((u) => u.socketId === socket.id);
    if (!user) {
      return;
    }

    if (lobby!.cardCollection.includes(cardId)) {
      user.selectCard(cardId);
      this.lobbyGateway.confirmCardSelection(user.client, cardId);
    }

    this.lobbyGateway.sendCardSelectionInformation(lobby!, user);
  }

  showCards(lobbyId: string, socket: Socket) {
    if (!ManagementService.activeLobbies.has(lobbyId)) {
      return;
    }

    const lobby = ManagementService.activeLobbies.get(lobbyId);
    if (!this.validateUserIsInLobbyAndIsAdming(lobby!, socket)) {
      return;
    }

    lobby!.state = LobbyState.OVERVIEW;
    this.lobbyGateway.sendFullLobbyInformationToLobby(lobby!, true);
  }

  resetLobby(lobbyId: string, socket: Socket) {
    if (!ManagementService.activeLobbies.has(lobbyId)) {
      return;
    }

    const lobby = ManagementService.activeLobbies.get(lobbyId);
    if (!this.validateUserIsInLobbyAndIsAdming(lobby!, socket)) {
      return;
    }

    lobby!.state = LobbyState.VOTING;
    lobby!.users.forEach((u) => {
      u.selectCard(undefined);
    });
    this.lobbyGateway.sendFullLobbyInformationToLobby(lobby!, false);
  }

  removeUserFromAllLobbies(socket: Socket) {
    ManagementService.activeLobbies.forEach((lobby) => {
      lobby.removeUser(socket);
      socket.leave(lobby.id);
    });
  }

  private validateUserIsInLobbyAndIsAdming(lobby: Lobby, socket: Socket) {
    const user = lobby.users.find((u) => u.socketId === socket.id);
    if (!user) {
      return false;
    }

    if (!user.roles.includes(Role.ADMIN)) {
      return false;
    }

    return true;
  }
}
