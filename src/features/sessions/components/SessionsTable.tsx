"use client";

import Link from "next/link";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui/Table";
import { Button } from "@/shared/ui/Button";
import { Eye, ArrowRightLeft, X } from "lucide-react";
import { SessionStatusBadge } from "./SessionStatusBadge";
import { ZoomJoinButton } from "./ZoomJoinButton";
import type { SessionDetailRow } from "@/features/sessions/api/queries";

interface Props {
  sessions: SessionDetailRow[];
  showActions?: boolean;
  showTeacher?: boolean;
  showStudent?: boolean;
  onShift?: (session: SessionDetailRow) => void;
  onCancel?: (session: SessionDetailRow) => void;
}

export function SessionsTable({
  sessions,
  showActions = false,
  showTeacher = true,
  showStudent = true,
  onShift,
  onCancel,
}: Props) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Subject</TableHead>
            {showTeacher && <TableHead>Teacher</TableHead>}
            {showStudent && <TableHead>Student</TableHead>}
            <TableHead>Date & Time</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Join</TableHead>
            <TableHead className="w-[100px]">View</TableHead>
            {showActions && (
              <TableHead className="w-[100px]">Actions</TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {sessions.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={showActions ? 8 : 7}
                className="text-center text-muted-foreground py-8"
              >
                No sessions found.
              </TableCell>
            </TableRow>
          )}
          {sessions.map((s) => (
            <TableRow
              key={s.id}
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => {
                window.location.href = `/sessions/${s.id}`;
              }}
            >
              <TableCell className="font-medium">{s.subject_name}</TableCell>
              {showTeacher && <TableCell>{s.teacher_name}</TableCell>}
              {showStudent && <TableCell>{s.student_name}</TableCell>}
              <TableCell>
                {s.scheduled_at ? (
                  <div className="text-sm">
                    <div>{format(new Date(s.scheduled_at), "MMM d, yyyy")}</div>
                    <div className="text-muted-foreground">
                      {format(new Date(s.scheduled_at), "h:mm a")} ·{" "}
                      {s.duration_minutes}m
                    </div>
                  </div>
                ) : (
                  "-"
                )}
              </TableCell>
              <TableCell>
                <span
                  className={`text-xs ${
                    s.session_type === "one_time"
                      ? "text-amber-600"
                      : "text-blue-600"
                  }`}
                >
                  {s.session_type === "recurring" ? "Recurring" : "One-time"}
                </span>
              </TableCell>
              <TableCell>
                <SessionStatusBadge status={s.status} />
              </TableCell>
              <TableCell onClick={(e) => e.stopPropagation()}>
                <ZoomJoinButton session={s} size="sm" />
              </TableCell>
              <TableCell onClick={(e) => e.stopPropagation()}>
                <Button size="icon" variant="ghost" asChild>
                  <Link href={`/sessions/${s.id}`}>
                    <Eye className="h-4 w-4" />
                  </Link>
                </Button>
              </TableCell>
              {showActions && (
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center gap-1">
                    {s.status === "scheduled" && (
                      <>
                        <Button
                          size="icon"
                          variant="ghost"
                          title="Shift"
                          onClick={() => onShift?.(s)}
                        >
                          <ArrowRightLeft className="h-4 w-4 text-purple-500" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          title="Cancel"
                          onClick={() => onCancel?.(s)}
                        >
                          <X className="h-4 w-4 text-red-500" />
                        </Button>
                      </>
                    )}
                  </div>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
