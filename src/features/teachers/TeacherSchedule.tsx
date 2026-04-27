"use client";

import { useCallback, useRef, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import type {
  DatesSetArg,
  EventClickArg,
  EventContentArg,
  EventHoveringArg,
} from "@fullcalendar/core";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { useTeacherSessions } from "./api/queries";
import { mapSessionToCalendarEvent } from "@/features/sessions/lib/calendar-mappers";
import type { SessionDetailRow } from "@/features/sessions/api/queries";

// ── Types ─────────────────────────────────────────────────────────────────────

interface Props {
  teacherId: string;
}

interface HoveredSession {
  session: SessionDetailRow;
  x: number;
  y: number;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function getSessionStyle(session: SessionDetailRow): string {
  if (session.status === "cancelled" || session.status === "shifted")
    return "bg-gray-100 text-gray-500 border-gray-200 opacity-60";
  if (session.is_exception)
    return "bg-purple-50 text-purple-800 border-purple-200";
  if (session.session_type === "one_time")
    return "bg-amber-50 text-amber-800 border-amber-200";
  return "bg-blue-50 text-blue-800 border-blue-200";
}

function statusLabel(session: SessionDetailRow): string {
  switch (session.status) {
    case "cancelled": return "Cancelled";
    case "shifted":   return "Shifted";
    case "completed": return "Completed";
    default:          return "Scheduled";
  }
}

// ── Sub-components ────────────────────────────────────────────────────────────

function EventCard({ info }: { info: EventContentArg }) {
  const session = info.event.extendedProps.session as SessionDetailRow | undefined;
  if (!session)
    return <span className="text-xs truncate px-1">{info.event.title}</span>;

  return (
    <div
      className={`h-full w-full rounded border px-1.5 py-0.5 text-[11px] font-medium leading-tight overflow-hidden truncate ${getSessionStyle(session)}`}
    >
      {session.subject_name ?? info.event.title}
    </div>
  );
}

function SessionPopover({ hovered }: { hovered: HoveredSession }) {
  const { session, x, y } = hovered;

  const start = session.scheduled_at ? new Date(session.scheduled_at) : null;
  const end =
    start && session.duration_minutes
      ? new Date(start.getTime() + session.duration_minutes * 60_000)
      : null;

  const timeRange =
    start && end
      ? `${format(start, "h:mm a")} – ${format(end, "h:mm a")}`
      : start
      ? format(start, "h:mm a")
      : "—";

  // Keep popover within viewport
  const POPOVER_W = 220;
  const left = x + POPOVER_W + 16 > window.innerWidth ? x - POPOVER_W - 8 : x + 12;

  return (
    <div
      className="fixed z-50 pointer-events-none"
      style={{ top: y + 8, left }}
    >
      <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-3 w-[220px] space-y-2 text-xs">
        {/* Subject + status badge */}
        <div className="flex items-start justify-between gap-2">
          <span className="font-semibold text-[#1A2B4C] leading-snug">
            {session.subject_name ?? "—"}
          </span>
          <span
            className={`shrink-0 px-1.5 py-0.5 rounded-full text-[10px] font-medium ${getSessionStyle(session)}`}
          >
            {statusLabel(session)}
          </span>
        </div>

        <div className="border-t border-gray-100" />

        <Row label="Student" value={session.student_name ?? "—"} />
        <Row label="Time"    value={timeRange} />
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-2">
      <span className="text-gray-400">{label}</span>
      <span className="text-gray-700 font-medium text-right">{value}</span>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function TeacherSchedule({ teacherId }: Props) {
  const router = useRouter();
  const calendarRef = useRef<FullCalendar>(null);
  const [hovered, setHovered] = useState<HoveredSession | null>(null);

  const [range, setRange] = useState<{ start: string; end: string }>(() => {
    const now = new Date();
    const start = new Date(now);
    start.setDate(now.getDate() - now.getDay());
    const end = new Date(start);
    end.setDate(start.getDate() + 7);
    return { start: start.toISOString(), end: end.toISOString() };
  });

  const { data: sessions = [], isLoading } = useTeacherSessions(teacherId, range);
  const events = sessions.map(mapSessionToCalendarEvent);

  const handleDatesSet = useCallback((info: DatesSetArg) => {
    setRange({ start: info.startStr, end: info.endStr });
  }, []);

  const handleEventClick = useCallback(
    (info: EventClickArg) => {
      const sessionId = info.event.extendedProps.session?.id;
      if (sessionId) router.push(`/sessions/${sessionId}`);
    },
    [router],
  );

  const handleMouseEnter = useCallback((info: EventHoveringArg) => {
    const session = info.event.extendedProps.session as SessionDetailRow | undefined;
    if (!session) return;
    const rect = (info.el as HTMLElement).getBoundingClientRect();
    setHovered({ session, x: rect.right, y: rect.top });
  }, []);

  const handleMouseLeave = useCallback(() => setHovered(null), []);

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
      <h2 className="text-base font-semibold text-[#1A2B4C] mb-6">
        Class Schedule
      </h2>

      <div className="overflow-hidden rounded-lg border border-gray-100">
        {isLoading ? (
          <div className="h-[500px] animate-pulse bg-gray-50 rounded-lg" />
        ) : (
          <FullCalendar
            ref={calendarRef}
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="timeGridWeek"
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay",
            }}
            events={events}
            datesSet={handleDatesSet}
            eventClick={handleEventClick}
            eventContent={(info) => <EventCard info={info} />}
            eventMouseEnter={handleMouseEnter}
            eventMouseLeave={handleMouseLeave}
            allDaySlot={false}
            slotMinTime="00:00:00"
            slotMaxTime="24:00:00"
            slotEventOverlap={false}
            eventMinHeight={28}
            timeZone="local"
            expandRows={true}
            stickyHeaderDates={true}
            height={500}
            noEventsContent={() => (
              <div className="py-12 text-center text-sm text-gray-400">
                No sessions this period
              </div>
            )}
          />
        )}
      </div>

      {hovered && <SessionPopover hovered={hovered} />}
    </div>
  );
}
