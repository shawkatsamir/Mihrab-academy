"use server";

import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/database.types";
import type { TeacherWithProfile } from "../api/queries";

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

export async function getTeacher(id: string): Promise<TeacherWithProfile | null> {
  const { data, error } = await supabaseAdmin
    .from("teachers")
    .select(`
      *,
      profiles(full_name, photo_url, is_active, created_at)
    `)
    .eq("id", id)
    .single();

  if (error) {
    if (error.code === "PGRST116") return null; // Not found
    throw new Error(error.message);
  }
  
  return data as TeacherWithProfile;
}
