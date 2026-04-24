"use server";

import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";
import type { Database } from "@/lib/supabase/database.types";
import { requireRole } from "@/lib/auth/getAuthenticatedUser";

const supabaseAdmin = createSupabaseClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } },
);

export async function createSession(payload: {
  session_type: "recurring" | "one_time";
  teacher_id: string;
  student_id: string;
  subject_id: string;
  scheduled_at: string;
  duration_minutes: number;
  zoom_join_url?: string;
  series_id?: string;
}) {
  const { user } = await requireRole(["admin", "supervisor"]);

  const { data, error } = await supabaseAdmin
    .from("sessions")
    .insert({ ...payload, created_by: user.id })
    .select()
    .single();

  if (error) throw new Error(error.message);

  revalidatePath("/sessions");
  revalidatePath("/calendar");
  return data;
}

export async function createSeries(payload: {
  teacher_id: string;
  student_id: string;
  subject_id: string;
  recurrence_type: "daily" | "weekly" | "custom";
  recurrence_days?: number[];
  session_time: string;
  duration_minutes: number;
  start_date: string;
  end_date?: string;
  zoom_join_url?: string;
  timezone: string;
}) {
  const { user } = await requireRole(["admin", "supervisor"]);

  const { data, error } = await supabaseAdmin
    .from("session_series")
    .insert({ ...payload, created_by: user.id })
    .select()
    .single();

  if (error) throw new Error(error.message);

  revalidatePath("/sessions");
  revalidatePath("/calendar");
  return data;
}
