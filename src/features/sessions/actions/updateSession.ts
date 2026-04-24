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

export async function shiftSession(payload: {
  originalSessionId: string;
  newScheduledAt: string;
  reason?: string;
}) {
  const { user } = await requireRole(["admin", "supervisor"]);

  const { error: updateErr } = await supabaseAdmin
    .from("sessions")
    .update({ status: "shifted", updated_at: new Date().toISOString() })
    .eq("id", payload.originalSessionId);

  if (updateErr) throw new Error(updateErr.message);

  const { data: original, error: fetchErr } = await supabaseAdmin
    .from("sessions")
    .select("*")
    .eq("id", payload.originalSessionId)
    .single();

  if (fetchErr || !original) throw fetchErr ?? new Error("Session not found");

  const { data, error: insertErr } = await supabaseAdmin
    .from("sessions")
    .insert({
      session_type: "one_time",
      teacher_id: original.teacher_id,
      student_id: original.student_id,
      subject_id: original.subject_id,
      scheduled_at: payload.newScheduledAt,
      duration_minutes: original.duration_minutes,
      zoom_join_url: original.zoom_join_url,
      status: "scheduled",
      is_exception: true,
      shifted_from_session_id: payload.originalSessionId,
      shift_reason: payload.reason ?? "Rescheduled",
      shifted_at: new Date().toISOString(),
      created_by: user.id,
    })
    .select()
    .single();

  if (insertErr) throw new Error(insertErr.message);

  revalidatePath("/sessions");
  revalidatePath("/calendar");
  return data;
}

export async function cancelSession(payload: {
  sessionId: string;
  reason?: string;
}) {
  const { user } = await requireRole(["admin", "supervisor"]);

  const { error } = await supabaseAdmin
    .from("sessions")
    .update({
      status: "cancelled",
      cancelled_by: user.id,
      cancelled_reason: payload.reason ?? null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", payload.sessionId);

  if (error) throw new Error(error.message);

  revalidatePath("/sessions");
  revalidatePath("/calendar");
}

export async function updateSession(
  id: string,
  values: Partial<{
    scheduled_at: string;
    duration_minutes: number;
    zoom_join_url: string;
    teacher_notes_md: string;
    status: "scheduled" | "live" | "completed" | "cancelled" | "no_show";
  }>,
) {
  await requireRole(["admin", "supervisor", "teacher"]);

  const { error } = await supabaseAdmin
    .from("sessions")
    .update({ ...values, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePath("/sessions");
  revalidatePath("/calendar");
}
