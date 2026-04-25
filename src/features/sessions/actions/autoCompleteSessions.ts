"use server";

import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/database.types";

const supabaseAdmin = createSupabaseClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } },
);

// Called by an Edge Function or pg_cron — no user session, runs as service role
export async function autoCompleteStaleSessions() {
  const cutoff = new Date();
  cutoff.setHours(cutoff.getHours() - 2);

  const { data: staleSessions, error } = await supabaseAdmin
    .from("sessions")
    .select(
      "id, teacher_id, student_id, duration_minutes, scheduled_at, teachers(price_per_session)",
    )
    .eq("status", "scheduled")
    .lt("scheduled_at", cutoff.toISOString());

  if (error || !staleSessions || staleSessions.length === 0) return { count: 0 };

  const now = new Date().toISOString();
  let completed = 0;

  for (const s of staleSessions) {
    const endTime = new Date(s.scheduled_at);
    endTime.setMinutes(endTime.getMinutes() + (s.duration_minutes ?? 45));

    // Skip sessions whose end time hasn't passed yet
    if (new Date() <= endTime) continue;

    const { error: updErr } = await supabaseAdmin
      .from("sessions")
      .update({
        status: "completed",
        completed_at: now,
        auto_completed: true,
        updated_at: now,
      })
      .eq("id", s.id);

    if (updErr) {
      console.error(`Auto-complete failed for session ${s.id}:`, updErr);
      continue;
    }

    // Only insert student attendance; teacher presence is implied by completion
    await supabaseAdmin
      .from("attendance")
      .upsert(
        {
          session_id: s.id,
          student_id: s.student_id,
          status: "present",
          marked_by: s.teacher_id,
        },
        { onConflict: "session_id,student_id" },
      );

    // Accrue salary — same logic as manual completion
    const priceInDollars = s.teachers?.price_per_session ?? 0;
    const amountCents = Math.round(priceInDollars * 100);

    if (amountCents > 0) {
      const { error: earnErr } = await supabaseAdmin
        .from("teacher_earnings")
        .insert({
          teacher_id: s.teacher_id,
          session_id: s.id,
          amount_cents: amountCents,
          marked_by: s.teacher_id,
        });
      if (earnErr) console.error(`Earnings insert failed for session ${s.id}:`, earnErr);
    }

    completed++;
  }

  return { count: completed };
}
