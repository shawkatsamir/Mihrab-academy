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

export async function upsertTeacherEval(formData: FormData) {
  await requireRole(["teacher"]);

  const sessionId = formData.get("session_id") as string;
  const teacherId = formData.get("teacher_id") as string;
  const studentId = formData.get("student_id") as string;
  const categoriesJson = formData.get("categories") as string;
  const notes = (formData.get("notes_md") as string) || null;
  const isVisible = formData.get("is_visible_to_parent") === "true";

  let categories: { category: string; score: number }[] = [];
  try {
    categories = JSON.parse(categoriesJson || "[]");
  } catch {
    throw new Error("Invalid categories format");
  }

  const { data: existing } = await supabaseAdmin
    .from("session_teacher_evals")
    .select("id")
    .eq("session_id", sessionId)
    .eq("teacher_id", teacherId)
    .maybeSingle();

  if (existing) {
    const { error } = await supabaseAdmin
      .from("session_teacher_evals")
      .update({
        categories,
        notes_md: notes,
        is_visible_to_parent: isVisible,
        updated_at: new Date().toISOString(),
      })
      .eq("id", existing.id);
    if (error) throw new Error(error.message);
  } else {
    const { error } = await supabaseAdmin
      .from("session_teacher_evals")
      .insert({
        session_id: sessionId,
        teacher_id: teacherId,
        student_id: studentId,
        categories,
        notes_md: notes,
        is_visible_to_parent: isVisible,
      });
    if (error) throw new Error(error.message);
  }

  revalidatePath(`/sessions/${sessionId}`);
  return { success: true };
}
