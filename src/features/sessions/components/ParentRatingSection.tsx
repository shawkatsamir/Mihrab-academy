"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/Card";
import { Button } from "@/shared/ui/Button";
import { Textarea } from "@/shared/ui/Textarea";
import { Star } from "lucide-react";
import { StarInput } from "@/features/sessions/components/StarInput";
import { upsertParentRating } from "@/features/sessions/actions/upsertParentRating";
import type { SessionDetailRow } from "@/features/sessions/api/queries";

interface Props {
  session: SessionDetailRow;
  existingRating?: any;
  readOnly?: boolean;
  onSaved?: (data: any) => void;
}

export function ParentRatingSection({
  session,
  existingRating,
  readOnly,
  onSaved,
}: Props) {
  const [rating, setRating] = useState<number>(existingRating?.rating ?? 0);
  const [comment, setComment] = useState<string>(
    existingRating?.comment ?? "",
  );
  const [saving, setSaving] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) return;
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append("session_id", session.id!);
      formData.append("student_id", session.student_id!);
      formData.append("rating", String(rating));
      formData.append("comment", comment);

      await upsertParentRating(formData);
      onSaved?.({ rating, comment, submitted_at: new Date().toISOString() });
    } finally {
      setSaving(false);
    }
  };

  if (readOnly && !existingRating) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
          Parent Satisfaction
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {readOnly ? (
          <div className="space-y-3 text-center">
            <div className="flex justify-center">
              <StarInput
                value={existingRating.rating}
                onChange={() => {}}
                readOnly
                size={32}
              />
            </div>
            <p className="text-2xl font-bold">
              {existingRating.rating}.0 / 5.0
            </p>
            {existingRating.comment && (
              <p className="text-muted-foreground italic">
                &ldquo;{existingRating.comment}&rdquo;
              </p>
            )}
            {existingRating.submitted_at && (
              <p className="text-xs text-muted-foreground">
                Submitted{" "}
                {format(new Date(existingRating.submitted_at), "MMM d, yyyy")}
              </p>
            )}
          </div>
        ) : (
          <>
            <div className="flex justify-center">
              <StarInput value={rating} onChange={setRating} size={32} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Feedback</label>
              <Textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="How was the session?"
                rows={3}
              />
            </div>
            <div className="flex justify-end">
              <Button
                onClick={handleSubmit}
                disabled={saving || rating === 0}
                size="sm"
              >
                {saving ? "Submitting…" : "Submit Rating"}
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
