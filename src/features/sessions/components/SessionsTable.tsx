"use client";

import { useState, useMemo } from "react";
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
import { Input } from "@/shared/ui/Input";
import { Eye, ArrowRightLeft, X, Search } from "lucide-react";
import { SessionStatusBadge } from "./SessionStatusBadge";
import type { SessionDetailRow } from "@/features/sessions/api/queries";

type StatusFilter =
  | "all"
  | "scheduled"
  | "live"
  | "completed"
  | "shifted"
  | "cancelled";

const STATUS_TABS: { value: StatusFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "scheduled", label: "Upcoming" },
  { value: "live", label: "Live" },
  { value: "completed", label: "Completed" },
  { value: "shifted", label: "Shifted" },
  { value: "cancelled", label: "Cancelled" },
];

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
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    let list = sessions;
    if (statusFilter !== "all") {
      list = list.filter((s) => s.status === statusFilter);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (s) =>
          s.subject_name?.toLowerCase().includes(q) ||
          s.teacher_name?.toLowerCase().includes(q) ||
          s.student_name?.toLowerCase().includes(q),
      );
    }
    return list;
  }, [sessions, statusFilter, search]);

  const colCount =
    5 + // id, subject, date, status, view
    (showTeacher ? 1 : 0) +
    (showStudent ? 1 : 0) +
    (showActions ? 1 : 0);

  return (
    <div className="space-y-3">
      {/* Filter row */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-1">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setStatusFilter(tab.value)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                statusFilter === tab.value
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/70"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="relative w-full sm:w-56">
          <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            placeholder="Search sessions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-8 pl-8 text-sm"
          />
        </div>
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[88px]">ID</TableHead>
              <TableHead>Subject</TableHead>
              {showTeacher && <TableHead>Teacher</TableHead>}
              {showStudent && <TableHead>Student</TableHead>}
              <TableHead>Date & Time</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[56px]">View</TableHead>
              {showActions && (
                <TableHead className="w-[88px]">Actions</TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={colCount}
                  className="py-8 text-center text-muted-foreground"
                >
                  No sessions found.
                </TableCell>
              </TableRow>
            )}
            {filtered.map((s) => (
              <TableRow key={s.id} className="cursor-pointer hover:bg-muted/50">
                <TableCell>
                  <span className="font-mono text-xs text-muted-foreground">
                    SES-{s.id?.slice(-4).toUpperCase()}
                  </span>
                </TableCell>
                <TableCell className="font-medium">{s.subject_name}</TableCell>
                {showTeacher && <TableCell>{s.teacher_name}</TableCell>}
                {showStudent && <TableCell>{s.student_name}</TableCell>}
                <TableCell>
                  {s.scheduled_at ? (
                    <div className="text-sm">
                      <div>
                        {format(new Date(s.scheduled_at), "MMM d, yyyy")}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {format(new Date(s.scheduled_at), "h:mm a")} ·{" "}
                        {s.duration_minutes}m
                      </div>
                    </div>
                  ) : (
                    "-"
                  )}
                </TableCell>
                <TableCell>
                  <SessionStatusBadge status={s.status} />
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
    </div>
  );
}
