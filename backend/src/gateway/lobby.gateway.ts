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
    this.lobbyService.addUserToLobby(lobbyId, userId, name, role, client);
  }

  @SubscribeMessage('selectCard')
  handleSelectCard(
    @MessageBody('lobbyId') lobbyId: string,
    @MessageBody('cardValue') cardId: string,
    @ConnectedSocket() client: Socket,
  ) {
    this.lobbyService.selectCardForUser(lobbyId, client, cardId);
  }

  @SubscribeMessage('leaveLobby')
  handleLeaveLobby(
    @MessageBody('lobbyId') lobbyId: string,
    @ConnectedSocket() client: Socket,
  ) {
    this.lobbyService.removeUserFromLobby(lobbyId, client);
  }

  @SubscribeMessage('showCards')
  handleShowCards(
    @MessageBody('lobbyId') lobbyId: string,
    @ConnectedSocket() client: Socket,
  ) {
    this.lobbyService.showCards(lobbyId, client);
  }

  @SubscribeMessage('reset')
  handleReset(
    @MessageBody('lobbyId') lobbyId: string,
    @ConnectedSocket() client: Socket,
  ) {
    this.lobbyService.resetLobby(lobbyId, client);
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

  public sendLobbyInformationToUser(lobby: Lobby, user: User) {
    user.client.emit(
      'fullLobbyInformation',
      lobby.toDisplayLobbyForUser(user.id),
    );
  }

  /*
   * Util
   */

  public joinRoom(client: Socket, lobbyId: string) {
    client.join(lobbyId);
  }

  public leaveRoom(client: Socket, lobbyId: string) {
    client.leave(lobbyId);
  }
}
