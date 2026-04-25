"use client";

import { useQuery } from "@tanstack/react-query";
import { sessionKeys } from "./keys";
import type { Tables } from "@/lib/supabase/database.types";
import {
  getSessions,
  getSessionById,
} from "@/features/sessions/actions/getSessions";
import { getAvailableTeachers } from "@/features/sessions/actions/getAvailableTeachers";
import {
  getStudents,
  getStudentSubjects,
} from "@/features/students/actions/getStudents";

export type SessionDetailRow = Tables<"v_session_details">;

/** Adds fields from the raw `sessions` table that are absent from the view */
export type EnrichedSessionRow = SessionDetailRow & {
  shift_reason: string | null;
  cancelled_reason: string | null;
  shifted_from_session_id: string | null;
  created_by: string | null;
};

export function useSessions(range?: { start: string; end: string }) {
  return useQuery({
    queryKey: sessionKeys.list(range),
    queryFn: () => getSessions(range) as Promise<SessionDetailRow[]>,
  });
}

export function useSession(id: string) {
  return useQuery({
    queryKey: sessionKeys.detail(id),
    queryFn: () => getSessionById(id) as Promise<SessionDetailRow>,
    enabled: !!id,
  });
}

export function useAvailableTeachers(start: Date | null, end: Date | null) {
  return useQuery({
    queryKey: sessionKeys.availableTeachers(
      start?.toISOString() ?? "",
      end?.toISOString() ?? "",
    ),
    queryFn: () =>
      getAvailableTeachers(start!.toISOString(), end!.toISOString()),
    enabled: !!start && !!end,
  });
}

export function useStudentSubjects(studentId: string | null) {
  return useQuery({
    queryKey: ["student-subjects", studentId],
    queryFn: () => getStudentSubjects(studentId!),
    enabled: !!studentId,
  });
}

export function useStudents() {
  return useQuery({
    queryKey: ["students"],
    queryFn: getStudents,
  });
}
