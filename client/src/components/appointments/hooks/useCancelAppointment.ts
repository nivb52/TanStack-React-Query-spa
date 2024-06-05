import type { Appointment } from "@shared/types";

import { axiosInstance } from "@/axiosInstance";
import { useCustomToast } from "@/components/app/hooks/useCustomToast";
import { queryKeys } from "@/react-query/constants";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/react-query/queryClient";
import dayjs from "dayjs";
import { formatDate } from "@/components/appointments/utils";

// for when server call is needed
async function removeAppointmentUser(appointment: Appointment): Promise<void> {
  const patchData = [{ op: 'remove', path: '/userId' }];
  await axiosInstance.patch(`/appointment/${appointment.id}`, {
    data: patchData,
  });
}

export function useCancelAppointment() {


  const toast = useCustomToast();
  const { mutate } = useMutation({
    mutationFn: removeAppointmentUser,
    mutationKey: [queryKeys.appointments, queryKeys.user],
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.appointments] })
      toast({
        status: "success",
        id: `${queryKeys.appointments}_${queryKeys.user}_cancel`,
        title: `You have cancel appointment for ${variables.treatmentName} at ${formatDate(variables.dateTime)}!`,
      })
    }
  })

  return mutate
}
