import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import ThemeSwitcher from 'src/app/themeswitcher'

describe('ThemeSwitcher', () => {
  it('should render correctly', () => {
    const { container } = render(<ThemeSwitcher />)
    expect(container).toMatchSnapshot()
  })

  it('should render all components', () => {
    render(<ThemeSwitcher />)
    expect(screen.getByTestId('theme-switcher')).toBeInTheDocument()
    expect(screen.getByTestId('theme-switcher-toggle')).toBeInTheDocument()
    expect(screen.getByTestId('theme-switcher-label')).toBeInTheDocument()
    expect(screen.getByTestId('theme-switcher-label-background')).toBeInTheDocument()
  })
})
