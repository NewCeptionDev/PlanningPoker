import { Role } from './Role';
import { User } from './User';

export interface DisplayUser {
  id: string;
  name: string;
  cardSelected: boolean;
  selectedCard: string | undefined;
  roles: Role[];
}

export function toDisplayUser(
  user: User,
  fullInformation: boolean,
): DisplayUser {
  return {
    id: user.id,
    name: user.name,
    cardSelected: user.selectedCard !== undefined,
    selectedCard: fullInformation ? user.selectedCard : undefined,
    roles: user.roles,
  };
}
