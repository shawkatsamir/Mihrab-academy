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

export async function assignSubjects(studentId: string, subjectIds: string[]) {
  const { user } = await requireRole(["admin"]);

  if (!studentId) throw new Error("Student ID is required");

  // Delete existing assignments then re-insert — clean sync
  const { error: delErr } = await supabaseAdmin
    .from("student_subjects")
    .delete()
    .eq("student_id", studentId);

  if (delErr) throw new Error(delErr.message);

  if (subjectIds.length > 0) {
    const { error: insErr } = await supabaseAdmin
      .from("student_subjects")
      .insert(
        subjectIds.map((sid) => ({
          student_id: studentId,
          subject_id: sid,
          assigned_by: user.id,
        })),
      );
    if (insErr) throw new Error(insErr.message);
  }

  revalidatePath(`/students/${studentId}`);
  return { success: true };
}
