"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/Card";
import { Button } from "@/shared/ui/Button";
import { Textarea } from "@/shared/ui/Textarea";
import { ClipboardCheck } from "lucide-react";
import { StarInput } from "@/features/sessions/components/StarInput";
import { upsertSupervisorEval } from "@/features/sessions/actions/upsertSupervisorEval";
import type { SessionDetailRow } from "@/features/sessions/api/queries";

interface Props {
  session: SessionDetailRow;
  existingEval?: any;
  readOnly?: boolean;
  userId?: string;
  onSaved?: (data: any) => void;
}

export function SupervisorEvalSection({
  session,
  existingEval,
  readOnly,
  userId,
  onSaved,
}: Props) {
  const [rating, setRating] = useState<number>(existingEval?.rating ?? 0);
  const [notes, setNotes] = useState<string>(existingEval?.notes_md ?? "");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (rating === 0) return;
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append("session_id", session.id!);
      formData.append("supervisor_id", userId ?? "");
      formData.append("teacher_id", session.teacher_id!);
      formData.append("rating", String(rating));
      formData.append("notes_md", notes);

      await upsertSupervisorEval(formData);
      onSaved?.({ rating, notes_md: notes });
    } finally {
      setSaving(false);
    }
  };

  if (readOnly && !existingEval) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <ClipboardCheck className="h-5 w-5 text-muted-foreground" />
          Supervisor Evaluation
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {readOnly ? (
          <div className="space-y-3">
            <StarInput
              value={existingEval.rating}
              onChange={() => {}}
              readOnly
              size={24}
            />
            {existingEval.notes_md && (
              <p className="text-sm whitespace-pre-wrap text-muted-foreground">
                {existingEval.notes_md}
              </p>
            )}
          </div>
        ) : (
          <>
            <div className="space-y-2">
              <label className="text-sm font-medium">Rating</label>
              <StarInput value={rating} onChange={setRating} size={28} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Notes</label>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Observations on teaching methodology and class management…"
                rows={3}
              />
            </div>
            <div className="flex justify-end">
              <Button
                onClick={handleSave}
                disabled={saving || rating === 0}
                size="sm"
              >
                {saving ? "Saving…" : "Save Evaluation"}
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
