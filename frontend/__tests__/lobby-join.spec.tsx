import { act, render, screen, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import LobbyJoin from 'src/app/[slug]/page'

jest.mock('next/navigation', () => ({
  useRouter: () => {
    return {
      prefetch: () => {},
    }
  },
}))

describe('LobbyJoin', () => {
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
    const { container } = render(<LobbyJoin params={{ slug: '1234' }} />)
    expect(container).toMatchSnapshot()
  })

  it('should render all important components', () => {
    render(<LobbyJoin params={{ slug: '1234' }} />)
    expect(screen.getByTestId('logo')).toBeInTheDocument()
    expect(screen.getByTestId('headline')).toBeInTheDocument()
    expect(screen.getByTestId('lobby-name')).toBeInTheDocument()
    expect(screen.getByTestId('theme-switcher')).toBeInTheDocument()
    expect(screen.getByTestId('lobby-join')).toBeInTheDocument()
    expect(screen.getByTestId('footer')).toBeInTheDocument()
  })

  it('should render correct lobby name', async () => {
    render(<LobbyJoin params={{ slug: '1234' }} />)

    await waitFor(() => expect(screen.getByTestId('lobby-name')).toHaveTextContent('Test'))
  })
})
