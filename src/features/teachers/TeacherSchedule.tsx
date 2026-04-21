"use client";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

const mockEvents = [
  {
    id: "1",
    title: "Quran Session (Advanced)",
    start: new Date(new Date().setHours(9, 0, 0, 0)).toISOString(),
    end: new Date(new Date().setHours(10, 30, 0, 0)).toISOString(),
    backgroundColor: "#E6F1FB",
    borderColor: "#0C447C",
    textColor: "#0C447C",
  },
  {
    id: "2",
    title: "Arabic Grammar",
    start: new Date(new Date().setHours(11, 0, 0, 0)).toISOString(),
    end: new Date(new Date().setHours(12, 0, 0, 0)).toISOString(),
    backgroundColor: "#FCEBEB",
    borderColor: "#D85A30",
    textColor: "#D85A30",
  },
  {
    id: "3",
    title: "Islamic Studies",
    start: new Date(new Date().setHours(14, 0, 0, 0)).toISOString(),
    end: new Date(new Date().setHours(15, 30, 0, 0)).toISOString(),
    backgroundColor: "#EAF3DE",
    borderColor: "#085041",
    textColor: "#085041",
  },
];

export default function TeacherSchedule() {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
      <h2 className="text-base font-semibold text-[#1A2B4C] mb-6">
        Class Schedule
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
          events={mockEvents}
          allDaySlot={false}
          slotMinTime="08:00:00"
          slotMaxTime="20:00:00"
          expandRows={true}
          stickyHeaderDates={true}
          height={500}
        />
      </div>
    </div>
  );
}
