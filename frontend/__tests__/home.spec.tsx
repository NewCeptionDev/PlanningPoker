import { render } from '@testing-library/react';
import Home from 'src/app/page';

describe('Home', () => {
  it('should render homepage unchanged', () => {
    const { container } = render(<Home />);
    expect(container).toMatchSnapshot();
  });
});
