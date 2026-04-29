"use client";

import { useState } from "react";
import { LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export function LogoutButton() {
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    // Full page navigation — prevents the browser from restoring this page
    // from bfcache on back-navigation after logout.
    window.location.href = "/auth/login";
  };

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-red-200 text-red-600 bg-white hover:bg-red-50 transition-colors text-sm font-medium disabled:opacity-60"
    >
      <LogOut className="w-4 h-4" />
      {loading ? "Signing out…" : "Sign Out"}
    </button>
  );
}
