import { DisplayUser } from './DisplayUser';
import { LobbyState } from './LobbyState';

export interface DisplayLobby {
  name: string;
  users: DisplayUser[];
  cardCollection: string[];
  state: LobbyState;
}
