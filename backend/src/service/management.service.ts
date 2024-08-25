import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Lobby } from 'src/model/Lobby';
import { LobbyState } from 'src/model/LobbyState';
import { Role } from 'src/model/Role';
import { User } from 'src/model/User';

@Injectable()
export class ManagementService {
  private activeLobbies: Map<string, Lobby> = new Map<string, Lobby>();

  createNewLobby(): string {
    let lobbyId = randomUUID().substring(0, 8);

    while (this.activeLobbies.has(lobbyId)) {
      lobbyId = randomUUID().substring(0, 8);
    }

    this.activeLobbies.set(lobbyId, {
      id: lobbyId,
      users: [],
      cardCollection: ['1', '2', '3', '5', '8', '13', '21'],
      state: LobbyState.VOTING,
    });

    console.log('created new lobby: ' + lobbyId);
    return lobbyId;
  }

  addUserToLobby(lobbyId: string, user: User): Lobby {
    if (!this.activeLobbies.has(lobbyId)) {
      throw new Error('Lobby does not exist');
    }

    if (this.activeLobbies.get(lobbyId)!.users.find((u) => u.id === user.id)) {
      throw new Error('User already in lobby');
    }

    // The first User of a Lobby is always an Admin
    if (this.activeLobbies.get(lobbyId)!.users.length === 0) {
      user.roles.push(Role.ADMIN);
    }

    this.activeLobbies.get(lobbyId)!.users.push(user);
    console.log('added user to lobby: ' + lobbyId);
    return this.activeLobbies.get(lobbyId)!;
  }

  getLobby(lobbyId: string): Lobby | undefined {
    return this.activeLobbies.get(lobbyId);
  }
}
