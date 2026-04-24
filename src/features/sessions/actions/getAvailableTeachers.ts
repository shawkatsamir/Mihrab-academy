"use server";

import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/database.types";

const supabaseAdmin = createSupabaseClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } },
);

export async function getAvailableTeachers(start: string, end: string) {
  const { data: teachers, error: tErr } = await supabaseAdmin
    .from("teachers")
    .select("id, profiles(full_name, photo_url), zoom_personal_link")
    .eq("profiles.is_active", true);

  if (tErr) throw new Error(tErr.message);

  const dayStart = new Date(start);
  dayStart.setHours(0, 0, 0, 0);
  const dayEnd = new Date(end);
  dayEnd.setHours(23, 59, 59, 999);

  const { data: daySessions, error: sErr } = await supabaseAdmin
    .from("sessions")
    .select("teacher_id, scheduled_at, duration_minutes")
    .gte("scheduled_at", dayStart.toISOString())
    .lte("scheduled_at", dayEnd.toISOString())
    .not("status", "in", '("cancelled","shifted","no_show")');

  if (sErr) throw new Error(sErr.message);

  const proposedStart = new Date(start);
  const proposedEnd = new Date(end);

  const busyTeacherIds = new Set(
    (daySessions ?? [])
      .filter((s) => {
        const sStart = new Date(s.scheduled_at);
        const sEnd = new Date(sStart.getTime() + (s.duration_minutes || 45) * 60000);
        return sStart < proposedEnd && sEnd > proposedStart;
      })
      .map((s) => s.teacher_id),
  );

  return (teachers ?? []).filter((t) => !busyTeacherIds.has(t.id));
}
