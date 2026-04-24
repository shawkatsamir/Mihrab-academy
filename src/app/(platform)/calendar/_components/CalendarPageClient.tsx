"use client";

import { useState } from "react";
import { useSessions } from "@/features/sessions/api/queries";
import { CalendarShell } from "./CalendarShell";

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
