"use client";

import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/Avatar";
import type { SessionDetailRow } from "@/features/sessions/api/queries";

interface Props {
  session: SessionDetailRow;
}

export function ParticipantsBar({ session }: Props) {
  return (
    <div className="flex items-center gap-2 rounded-lg border p-4">
      <Link
        href={`/teachers/${session.teacher_id}`}
        className="flex flex-1 items-center gap-3 rounded-md p-2 transition-colors hover:bg-muted/60"
      >
        <Avatar className="h-10 w-10">
          <AvatarImage src={session.teacher_photo ?? undefined} />
          <AvatarFallback>
            {session.teacher_name?.charAt(0) ?? "T"}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="text-sm font-medium">{session.teacher_name}</p>
          <p className="text-xs text-muted-foreground">Teacher</p>
        </div>
      </Link>

      <div className="h-10 w-px shrink-0 bg-border" />

      <Link
        href={`/students/${session.student_id}`}
        className="flex flex-1 items-center gap-3 rounded-md p-2 transition-colors hover:bg-muted/60"
      >
        <Avatar className="h-10 w-10">
          <AvatarImage src={session.student_photo ?? undefined} />
          <AvatarFallback>
            {session.student_name?.charAt(0) ?? "S"}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="text-sm font-medium">{session.student_name}</p>
          <p className="text-xs text-muted-foreground">Student</p>
        </div>
      </Link>
    </div>
  );
}
