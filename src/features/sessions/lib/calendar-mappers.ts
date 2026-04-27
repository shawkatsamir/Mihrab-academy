import type { EventInput } from "@fullcalendar/core";
import type { SessionDetailRow } from "../api/queries";

function toUtcDate(iso: string): Date {
  // Supabase returns timestamptz as "…+00:00" or "…Z".
  // If the string has no offset (bare local timestamp), append Z so the
  // browser treats it as UTC rather than local time.
  const hasOffset = iso.endsWith("Z") || /[+-]\d{2}:\d{2}$/.test(iso);
  return new Date(hasOffset ? iso : iso + "Z");
}

export function mapSessionToCalendarEvent(
  session: SessionDetailRow,
): EventInput {
  const start = session.scheduled_at ? toUtcDate(session.scheduled_at) : new Date();
  const end = session.duration_minutes
    ? new Date(start.getTime() + session.duration_minutes * 60000)
    : start;

  return {
    id: session.id ?? "",
    title: session.subject_name || "Session",
    start,
    end,
    extendedProps: { session },
    backgroundColor: "transparent",
    borderColor: "transparent",
    textColor: "inherit",
  };
}
