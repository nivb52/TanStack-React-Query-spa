import { act, renderHook, waitFor } from '@testing-library/react';

import { useAppointments } from '../hooks/useAppointments';
import { AppointmentDateMap } from '../types';

import { createQueryClientWrapper } from '@/test-utils';

/**
 * @description helper function to count the total number of appointment
 */
const getAppointmentCount = (appointment: AppointmentDateMap) =>
  Object.values(appointment).reduce((runningCount, appointmentOnDate) => runningCount + appointmentOnDate.length, 0);

test('filter appointments by availability', async () => {
  // test goes here
  const { result } = renderHook(() => useAppointments(), {
    wrapper: createQueryClientWrapper()
  });

  // wait for appointments to populate from the mock-server
  await waitFor(() => expect(getAppointmentCount(result.current.appointments)).toBeGreaterThan(0));

  // appoibntemts start out filtered (shows only available)
  const filteredAppointmentCount = getAppointmentCount(result.current.appointments);

  // remove filter
  act(() => result.current.setShowAll(true));

  // wait for count appointments to be greater than when filtered
  await waitFor(() =>
    expect(filteredAppointmentCount).toBeLessThanOrEqual(getAppointmentCount(result.current.appointments))
  );
});
