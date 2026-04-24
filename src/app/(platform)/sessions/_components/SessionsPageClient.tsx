"use client";

import { useState, useMemo } from "react";
import {
  format,
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
} from "date-fns";
import { Plus, CalendarIcon } from "lucide-react";
import { useSessions } from "@/features/sessions/api/queries";
import { Button } from "@/shared/ui/Button";
import { Calendar } from "@/shared/ui/Calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/ui/Popover";
import { AdminSessionsView } from "./AdminSessionsView";
import { SupervisorSessionsView } from "./SupervisorSessionsView";
import { TeacherSessionsView } from "./TeacherSessionsView";
import { StudentSessionsView } from "./StudentSessionsView";
import { ScheduleSessionModal } from "@/features/sessions/components/ScheduleSessionModal";
import { SessionStatsCards } from "@/features/sessions/components/SessionStatsCards";

type DateMode = "day" | "week" | "month";

interface Props {
  role: "admin" | "supervisor" | "teacher" | "student";
}

export function SessionsPageClient({ role }: Props) {
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [dateMode, setDateMode] = useState<DateMode>("week");

  const range = useMemo(() => {
    if (dateMode === "day") {
      return {
        start: startOfDay(selectedDate).toISOString(),
        end: endOfDay(selectedDate).toISOString(),
      };
    }
    if (dateMode === "week") {
      return {
        start: startOfWeek(selectedDate, { weekStartsOn: 1 }).toISOString(),
        end: endOfWeek(selectedDate, { weekStartsOn: 1 }).toISOString(),
      };
    }
    return {
      start: startOfMonth(selectedDate).toISOString(),
      end: endOfMonth(selectedDate).toISOString(),
    };
  }, [selectedDate, dateMode]);

  const dateLabel = useMemo(() => {
    if (dateMode === "day") return format(selectedDate, "MMM d, yyyy");
    if (dateMode === "week") {
      const s = startOfWeek(selectedDate, { weekStartsOn: 1 });
      const e = endOfWeek(selectedDate, { weekStartsOn: 1 });
      return `${format(s, "MMM d")} – ${format(e, "MMM d, yyyy")}`;
    }
    return format(selectedDate, "MMMM yyyy");
  }, [selectedDate, dateMode]);

  const { data: sessions = [], isLoading } = useSessions(range);
  const canCreate = role === "admin" || role === "supervisor";

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="h-8 w-32 bg-muted animate-pulse rounded" />
          <div className="h-8 w-56 bg-muted animate-pulse rounded" />
        </div>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-24 bg-muted animate-pulse rounded-lg" />
          ))}
        </div>
        <div className="h-80 bg-muted animate-pulse rounded-lg" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Sessions</h1>
        <div className="flex items-center gap-2 flex-wrap">
          {/* Day / Week / Month toggle */}
          <div className="flex overflow-hidden rounded-md border text-xs font-medium">
            {(["day", "week", "month"] as DateMode[]).map((mode) => (
              <button
                key={mode}
                onClick={() => setDateMode(mode)}
                className={`px-3 py-1.5 capitalize transition-colors ${
                  dateMode === mode
                    ? "bg-primary text-primary-foreground"
                    : "bg-background text-muted-foreground hover:bg-muted"
                }`}
              >
                {mode}
              </button>
            ))}
          </div>

          {/* Calendar date picker */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="gap-1.5 text-xs font-normal">
                <CalendarIcon className="h-3.5 w-3.5" />
                {dateLabel}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(d) => d && setSelectedDate(d)}
              />
            </PopoverContent>
          </Popover>

          {canCreate && (
            <Button size="sm" onClick={() => setScheduleOpen(true)}>
              <Plus className="h-4 w-4 mr-1" />
              Schedule Session
            </Button>
          )}
        </div>
      </div>

      {/* Stats cards */}
      <SessionStatsCards sessions={sessions} />

      {/* Role-specific table view */}
      {role === "admin" && <AdminSessionsView sessions={sessions} />}
      {role === "supervisor" && <SupervisorSessionsView sessions={sessions} />}
      {role === "teacher" && <TeacherSessionsView sessions={sessions} />}
      {role === "student" && <StudentSessionsView sessions={sessions} />}

      {canCreate && (
        <ScheduleSessionModal
          open={scheduleOpen}
          onOpenChange={setScheduleOpen}
          role={role as "admin" | "supervisor"}
        />
      )}
    </div>
  );
}
