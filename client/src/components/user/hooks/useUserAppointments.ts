import type { Appointment } from "@shared/types";

import { axiosInstance, getJWTHeader } from "../../../axiosInstance";

import { useLoginData } from "@/auth/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { generateUserAppointmentsKey } from "@/react-query/key-factories";

async function getUserAppointments(
  userId: number,
  userToken: string
): Promise<Appointment[] | null> {
  const { data } = await axiosInstance.get(`/user/${userId}/appointments`, {
    headers: getJWTHeader(userToken),
  });
  return data.appointments;
}

export function useUserAppointments(): Appointment[] {
  const userData = useLoginData();
  const fallback = [] as Appointment[];
  const { data = fallback } = useQuery({
    queryKey: generateUserAppointmentsKey(userData.userId),
    queryFn: () => getUserAppointments(userData.userId, userData.userToken),
    enabled: !!userData.userId
  })

  return data;
}
