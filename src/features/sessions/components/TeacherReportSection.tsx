"use client";

import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/Card";
import { Button } from "@/shared/ui/Button";
import { Input } from "@/shared/ui/Input";
import { Checkbox } from "@/shared/ui/Checkbox";
import { Textarea } from "@/shared/ui/Textarea";
import { Badge } from "@/shared/ui/Badge";
import { GraduationCap, Eye, EyeOff, Plus, X, Lock } from "lucide-react";
import { StarInput } from "@/features/sessions/components/StarInput";
import { upsertTeacherEval } from "@/features/sessions/actions/upsertTeacherEval";
import { getPresets, LOCKED_TOPIC } from "@/features/sessions/lib/topic-presets";
import type { SessionDetailRow } from "@/features/sessions/api/queries";

interface TopicEntry {
  category: string;
  score: number;
  locked?: boolean;
}

interface SavedCategory {
  category: string;
  score: number;
}

interface ExistingEval {
  categories?: SavedCategory[];
  notes_md?: string;
  is_visible_to_parent?: boolean;
  rating?: number;
}

interface Props {
  session: SessionDetailRow;
  existingEval?: ExistingEval;
  readOnly?: boolean;
  onSaved?: (data: ExistingEval) => void;
}

function buildInitialTopics(existingEval: ExistingEval | undefined): TopicEntry[] {
  if (existingEval?.categories?.length) {
    // Restore saved categories; ensure the locked Attendance entry is always first.
    const saved: TopicEntry[] = existingEval.categories.map((c) => ({
        category: c.category,
        score: c.score,
        locked: c.category === LOCKED_TOPIC,
      }),
    );
    if (!saved.some((t) => t.category === LOCKED_TOPIC)) {
      saved.unshift({ category: LOCKED_TOPIC, score: 0, locked: true });
    }
    return saved;
  }
  return [{ category: LOCKED_TOPIC, score: 0, locked: true }];
}

export function TeacherReportSection({
  session,
  existingEval,
  readOnly,
  onSaved,
}: Props) {
  const [topics, setTopics] = useState<TopicEntry[]>(() =>
    buildInitialTopics(existingEval),
  );
  const [notes, setNotes] = useState<string>(existingEval?.notes_md ?? "");
  const [isVisible, setIsVisible] = useState<boolean>(
    existingEval?.is_visible_to_parent ?? false,
  );
  const [customInput, setCustomInput] = useState("");
  const [saving, setSaving] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const presets = getPresets(session.subject_category);
  const addedKeys = new Set(topics.map((t) => t.category));

  const addTopic = (name: string) => {
    const trimmed = name.trim();
    if (!trimmed || addedKeys.has(trimmed)) return;
    setTopics((prev) => [...prev, { category: trimmed, score: 0 }]);
  };

  const removeTopic = (category: string) => {
    setTopics((prev) => prev.filter((t) => t.locked || t.category !== category));
  };

  const setScore = (category: string, score: number) => {
    setTopics((prev) =>
      prev.map((t) => (t.category === category ? { ...t, score } : t)),
    );
  };

  const handleAddCustom = () => {
    addTopic(customInput);
    setCustomInput("");
    inputRef.current?.focus();
  };

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
          topics.map((t) => ({ category: t.category, score: t.score })),
        ),
      );
      formData.append("notes_md", notes);
      formData.append("is_visible_to_parent", String(isVisible));

      await upsertTeacherEval(formData);
      onSaved?.({
        categories: topics.map((t) => ({ category: t.category, score: t.score })),
        notes_md: notes,
        is_visible_to_parent: isVisible,
      });
    } finally {
      setSaving(false);
    }
  };

  // ── Read-only view ────────────────────────────────────────────────────────

  if (readOnly) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-muted-foreground" />
              <CardTitle className="text-base">Teacher&apos;s Report</CardTitle>
            </div>
            {existingEval?.is_visible_to_parent ? (
              <Badge variant="outline" className="gap-1">
                <Eye className="h-3 w-3" />
                Visible to Parent
              </Badge>
            ) : (
              <Badge variant="secondary" className="gap-1">
                <EyeOff className="h-3 w-3" />
                Private
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {topics.map((t) => (
              <div
                key={t.category}
                className="space-y-1.5 rounded-lg border p-3 text-center"
              >
                <div className="flex items-center justify-center gap-1">
                  {t.locked && <Lock className="h-3 w-3 text-muted-foreground" />}
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    {t.category}
                  </p>
                </div>
                <div className="flex justify-center">
                  <StarInput
                    value={t.score}
                    onChange={() => {}}
                    readOnly
                    size={18}
                  />
                </div>
              </div>
            ))}
          </div>
          {notes && (
            <div className="space-y-1">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Notes
              </p>
              <p className="text-sm whitespace-pre-wrap text-muted-foreground">
                {notes}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  // ── Edit view ─────────────────────────────────────────────────────────────

  const availablePresets = presets.filter((p) => !addedKeys.has(p));

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <GraduationCap className="h-5 w-5 text-muted-foreground" />
          <CardTitle className="text-base">Teacher&apos;s Report</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-5">

        {/* ── Topics covered ─────────────────────────────────────────── */}
        <div className="space-y-3">
          <p className="text-sm font-medium">Topics Covered &amp; Performance</p>

          {/* Added topics with rating */}
          <div className="space-y-2">
            {topics.map((t) => (
              <div
                key={t.category}
                className="flex items-center gap-3 rounded-lg border px-3 py-2"
              >
                <div className="flex items-center gap-1.5 flex-1 min-w-0">
                  {t.locked && (
                    <Lock className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                  )}
                  <span className="text-sm font-medium truncate">
                    {t.category}
                  </span>
                  {t.locked && (
                    <Badge variant="secondary" className="text-[10px] h-4 shrink-0">
                      default
                    </Badge>
                  )}
                </div>
                <StarInput
                  value={t.score}
                  onChange={(score) => setScore(t.category, score)}
                  size={18}
                />
                <button
                  onClick={() => removeTopic(t.category)}
                  disabled={t.locked}
                  className="shrink-0 rounded p-0.5 text-muted-foreground hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-30"
                  title={t.locked ? "Cannot remove default topic" : "Remove topic"}
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>

          {/* Preset chips */}
          {availablePresets.length > 0 && (
            <div className="space-y-1.5">
              <p className="text-xs text-muted-foreground">Quick-add topics:</p>
              <div className="flex flex-wrap gap-1.5">
                {availablePresets.map((preset) => (
                  <button
                    key={preset}
                    onClick={() => addTopic(preset)}
                    className="flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium text-muted-foreground hover:border-primary hover:text-primary transition-colors"
                  >
                    <Plus className="h-3 w-3" />
                    {preset}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Custom topic input */}
          <div className="flex gap-2">
            <Input
              ref={inputRef}
              placeholder="Add a custom topic…"
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddCustom();
                }
              }}
              className="h-8 text-sm"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={handleAddCustom}
              disabled={!customInput.trim() || addedKeys.has(customInput.trim())}
            >
              <Plus className="h-3.5 w-3.5 mr-1" />
              Add
            </Button>
          </div>
        </div>

        {/* ── Notes ──────────────────────────────────────────────────── */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Notes</label>
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="How did the student perform overall? Any homework assigned?"
            rows={3}
          />
        </div>

        {/* ── Footer ─────────────────────────────────────────────────── */}
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
      </CardContent>
    </Card>
  );
}
