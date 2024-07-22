import { render, screen } from '@/test-utils';

import { Treatments } from '../Treatments';
import { mockTreatments } from '../../../mocks/mockData';

test('renders response from query', async () => {
  // arrange
  const titles = mockTreatments.map((treatmentData) => treatmentData.name);
  const titlesOptionsRegex = new RegExp(titles.join('|'), 'i');
  // act
  render(<Treatments />);
  const treatmentTitles = await screen.findAllByRole('heading', { name: titlesOptionsRegex });
  // expect
  expect(treatmentTitles).toHaveLength(titles.length);
});
