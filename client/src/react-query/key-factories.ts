import { queryKeys } from "./constants";

export const generateUserKey = (userId: number) => {
    return [queryKeys.user, userId]
}

export const generateUserAppointmentsKey = (userId: number) => {
    return [queryKeys.appointments, queryKeys.user, userId]
}

export const PATCH_USER_MUTATION_KEY = "patch-user"
