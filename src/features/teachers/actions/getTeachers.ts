"use server";

import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/database.types";

const supabaseAdmin = createSupabaseClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  },
);

export async function getTeachers() {
  const { data, error } = await supabaseAdmin
    .from("teachers")
    .select(`
      *,
      profiles(full_name, photo_url, is_active, created_at),
      supervisor_assignments(
        supervisor_id,
        supervisors(
          profiles(full_name)
        )
      )
    `)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
}

/**
 * Fetch only teachers assigned to a specific supervisor.
 * Used when the logged-in user is a supervisor — enforces data scoping.
 */
export async function getTeachersBySupervisor(supervisorId: string) {
  const { data, error } = await supabaseAdmin
    .from("supervisor_assignments")
    .select(`
      teacher_id,
      teachers(
        *,
        profiles(full_name, photo_url, is_active, created_at),
        supervisor_assignments(
          supervisor_id,
          supervisors(
            profiles(full_name)
          )
        )
      )
    `)
    .eq("supervisor_id", supervisorId);

  if (error) {
    throw new Error(error.message);
  }

  // Unwrap the nested teachers array
  return (data ?? []).map((row) => row.teachers).filter(Boolean);
}
