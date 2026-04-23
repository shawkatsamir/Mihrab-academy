import { createClient } from "@/lib/supabase/server";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import type { Database } from "@/lib/supabase/database.types";

type UserRole = Database["public"]["Enums"]["user_role"];

/**
 * Service-role client for reading the profiles table.
 *
 * We use this instead of the user's session client because RLS policies on
 * the `profiles` table may block the user from reading their own row
 * (e.g. if the policy does a role-check that itself queries profiles,
 * causing infinite recursion).
 *
 * This is safe because:
 * 1. This code runs server-side only (never shipped to the browser)
 * 2. We only read ONE column (`role`) from ONE row (the user's own)
 */
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

/**
 * Resolves the authenticated user and their role safely.
 *
 * ─── CRITICAL SECURITY RULE ────────────────────────────────────────────────
 * Role is read from `profiles.role` (DB) only — via service-role client
 * to bypass RLS. `user_metadata.role` is NOT trusted (client-writable).
 *
 * We NEVER fall back to "admin". If the role cannot be resolved we treat
 * the user as unauthenticated and redirect to login.
 * ───────────────────────────────────────────────────────────────────────────
 *
 * @param allowedRoles - If provided, redirects to /dashboard when the user's
 *                       role is not in the list.
 */
export async function getAuthenticatedUser(allowedRoles?: UserRole[]) {
  // Step 1: verify the session exists (uses the user's session cookie)
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login");

  // Step 2: read role via admin client — bypasses RLS to avoid recursion
  const { data: profile } = await supabaseAdmin
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  const role = profile?.role as UserRole | null;

  if (!role) {
    // Profile row missing or role null — kick to login
    redirect("/auth/login");
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    // User is authenticated but lacks permission for this page
    redirect("/dashboard");
  }

  return { user, role };
}

/**
 * Server-action variant — throws instead of redirecting (safe for use inside
 * `"use server"` functions that are called from client components).
 */
export async function requireRole(allowedRoles: UserRole[]) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  // Read role via admin client — bypasses RLS
  const { data: profile } = await supabaseAdmin
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  const role = profile?.role as UserRole | null;

  if (!role) throw new Error("Unauthorized: no role assigned");

  if (!allowedRoles.includes(role)) {
    throw new Error(`Forbidden: requires one of [${allowedRoles.join(", ")}]`);
  }

  return { user, role };
}
