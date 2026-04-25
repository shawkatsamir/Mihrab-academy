"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/Card";
import { Button } from "@/shared/ui/Button";
import { Checkbox } from "@/shared/ui/Checkbox";
import { Textarea } from "@/shared/ui/Textarea";
import { Badge } from "@/shared/ui/Badge";
import { GraduationCap, Eye, EyeOff } from "lucide-react";
import { StarInput } from "@/features/sessions/components/StarInput";
import { upsertTeacherEval } from "@/features/sessions/actions/upsertTeacherEval";
import type { SessionDetailRow } from "@/features/sessions/api/queries";

const DEFAULT_CATEGORIES = [
  { key: "Tajweed", label: "Tajweed" },
  { key: "Memorization", label: "Memorization" },
  { key: "Behavior", label: "Behavior" },
];

interface Props {
  session: SessionDetailRow;
  existingEval?: any;
  readOnly?: boolean;
  onSaved?: (data: any) => void;
}

export function TeacherReportSection({
  session,
  existingEval,
  readOnly,
  onSaved,
}: Props) {
  const [categories, setCategories] = useState(() => {
    if (existingEval?.categories) {
      const map = new Map(
        (existingEval.categories as any[]).map((c) => [c.category, c.score]),
      );
      return DEFAULT_CATEGORIES.map((c) => ({
        ...c,
        score: (map.get(c.key) as number) || 0,
      }));
    }
    return DEFAULT_CATEGORIES.map((c) => ({ ...c, score: 0 }));
  });

  const [notes, setNotes] = useState<string>(existingEval?.notes_md ?? "");
  const [isVisible, setIsVisible] = useState<boolean>(
    existingEval?.is_visible_to_parent ?? false,
  );
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append("session_id", session.id!);
      formData.append("teacher_id", session.teacher_id!);
      formData.append("student_id", session.student_id!);
      formData.append(
        "categories",
        JSON.stringify(
          categories.map((c) => ({ category: c.key, score: c.score })),
        ),
      );
      formData.append("notes_md", notes);
      formData.append("is_visible_to_parent", String(isVisible));

      await upsertTeacherEval(formData);
      onSaved?.({
        categories: categories.map((c) => ({
          category: c.key,
          score: c.score,
        })),
        notes_md: notes,
        is_visible_to_parent: isVisible,
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-muted-foreground" />
            <CardTitle className="text-base">Teacher&apos;s Report</CardTitle>
          </div>
          {readOnly &&
            (existingEval?.is_visible_to_parent ? (
              <Badge variant="outline" className="gap-1">
                <Eye className="h-3 w-3" />
                Visible to Parent
              </Badge>
            ) : (
              <Badge variant="secondary" className="gap-1">
                <EyeOff className="h-3 w-3" />
                Private
              </Badge>
            ))}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-4">
          {categories.map((cat) => (
            <div
              key={cat.key}
              className="space-y-2 rounded-lg border p-3 text-center"
            >
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {cat.label}
              </p>
              <div className="flex justify-center">
                <StarInput
                  value={cat.score}
                  onChange={(score) => {
                    if (!readOnly)
                      setCategories((prev) =>
                        prev.map((c) =>
                          c.key === cat.key ? { ...c, score } : c,
                        ),
                      );
                  }}
                  readOnly={readOnly}
                  size={20}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Notes</label>
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            readOnly={readOnly}
            placeholder="How did the student perform?"
            rows={3}
          />
        </div>

        {!readOnly && (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Checkbox
                id="visible"
                checked={isVisible}
                onCheckedChange={(c) => setIsVisible(c === true)}
              />
              <label htmlFor="visible" className="text-sm">
                Visible to Parent
              </label>
            </div>
            <Button onClick={handleSave} disabled={saving} size="sm">
              {saving ? "Saving…" : "Save Report"}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
