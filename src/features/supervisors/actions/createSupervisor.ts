"use server";

import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { Database } from "@/lib/supabase/database.types";

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
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  const role = user.user_metadata?.role || profile?.role || "admin";
  if (role !== "admin") {
    throw new Error("Forbidden: Only admins can create supervisors");
  }

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
