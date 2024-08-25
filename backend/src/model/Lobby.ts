import { LobbyState } from './LobbyState';
import { User } from './User';

export interface Lobby {
  id: string;
  users: User[];
  cardCollection: string[];
  state: LobbyState;
}
