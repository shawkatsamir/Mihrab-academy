"use server";

import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/database.types";

const supabaseAdmin = createSupabaseClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } },
);

export async function getSubjectOverviews() {
  const { data, error } = await supabaseAdmin
    .from("v_subject_overview")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function getSubjectDetail(id: string) {
  const { data, error } = await supabaseAdmin
    .from("subjects")
    .select(
      `
      *,
      milestones(
        *,
        lessons(
          *,
          lesson_content(*)
        )
      )
    `,
    )
    .eq("id", id)
    .single();

  if (error) throw new Error(error.message);
  return data;
}
