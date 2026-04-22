"use server";

import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/database.types";
import type { SupervisorWithProfile } from "../api/queries";

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

export async function getSupervisor(
  id: string,
): Promise<(SupervisorWithProfile & { email: string | null }) | null> {
  const { data, error } = await supabaseAdmin
    .from("supervisors")
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

  // Fetch email from auth.users (not stored in profiles table)
  const { data: authUser } = await supabaseAdmin.auth.admin.getUserById(id);
  const email = authUser?.user?.email ?? null;

  return { ...(data as SupervisorWithProfile), email };
}
