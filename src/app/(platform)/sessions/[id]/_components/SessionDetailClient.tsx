"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/shared/ui/Button";
import { SessionHeader } from "@/features/sessions/components/SessionHeader";
import { ParticipantsBar } from "@/features/sessions/components/ParticipantsBar";
import { ZoomJoinSection } from "@/features/sessions/components/ZoomJoinSection";
import { SessionMetadataCard } from "@/features/sessions/components/SessionMetadataCard";
import { TeacherReportSection } from "@/features/sessions/components/TeacherReportSection";
import { ParentRatingSection } from "@/features/sessions/components/ParentRatingSection";
import { SupervisorEvalSection } from "@/features/sessions/components/SupervisorEvalSection";
import { AdminEvalOverview } from "@/features/sessions/components/AdminEvalOverview";
import type { EnrichedSessionRow } from "@/features/sessions/api/queries";

interface Props {
  session: EnrichedSessionRow;
  role: "admin" | "supervisor" | "teacher" | "student";
  userId: string;
  teacherEval: any;
  supervisorEval: any;
  parentRating: any;
}

export function SessionDetailClient({
  session,
  role,
  userId,
  teacherEval,
  supervisorEval,
  parentRating,
}: Props) {
  const [localTeacherEval, setLocalTeacherEval] = useState(teacherEval);
  const [localSupervisorEval, setLocalSupervisorEval] =
    useState(supervisorEval);
  const [localParentRating, setLocalParentRating] = useState(parentRating);

  const isAdmin = role === "admin";
  const isSupervisor = role === "supervisor";
  const isTeacher = role === "teacher";
  const isStudent = role === "student";
  const isOwnTeacher = userId === session.teacher_id;
  const isOwnStudent = userId === session.student_id;

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <Button variant="outline" size="sm" asChild>
        <Link href="/sessions">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Sessions
        </Link>
      </Button>

      {/* ── Shared info ─────────────────────────── */}
      <SessionHeader session={session} />
      <ParticipantsBar session={session} />
      <ZoomJoinSection session={session} />
      <SessionMetadataCard session={session} />

      {/* ── Admin: full evaluation overview ─────── */}
      {isAdmin && (
        <AdminEvalOverview
          teacherEval={localTeacherEval}
          supervisorEval={localSupervisorEval}
          parentRating={localParentRating}
        />
      )}

      {/* ── Teacher (own session) ────────────────── */}
      {isTeacher && isOwnTeacher && (
        <>
          <TeacherReportSection
            session={session}
            existingEval={localTeacherEval}
            onSaved={setLocalTeacherEval}
          />
          {localSupervisorEval && (
            <SupervisorEvalSection
              session={session}
              existingEval={localSupervisorEval}
              readOnly
            />
          )}
          {localParentRating && (
            <ParentRatingSection
              session={session}
              existingRating={localParentRating}
              readOnly
            />
          )}
        </>
      )}

      {/* ── Supervisor ───────────────────────────── */}
      {isSupervisor && (
        <>
          <SupervisorEvalSection
            session={session}
            existingEval={localSupervisorEval}
            userId={userId}
            onSaved={setLocalSupervisorEval}
          />
          {localTeacherEval && (
            <TeacherReportSection
              session={session}
              existingEval={localTeacherEval}
              readOnly
            />
          )}
          {localParentRating && (
            <ParentRatingSection
              session={session}
              existingRating={localParentRating}
              readOnly
            />
          )}
        </>
      )}

      {/* ── Student / Parent ─────────────────────── */}
      {isStudent && isOwnStudent && (
        <>
          {session.status === "completed" && (
            <ParentRatingSection
              session={session}
              existingRating={localParentRating}
              onSaved={setLocalParentRating}
            />
          )}
          {localTeacherEval?.is_visible_to_parent && (
            <TeacherReportSection
              session={session}
              existingEval={localTeacherEval}
              readOnly
            />
          )}
        </>
      )}
    </div>
  );
}
