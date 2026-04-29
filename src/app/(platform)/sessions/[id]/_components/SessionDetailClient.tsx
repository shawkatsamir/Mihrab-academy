"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/shared/ui/Button";
import { SessionHeader } from "@/features/sessions/components/SessionHeader";
import { ParticipantsBar } from "@/features/sessions/components/ParticipantsBar";
import { ZoomJoinSection } from "@/features/sessions/components/ZoomJoinSection";
import { SessionMetadataCard } from "@/features/sessions/components/SessionMetadataCard";
import { MarkCompleteCard } from "@/features/sessions/components/MarkCompleteSection";
import type { EnrichedSessionRow } from "@/features/sessions/api/queries";

const TeacherReportSection = dynamic(
  () =>
    import("@/features/sessions/components/TeacherReportSection").then((m) => ({
      default: m.TeacherReportSection,
    })),
  { ssr: false },
);
const ParentRatingSection = dynamic(
  () =>
    import("@/features/sessions/components/ParentRatingSection").then((m) => ({
      default: m.ParentRatingSection,
    })),
  { ssr: false },
);
const SupervisorEvalSection = dynamic(
  () =>
    import("@/features/sessions/components/SupervisorEvalSection").then(
      (m) => ({ default: m.SupervisorEvalSection }),
    ),
  { ssr: false },
);
const AdminEvalOverview = dynamic(
  () =>
    import("@/features/sessions/components/AdminEvalOverview").then((m) => ({
      default: m.AdminEvalOverview,
    })),
  { ssr: false },
);

interface Props {
  session: EnrichedSessionRow;
  role: "admin" | "supervisor" | "teacher" | "student";
  userId: string;
  teacherEval: {
    is_visible_to_parent?: boolean | null;
    categories?: unknown;
    notes_md?: string | null;
  } | null;
  supervisorEval: { rating?: number | null; notes_md?: string | null } | null;
  parentRating: {
    rating?: number | null;
    comment?: string | null;
    submitted_at?: string | null;
  } | null;
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
      <ParticipantsBar session={session} role={role} />
      {(session.status === "scheduled" || session.status === "live") && (
        <ZoomJoinSection session={session} />
      )}
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
            existingEval={
              localTeacherEval as
                | {
                    is_visible_to_parent?: boolean;
                    categories?: { category: string; score: number }[];
                    notes_md?: string;
                  }
                | undefined
            }
            readOnly={!!localTeacherEval}
            onSaved={setLocalTeacherEval}
          />
          {localSupervisorEval && (
            <SupervisorEvalSection
              session={session}
              existingEval={localSupervisorEval ?? undefined}
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
              existingEval={localSupervisorEval ?? undefined}
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
              existingRating={localParentRating ?? undefined}
              readOnly={!!localParentRating}
              onSaved={setLocalParentRating}
            />
          )}
          {localTeacherEval?.is_visible_to_parent && (
            <TeacherReportSection
              session={session}
              existingEval={
                localTeacherEval as
                  | {
                      is_visible_to_parent?: boolean;
                      categories?: { category: string; score: number }[];
                      notes_md?: string;
                    }
                  | undefined
              }
              readOnly
            />
          )}
        </>
      )}
    </div>
  );
}
