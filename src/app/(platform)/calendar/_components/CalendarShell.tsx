"use client";

import { useRef, useCallback, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import interactionPlugin from "@fullcalendar/interaction";
import type {
  EventClickArg,
  DatesSetArg,
  EventContentArg,
} from "@fullcalendar/core";
import {
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  CalendarDays,
  List as ListIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { mapSessionToCalendarEvent } from "@/features/sessions/lib/calendar-mappers";
import type { SessionDetailRow } from "@/features/sessions/api/queries";

type ViewType = "dayGridMonth" | "timeGridWeek" | "timeGridDay";

const VIEWS: { value: ViewType; label: string; icon: React.ReactNode }[] = [
  {
    value: "dayGridMonth",
    label: "Month",
    icon: <LayoutGrid className="h-4 w-4" />,
  },
  {
    value: "timeGridWeek",
    label: "Week",
    icon: <CalendarDays className="h-4 w-4" />,
  },
  {
    value: "timeGridDay",
    label: "Day",
    icon: <ListIcon className="h-4 w-4" />,
  },
];

interface Props {
  sessions: SessionDetailRow[];
  isLoading: boolean;
  role: string;
  onRangeChange: (range: { start: string; end: string }) => void;
}

function EventCard({ info }: { info: EventContentArg }) {
  const session = info.event.extendedProps.session as
    | SessionDetailRow
    | undefined;
  if (!session)
    return <span className="text-xs truncate">{info.event.title}</span>;

  const isMonth = info.view.type === "dayGridMonth";
  let bg = "bg-blue-50 text-blue-800 border-blue-200";
  if (session.status === "cancelled" || session.status === "shifted")
    bg = "bg-gray-100 text-gray-500 border-gray-200 opacity-60";
  else if (session.session_type === "one_time")
    bg = "bg-amber-50 text-amber-800 border-amber-200";
  else if (session.shifted_from_session_id)
    bg = "bg-purple-50 text-purple-800 border-purple-200";

  return (
    <div
      className={`h-full w-full rounded border px-1.5 py-0.5 text-[11px] leading-tight overflow-hidden ${bg}`}
    >
      <div className="font-medium truncate">{session.subject_name}</div>
      {!isMonth && (
        <div className="mt-0.5 opacity-90 truncate">
          {info.timeText} · {session.teacher_name}
        </div>
      )}
    </div>
  );
}

export function CalendarShell({ sessions, isLoading, onRangeChange }: Props) {
  const calendarRef = useRef<FullCalendar>(null);
  const [activeView, setActiveView] = useState<ViewType>("dayGridMonth");
  const router = useRouter();

  const api = calendarRef.current?.getApi();
  const currentDate = api ? api.getDate() : new Date();

  const handleEventClick = useCallback(
    (info: EventClickArg) => {
      const session = info.event.extendedProps.session as
        | SessionDetailRow
        | undefined;
      if (session?.id) router.push(`/sessions/${session.id}`);
    },
    [router],
  );

  const handleDatesSet = useCallback(
    (info: DatesSetArg) => {
      onRangeChange({ start: info.startStr, end: info.endStr });
    },
    [onRangeChange],
  );

  const events = sessions.map(mapSessionToCalendarEvent);

  return (
    <div className="p-6 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-white border rounded-lg shadow-sm">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => api?.prev()}
              className="h-9 w-9 rounded-none rounded-l-lg"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => api?.today()}
              className="h-9 px-3 text-xs font-medium rounded-none border-x"
            >
              Today
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => api?.next()}
              className="h-9 w-9 rounded-none rounded-r-lg"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <h2 className="text-lg font-semibold">
            {format(currentDate, "MMMM yyyy")}
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center bg-gray-100 rounded-lg p-0.5">
            {VIEWS.map((v) => (
              <button
                key={v.value}
                onClick={() => {
                  api?.changeView(v.value);
                  setActiveView(v.value);
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                  activeView === v.value
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {v.icon}
                <span className="hidden sm:inline">{v.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="border rounded-lg border-gray-200 bg-white p-2">
        <FullCalendar
          ref={calendarRef}
          plugins={[
            dayGridPlugin,
            timeGridPlugin,
            listPlugin,
            interactionPlugin,
          ]}
          initialView="dayGridMonth"
          headerToolbar={false}
          events={events}
          loading={isLoading}
          eventClick={handleEventClick}
          datesSet={handleDatesSet}
          eventContent={(info) => <EventCard info={info} />}
          height="auto"
          slotMinTime="06:00:00"
          slotMaxTime="23:00:00"
          dayHeaderFormat={{ weekday: "short", day: "numeric" }}
          eventTimeFormat={{
            hour: "numeric",
            minute: "2-digit",
            meridiem: "short",
          }}
          noEventsContent={
            <div className="py-12 text-center text-sm text-gray-500">
              No sessions scheduled
            </div>
          }
        />
      </div>
    </div>
  );
}
