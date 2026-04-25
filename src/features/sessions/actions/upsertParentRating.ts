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

export async function upsertParentRating(formData: FormData) {
  await requireRole(["student"]);

  const sessionId = formData.get("session_id") as string;
  const studentId = formData.get("student_id") as string;
  const ratingRaw = formData.get("rating") as string;
  const comment = (formData.get("comment") as string) || null;

  const rating = parseInt(ratingRaw, 10);
  if (isNaN(rating) || rating < 1 || rating > 5) {
    throw new Error("Rating must be 1-5");
  }

  const { data: existing } = await supabaseAdmin
    .from("parent_ratings")
    .select("id")
    .eq("session_id", sessionId)
    .eq("student_id", studentId)
    .maybeSingle();

  if (existing) {
    const { error } = await supabaseAdmin
      .from("parent_ratings")
      .update({ rating, comment })
      .eq("id", existing.id);
    if (error) throw new Error(error.message);
  } else {
    const { error } = await supabaseAdmin.from("parent_ratings").insert({
      session_id: sessionId,
      student_id: studentId,
      rating,
      comment,
    });
    if (error) throw new Error(error.message);
  }

  revalidatePath(`/sessions/${sessionId}`);
  return { success: true };
}
