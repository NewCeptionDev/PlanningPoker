import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Socket } from 'socket.io';
import { Lobby } from 'src/model/Lobby';
import { LobbyState } from 'src/model/LobbyState';
import { User } from 'src/model/User';

@Injectable()
export class ManagementService {
  public static activeLobbies: Map<string, Lobby> = new Map<string, Lobby>();

  createNewLobby(): string {
    let lobbyId = randomUUID().substring(0, 8);

    while (ManagementService.activeLobbies.has(lobbyId)) {
      lobbyId = randomUUID().substring(0, 8);
    }

    const lobby = new Lobby(
      lobbyId,
      [],
      ['1', '2', '3', '5', '8', '13', '21'],
      LobbyState.VOTING,
    );
    ManagementService.activeLobbies.set(lobbyId, lobby);

    console.log('created new lobby: ' + lobbyId);
    return lobbyId;
  }

  addUserToLobby(lobbyId: string, client: Socket): Lobby | undefined {
    if (!ManagementService.activeLobbies.has(lobbyId)) {
      return;
    }

    const lobby = ManagementService.activeLobbies.get(lobbyId);
    const user = User.fromRequest('TestUser', client);
    lobby!.addUser(user);

    return lobby;
  }

  removeUserFromLobby(lobbyId: string, client: Socket): Lobby | undefined {
    if (!ManagementService.activeLobbies.has(lobbyId)) {
      return;
    }

    const lobby = ManagementService.activeLobbies.get(lobbyId);
    lobby!.removeUser(client.id);
  }
}
