import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Lobby } from 'src/model/Lobby';
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
    });

    console.log('created new lobby: ' + lobbyId);
    return lobbyId;
  }

  addUserToLobby(lobbyId: string, user: User): void {
    if (!this.activeLobbies.has(lobbyId)) {
      throw new Error('Lobby does not exist');
    }
    this.activeLobbies.get(lobbyId)!.users.push(user);
    console.log('added user to lobby: ' + lobbyId);
  }
}
