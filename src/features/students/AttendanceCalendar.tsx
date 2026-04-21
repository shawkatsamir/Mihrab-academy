"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  getDay,
  isToday,
} from "date-fns";

type AttendanceType = "present" | "late" | "sick" | "absent" | "none";

interface AttendanceRecord {
  date: string; // YYYY-MM-DD
  status: AttendanceType;
}

interface AttendanceCalendarProps {
  records: AttendanceRecord[];
  onRecordChange?: (date: string, status: AttendanceType) => void;
}

export function AttendanceCalendar({
  records,
  onRecordChange,
}: AttendanceCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth),
  });

  const startDayOfWeek = getDay(startOfMonth(currentMonth));
  const previousDays = Array.from({ length: startDayOfWeek }).map((_, i) => i);

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  const getStatusForDate = (date: Date): AttendanceType => {
    const formattedDate = format(date, "yyyy-MM-dd");
    const record = records.find((r) => r.date === formattedDate);
    return record ? record.status : "none";
  };

  const handleDayClick = (date: Date) => {
    if (!onRecordChange) return;
    const formattedDate = format(date, "yyyy-MM-dd");
    const currentStatus = getStatusForDate(date);

    const cycle: AttendanceType[] = [
      "none",
      "present",
      "late",
      "sick",
      "absent",
    ];
    const nextIndex = (cycle.indexOf(currentStatus) + 1) % cycle.length;
    const nextStatus = cycle[nextIndex];

    onRecordChange(formattedDate, nextStatus);
  };

  const getStatusColor = (status: AttendanceType) => {
    switch (status) {
      case "present":
        return "bg-[#EDF3FA] text-[#1A4B7C] font-semibold";
      case "late":
        return "bg-[#FCEBEB] text-[#D85A30] font-semibold";
      case "sick":
        return "bg-[#1A2B4C] text-white font-semibold";
      case "absent":
        return "bg-[#FAF9F6] text-[#4B5563] font-semibold border border-gray-100";
      default:
        return "text-gray-600 hover:bg-gray-50";
    }
  };

  // Calculate summary for the current month view (or overall)
  const summary = {
    present: records.filter((r) => r.status === "present").length,
    late: records.filter((r) => r.status === "late").length,
    sick: records.filter((r) => r.status === "sick").length,
    absent: records.filter((r) => r.status === "absent").length,
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 flex flex-col h-full">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-[#1A2B4C] font-semibold">
          {format(currentMonth, "MMMM yyyy")}
        </h3>
        <div className="flex items-center gap-2">
          <button
            onClick={prevMonth}
            className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={nextMonth}
            className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="flex-1">
        <div className="grid grid-cols-7 gap-1 text-center mb-2">
          {["S", "M", "T", "W", "T", "F", "S"].map((day, i) => (
            <div key={i} className="text-xs font-medium text-gray-400 py-2">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1 text-center">
          {previousDays.map((_, i) => (
            <div key={`empty-${i}`} className="p-2 text-sm text-gray-300">
              {/* Could show prev month days here, but leaving blank to match design */}
            </div>
          ))}

          {daysInMonth.map((date) => {
            const status = getStatusForDate(date);
            const isCurrentDay = isToday(date);

            return (
              <div
                key={date.toString()}
                onClick={() => handleDayClick(date)}
                className={`
                  p-2 text-sm rounded-lg flex items-center justify-center transition-colors cursor-pointer
                  ${getStatusColor(status)}
                  ${isCurrentDay && status === "none" ? "border border-[#1A4B7C] text-[#1A4B7C] font-bold" : ""}
                `}
              >
                {format(date, "d")}
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend / Summary */}
      <div className="mt-6 grid grid-cols-2 gap-3">
        <div className="flex justify-between items-center px-4 py-2 rounded-lg bg-[#EDF3FA] text-sm">
          <span className="text-[#1A4B7C]">Present</span>
          <span className="font-bold text-[#1A4B7C]">{summary.present}</span>
        </div>
        <div className="flex justify-between items-center px-4 py-2 rounded-lg bg-[#FCEBEB] text-sm">
          <span className="text-[#D85A30]">Late</span>
          <span className="font-bold text-[#D85A30]">{summary.late}</span>
        </div>
        <div className="flex justify-between items-center px-4 py-2 rounded-lg bg-[#1A2B4C] text-sm">
          <span className="text-white">Sick</span>
          <span className="font-bold text-white">{summary.sick}</span>
        </div>
        <div className="flex justify-between items-center px-4 py-2 rounded-lg bg-[#FAF9F6] border border-gray-100 text-sm">
          <span className="text-[#4B5563]">Absent</span>
          <span className="font-bold text-[#1A2B4C]">{summary.absent}</span>
        </div>
      </div>
    </div>
  );
}
