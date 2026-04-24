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
