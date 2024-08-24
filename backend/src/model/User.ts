import { Role } from './Role';

export interface User {
  id: string;
  name: string;
  socketId: string;
  roles: Role[];
}
