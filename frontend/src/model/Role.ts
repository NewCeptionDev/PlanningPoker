export enum Role {
  PLAYER = "PLAYER",
  OBSERVER = "OBSERVER",
  ADMIN = "ADMIN",
}

export function roleFromString(role: string): Role {
  switch (role) {
    case "PLAYER":
      return Role.PLAYER;
    case "OBSERVER":
      return Role.OBSERVER;
    case "ADMIN":
      return Role.ADMIN;
    default:
      return Role.PLAYER;
  }
}
