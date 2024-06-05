import { useState } from "react";

import type { Staff } from "@shared/types";

import { filterByTreatment } from "../utils";

import { axiosInstance } from "@/axiosInstance";
import { queryKeys } from "@/react-query/constants";
import { useQuery } from "@tanstack/react-query";

// query function for useQuery
async function getStaff(): Promise<Staff[]> {
  const { data } = await axiosInstance.get('/staff');
  return data;
}

const selectFn = (data: Staff[], filter: string) => {
  if (filter === "all") {
    return data;
  }
  // sorted to prevent jumps in the stafff pictures
  return filterByTreatment(data.sort((a: Staff, b: Staff): number => a.name > b.name ? 1 : 0), filter);
}

export function useStaff() {
  // for filtering staff by treatment
  const [filter, setFilter] = useState("all");

  const fallback: Staff[] = [];
  const { data = fallback } = useQuery({
    queryKey: [queryKeys.staff],
    queryFn: getStaff,
    select: (data) => selectFn(data, filter)
  })

  return { staff: data, filter, setFilter };
}
