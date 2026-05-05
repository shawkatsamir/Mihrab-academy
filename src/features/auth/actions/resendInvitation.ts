"use server";

import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { requireRole } from "@/lib/auth/getAuthenticatedUser";
import { sendInvitationEmail } from "@/lib/email/sendInvitationEmail";
import type { Database } from "@/lib/supabase/database.types";

const supabaseAdmin = createSupabaseClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } },
);

export async function resendInvitation(userId: string) {
  await requireRole(["admin"]);

  const {
    data: { user },
    error,
  } = await supabaseAdmin.auth.admin.getUserById(userId);

  if (error || !user?.email) throw new Error("User not found");

  const { data: profile } = await supabaseAdmin
    .from("profiles")
    .select("full_name")
    .eq("id", userId)
    .single();

  await sendInvitationEmail({
    email: user.email,
    fullName: profile?.full_name ?? user.email,
  });

  return { success: true };
}
