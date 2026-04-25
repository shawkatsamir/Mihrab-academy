"use server";

import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth/getAuthenticatedUser";
import type { Database } from "@/lib/supabase/database.types";

const supabaseAdmin = createSupabaseClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } },
);

export async function markSessionComplete(formData: FormData) {
  const { user, role } = await requireRole(["teacher", "admin", "supervisor"]);

  const sessionId = formData.get("session_id") as string;
  const studentAttendance =
    (formData.get("student_attendance") as "present" | "absent" | "late") ??
    "present";
  const notes = (formData.get("notes_md") as string) || null;

  if (!sessionId) throw new Error("Session ID required");

  // Query sessions directly for a typed join — avoids casting (session as any)
  const { data: session, error: sErr } = await supabaseAdmin
    .from("sessions")
    .select("teacher_id, student_id, status, teachers(price_per_session)")
    .eq("id", sessionId)
    .single();

  if (sErr || !session) throw new Error("Session not found");

  // Teachers may only complete their own sessions; admins/supervisors can complete any
  if (role === "teacher" && user.id !== session.teacher_id) {
    throw new Error("Unauthorized: you can only complete your own sessions");
  }

  if (session.status === "completed") throw new Error("Already completed");
  if (session.status === "cancelled") throw new Error("Session was cancelled");
  if (session.status === "shifted") throw new Error("Session was shifted");

  const now = new Date().toISOString();

  const { error: updErr } = await supabaseAdmin
    .from("sessions")
    .update({
      status: "completed",
      completed_at: now,
      completed_by: user.id,
      teacher_notes_md: notes ?? undefined,
      updated_at: now,
    })
    .eq("id", sessionId);

  if (updErr) throw new Error(updErr.message);

  // attendance.student_id references students(id), not teachers(id) —
  // only insert the student row; teacher presence is implied by completion
  const { error: attErr } = await supabaseAdmin
    .from("attendance")
    .upsert(
      {
        session_id: sessionId,
        student_id: session.student_id,
        status: studentAttendance,
        marked_by: user.id,
      },
      { onConflict: "session_id,student_id" },
    );

  if (attErr) throw new Error(attErr.message);

  // price_per_session is stored in dollars; amount_cents requires cents
  const priceInDollars = session.teachers?.price_per_session ?? 0;
  const amountCents = Math.round(priceInDollars * 100);

  if (amountCents > 0) {
    const { error: earnErr } = await supabaseAdmin
      .from("teacher_earnings")
      .insert({
        teacher_id: session.teacher_id,
        session_id: sessionId,
        amount_cents: amountCents,
        marked_by: user.id,
      });
    if (earnErr) console.error("Earnings insert failed:", earnErr);
  }

  revalidatePath(`/sessions/${sessionId}`);
  revalidatePath("/sessions");
  revalidatePath("/dashboard");
  return { success: true };
}
