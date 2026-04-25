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
import { CheckCircle, XCircle, Clock, AlertTriangle } from "lucide-react";
import { markSessionComplete } from "@/features/sessions/actions/markSessionComplete";
import { markSessionNoShow } from "@/features/sessions/actions/markSessionNoShow";
import { useRouter } from "next/navigation";
import type { SessionDetailRow } from "@/features/sessions/api/queries";

interface Props {
  session: SessionDetailRow;
  canComplete: boolean; // is teacher or admin
}

export function MarkCompleteCard({ session, canComplete }: Props) {
  const [studentStatus, setStudentStatus] = useState<
    "present" | "absent" | "late"
  >("present");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const start = session.scheduled_at ? new Date(session.scheduled_at) : null;
  const end = start
    ? new Date(start.getTime() + (session.duration_minutes ?? 45) * 60000)
    : null;
  const now = new Date();
  const isPastEnd = end ? now > end : false;

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
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleNoShow = async () => {
    if (
      !confirm(
        "Mark this session as student no-show? Teacher will not be paid.",
      )
    )
      return;
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("session_id", session.id!);
      formData.append("no_show_student", "true");
      await markSessionNoShow(formData);
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!canComplete) return null;
  if (session.status === "completed") {
    return (
      <Card className="border-green-200 bg-green-50">
        <CardContent className="py-4 flex items-center gap-3">
          <CheckCircle className="h-5 w-5 text-green-600" />
          <div>
            <p className="font-medium text-green-800">Session Completed</p>
            <p className="text-xs text-green-700">
              {session.completed_at
                ? format(new Date(session.completed_at), "PPp")
                : "-"}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (session.status === "no_show") {
    return (
      <Card className="border-orange-200 bg-orange-50">
        <CardContent className="py-4 flex items-center gap-3">
          <XCircle className="h-5 w-5 text-orange-600" />
          <p className="font-medium text-orange-800">Marked as No-Show</p>
        </CardContent>
      </Card>
    );
  }

  if (session.status === "cancelled" || session.status === "shifted")
    return null;

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
                Scheduled to end at {end ? format(end, "h:mm a") : "-"}. You can
                mark complete early if the session finished ahead of time.
              </p>
            </div>
          </div>
        )}

        <div className="space-y-2">
          <Label>Student Attendance</Label>
          <Select
            value={studentStatus}
            onValueChange={(v) => setStudentStatus(v as any)}
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

        <div className="space-y-2">
          <Label>Session Notes</Label>
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="What was covered? Any homework assigned?"
            rows={3}
          />
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <div className="flex flex-col gap-2 sm:flex-row">
          <Button
            className="flex-1"
            onClick={handleComplete}
            disabled={loading || studentStatus === "absent"}
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            {loading ? "Saving..." : "Mark as Complete"}
          </Button>

          <Button
            variant="outline"
            className="flex-1"
            onClick={handleNoShow}
            disabled={loading}
          >
            <XCircle className="h-4 w-4 mr-2" />
            Student No-Show
          </Button>
        </div>

        {studentStatus === "absent" && (
          <p className="text-xs text-muted-foreground">
            Select "Absent" and click "Student No-Show" to record a no-show. No
            payment will be issued.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
