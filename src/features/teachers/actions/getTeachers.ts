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
      profiles(full_name, photo_url, is_active, created_at)
    `)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }
  
  return data ?? [];
}
