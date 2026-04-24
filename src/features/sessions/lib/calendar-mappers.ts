import type { EventInput } from "@fullcalendar/core";
import type { SessionDetailRow } from "../api/queries";

export function mapSessionToCalendarEvent(
  session: SessionDetailRow,
): EventInput {
  const start = session.scheduled_at
    ? new Date(session.scheduled_at)
    : new Date();
  const end = session.duration_minutes
    ? new Date(start.getTime() + session.duration_minutes * 60000)
    : start;

  let borderColor = "#3b82f6"; // blue
  if (session.session_type === "one_time") borderColor = "#f59e0b"; // amber
  if (session.shifted_from_session_id) borderColor = "#a855f7"; // purple
  if (session.status === "cancelled" || session.status === "shifted")
    borderColor = "#9ca3af"; // gray

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
