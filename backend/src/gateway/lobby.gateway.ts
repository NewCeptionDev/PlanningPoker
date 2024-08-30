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

@WebSocketGateway()
export class LobbyGateway {
  @WebSocketServer()
  private server: Server;

  constructor(
    @Inject(forwardRef(() => LobbyService))
    private lobbyService: LobbyService,
  ) {}

  /*
   * Receiving messages
   */

  @SubscribeMessage('joinLobby')
  handleJoinLobby(
    @MessageBody('lobbyId') lobbyId: string,
    @MessageBody('userId') userId: string,
    @MessageBody('name') name: string,
    @MessageBody('role') role: string,
    @ConnectedSocket() client: Socket,
  ) {
    console.log('joining lobby: ' + lobbyId);
    this.lobbyService.addUserToLobby(lobbyId, userId, name, role, client);

    console.log('currently connected:', this.server.engine.clientsCount);
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
    this.lobbyService.removeUserFromLobby(lobbyId, client);
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

  @SubscribeMessage('disconnect')
  handleDisconnect(@ConnectedSocket() client: Socket) {
    this.lobbyService.removeUserFromAllLobbies(client);
  }

  /*
   * Sending messages
   */
  public sendFullLobbyInformationToLobby(lobby: Lobby, revealCards: boolean) {
    this.server
      .to(lobby.id)
      .emit('fullLobbyInformation', lobby.toDisplayLobby(revealCards));
  }

  public sendCardSelectionInformation(lobby: Lobby, user: User) {
    this.server.to(lobby.id).emit('cardSelected', user.id);
  }

  public joinRoom(client: Socket, lobbyId: string) {
    client.join(lobbyId);
  }

  public leaveRoom(client: Socket, lobbyId: string) {
    client.leave(lobbyId);
  }

  public confirmCardSelection(client: Socket, cardId: string) {
    console.log('confirming card selection: ' + cardId);
    client.emit('confirmCardSelection', cardId);
  }
}
