import { AllStaff } from '../AllStaff';
import { http, HttpResponse } from 'msw';
import { server } from '@/mocks/server';

import { render, screen } from '@/test-utils';
// helpers
import { createTitle } from '@/react-query/queryClient';

test('handles query error', async () => {
  // arrange
  const toastTitle = createTitle('fetch', '');
  const titlesRegex = new RegExp(toastTitle, 'i');
  const errorcodeMentionRegex = new RegExp('500', 'i');
  // (re)set handler to return a 500 error for staff and treatments
  server.use(
    http.get('http://localhost:3030/staff', () => {
      return new HttpResponse(null, { status: 500 });
    }),
    http.get('http://localhost:3030/treatments', () => {
      return new HttpResponse(null, { status: 500 });
    })
  );
  // act
  render(<AllStaff />);
  const alertToast = await screen.findByRole('status');

  // expect
  expect(alertToast).toHaveTextContent(titlesRegex);
  expect(alertToast).toHaveTextContent(errorcodeMentionRegex);
});
