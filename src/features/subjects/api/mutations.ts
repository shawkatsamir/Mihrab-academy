"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { subjectKeys } from "./keys";
import type { TablesInsert, TablesUpdate } from "@/lib/supabase/database.types";
import { createSubject } from "@/features/subjects/actions/createSubject";

// ─── Subject ─────────────────────────────────────────────

export function useCreateSubject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (values: TablesInsert<"subjects">) => createSubject(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: subjectKeys.all });
    },
  });
}

export function useUpdateSubject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      values,
    }: {
      id: string;
      values: TablesUpdate<"subjects">;
    }) => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("subjects")
        .update(values)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: subjectKeys.all });
      queryClient.invalidateQueries({
        queryKey: subjectKeys.detail(vars.id),
      });
    },
  });
}

export function useDeleteSubject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const supabase = createClient();
      const { error } = await supabase.from("subjects").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: subjectKeys.all });
    },
  });
}
