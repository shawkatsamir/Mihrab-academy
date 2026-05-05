"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";

interface Props {
  tokenHash: string;
}

/**
 * This button is the ONLY thing that calls verifyOtp.
 * It is intentionally client-side so email pre-scanners (Gmail, Outlook Safe
 * Links) cannot trigger it — they fetch HTML but do not execute JS or click
 * buttons. The OTP is therefore safe until a real user interacts.
 */
export function AcceptInviteButton({ tokenHash }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAccept = async () => {
    setIsLoading(true);
    setError(null);

    const supabase = createClient();
    const { error } = await supabase.auth.verifyOtp({
      type: "recovery",
      token_hash: tokenHash,
    });

    if (error) {
      setError("This invitation link has expired or already been used. Please contact your administrator.");
      setIsLoading(false);
      return;
    }

    // Full page load so middleware picks up the new session cookie
    window.location.href = "/auth/update-password";
  };

  return (
    <div className="space-y-3">
      <Button className="w-full" onClick={handleAccept} disabled={isLoading}>
        {isLoading ? "Verifying…" : "Set My Password"}
      </Button>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
