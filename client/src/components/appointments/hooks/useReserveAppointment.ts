import type { Appointment } from "@shared/types";

import { useLoginData } from "@/auth/AuthContext";
import { axiosInstance } from "@/axiosInstance";
import { useCustomToast } from "@/components/app/hooks/useCustomToast";
import { queryKeys } from "@/react-query/constants";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { formatDate } from "@/components/appointments/utils";

// for when we need functions for useMutation
async function setAppointmentUser(
  appointment: Appointment,
  userId: number | undefined,
): Promise<void> {
  if (!userId) return;
  const patchOp = appointment.userId ? 'replace' : 'add';
  const patchData = [{ op: patchOp, path: '/userId', value: userId }];
  await axiosInstance.patch(`/appointment/${appointment.id}`, {
    data: patchData,
  });
}

export function useReserveAppointment() {
  const queryClient = useQueryClient();
  const { userId } = useLoginData();
  const toast = useCustomToast();

  const { mutate } = useMutation({
    mutationFn: (appointment: Appointment) => setAppointmentUser(appointment, userId),
    mutationKey: [queryKeys.appointments, queryKeys.user, userId],
    onSuccess(data, variables, context) {
      console.log(data, '|', variables);
      queryClient.invalidateQueries({ queryKey: [queryKeys.appointments] }); // validate all the userAppointments & useAppointment
      toast({
        status: "success",
        id: `${queryKeys.user}_${userId}_create`,
        title: `You have reserved appointment for ${variables.treatmentName} at ${formatDate(variables.dateTime)}!`,
      })
    },
  })


  return mutate
}
