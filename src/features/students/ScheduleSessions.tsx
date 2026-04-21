"use client";

import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";

const mockSessions = [
  {
    id: "1",
    title: "Quran Hifz",
    start: new Date(new Date().setHours(7, 0, 0, 0)).toISOString(),
    end: new Date(new Date().setHours(8, 30, 0, 0)).toISOString(),
    backgroundColor: "#EDF3FA",
    borderColor: "transparent",
    textColor: "#1A4B7C",
  },
  {
    id: "2",
    title: "Tajweed",
    start: new Date(new Date().setHours(8, 0, 0, 0)).toISOString(),
    end: new Date(new Date().setHours(9, 0, 0, 0)).toISOString(),
    backgroundColor: "#1A2B4C",
    borderColor: "transparent",
    textColor: "#FFFFFF",
  },
  {
    id: "3",
    title: "Quran Hifz",
    start: new Date(new Date().setHours(8, 0, 0, 0)).toISOString(),
    end: new Date(new Date().setHours(9, 0, 0, 0)).toISOString(),
    backgroundColor: "#EDF3FA",
    borderColor: "transparent",
    textColor: "#1A4B7C",
  },
  {
    id: "4",
    title: "Tajweed",
    start: new Date(new Date().setHours(10, 30, 0, 0)).toISOString(),
    end: new Date(new Date().setHours(11, 30, 0, 0)).toISOString(),
    backgroundColor: "#1A2B4C",
    borderColor: "transparent",
    textColor: "#FFFFFF",
  },
  {
    id: "5",
    title: "Quran Hifz",
    start: new Date(new Date().setHours(9, 30, 0, 0)).toISOString(),
    end: new Date(new Date().setHours(11, 0, 0, 0)).toISOString(),
    backgroundColor: "#EDF3FA",
    borderColor: "transparent",
    textColor: "#1A4B7C",
  },
];

export function ScheduleSessions() {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 mt-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-[#1A2B4C] font-semibold text-lg">
          Schedule Sessions
        </h3>
        <select className="bg-[#EDF3FA] text-[#1A4B7C] text-sm font-medium px-4 py-2 rounded-lg border-none focus:ring-0 cursor-pointer outline-none">
          <option>Weekly</option>
          <option>Monthly</option>
        </select>
      </div>

      <div className="overflow-hidden rounded-lg border border-gray-100">
        <FullCalendar
          plugins={[timeGridPlugin]}
          initialView="timeGridWeek"
          headerToolbar={false}
          events={mockSessions}
          allDaySlot={false}
          slotMinTime="07:00:00"
          slotMaxTime="14:00:00"
          expandRows={true}
          height={400}
          hiddenDays={[0, 6]} // Hide Sunday and Saturday if we just want Mon-Fri as per image
          dayHeaderFormat={{ weekday: "short" }} // 'Mon', 'Tue'
        />
      </div>

      {/* Adjusting fullcalendar internal styles to match image */}
      <style>{`
        .fc-theme-standard td,
        .fc-theme-standard th {
          border-color: #f3f4f6;
        }
        .fc-col-header-cell-cushion {
          color: #9ca3af;
          font-weight: 500;
          font-size: 14px;
          padding: 8px 0;
        }
        .fc-timegrid-slot-label-cushion {
          color: #9ca3af;
          font-size: 12px;
        }
        .fc-event {
          border-radius: 6px;
          padding: 4px 8px;
          font-size: 12px;
          font-weight: 500;
          box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
        }
      `}</style>
    </div>
  );
}
