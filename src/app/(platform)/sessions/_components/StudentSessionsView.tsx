"use client";

import { SessionsTable } from "@/features/sessions/components/SessionsTable";
import type { SessionDetailRow } from "@/features/sessions/api/queries";

interface Props {
  sessions: SessionDetailRow[];
}

export function StudentSessionsView({ sessions }: Props) {
  return (
    <SessionsTable
      sessions={sessions}
      showActions={false}
      showTeacher
      showStudent={false}
    />
  );
}
