import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Lobby } from 'src/model/Lobby';
import { LobbyState } from 'src/model/LobbyState';

@Injectable()
export class ManagementService {
  public static activeLobbies: Map<string, Lobby> = new Map<string, Lobby>();

  createNewLobby(lobbyName: string, availableCards: string[]): string {
    let lobbyId = randomUUID().substring(0, 8);

    while (ManagementService.activeLobbies.has(lobbyId)) {
      lobbyId = randomUUID().substring(0, 8);
    }

    const lobby = new Lobby(
      lobbyId,
      lobbyName,
      [],
      availableCards,
      LobbyState.VOTING,
    );
    ManagementService.activeLobbies.set(lobbyId, lobby);

    console.log('created new lobby: ' + lobbyId);
    return lobbyId;
  }
}
