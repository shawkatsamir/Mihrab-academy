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

export async function createStudent(formData: FormData) {
  await requireRole(["admin"]);

  const fullName = formData.get("full_name") as string;
  const parentEmail = formData.get("parent_email") as string;
  const dob = (formData.get("date_of_birth") as string) || null;
  const parentWhatsapp = (formData.get("parent_whatsapp") as string) || null;

  if (!fullName || !parentEmail) {
    throw new Error("Full name and parent email are required");
  }

  // 1. Create auth user
  const tempPassword = crypto.randomUUID();
  const { data: authData, error: authErr } =
    await supabaseAdmin.auth.admin.createUser({
      email: parentEmail,
      password: tempPassword,
      email_confirm: true,
      user_metadata: { full_name: fullName, role: "student" },
    });

  if (authErr || !authData.user) {
    throw new Error(authErr?.message ?? "Failed to create auth user");
  }

  const userId = authData.user.id;

  // 2. Enrich profile (trigger already created the row)
  const { error: profileErr } = await supabaseAdmin
    .from("profiles")
    .update({ full_name: fullName, role: "student", is_active: true })
    .eq("id", userId);

  if (profileErr) throw new Error(profileErr.message);

  // 3. Create student record (trigger auto-assigns age_group from DOB)
  const { error: studentErr } = await supabaseAdmin.from("students").insert({
    id: userId,
    date_of_birth: dob,
    parent_whatsapp: parentWhatsapp,
  });

  if (studentErr) throw new Error(studentErr.message);

  // 4. Send invitation email
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  await supabaseAdmin.auth.resetPasswordForEmail(parentEmail, {
    redirectTo: `${siteUrl}/auth/confirm?next=/auth/update-password`,
  });

  revalidatePath("/students");
  return { success: true, userId };
}
