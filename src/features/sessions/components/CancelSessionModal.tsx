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
import { useCancelSession } from "@/features/sessions/api/mutations";
import type { SessionDetailRow } from "@/features/sessions/api/queries";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  session: SessionDetailRow | null;
}

export function CancelSessionModal({ open, onOpenChange, session }: Props) {
  const [reason, setReason] = useState("");
  const [error, setError] = useState<string | null>(null);
  const cancel = useCancelSession();

  if (!session) return null;

  const handleSubmit = async () => {
    setError(null);
    try {
      await cancel.mutateAsync({
        sessionId: session.id!,
        reason: reason || undefined,
      });
      onOpenChange(false);
    } catch (err: any) {
      setError(err.message ?? "Cancel failed");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Cancel Session</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="rounded-md bg-red-50 p-3 text-sm">
            <p>
              <strong>{session.subject_name}</strong>
            </p>
            <p className="text-muted-foreground">
              {session.scheduled_at
                ? format(new Date(session.scheduled_at), "PPp")
                : "-"}
            </p>
          </div>

          <div className="space-y-2">
            <Label>Reason (optional)</Label>
            <Input
              placeholder="Reason for cancellation"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Keep Session
            </Button>
            <Button
              variant="destructive"
              onClick={handleSubmit}
              disabled={cancel.isPending}
            >
              {cancel.isPending ? "Cancelling..." : "Confirm Cancel"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
