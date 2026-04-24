"use client";

import { useQuery } from "@tanstack/react-query";
import { getStudentsAdmin, getStudent } from "../actions/getStudents";
import { studentKeys } from "./keys";

export function useStudents() {
  return useQuery({
    queryKey: studentKeys.list(),
    queryFn: () => getStudentsAdmin(),
  });
}

export function useStudent(id: string) {
  return useQuery({
    queryKey: studentKeys.detail(id),
    queryFn: () => getStudent(id),
    enabled: !!id,
  });
}
