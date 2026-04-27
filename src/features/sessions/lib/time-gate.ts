export type ZoomButtonState =
  | { state: "too_early"; label: string }
  | { state: "active"; label: string }
  | { state: "ended"; label: string };

export function getZoomButtonState(
  scheduledAt: string,
  durationMinutes: number,
  joinWindowMinutes: number = 5,
): ZoomButtonState {
  const now = Date.now();
  const start = new Date(scheduledAt).getTime();
  const end = start + durationMinutes * 60000;
  const windowOpen = start - joinWindowMinutes * 60000;

  if (now < windowOpen) {
    const timeStr = new Date(windowOpen).toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
    });
    return { state: "too_early", label: `Available at ${timeStr}` };
  }

  if (now > end) {
    return { state: "ended", label: "Session Ended" };
  }

  return { state: "active", label: "Join Session" };
}

/**
 * Returns "live" when a scheduled session is inside its active time window,
 * otherwise returns the DB status unchanged.
 * Use this wherever the UI needs to reflect real-time session state without
 * relying on a DB status column that is never auto-promoted to "live".
 */
export function getEffectiveStatus(session: {
  status: string | null;
  scheduled_at: string | null;
  duration_minutes: number | null;
}): string {
  if (session.status === "scheduled" && session.scheduled_at) {
    const gate = getZoomButtonState(
      session.scheduled_at,
      session.duration_minutes ?? 45,
    );
    if (gate.state === "active") return "live";
  }
  return session.status ?? "scheduled";
}
