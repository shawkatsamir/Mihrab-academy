"use server";

import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";
import type { Database } from "@/lib/supabase/database.types";
import { requireRole } from "@/lib/auth/getAuthenticatedUser";

const supabaseAdmin = createSupabaseClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  },
);

export async function createSupervisor(formData: FormData) {
  // Auth guard — only admins, reading role from DB (not user_metadata)
  await requireRole(["admin"]);

  const fullName = formData.get("full_name") as string;
  const email = formData.get("email") as string;
  const imageFile = formData.get("image") as File | null;

  if (!fullName || !email) {
    throw new Error("Invalid form data");
  }

  // 1. Upload avatar if provided
  let photoUrl: string | null = null;
  if (imageFile && imageFile.size > 0) {
    const ext = imageFile.name.split(".").pop();
    const fileName = `${crypto.randomUUID()}.${ext}`;
    const { error: upErr } = await supabaseAdmin.storage
      .from("avatars")
      .upload(fileName, imageFile, { contentType: imageFile.type });

    if (upErr) throw new Error(`Image upload failed: ${upErr.message}`);

    const { data: urlData } = supabaseAdmin.storage
      .from("avatars")
      .getPublicUrl(fileName);
    photoUrl = urlData.publicUrl;
  }

  // 2. Create auth user
  const tempPassword = crypto.randomUUID();
  const { data: authData, error: authErr } =
    await supabaseAdmin.auth.admin.createUser({
      email,
      password: tempPassword,
      email_confirm: true,
      user_metadata: { full_name: fullName, role: "supervisor" },
    });

  if (authErr || !authData.user) {
    throw new Error(authErr?.message ?? "Failed to create auth user");
  }

  // 3. Update profile (trigger already created it; we enrich it)
  const { error: profileErr } = await supabaseAdmin
    .from("profiles")
    .update({
      full_name: fullName,
      photo_url: photoUrl,
      role: "supervisor",
      is_active: true,
    })
    .eq("id", authData.user.id);

  if (profileErr) throw new Error(profileErr.message);

  // 4. Create supervisor record
  const { error: supervisorErr } = await supabaseAdmin
    .from("supervisors")
    .insert({
      id: authData.user.id,
    });

  if (supervisorErr) throw new Error(supervisorErr.message);

  revalidatePath("/supervisors");
  return { success: true, userId: authData.user.id };
}
