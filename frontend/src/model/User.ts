import { Role } from "./Role";

export interface User {
  id: string;
  name: string;
  cardSelected: boolean;
  selectedCard: string | undefined;
  roles: Role[];
}
