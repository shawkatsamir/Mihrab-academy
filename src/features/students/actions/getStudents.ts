"use server";

import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { requireRole } from "@/lib/auth/getAuthenticatedUser";
import type { Database } from "@/lib/supabase/database.types";

const supabaseAdmin = createSupabaseClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } },
);

// ─── Sessions dropdown (no role check — all authenticated roles need this) ────

export async function getStudents() {
  const { data, error } = await supabaseAdmin
    .from("students")
    .select("id, profiles!fk_students_profile(full_name, photo_url), age_groups(label)");

  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function getStudentSubjects(studentId: string) {
  const { data, error } = await supabaseAdmin
    .from("student_subjects")
    .select("subject_id, subjects(id, name, category)")
    .eq("student_id", studentId)
    .eq("is_active", true);

  if (error) throw new Error(error.message);
  return data ?? [];
}

// ─── Admin list page ──────────────────────────────────────────────────────────

export async function getStudentsAdmin() {
  await requireRole(["admin"]);

  const { data, error } = await supabaseAdmin
    .from("students")
    .select(
      `
      id,
      date_of_birth,
      parent_whatsapp,
      enrollment_date,
      age_groups(id, label),
      profiles!fk_students_profile(full_name, photo_url, is_active, created_at),
      student_subjects(
        subject_id,
        subjects(id, name, category)
      )
    `,
    )
    .order("enrollment_date", { ascending: false });

  if (error) throw new Error(error.message);
  return data ?? [];
}

// ─── Admin detail page ────────────────────────────────────────────────────────

export async function getStudent(studentId: string) {
  await requireRole(["admin"]);

  const { data, error } = await supabaseAdmin
    .from("students")
    .select(
      `
      id,
      date_of_birth,
      parent_whatsapp,
      enrollment_date,
      age_groups(id, label),
      profiles!fk_students_profile(full_name, photo_url, is_active, created_at),
      student_subjects(
        subject_id,
        subjects(id, name, category)
      ),
      student_plans(
        id,
        status,
        plan_templates(title)
      )
    `,
    )
    .eq("id", studentId)
    .single();

  if (error) throw new Error(error.message);
  return data;
}
