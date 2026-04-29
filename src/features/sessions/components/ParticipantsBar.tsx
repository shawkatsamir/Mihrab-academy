"use client";

import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/Avatar";
import type { SessionDetailRow } from "@/features/sessions/api/queries";

interface Props {
  session: SessionDetailRow;
  role: "admin" | "supervisor" | "teacher" | "student";
}

function ParticipantCard({
  href,
  photo,
  name,
  label,
  navigable,
}: {
  href: string;
  photo?: string | null;
  name?: string | null;
  label: string;
  navigable: boolean;
}) {
  const content = (
    <>
      <Avatar className="h-10 w-10">
        <AvatarImage src={photo ?? undefined} />
        <AvatarFallback>{name?.charAt(0) ?? label.charAt(0)}</AvatarFallback>
      </Avatar>
      <div>
        <p className="text-sm font-medium">{name}</p>
        <p className="text-xs text-muted-foreground">{label}</p>
      </div>
    </>
  );

  if (navigable) {
    return (
      <Link
        href={href}
        className="flex flex-1 items-center gap-3 rounded-md p-2 transition-colors hover:bg-muted/60"
      >
        {content}
      </Link>
    );
  }

  return (
    <div className="flex flex-1 items-center gap-3 rounded-md p-2">
      {content}
    </div>
  );
}

export function ParticipantsBar({ session, role }: Props) {
  const canNavigate = role === "admin" || role === "supervisor";

  return (
    <div className="flex items-center gap-2 rounded-lg border p-4">
      <ParticipantCard
        href={`/teachers/${session.teacher_id}`}
        photo={session.teacher_photo}
        name={session.teacher_name}
        label="Teacher"
        navigable={canNavigate}
      />

      <div className="h-10 w-px shrink-0 bg-border" />

      <ParticipantCard
        href={`/students/${session.student_id}`}
        photo={session.student_photo}
        name={session.student_name}
        label="Student"
        navigable={canNavigate}
      />
    </div>
  );
}
