"use server";

import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { requireRole } from "@/lib/auth/getAuthenticatedUser";
import type { Database } from "@/lib/supabase/database.types";

const supabaseAdmin = createSupabaseClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } },
);

export async function getSessions(range?: { start: string; end: string }) {
  const { user, role } = await requireRole([
    "admin",
    "supervisor",
    "teacher",
    "student",
  ]);

  const start =
    range?.start ??
    (() => {
      const d = new Date();
      d.setDate(d.getDate() - 7);
      return d.toISOString();
    })();
  const end =
    range?.end ??
    (() => {
      const d = new Date();
      d.setDate(d.getDate() + 30);
      return d.toISOString();
    })();

  // Build a base query scoped to the caller's role
  if (role === "student") {
    const { data, error } = await supabaseAdmin
      .from("v_session_details")
      .select("*")
      .eq("student_id", user.id)
      .gte("scheduled_at", start)
      .lte("scheduled_at", end)
      .order("scheduled_at", { ascending: true });

    if (error) throw new Error(error.message);
    return data ?? [];
  }

  if (role === "teacher") {
    const { data, error } = await supabaseAdmin
      .from("v_session_details")
      .select("*")
      .eq("teacher_id", user.id)
      .gte("scheduled_at", start)
      .lte("scheduled_at", end)
      .order("scheduled_at", { ascending: true });

    if (error) throw new Error(error.message);
    return data ?? [];
  }

  if (role === "supervisor") {
    // Fetch the IDs of teachers this supervisor is responsible for
    const { data: assignments, error: assignErr } = await supabaseAdmin
      .from("supervisor_assignments")
      .select("teacher_id")
      .eq("supervisor_id", user.id);

    if (assignErr) throw new Error(assignErr.message);

    const teacherIds = (assignments ?? []).map((a) => a.teacher_id);

    // No assigned teachers → no sessions
    if (teacherIds.length === 0) return [];

    const { data, error } = await supabaseAdmin
      .from("v_session_details")
      .select("*")
      .in("teacher_id", teacherIds)
      .gte("scheduled_at", start)
      .lte("scheduled_at", end)
      .order("scheduled_at", { ascending: true });

    if (error) throw new Error(error.message);
    return data ?? [];
  }

  // admin — full access
  const { data, error } = await supabaseAdmin
    .from("v_session_details")
    .select("*")
    .gte("scheduled_at", start)
    .lte("scheduled_at", end)
    .order("scheduled_at", { ascending: true });

  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function getSessionById(id: string) {
  const { user, role } = await requireRole([
    "admin",
    "supervisor",
    "teacher",
    "student",
  ]);

  if (role === "student") {
    const { data, error } = await supabaseAdmin
      .from("v_session_details")
      .select("*")
      .eq("id", id)
      .eq("student_id", user.id)
      .single();

    if (error || !data) throw new Error("Session not found");
    return data;
  }

  if (role === "teacher") {
    const { data, error } = await supabaseAdmin
      .from("v_session_details")
      .select("*")
      .eq("id", id)
      .eq("teacher_id", user.id)
      .single();

    if (error || !data) throw new Error("Session not found");
    return data;
  }

  if (role === "supervisor") {
    const { data: assignments, error: assignErr } = await supabaseAdmin
      .from("supervisor_assignments")
      .select("teacher_id")
      .eq("supervisor_id", user.id);

    if (assignErr) throw new Error(assignErr.message);

    const teacherIds = (assignments ?? []).map((a) => a.teacher_id);
    if (teacherIds.length === 0) throw new Error("Session not found");

    const { data, error } = await supabaseAdmin
      .from("v_session_details")
      .select("*")
      .eq("id", id)
      .in("teacher_id", teacherIds)
      .single();

    if (error || !data) throw new Error("Session not found");
    return data;
  }

  // admin — full access
  const { data, error } = await supabaseAdmin
    .from("v_session_details")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) throw new Error("Session not found");
  return data;
}
