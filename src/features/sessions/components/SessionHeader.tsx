"use client";

import Link from "next/link";
import { format } from "date-fns";
import { ArrowRightLeft } from "lucide-react";
import { SessionStatusBadge } from "./SessionStatusBadge";
import type { EnrichedSessionRow } from "@/features/sessions/api/queries";

interface Props {
  session: EnrichedSessionRow;
}

export function SessionHeader({ session }: Props) {
  const start = session.scheduled_at ? new Date(session.scheduled_at) : null;

  return (
    <div className="space-y-1">
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-2xl font-bold">{session.subject_name}</h1>
        <SessionStatusBadge status={session.status} />
      </div>

      <p className="text-muted-foreground">
        {start ? format(start, "EEEE, MMMM d, yyyy · h:mm a") : "—"} ·{" "}
        {session.duration_minutes} min
      </p>

      {session.shifted_from_session_id && (
        <p className="flex items-center gap-1.5 text-sm text-purple-600">
          <ArrowRightLeft className="h-3.5 w-3.5" />
          Shifted from{" "}
          <Link
            href={`/sessions/${session.shifted_from_session_id}`}
            className="underline underline-offset-2 hover:text-purple-800"
          >
            original session
          </Link>
        </p>
      )}
    </div>
  );
}
