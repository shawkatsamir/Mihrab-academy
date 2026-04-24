"use server";

import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/database.types";

const supabaseAdmin = createSupabaseClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } },
);

export async function getSessions(range?: { start: string; end: string }) {
  const start = range?.start ?? (() => {
    const d = new Date();
    d.setDate(d.getDate() - 7);
    return d.toISOString();
  })();
  const end = range?.end ?? (() => {
    const d = new Date();
    d.setDate(d.getDate() + 30);
    return d.toISOString();
  })();

  const { data, error } = await supabaseAdmin
    .from("v_session_details")
    .select("*")
    .gte("scheduled_at", start)
    .lte("scheduled_at", end)
    .order("scheduled_at", { ascending: true });

  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function getSessionById(id: string) {
  const { data, error } = await supabaseAdmin
    .from("v_session_details")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw new Error(error.message);
  return data;
}
