"use client";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

export interface CalendarEvent {
  id: string;
  title: string;
  start: string | Date;
  end: string | Date;
  backgroundColor?: string;
  borderColor?: string;
  textColor?: string;
}

interface CalendarViewProps {
  events: CalendarEvent[];
  title?: string;
  height?: string | number;
}

export function CalendarView({ events, title = "Schedule", height = 500 }: CalendarViewProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
      <h2 className="text-base font-semibold text-[#1A2B4C] mb-6">
        {title}
      </h2>
      <div className="overflow-hidden rounded-lg border border-gray-100">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="timeGridWeek"
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay",
          }}
          events={events}
          allDaySlot={false}
          slotMinTime="08:00:00"
          slotMaxTime="20:00:00"
          expandRows={true}
          stickyHeaderDates={true}
          height={height}
        />
      </div>
    </div>
  );
}
