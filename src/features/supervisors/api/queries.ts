"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { supervisorKeys } from "./keys";
import type { Tables } from "@/lib/supabase/database.types";

export type SupervisorWithProfile = Tables<"supervisors"> & {
  profiles: Pick<
    Tables<"profiles">,
    "full_name" | "photo_url" | "is_active" | "created_at"
  > | null;
};

import { getSupervisors } from "../actions/getSupervisors";

export function useSupervisors() {
  return useQuery({
    queryKey: supervisorKeys.list(),
    queryFn: async () => {
      const data = await getSupervisors();
      return data as unknown as SupervisorWithProfile[];
    },
  });
}

import { getSupervisor } from "../actions/getSupervisor";

export function useSupervisor(id: string) {
  return useQuery({
    queryKey: supervisorKeys.detail(id),
    queryFn: async () => {
      const data = await getSupervisor(id);
      return data;
    },
    enabled: !!id,
  });
}

export function useUpdateSupervisor() {
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
      };
      imageFile?: File;
    }) => {
      const supabase = createClient();
      let photoUrl: string | undefined;

      // Upload new avatar if provided
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

      // Update profile
      const profileUpdate: Record<string, unknown> = {
        full_name: values.full_name,
      };
      if (photoUrl) profileUpdate.photo_url = photoUrl;

      const { error: pErr } = await supabase
        .from("profiles")
        .update(profileUpdate)
        .eq("id", id);
      if (pErr) throw pErr;

      return { id };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: supervisorKeys.all });
    },
  });
}

export function useToggleSupervisorActive() {
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
      queryClient.invalidateQueries({ queryKey: supervisorKeys.all });
    },
  });
}
