"use server";

import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/database.types";

const supabaseAdmin = createSupabaseClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } },
);

export interface TeacherStats {
  totalMinutes: number;
  totalHours: number;
  totalSalaryCents: number;
}

export async function getTeacherStats(teacherId: string): Promise<TeacherStats> {
  // TODO 1 ✅ — teacher_earnings.session_id is isOneToOne: true → no fan-out risk.
  //
  // TODO 2 — single join: teacher_earnings (financial ledger) → sessions.
  //   Driving from teacher_earnings guarantees only sessions that HAVE an
  //   earnings record are counted, keeping hours and salary in sync.
  //
  // TODO 3 — completed_at IS NOT NULL guard applied in the loop below.
  //   teacher_earnings is only ever created for finalized sessions, so every
  //   row should already pass this check. The guard protects against any
  //   future data-integrity edge case.
  const { data, error } = await supabaseAdmin
    .from("teacher_earnings")
    .select(
      "amount_cents, sessions!teacher_earnings_session_id_fkey(duration_minutes, completed_at)",
    )
    .eq("teacher_id", teacherId);

  if (error) throw new Error(error.message);

  // TODO 4 — both metrics computed from the same joined rows in one pass.
  let totalSalaryCents = 0;
  let totalMinutes = 0;

  for (const row of data ?? []) {
    // TODO 3 guard: skip any row whose session was not finalized
    if (!row.sessions?.completed_at) continue;

    totalSalaryCents += row.amount_cents;
    totalMinutes += row.sessions.duration_minutes;
  }

  // TODO 5 — return shape unchanged; no UI update needed.
  return {
    totalMinutes,
    totalHours: totalMinutes / 60,
    totalSalaryCents,
  };
}
