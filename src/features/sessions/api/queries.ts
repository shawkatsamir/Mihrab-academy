"use client";

import { useQuery } from "@tanstack/react-query";
import { sessionKeys } from "./keys";
import type { Tables } from "@/lib/supabase/database.types";
import {
  getSessions,
  getSessionById,
  getPagedSessions,
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
  shifted_at: string | null;
  cancelled_reason: string | null;
  shifted_from_session_id: string | null;
  shifted_to_session_id: string | null;
  created_by: string | null;
  created_by_name: string | null;
};

export function useSessions(range?: { start: string; end: string }) {
  return useQuery({
    queryKey: sessionKeys.list(range),
    queryFn: () => getSessions(range) as Promise<SessionDetailRow[]>,
  });
}

export function usePagedSessions(
  range?: { start: string; end: string },
  page: number = 1,
) {
  return useQuery({
    queryKey: sessionKeys.pagedList(range, page),
    queryFn: () => getPagedSessions(range, page),
  });
}

export function useSession(id: string) {
  return useQuery({
    queryKey: sessionKeys.detail(id),
    queryFn: () => getSessionById(id) as Promise<SessionDetailRow>,
    enabled: !!id,
  });
}

const isValidDate = (d: Date | null): d is Date =>
  d !== null && !isNaN(d.getTime());

export function useAvailableTeachers(start: Date | null, end: Date | null) {
  const validStart = isValidDate(start);
  const validEnd = isValidDate(end);
  return useQuery({
    queryKey: sessionKeys.availableTeachers(
      validStart ? start.toISOString() : "",
      validEnd ? end.toISOString() : "",
    ),
    queryFn: () =>
      getAvailableTeachers(start!.toISOString(), end!.toISOString()),
    enabled: validStart && validEnd,
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
