import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { Role } from 'src/model/Role';
import { ManagementService } from 'src/service/management.service';

@WebSocketGateway()
export class LobbyGateway {
  constructor(private managementService: ManagementService) {}

  @SubscribeMessage('joinLobby')
  handleJoinLobby(
    @MessageBody('lobbyId') lobbyId: string,
    @ConnectedSocket() client: Socket,
  ) {
    console.log('joining lobby: ' + lobbyId);
    try {
      this.managementService.addUserToLobby(lobbyId, {
        id: client.id,
        name: client.id,
        socketId: client.id,
        roles: [Role.PLAYER],
      });
      client.join(lobbyId);
    } catch (error) {
      console.log(error);
    }
  }
}
