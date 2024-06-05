import jsonpatch from "fast-json-patch";

import type { User } from "@shared/types";

import { axiosInstance, getJWTHeader } from "../../../axiosInstance";
import { useUser } from "./useUser";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/components/app/toast";
import { queryKeys } from "@/react-query/constants";
import { PATCH_USER_MUTATION_KEY } from "@/react-query/key-factories";

// for when we need a server function
async function patchUserOnServer(
  newData: User | null,
  originalData: User | null,
): Promise<User | null> {
  if (!newData || !originalData) return null;
  // create a patch for the difference between newData and originalData
  const patch = jsonpatch.compare(originalData, newData);

  // send patched data to the server
  const { data } = await axiosInstance.patch(
    `/user/${originalData.id}`,
    { patch },
    {
      headers: getJWTHeader(originalData.token),
    },
  );
  return data.user;
}

export function usePatchUser() {
  const { user, updateUser } = useUser();
  const queryClient = useQueryClient();

  const { mutate: patchUser } = useMutation({
    mutationFn: (newUser: User) => patchUserOnServer(newUser, user),
    mutationKey: [PATCH_USER_MUTATION_KEY],
    onSuccess(data: User | null, variables, context) {
      updateUser(data)
      toast({ title: "User Info Updated", status: "success" })
    },
    onSettled: (data, error, variables, context) => {
      return queryClient.invalidateQueries({ queryKey: [queryKeys.user] })
    },
  })

  return patchUser;
}
