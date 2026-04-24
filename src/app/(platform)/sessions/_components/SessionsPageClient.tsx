"use client";

import { useState } from "react";
import { useSessions } from "@/features/sessions/api/queries";
import { Button } from "@/shared/ui/Button";
import { Plus } from "lucide-react";
import { AdminSessionsView } from "./AdminSessionsView";
import { SupervisorSessionsView } from "./SupervisorSessionsView";
import { TeacherSessionsView } from "./TeacherSessionsView";
import { StudentSessionsView } from "./StudentSessionsView";
import { ScheduleSessionModal } from "@/features/sessions/components/ScheduleSessionModal";

interface Props {
  role: "admin" | "supervisor" | "teacher" | "student";
}

export function SessionsPageClient({ role }: Props) {
  const { data: sessions = [], isLoading } = useSessions();
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const canCreate = role === "admin" || role === "supervisor";

  if (isLoading) {
    return (
      <div className="p-6 space-y-4">
        <div className="h-8 w-48 bg-gray-200 animate-pulse rounded" />
        <div className="h-96 bg-gray-200 animate-pulse rounded" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Sessions</h1>
        {canCreate && (
          <Button onClick={() => setScheduleOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Schedule Session
          </Button>
        )}
      </div>

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
