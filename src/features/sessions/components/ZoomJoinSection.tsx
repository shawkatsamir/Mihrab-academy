"use client";

import { Button } from "@/shared/ui/Button";
import { Video } from "lucide-react";
import { getZoomButtonState } from "@/features/sessions/lib/time-gate";
import type { SessionDetailRow } from "@/features/sessions/api/queries";

interface Props {
  session: SessionDetailRow;
}

export function ZoomJoinSection({ session }: Props) {
  const zoomUrl = session.zoom_join_url;
  if (!zoomUrl || !session.scheduled_at) return null;

  const state = getZoomButtonState(
    session.scheduled_at,
    session.duration_minutes ?? 45,
  );

  return (
    <div className="flex items-center justify-between rounded-lg border p-4">
      <div>
        <p className="text-sm font-medium">Video Session</p>
        <p className="text-xs text-muted-foreground">
          {state.state === "active"
            ? "Session is live — join now"
            : state.state === "too_early"
              ? `Opens ${state.label.replace("Available at ", "at ")}`
              : "Session has ended"}
        </p>
      </div>

      {state.state === "active" ? (
        <Button asChild>
          <a href={zoomUrl} target="_blank" rel="noreferrer">
            <Video className="h-4 w-4 mr-2" />
            Join Now
          </a>
        </Button>
      ) : state.state === "too_early" ? (
        <Button disabled variant="outline">
          <Video className="h-4 w-4 mr-2" />
          {state.label}
        </Button>
      ) : (
        <Button disabled variant="ghost">
          Session Ended
        </Button>
      )}
    </div>
  );
}
