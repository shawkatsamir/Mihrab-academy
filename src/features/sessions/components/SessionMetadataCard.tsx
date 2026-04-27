"use client";

import Link from "next/link";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/Card";
import type { EnrichedSessionRow } from "@/features/sessions/api/queries";

interface Props {
  session: EnrichedSessionRow;
}

export function SessionMetadataCard({ session }: Props) {
  const isShifted = !!session.shifted_from_session_id;
  const isCancelled = session.status === "cancelled";

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
            <p className="text-xs text-muted-foreground">
              {isShifted ? "Rescheduled on" : "Scheduled on"}
            </p>
            <p className="font-medium">
              {format(new Date(session.created_at), "MMM d, yyyy")}
            </p>
          </div>
        )}

        {/* Shift metadata — only shown on the new (rescheduled) session, never on cancelled */}
        {isShifted && !isCancelled && (
          <>
            {session.shift_reason && (
              <div className="col-span-2 sm:col-span-3">
                <p className="text-xs text-muted-foreground">Shift Reason</p>
                <p className="font-medium">{session.shift_reason}</p>
              </div>
            )}

            {session.created_by_name && (
              <div>
                <p className="text-xs text-muted-foreground">Shifted by</p>
                <p className="font-medium">{session.created_by_name}</p>
              </div>
            )}

            {session.shifted_at && (
              <div>
                <p className="text-xs text-muted-foreground">Shifted at</p>
                <p className="font-medium">
                  {format(new Date(session.shifted_at), "MMM d, yyyy · h:mm a")}
                </p>
              </div>
            )}
          </>
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
