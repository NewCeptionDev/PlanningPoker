import LobbyScreen from '@/app/[slug]/lobby'
import { Role } from '@/model/Role'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

jest.mock('next/navigation', () => ({
  useRouter: () => {
    return {
      prefetch: () => {},
    }
  },
}))

describe('Lobby', () => {
  beforeAll(() => {
    // @ts-expect-error only partially defined
    const response: Response = {
      ok: true,
      json: async () => {
        return {
          lobbyExists: true,
          lobbyName: 'Test',
        }
      },
    }
    global.fetch = jest.fn().mockResolvedValue(response)
  })

  beforeEach(() => {
    jest.resetModules()
  })

  it('should render correctly', () => {
    const { container } = render(
      <LobbyScreen
        lobbyId='1234'
        user={{
          id: '1234',
          name: 'Test',
          roles: [Role.PLAYER],
          cardSelected: false,
          selectedCard: undefined,
        }}
      />,
    )
    expect(container).toMatchSnapshot()
  })

  it('should render all important components', () => {
    render(
      <LobbyScreen
        lobbyId='1234'
        user={{
          id: '1234',
          name: 'Test',
          roles: [Role.PLAYER],
          cardSelected: false,
          selectedCard: undefined,
        }}
      />,
    )
    expect(screen.getByTestId('logo')).toBeInTheDocument()
    expect(screen.getByTestId('headline')).toBeInTheDocument()
    expect(screen.getByTestId('lobby-name')).toBeInTheDocument()
    expect(screen.getByTestId('theme-switcher')).toBeInTheDocument()
    expect(screen.getByTestId('lobby-info')).toBeInTheDocument()
    expect(screen.getByTestId('lobby-players')).toBeInTheDocument()
    expect(screen.getByTestId('lobby-users')).toBeInTheDocument()
    expect(screen.getByTestId('card-collection')).toBeInTheDocument()
  })
})
