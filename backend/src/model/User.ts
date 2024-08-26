import { Socket } from 'socket.io';
import { Role } from './Role';
import { DisplayUser } from './DisplayUser';
import { randomUUID } from 'crypto';

export class User {
  id: string;
  socketId: string;
  name: string;
  roles: Role[];
  selectedCard: string | undefined;
  client: Socket;

  constructor(
    id: string,
    socketId: string,
    name: string,
    roles: Role[],
    selectedCard: string | undefined,
    client: Socket,
  ) {
    this.id = id;
    this.socketId = socketId;
    this.name = name;
    this.roles = roles;
    this.selectedCard = selectedCard;
    this.client = client;
  }

  static fromRequest(username: string, client: Socket) {
    return new User(
      randomUUID(),
      client.id,
      username,
      [Role.PLAYER],
      undefined,
      client,
    );
  }

  selectCard(cardId: string | undefined) {
    this.selectedCard = cardId;
  }

  toDisplayUser(fullInformation: boolean): DisplayUser {
    return {
      id: this.id,
      name: this.name,
      cardSelected: this.selectedCard !== undefined,
      selectedCard: fullInformation ? this.selectedCard : undefined,
      roles: this.roles,
    };
  }
}
