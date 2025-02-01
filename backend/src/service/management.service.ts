import { Option, optionFromString } from 'src/model/Option'
import { Injectable } from '@nestjs/common'
import { Lobby } from 'src/model/Lobby'
import { LobbyState } from 'src/model/LobbyState'
import { randomUUID } from 'crypto'

@Injectable()
export class ManagementService {
  private activeLobbies: Map<string, Lobby> = new Map<string, Lobby>()

  createNewLobby(lobbyName: string, availableCards: string[], enabledOptions: string[]): string {
    let lobbyId = randomUUID().substring(0, 8)

    while (this.activeLobbies.has(lobbyId)) {
      lobbyId = randomUUID().substring(0, 8)
    }

    const validEnabledOptions = this.validateOptions(enabledOptions)

    const lobby = new Lobby(
      lobbyId,
      lobbyName,
      [],
      availableCards,
      LobbyState.VOTING,
      validEnabledOptions,
    )
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

  private validateOptions(enabledOptions: string[]): Option[] {
    if (!enabledOptions) {
      return []
    }

    return enabledOptions
      .map((enabled) => optionFromString(enabled))
      .filter((option) => option !== null)
  }
}
