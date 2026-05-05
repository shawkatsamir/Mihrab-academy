"use client";

import { useState } from "react";
import { Mail, Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { resendInvitation } from "@/features/auth/actions/resendInvitation";

interface Props {
  userId: string;
  className?: string;
}

type State = "idle" | "loading" | "sent" | "error";

export function ResendInviteButton({ userId, className }: Props) {
  const [state, setState] = useState<State>("idle");

  const handleClick = async (e: React.MouseEvent) => {
    e.stopPropagation(); // prevent table row / card click-through
    if (state !== "idle") return;
    setState("loading");
    try {
      await resendInvitation(userId);
      setState("sent");
    } catch {
      setState("error");
    } finally {
      setTimeout(() => setState("idle"), 3000);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={state === "loading"}
      title="Resend invitation email"
      className={cn(
        "flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-md transition-colors disabled:opacity-50 whitespace-nowrap",
        state === "sent" && "text-green-700 bg-green-50",
        state === "error" && "text-red-600 bg-red-50",
        (state === "idle" || state === "loading") &&
          "text-muted-foreground hover:text-foreground hover:bg-muted",
        className,
      )}
    >
      {state === "sent" ? (
        <Check className="w-3.5 h-3.5" />
      ) : state === "error" ? (
        <X className="w-3.5 h-3.5" />
      ) : (
        <Mail className="w-3.5 h-3.5" />
      )}
      {state === "loading"
        ? "Sending…"
        : state === "sent"
          ? "Sent!"
          : state === "error"
            ? "Failed"
            : "Resend invite"}
    </button>
  );
}
