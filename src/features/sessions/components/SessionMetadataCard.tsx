"use client";

import Link from "next/link";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/Card";
import type { EnrichedSessionRow } from "@/features/sessions/api/queries";

interface Props {
  session: EnrichedSessionRow;
}

export function SessionMetadataCard({ session }: Props) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Session Details</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-x-6 gap-y-4 text-sm sm:grid-cols-3">
        <div>
          <p className="text-xs text-muted-foreground">Type</p>
          <p className="font-medium capitalize">
            {session.session_type === "one_time" ? "One-time" : "Recurring"}
          </p>
        </div>

        {session.series_id && (
          <div>
            <p className="text-xs text-muted-foreground">Series</p>
            <Link
              href={`/sessions?series=${session.series_id}`}
              className="font-medium text-blue-600 hover:underline"
            >
              View Series
            </Link>
          </div>
        )}

        {session.created_at && (
          <div>
            <p className="text-xs text-muted-foreground">Scheduled on</p>
            <p className="font-medium">
              {format(new Date(session.created_at), "MMM d, yyyy")}
            </p>
          </div>
        )}

        {session.shift_reason && (
          <div className="col-span-2 sm:col-span-3">
            <p className="text-xs text-muted-foreground">Shift Reason</p>
            <p className="font-medium">{session.shift_reason}</p>
          </div>
        )}

        {session.cancelled_reason && (
          <div className="col-span-2 sm:col-span-3">
            <p className="text-xs text-muted-foreground">Cancellation Reason</p>
            <p className="font-medium text-red-600">
              {session.cancelled_reason}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
