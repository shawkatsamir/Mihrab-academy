"use server";

import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { requireRole } from "@/lib/auth/getAuthenticatedUser";
import type { Database } from "@/lib/supabase/database.types";

const supabaseAdmin = createSupabaseClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } },
);

export async function getSessionEvaluations(sessionId: string) {
  await requireRole(["admin", "supervisor", "teacher", "student"]);

  const [teacherRes, supervisorRes, parentRes] = await Promise.all([
    supabaseAdmin
      .from("session_teacher_evals")
      .select("*")
      .eq("session_id", sessionId)
      .maybeSingle(),
    supabaseAdmin
      .from("session_supervisor_evals")
      .select("*")
      .eq("session_id", sessionId)
      .maybeSingle(),
    supabaseAdmin
      .from("parent_ratings")
      .select("*")
      .eq("session_id", sessionId)
      .maybeSingle(),
  ]);

  return {
    teacherEval: teacherRes.data,
    supervisorEval: supervisorRes.data,
    parentRating: parentRes.data,
    errors: [teacherRes.error, supervisorRes.error, parentRes.error].filter(
      Boolean,
    ),
  };
}
