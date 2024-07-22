import { AllStaff } from '../AllStaff';

import { render, screen } from '@/test-utils';

import { mockStaff } from '../../../mocks/mockData';

test('renders response from query', async () => {
  // arrange
  const staffNames = mockStaff.map((employee) => employee.name);
  const staffNameRegex = new RegExp(staffNames.join('|'), 'i');
  // act
  render(<AllStaff />);
  const staffTitles = await screen.findAllByRole('heading', { name: staffNameRegex });
  // expect
  expect(staffTitles).toHaveLength(staffNames.length);
});
