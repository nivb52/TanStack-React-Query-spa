import { AxiosResponse } from "axios";

import type { User } from "@shared/types";

import { useLoginData } from "@/auth/AuthContext";
import { axiosInstance, getJWTHeader } from "@/axiosInstance";
import { queryKeys } from "@/react-query/constants";
import { useQuery, } from "@tanstack/react-query";
import { generateUserKey } from "@/react-query/key-factories";
import { queryClient } from "@/react-query/queryClient";

// query function
async function getUser(userId: number, userToken: string) {
  const { data }: AxiosResponse<{ user: User }> = await axiosInstance.get(
    `/user/${userId}`,
    {
      headers: getJWTHeader(userToken),
    }
  );

  return data.user;
}

export function useUser() {
  const userState = useLoginData();
  const { data: user } = useQuery({
    queryKey: generateUserKey(userState.userId),
    queryFn: () => getUser(userState.userId, userState.userToken),
    /** 
     * @note
     *  never mark the data stale, unless the garbage time expire data expired
     *     it can go wrong - if user change his data in 1 cpu and not in the other
     *     but we will ignore this use case
    */
    staleTime: Infinity,
    enabled: !!userState.userId
  });

  // meant to be called from useAuth
  function updateUser(newUser: User): void {
    queryClient.setQueryData(
      generateUserKey(userState.userId),
      newUser
    );
  }

  // meant to be called from useAuth
  function clearUser() {
    // remove user profile data
    queryClient.removeQueries({
      queryKey: [queryKeys.user]
    });

    // remove user appointments data
    queryClient.removeQueries({
      queryKey: [queryKeys.appointments, queryKeys.user]
    });

  }

  return { user, updateUser, clearUser };
}
