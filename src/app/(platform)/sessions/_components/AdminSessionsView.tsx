"use client";

import { useState } from "react";
import { SessionsTable } from "@/features/sessions/components/SessionsTable";
import { ShiftSessionModal } from "@/features/sessions/components/ShiftSessionModal";
import { CancelSessionModal } from "@/features/sessions/components/CancelSessionModal";
import type { SessionDetailRow } from "@/features/sessions/api/queries";

interface Props {
  sessions: SessionDetailRow[];
}

export function AdminSessionsView({ sessions }: Props) {
  const [shiftSession, setShiftSession] = useState<SessionDetailRow | null>(null);
  const [cancelSession, setCancelSession] = useState<SessionDetailRow | null>(null);

  return (
    <div className="space-y-4">
      <SessionsTable
        sessions={sessions}
        showActions
        showTeacher
        showStudent
        onShift={setShiftSession}
        onCancel={setCancelSession}
      />

      <ShiftSessionModal
        open={!!shiftSession}
        onOpenChange={(open) => !open && setShiftSession(null)}
        session={shiftSession}
      />
      <CancelSessionModal
        open={!!cancelSession}
        onOpenChange={(open) => !open && setCancelSession(null)}
        session={cancelSession}
      />
    </div>
  );
}
