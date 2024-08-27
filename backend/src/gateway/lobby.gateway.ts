import { forwardRef, Inject } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Lobby } from 'src/model/Lobby';
import { User } from 'src/model/User';
import { LobbyService } from 'src/service/lobby.service';
import { ManagementService } from 'src/service/management.service';

@WebSocketGateway()
export class LobbyGateway {
  @WebSocketServer()
  private server: Server;

  constructor(
    private managementService: ManagementService,
    @Inject(forwardRef(() => LobbyService))
    private lobbyService: LobbyService,
  ) {}

  /*
   * Receiving messages
   */

  @SubscribeMessage('joinLobby')
  handleJoinLobby(
    @MessageBody('lobbyId') lobbyId: string,
    @ConnectedSocket() client: Socket,
  ) {
    console.log('joining lobby: ' + lobbyId);
    const lobby = this.managementService.addUserToLobby(lobbyId, client);
    if (!lobby) {
      return;
    }
    client.join(lobbyId);
    this.sendFullLobbyInformationToUser(lobby, client);
  }

  @SubscribeMessage('selectCard')
  handleSelectCard(
    @MessageBody('lobbyId') lobbyId: string,
    @MessageBody('cardValue') cardId: string,
    @ConnectedSocket() client: Socket,
  ) {
    console.log('selecting card: ' + cardId);
    this.lobbyService.selectCardForUser(lobbyId, client, cardId);
  }

  @SubscribeMessage('leaveLobby')
  handleLeaveLobby(
    @MessageBody('lobbyId') lobbyId: string,
    @ConnectedSocket() client: Socket,
  ) {
    console.log('leaving lobby: ' + lobbyId);
    this.managementService.removeUserFromLobby(lobbyId, client);
    client.leave(lobbyId);
  }

  @SubscribeMessage('showCards')
  handleShowCards(
    @MessageBody('lobbyId') lobbyId: string,
    @ConnectedSocket() client: Socket,
  ) {
    this.lobbyService.showCards(lobbyId, client);
    console.log('showing cards: ' + lobbyId);
  }

  @SubscribeMessage('reset')
  handleReset(
    @MessageBody('lobbyId') lobbyId: string,
    @ConnectedSocket() client: Socket,
  ) {
    this.lobbyService.resetLobby(lobbyId, client);
    console.log('resetting lobby: ' + lobbyId);
  }

  /*
   * Sending messages
   */

  public sendFullLobbyInformationToUser(lobby: Lobby, client: Socket) {
    client.emit('fullLobbyInformation', lobby.toDisplayLobby(false));
  }

  public sendFullLobbyInformationToLobby(lobby: Lobby) {
    this.server
      .to(lobby.id)
      .emit('fullLobbyInformation', lobby.toDisplayLobby(true));
  }

  public sendCardSelectionInformation(lobby: Lobby, user: User) {
    this.server.to(lobby.id).emit('cardSelected', user.id);
  }
}
