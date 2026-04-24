"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createStudent } from "../actions/createStudent";
import { updateStudent } from "../actions/updateStudent";
import { toggleStudentActive } from "../actions/toggleStudentActive";
import { assignSubjects } from "../actions/assignSubjects";
import { studentKeys } from "./keys";

export function useCreateStudent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formData: FormData) => createStudent(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: studentKeys.all });
    },
  });
}

export function useUpdateStudent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formData: FormData) => updateStudent(formData),
    onSuccess: (_, formData) => {
      const id = formData.get("student_id") as string;
      queryClient.invalidateQueries({ queryKey: studentKeys.all });
      queryClient.invalidateQueries({ queryKey: studentKeys.detail(id) });
    },
  });
}

export function useToggleStudentActive() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      toggleStudentActive(id, isActive),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: studentKeys.all });
    },
  });
}

export function useAssignSubjects(studentId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (subjectIds: string[]) => assignSubjects(studentId, subjectIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: studentKeys.detail(studentId) });
      queryClient.invalidateQueries({ queryKey: studentKeys.all });
    },
  });
}
