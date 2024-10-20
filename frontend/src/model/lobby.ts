import { LobbyState } from './LobbyState'
import { User } from './User'

export interface Lobby {
  users: User[]
  cardCollection: string[]
  state: LobbyState
}
