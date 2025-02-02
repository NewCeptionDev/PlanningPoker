export enum Option {
  AUTOREVEAL = 'AUTOREVEAL',
}

export function optionFromString(option: string): Option | null {
  switch (option) {
    case 'AUTOREVEAL':
      return Option.AUTOREVEAL
    default:
      return null
  }
}
