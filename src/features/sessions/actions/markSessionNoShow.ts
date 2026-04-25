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

export async function markSessionNoShow(formData: FormData) {
  const { user, role } = await requireRole(["teacher", "admin", "supervisor"]);

  const sessionId = formData.get("session_id") as string;
  if (!sessionId) throw new Error("Session ID required");

  const { data: session } = await supabaseAdmin
    .from("sessions")
    .select("teacher_id, student_id, status")
    .eq("id", sessionId)
    .single();

  if (!session) throw new Error("Session not found");

  // Teachers may only mark no-show on their own sessions
  if (role === "teacher" && user.id !== session.teacher_id) {
    throw new Error("Unauthorized: you can only mark your own sessions");
  }

  if (session.status !== "scheduled" && session.status !== "live") {
    throw new Error("Can only mark no-show on active sessions");
  }

  const now = new Date().toISOString();

  const { error: updErr } = await supabaseAdmin
    .from("sessions")
    .update({
      status: "no_show",
      completed_at: now,
      completed_by: user.id,
      updated_at: now,
    })
    .eq("id", sessionId);

  if (updErr) throw new Error(updErr.message);

  // Only insert student attendance; teacher presence is not tracked via this table
  const { error: attErr } = await supabaseAdmin
    .from("attendance")
    .upsert(
      {
        session_id: sessionId,
        student_id: session.student_id,
        status: "absent",
        marked_by: user.id,
      },
      { onConflict: "session_id,student_id" },
    );

  if (attErr) console.error("Attendance insert failed:", attErr);

  revalidatePath(`/sessions/${sessionId}`);
  revalidatePath("/sessions");
  return { success: true };
}
