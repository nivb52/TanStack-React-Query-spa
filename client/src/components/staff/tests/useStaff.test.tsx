import { act, renderHook, waitFor } from '@testing-library/react';

import { useStaff } from '../hooks/useStaff';

import { createQueryClientWrapper } from '@/test-utils';

import { mockStaff } from '../../../mocks/mockData';
import { filterByTreatment } from '../utils';

test('filter staff', async () => {
  const { result } = renderHook(() => useStaff(), {
    wrapper: createQueryClientWrapper()
  });

  await waitFor(() => expect(result.current.staff.length).toBe(mockStaff.length));

  const someTreatment = mockStaff[0].treatmentNames[0];
  act(() => result.current.setFilter(someTreatment));
  const actualStaffPerTreatment = filterByTreatment(mockStaff, someTreatment).length;

  await waitFor(() => expect(result.current.staff.length).toBe(actualStaffPerTreatment));
});
