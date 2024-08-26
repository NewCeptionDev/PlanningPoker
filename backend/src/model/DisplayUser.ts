import { Role } from './Role';
import { User } from './User';

export interface DisplayUser {
  id: string;
  name: string;
  cardSelected: boolean;
  selectedCard: string | undefined;
  roles: Role[];
}
