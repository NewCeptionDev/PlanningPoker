import { act, render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import Home from 'src/app/page'

describe('Home', () => {
  it('should render homepage unchanged', () => {
    const { container } = render(<Home />)
    expect(container).toMatchSnapshot()
  })

  it('should render all important components', () => {
    render(<Home />)
    expect(screen.getByTestId('logo')).toBeInTheDocument()
    expect(screen.getByTestId('headline')).toBeInTheDocument()
    expect(screen.getByTestId('theme-switcher')).toBeInTheDocument()
    expect(screen.getByTestId('lobby-join')).toBeInTheDocument()
    expect(screen.getByTestId('lobby-create')).toBeInTheDocument()
    expect(screen.getByTestId('footer')).toBeInTheDocument()
  })

  it('should show custom card input when custom card group is selected', () => {
    render(<Home />)

    expect(screen.queryByTestId('lobby-create-custom-cards')).not.toBeInTheDocument()

    act(() => {
      const select = screen.getByTestId('cardGroupSelect')
      // @ts-expect-error value is defined
      select.value = 'Custom'
      select.dispatchEvent(new Event('change', { bubbles: true }))
    })

    expect(screen.getByTestId('lobby-create-custom-cards')).toBeInTheDocument()
  })
})
