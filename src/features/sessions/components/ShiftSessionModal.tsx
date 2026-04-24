"use client";

import { useState } from "react";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/Dialog";
import { Button } from "@/shared/ui/Button";
import { Input } from "@/shared/ui/Input";
import { Label } from "@/shared/ui/Label";
import { Calendar } from "@/shared/ui/Calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/ui/Popover";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useShiftSession } from "@/features/sessions/api/mutations";
import type { SessionDetailRow } from "@/features/sessions/api/queries";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  session: SessionDetailRow | null;
}

export function ShiftSessionModal({ open, onOpenChange, session }: Props) {
  const [date, setDate] = useState<Date | undefined>(
    session?.scheduled_at ? new Date(session.scheduled_at) : undefined,
  );
  const [time, setTime] = useState(
    session?.scheduled_at
      ? format(new Date(session.scheduled_at), "HH:mm")
      : "",
  );
  const [reason, setReason] = useState("");
  const [error, setError] = useState<string | null>(null);

  const shift = useShiftSession();

  if (!session) return null;

  const handleSubmit = async () => {
    setError(null);
    if (!date || !time) return;

    const [h, m] = time.split(":").map(Number);
    const newStart = new Date(date);
    newStart.setHours(h, m, 0, 0);

    try {
      await shift.mutateAsync({
        originalSessionId: session.id!,
        newScheduledAt: newStart.toISOString(),
        reason: reason || undefined,
      });
      onOpenChange(false);
    } catch (err: any) {
      setError(err.message ?? "Shift failed");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Shift Session</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="rounded-md bg-muted p-3 text-sm">
            <p>
              <strong>{session.subject_name}</strong>
            </p>
            <p className="text-muted-foreground">
              {session.teacher_name} → {session.student_name}
            </p>
            <p className="text-muted-foreground">
              Currently:{" "}
              {session.scheduled_at
                ? format(new Date(session.scheduled_at), "PPp")
                : "-"}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>New Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !date && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : "Pick date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    disabled={(d) => d < new Date()}
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <Label>New Time</Label>
              <Input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Reason (optional)</Label>
            <Input
              placeholder="Why is this being shifted?"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={shift.isPending || !date || !time}
            >
              {shift.isPending ? "Shifting..." : "Confirm Shift"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
