import { DisplayUser, toDisplayUser } from './DisplayUser';
import { Lobby } from './Lobby';
import { LobbyState } from './LobbyState';

export interface DisplayLobby {
  users: DisplayUser[];
  cardCollection: string[];
  state: LobbyState;
}

export function toDisplayLobby(
  lobby: Lobby,
  fullInformation: boolean,
): DisplayLobby {
  return {
    users: lobby.users.map((u) => toDisplayUser(u, fullInformation)),
    cardCollection: lobby.cardCollection,
    state: lobby.state,
  };
}
