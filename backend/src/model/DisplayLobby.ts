import { DisplayUser } from './DisplayUser';
import { LobbyState } from './LobbyState';

export interface DisplayLobby {
  users: DisplayUser[];
  cardCollection: string[];
  state: LobbyState;
}
