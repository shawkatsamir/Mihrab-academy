"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * Detects Supabase auth error hashes that land on arbitrary pages.
 *
 * When a Supabase auth link fails (expired OTP, already used, etc.) Supabase
 * redirects to the configured Site URL — not to redirectTo — and appends the
 * error as a URL hash fragment:
 *   http://localhost:3000/#error=access_denied&error_description=Email+link+is+invalid+or+has+expired
 *
 * Since hash fragments are client-only, server components and middleware never
 * see them. This component runs on every page and catches those errors so the
 * user gets a meaningful message instead of a blank homepage.
 */
export function SupabaseHashHandler() {
  const router = useRouter();

  useEffect(() => {
    const hash = window.location.hash.substring(1);
    if (!hash) return;

    const params = new URLSearchParams(hash);
    const error = params.get("error");
    const description = params.get("error_description");

    if (error) {
      const message = description ?? error;
      router.replace(`/auth/error?error=${encodeURIComponent(message)}`);
    }
  }, [router]);

  return null;
}
