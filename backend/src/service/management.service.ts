import { Injectable } from '@nestjs/common'
import { Lobby } from 'src/model/Lobby'
import { LobbyState } from 'src/model/LobbyState'
import { randomUUID } from 'crypto'

@Injectable()
export class ManagementService {
  private activeLobbies: Map<string, Lobby> = new Map<string, Lobby>()

  createNewLobby(lobbyName: string, availableCards: string[]): string {
    let lobbyId = randomUUID().substring(0, 8)

    while (this.activeLobbies.has(lobbyId)) {
      lobbyId = randomUUID().substring(0, 8)
    }

    const lobby = new Lobby(lobbyId, lobbyName, [], availableCards, LobbyState.VOTING)
    this.activeLobbies.set(lobbyId, lobby)

    return lobbyId
  }

  discardLobby(lobbyId: string) {
    this.activeLobbies.delete(lobbyId)
  }

  getLobby(lobbyId: string): Lobby | undefined {
    return this.activeLobbies.get(lobbyId)
  }

  hasLobby(lobbyId: string): boolean {
    return this.activeLobbies.has(lobbyId)
  }

  getLobbies(): Map<string, Lobby> {
    return this.activeLobbies
  }
}
