"use client";

import { Button } from "@/components/ui/button";
import { Video } from "lucide-react";
import { getZoomButtonState } from "@/features/sessions/lib/time-gate";
import type { SessionDetailRow } from "@/features/sessions/api/queries";

interface Props {
  session: SessionDetailRow;
  size?: "default" | "sm" | "icon";
}

export function ZoomJoinButton({ session, size = "default" }: Props) {
  const zoomUrl =
    session.zoom_join_url || (session.teacher_id ? undefined : undefined); // Could fetch teacher fallback

  const btnState = session.scheduled_at
    ? getZoomButtonState(session.scheduled_at, session.duration_minutes ?? 45)
    : { state: "ended" as const, label: "No Link" };

  if (!zoomUrl) return null;

  if (btnState.state === "too_early" || btnState.state === "ended") {
    return (
      <Button size={size} disabled variant="outline">
        <Video className="h-4 w-4 mr-2" />
        {btnState.label}
      </Button>
    );
  }

  return (
    <Button size={size} asChild>
      <a href={zoomUrl} target="_blank" rel="noreferrer">
        <Video className="h-4 w-4 mr-2" />
        {btnState.label}
      </a>
    </Button>
  );
}
