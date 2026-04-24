"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { sessionKeys } from "./keys";
import { createSession, createSeries } from "@/features/sessions/actions/createSession";
import {
  shiftSession,
  cancelSession,
  updateSession,
} from "@/features/sessions/actions/updateSession";

export function useCreateSession() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createSession,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: sessionKeys.all });
    },
  });
}

export function useCreateSeries() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createSeries,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: sessionKeys.all });
    },
  });
}

export function useShiftSession() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: {
      originalSessionId: string;
      newScheduledAt: string;
      reason?: string;
    }) => shiftSession(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: sessionKeys.all });
    },
  });
}

export function useCancelSession() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: { sessionId: string; reason?: string }) =>
      cancelSession(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: sessionKeys.all });
    },
  });
}

export function useUpdateSession() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      values,
    }: {
      id: string;
      values: Partial<{
        scheduled_at: string;
        duration_minutes: number;
        zoom_join_url: string;
        teacher_notes_md: string;
        status: "scheduled" | "live" | "completed" | "cancelled" | "no_show";
      }>;
    }) => updateSession(id, values),
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: sessionKeys.all });
      queryClient.invalidateQueries({ queryKey: sessionKeys.detail(vars.id) });
    },
  });
}
