"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { useSessions } from "@/features/sessions/api/queries";

// FullCalendar imports 5 heavy plugins. Defer the entire shell client-side so
// the calendar page shell compiles without them on first server render.
const CalendarShell = dynamic(
  () =>
    import("./CalendarShell").then((m) => ({ default: m.CalendarShell })),
  {
    ssr: false,
    loading: () => (
      <div className="p-6 min-h-[600px] animate-pulse rounded-xl bg-white border border-gray-200" />
    ),
  },
);

interface Props {
  role: "admin" | "supervisor" | "teacher" | "student";
}

export function CalendarPageClient({ role }: Props) {
  const [range, setRange] = useState<{ start: string; end: string }>({
    start: new Date().toISOString(),
    end: new Date().toISOString(),
  });

  const { data: sessions = [], isLoading } = useSessions(range);

  return (
    <CalendarShell
      sessions={sessions}
      isLoading={isLoading}
      role={role}
      onRangeChange={setRange}
    />
  );
}
