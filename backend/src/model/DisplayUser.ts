import { Role } from './Role'

export interface DisplayUser {
  id: string
  name: string
  cardSelected: boolean
  selectedCard: string | undefined
  roles: Role[]
}
