import { render, screen } from '@/test-utils';

import { Treatments } from '../Treatments';

test('renders response from query', () => {
  render(<Treatments />);
});
