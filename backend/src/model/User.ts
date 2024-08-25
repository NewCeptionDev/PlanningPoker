import { Socket } from 'socket.io';
import { Role } from './Role';

export interface User {
  id: string;
  socketId: string;
  name: string;
  roles: Role[];
  selectedCard: string | undefined;
  client: Socket;
}
