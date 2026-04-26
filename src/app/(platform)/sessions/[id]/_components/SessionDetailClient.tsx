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
import { MarkCompleteCard } from "@/features/sessions/components/MarkCompleteSection";
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
  const [localSupervisorEval, setLocalSupervisorEval] = useState(supervisorEval);
  const [localParentRating, setLocalParentRating] = useState(parentRating);

  const isAdmin = role === "admin";
  const isSupervisor = role === "supervisor";
  const isTeacher = role === "teacher";
  const isStudent = role === "student";
  const isOwnTeacher = userId === session.teacher_id;
  const isOwnStudent = userId === session.student_id;
  const isCompleted = session.status === "completed";

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <Button variant="outline" size="sm" asChild>
        <Link href="/sessions">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Sessions
        </Link>
      </Button>

      {/* ── Shared info ──────────────────────────────────────── */}
      <SessionHeader session={session} />
      <ParticipantsBar session={session} />
      <ZoomJoinSection session={session} />
      <SessionMetadataCard session={session} />

      {/*
        MarkCompleteCard renders terminal status (completed / no_show)
        for ALL roles so everyone can see the result.
        The action form inside is shown only when canComplete=true (teacher).
      */}
      <MarkCompleteCard
        session={session}
        canComplete={isTeacher && isOwnTeacher}
      />

      {/* ── Admin: full read-only evaluation overview ─────────── */}
      {isAdmin && (
        <AdminEvalOverview
          teacherEval={localTeacherEval}
          supervisorEval={localSupervisorEval}
          parentRating={localParentRating}
        />
      )}

      {/* ── Teacher (own session, completed) ─────────────────── */}
      {isTeacher && isOwnTeacher && isCompleted && (
        <>
          {/* Read-only once saved for the first time */}
          <TeacherReportSection
            session={session}
            existingEval={localTeacherEval}
            readOnly={!!localTeacherEval}
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

      {/* ── Supervisor ───────────────────────────────────────── */}
      {isSupervisor && (
        <>
          {isCompleted && (
            /*
              readOnly derives from whether an eval already exists.
              On first view: editable. After save (or on reload with data): read-only.
            */
            <SupervisorEvalSection
              session={session}
              existingEval={localSupervisorEval}
              readOnly={!!localSupervisorEval}
              userId={userId}
              onSaved={setLocalSupervisorEval}
            />
          )}
          {/* Overview of all evals — always visible to supervisor */}
          <AdminEvalOverview
            teacherEval={localTeacherEval}
            supervisorEval={localSupervisorEval}
            parentRating={localParentRating}
          />
        </>
      )}

      {/* ── Student / Parent ─────────────────────────────────── */}
      {isStudent && isOwnStudent && (
        <>
          {isCompleted && (
            <ParentRatingSection
              session={session}
              existingRating={localParentRating}
              readOnly={!!localParentRating}
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
