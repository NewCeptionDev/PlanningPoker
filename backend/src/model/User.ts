import { Socket } from 'socket.io';
import { Role } from './Role';
import { DisplayUser } from './DisplayUser';

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

  static fromRequest(id: string, username: string, role: Role, client: Socket) {
    return new User(id, client.id, username, [role], undefined, client);
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
