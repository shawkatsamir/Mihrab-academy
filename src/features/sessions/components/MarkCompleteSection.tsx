"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/shared/ui/Button";
import { Label } from "@/shared/ui/Label";
import { Textarea } from "@/shared/ui/Textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/Select";
import { CheckCircle, XCircle, Clock, AlertTriangle, Info } from "lucide-react";
import { markSessionComplete } from "@/features/sessions/actions/markSessionComplete";
import { useRouter } from "next/navigation";
import type { SessionDetailRow } from "@/features/sessions/api/queries";
import { cn } from "@/lib/utils";

const ATTENDANCE_LABEL: Record<string, string> = {
  present: "Present",
  late: "Late",
  absent: "Absent",
};

const ATTENDANCE_COLOR: Record<string, string> = {
  present: "text-green-700 bg-green-100",
  late: "text-amber-700 bg-amber-100",
  absent: "text-red-700 bg-red-100",
};

interface Props {
  session: SessionDetailRow;
  /** True only for the teacher who owns this session */
  canComplete: boolean;
}

export function MarkCompleteCard({ session, canComplete }: Props) {
  const [studentStatus, setStudentStatus] = useState<
    "present" | "absent" | "late"
  >("present");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // ── Terminal: completed ─────────────────────────────────────────────────

  if (session.status === "completed") {
    return (
      <Card className="border-green-200 bg-green-50">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2 text-green-800">
            <CheckCircle className="h-4 w-4 text-green-600" />
            Session Completed
            {session.completed_at && (
              <span className="text-xs font-normal text-green-700 ml-auto">
                {format(new Date(session.completed_at), "PPp")}
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0 space-y-3">
          {session.attendance_status && (
            <div className="flex items-center gap-2 text-sm">
              <span className="text-green-700 font-medium">
                Student Attendance:
              </span>
              <span
                className={cn(
                  "text-xs font-semibold px-2 py-0.5 rounded-full capitalize",
                  ATTENDANCE_COLOR[session.attendance_status] ??
                    "text-gray-700 bg-gray-100",
                )}
              >
                {ATTENDANCE_LABEL[session.attendance_status] ??
                  session.attendance_status}
              </span>
            </div>
          )}
          {session.teacher_notes_md && (
            <div className="space-y-1">
              <p className="text-xs font-semibold text-green-700 uppercase tracking-wide">
                Session Notes
              </p>
              <p className="text-sm text-green-900 whitespace-pre-wrap">
                {session.teacher_notes_md}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  // ── Terminal: no_show (legacy records) ─────────────────────────────────

  if (session.status === "no_show") {
    return (
      <Card className="border-orange-200 bg-orange-50">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2 text-orange-800">
            <XCircle className="h-4 w-4 text-orange-600" />
            Student Absent — Session Counted &amp; Paid
            {session.completed_at && (
              <span className="text-xs font-normal text-orange-700 ml-auto">
                {format(new Date(session.completed_at), "PPp")}
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <p className="text-sm text-orange-700">
            The student did not attend. The teacher completed the mandatory
            30-minute waiting period and has been compensated accordingly. This
            session is included in the total session count.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (session.status === "cancelled" || session.status === "shifted") {
    return null;
  }

  // ── Action form — teacher only ──────────────────────────────────────────

  if (!canComplete) return null;

  const start = session.scheduled_at ? new Date(session.scheduled_at) : null;
  const end = start
    ? new Date(start.getTime() + (session.duration_minutes ?? 45) * 60000)
    : null;
  const isPastEnd = end ? new Date() > end : false;

  const handleComplete = async () => {
    setLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("session_id", session.id!);
      formData.append("student_attendance", studentStatus);
      formData.append("notes_md", notes);
      await markSessionComplete(formData);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <Clock className="h-4 w-4" />
          Complete Session
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!isPastEnd && (
          <div className="flex items-start gap-2 rounded-md bg-amber-50 p-3 text-sm text-amber-800">
            <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
            <div>
              <p className="font-medium">Session still in progress</p>
              <p className="text-xs">
                Scheduled to end at {end ? format(end, "h:mm a") : "-"}. You
                can mark complete early if the session finished ahead of time.
              </p>
            </div>
          </div>
        )}

        <div className="space-y-2">
          <Label>Student Attendance</Label>
          <Select
            value={studentStatus}
            onValueChange={(v) => setStudentStatus(v as "present" | "absent" | "late")}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="present">Present</SelectItem>
              <SelectItem value="late">Late</SelectItem>
              <SelectItem value="absent">Absent (No-Show)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Policy banner — shown only when teacher marks student as absent */}
        {studentStatus === "absent" && (
          <div className="flex items-start gap-2 rounded-md bg-blue-50 border border-blue-200 p-3 text-sm text-blue-800">
            <Info className="h-4 w-4 mt-0.5 shrink-0 text-blue-600" />
            <div className="space-y-1">
              <p className="font-medium">Absent student — session still paid</p>
              <p className="text-xs text-blue-700">
                Per academy policy, the teacher waits a mandatory 30 minutes for
                the student. The session will be marked as completed, counted in
                the total, and the teacher will be compensated in full.
              </p>
              <p className="text-xs text-blue-600 font-medium mt-1">
                If the parent notified you in advance that the student
                wouldn&apos;t attend, cancel the session instead of completing
                it.
              </p>
            </div>
          </div>
        )}

        <div className="space-y-2">
          <Label>Session Notes</Label>
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder={
              studentStatus === "absent"
                ? "Note that the student was absent and you waited the required 30 minutes."
                : "What was covered? Any homework assigned?"
            }
            rows={3}
          />
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <Button
          className="w-full"
          onClick={handleComplete}
          disabled={loading}
        >
          <CheckCircle className="h-4 w-4 mr-2" />
          {loading
            ? "Saving..."
            : studentStatus === "absent"
              ? "Mark as Complete (Student Absent)"
              : "Mark as Complete"}
        </Button>
      </CardContent>
    </Card>
  );
}
