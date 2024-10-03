import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Layout from 'src/app/layout';

describe('layout', () => {
  beforeAll(() => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(), // Deprecated
        removeListener: jest.fn(), // Deprecated
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    });
  })

  it('should render layout unchanged', () => {
    const { container } = render(<Layout />);
    expect(container).toMatchSnapshot();
  });

  it('should render links', () => {
    render(<Layout />);

    expect(screen.getByTestId('favicon-32')).toBeInTheDocument();
    expect(screen.getByTestId('favicon-16')).toBeInTheDocument();
    expect(screen.getByTestId('favicon-apple-16')).toBeInTheDocument();
    expect(screen.getByTestId('favicon-apple-32')).toBeInTheDocument();
  });
});
