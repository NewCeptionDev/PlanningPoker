import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { randomUUID } from 'crypto';
import { Server, Socket } from 'socket.io';
import { toDisplayLobby } from 'src/model/DisplayLobby';
import { Lobby } from 'src/model/Lobby';
import { LobbyState } from 'src/model/LobbyState';
import { Role } from 'src/model/Role';
import { User } from 'src/model/User';
import { ManagementService } from 'src/service/management.service';

@WebSocketGateway()
export class LobbyGateway {
  @WebSocketServer()
  private server: Server;

  constructor(private managementService: ManagementService) {}

  @SubscribeMessage('joinLobby')
  handleJoinLobby(
    @MessageBody('lobbyId') lobbyId: string,
    @ConnectedSocket() client: Socket,
  ) {
    console.log('joining lobby: ' + lobbyId);
    try {
      const user = {
        id: randomUUID(),
        socketId: client.id,
        name: 'TestUser',
        roles: [Role.PLAYER],
        selectedCard: undefined,
        client,
      };
      const lobby = this.managementService.addUserToLobby(lobbyId, user);
      client.join(lobbyId);
      this.sendFullLobbyInformationToUser(lobby, user);
    } catch (error) {
      console.log(error);
    }
  }

  @SubscribeMessage('selectCard')
  handleSelectCard(
    @MessageBody('lobbyId') lobbyId: string,
    @MessageBody('cardValue') cardId: string,
    @ConnectedSocket() client: Socket,
  ) {
    console.log('selecting card: ' + cardId);

    const lobby = this.managementService.getLobby(lobbyId);
    if (!lobby) {
      return;
    }

    const user = lobby.users.find((u) => u.id === client.id);
    if (!user) {
      return;
    }

    if (lobby.cardCollection.includes(cardId)) {
      user.selectedCard = cardId;
    }

    this.sendCardSelectionInformation(lobby, user);
  }

  @SubscribeMessage('leaveLobby')
  handleLeaveLobby(
    @MessageBody('lobbyId') lobbyId: string,
    @ConnectedSocket() client: Socket,
  ) {
    console.log('leaving lobby: ' + lobbyId);
    const lobby = this.managementService.getLobby(lobbyId);
    if (!lobby) {
      return;
    }

    const user = lobby.users.find((u) => u.id === client.id);
    if (!user) {
      return;
    }

    lobby.users = lobby.users.filter((u) => u.id !== user.id);
    client.leave(lobbyId);
  }

  @SubscribeMessage('showCards')
  handleShowCards(
    @MessageBody('lobbyId') lobbyId: string,
    @ConnectedSocket() client: Socket,
  ) {
    console.log('showing cards: ' + lobbyId);
    const lobby = this.managementService.getLobby(lobbyId);
    if (!lobby) {
      return;
    }

    const user = lobby.users.find((u) => u.id === client.id);
    if (!user) {
      return;
    }

    if (!user.roles.includes(Role.ADMIN)) {
      return;
    }

    lobby.state = LobbyState.OVERVIEW;
    this.sendFullLobbyInformationToLobby(lobby);
  }

  @SubscribeMessage('reset')
  handleReset(
    @MessageBody('lobbyId') lobbyId: string,
    @ConnectedSocket() client: Socket,
  ) {
    console.log('resetting lobby: ' + lobbyId);
    const lobby = this.managementService.getLobby(lobbyId);
    if (!lobby) {
      return;
    }

    const user = lobby.users.find((u) => u.id === client.id);
    if (!user) {
      return;
    }

    if (!user.roles.includes(Role.ADMIN)) {
      return;
    }

    lobby.state = LobbyState.VOTING;
    lobby.users.forEach((u) => {
      u.selectedCard = undefined;
    });
    this.sendFullLobbyInformationToLobby(lobby);
  }

  private sendFullLobbyInformationToUser(lobby: Lobby, user: User) {
    user.client.emit('fullLobbyInformation', toDisplayLobby(lobby, false));
  }

  private sendFullLobbyInformationToLobby(lobby: Lobby) {
    this.server
      .to(lobby.id)
      .emit('fullLobbyInformation', toDisplayLobby(lobby, true));
  }

  private sendCardSelectionInformation(lobby: Lobby, user: User) {
    this.server.to(lobby.id).emit('cardSelected', user.id);
  }
}
