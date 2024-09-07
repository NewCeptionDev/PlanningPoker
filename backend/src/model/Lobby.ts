import { Socket } from 'socket.io';
import { DisplayLobby } from './DisplayLobby';
import { LobbyState } from './LobbyState';
import { User } from './User';
import { Role } from './Role';

export class Lobby {
  id: string;
  name: string;
  users: User[];
  cardCollection: string[];
  state: LobbyState;

  constructor(
    id: string,
    name: string,
    users: User[],
    cardCollection: string[],
    state: LobbyState,
  ) {
    this.id = id;
    this.name = name;
    this.users = users;
    this.cardCollection = cardCollection;
    this.state = state;
  }

  toDisplayLobby(fullInformation: boolean): DisplayLobby {
    return {
      name: this.name,
      users: this.users.map((u) => u.toDisplayUser(fullInformation)),
      cardCollection: this.cardCollection,
      state: this.state,
    };
  }

  toDisplayLobbyForUser(userId: string): DisplayLobby {
    return {
      name: this.name,
      users: this.users.map((u) =>
        u.toDisplayUser(u.id === userId || this.state === LobbyState.OVERVIEW),
      ),
      cardCollection: this.cardCollection,
      state: this.state,
    };
  }

  addUser(user: User) {
    if (this.users.find((u) => u.id === user.id)) {
      return;
    }

    // The first User of a Lobby is always an Admin
    if (this.users.length === 0) {
      user.roles.push(Role.ADMIN);
    }

    this.users.push(user);
  }

  removeUser(socket: Socket): boolean {
    const user = this.users.find((u) => u.socketId === socket.id);
    if (!user) {
      return false;
    }
    this.users = this.users.filter((u) => u.socketId !== socket.id);
    return true;
  }
}
