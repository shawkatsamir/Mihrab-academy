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

export async function upsertSupervisorEval(formData: FormData) {
  await requireRole(["supervisor"]);

  const sessionId = formData.get("session_id") as string;
  const supervisorId = formData.get("supervisor_id") as string;
  const teacherId = formData.get("teacher_id") as string;
  const ratingRaw = formData.get("rating") as string;
  const notes = (formData.get("notes_md") as string) || null;

  const rating = parseInt(ratingRaw, 10);
  if (isNaN(rating) || rating < 1 || rating > 5) {
    throw new Error("Rating must be 1-5");
  }

  const { data: existing } = await supabaseAdmin
    .from("session_supervisor_evals")
    .select("id")
    .eq("session_id", sessionId)
    .eq("supervisor_id", supervisorId)
    .maybeSingle();

  if (existing) {
    const { error } = await supabaseAdmin
      .from("session_supervisor_evals")
      .update({
        rating,
        notes_md: notes,
        updated_at: new Date().toISOString(),
      })
      .eq("id", existing.id);
    if (error) throw new Error(error.message);
  } else {
    const { error } = await supabaseAdmin
      .from("session_supervisor_evals")
      .insert({
        session_id: sessionId,
        supervisor_id: supervisorId,
        teacher_id: teacherId,
        rating,
        notes_md: notes,
      });
    if (error) throw new Error(error.message);
  }

  revalidatePath(`/sessions/${sessionId}`);
  return { success: true };
}
