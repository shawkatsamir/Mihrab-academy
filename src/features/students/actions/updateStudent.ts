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

export async function updateStudent(formData: FormData) {
  await requireRole(["admin"]);

  const studentId = formData.get("student_id") as string;
  const fullName = formData.get("full_name") as string;
  const dob = (formData.get("date_of_birth") as string) || null;
  const parentWhatsapp = (formData.get("parent_whatsapp") as string) || null;
  const isActive = formData.get("is_active") === "true";

  if (!studentId || !fullName) throw new Error("Missing required fields");

  const { error: profileErr } = await supabaseAdmin
    .from("profiles")
    .update({ full_name: fullName, is_active: isActive })
    .eq("id", studentId);
  if (profileErr) throw new Error(profileErr.message);

  const { error: studentErr } = await supabaseAdmin
    .from("students")
    .update({ date_of_birth: dob, parent_whatsapp: parentWhatsapp })
    .eq("id", studentId);
  if (studentErr) throw new Error(studentErr.message);

  revalidatePath("/students");
  revalidatePath(`/students/${studentId}`);
  return { success: true };
}
