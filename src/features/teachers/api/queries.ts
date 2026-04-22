"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { teacherKeys } from "./keys";
import type { Tables } from "@/lib/supabase/database.types";

export type TeacherWithProfile = Tables<"teachers"> & {
  profiles: Pick<
    Tables<"profiles">,
    "full_name" | "photo_url" | "is_active" | "created_at"
  > | null;
};

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
        price_per_session: number;
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

      // Update teacher record
      const { error: tErr } = await supabase
        .from("teachers")
        .update({
          bio: values.bio ?? null,
          price_per_session: values.price_per_session,
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
