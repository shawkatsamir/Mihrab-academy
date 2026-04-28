"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { teacherKeys } from "./keys";
import type { Tables } from "@/lib/supabase/database.types";

// ─── Types derived from DB schema (no manual duplication) ─────────────────────

export type TeacherWithProfile = Tables<"teachers"> & {
  profiles: Pick<
    Tables<"profiles">,
    "full_name" | "photo_url" | "is_active" | "created_at"
  > | null;
  /** Joined supervisor assignment — at most one row per teacher */
  supervisor_assignments:
    | {
        supervisor_id: string;
        supervisors: {
          profiles: Pick<Tables<"profiles">, "full_name"> | null;
        } | null;
      }[]
    | null;
};

/** Convenience helper: pull the supervisor name off a TeacherWithProfile row */
export function getSupervisorName(teacher: TeacherWithProfile): string | null {
  const first = teacher.supervisor_assignments?.[0];
  return first?.supervisors?.profiles?.full_name ?? null;
}

/** Convenience helper: pull the supervisor id off a TeacherWithProfile row */
export function getSupervisorId(teacher: TeacherWithProfile): string | null {
  return teacher.supervisor_assignments?.[0]?.supervisor_id ?? null;
}

// ─── Hooks ─────────────────────────────────────────────────────────────────────

import { getTeachers } from "../actions/getTeachers";

export function useTeachers() {
  return useQuery({
    queryKey: teacherKeys.list(),
    queryFn: async () => {
      const data = await getTeachers();
      return data as unknown as TeacherWithProfile[];
    },
  });
}

import { getTeacher } from "../actions/getTeacher";

export function useTeacher(id: string) {
  return useQuery({
    queryKey: teacherKeys.detail(id),
    queryFn: async () => {
      const data = await getTeacher(id);
      return data;
    },
    enabled: !!id,
  });
}

import { getTeacherStats } from "../actions/getTeacherStats";

export function useTeacherStats(teacherId: string) {
  return useQuery({
    queryKey: teacherKeys.stats(teacherId),
    queryFn: () => getTeacherStats(teacherId),
    enabled: !!teacherId,
  });
}

import { getTeachersBySupervisor } from "../actions/getTeachers";

/**
 * Fetch only the teachers assigned to `supervisorId`.
 * Used on the teachers list page when a supervisor is logged in.
 */
export function useTeachersBySupervisor(supervisorId: string) {
  return useQuery({
    queryKey: [...teacherKeys.list(), "bySupervisor", supervisorId],
    queryFn: async () => {
      const data = await getTeachersBySupervisor(supervisorId);
      return data as unknown as TeacherWithProfile[];
    },
    enabled: !!supervisorId,
  });
}

// ─── Assignment hook ────────────────────────────────────────────────────────────

import { assignSupervisor, unassignSupervisor } from "../actions/assignSupervisor";

export function useAssignSupervisor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: assignSupervisor,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: teacherKeys.all });
    },
  });
}

export function useUnassignSupervisor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: unassignSupervisor,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: teacherKeys.all });
    },
  });
}

// ─── Teacher sessions hook ─────────────────────────────────────────────────────

import { getTeacherSessions } from "../actions/getTeacherSessions";
import type { SessionDetailRow } from "@/features/sessions/api/queries";

export function useTeacherSessions(
  teacherId: string,
  range?: { start: string; end: string },
) {
  return useQuery({
    queryKey: teacherKeys.sessions(teacherId, range),
    queryFn: () =>
      getTeacherSessions(teacherId, range) as Promise<SessionDetailRow[]>,
    enabled: !!teacherId,
  });
}

// ─── Update / Toggle hooks ──────────────────────────────────────────────────────

export function useUpdateTeacher() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      values,
      imageFile,
    }: {
      id: string;
      values: {
        full_name: string;
        bio?: string;
        price_per_hour: number;
        zoom_personal_link?: string;
      };
      imageFile?: File;
    }) => {
      const supabase = createClient();
      let photoUrl: string | undefined;

      if (imageFile) {
        const ext = imageFile.name.split(".").pop();
        const fileName = `${crypto.randomUUID()}.${ext}`;
        const { error: upErr } = await supabase.storage
          .from("avatars")
          .upload(fileName, imageFile, { contentType: imageFile.type });
        if (upErr) throw upErr;

        const { data: urlData } = supabase.storage
          .from("avatars")
          .getPublicUrl(fileName);
        photoUrl = urlData.publicUrl;
      }

      const profileUpdate: Record<string, unknown> = {
        full_name: values.full_name,
      };
      if (photoUrl) profileUpdate.photo_url = photoUrl;

      const { error: pErr } = await supabase
        .from("profiles")
        .update(profileUpdate)
        .eq("id", id);
      if (pErr) throw pErr;

      const { error: tErr } = await supabase
        .from("teachers")
        .update({
          bio: values.bio ?? null,
          price_per_hour: values.price_per_hour,
          zoom_personal_link: values.zoom_personal_link ?? null,
        })
        .eq("id", id);
      if (tErr) throw tErr;

      return { id };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: teacherKeys.all });
    },
  });
}

export function useToggleTeacherActive() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) => {
      const supabase = createClient();
      const { error } = await supabase
        .from("profiles")
        .update({ is_active: isActive })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: teacherKeys.all });
    },
  });
}
