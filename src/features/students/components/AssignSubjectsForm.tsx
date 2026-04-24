"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Search, BookOpen, Check } from "lucide-react";
import { Button } from "@/shared/ui/Button";
import { Input } from "@/shared/ui/Input";
import { useSubjectOverviews } from "@/features/subjects/api/queries";
import { useAssignSubjects } from "@/features/students/api/mutations";

const schema = z.object({
  subject_ids: z.array(z.string()).min(1, "Select at least one subject"),
});

type FormValues = z.infer<typeof schema>;

const CATEGORY_COLORS: Record<string, string> = {
  quran: "bg-emerald-50 border-emerald-200 text-emerald-800",
  arabic: "bg-blue-50 border-blue-200 text-blue-800",
  islamic_studies: "bg-amber-50 border-amber-200 text-amber-800",
};

const CATEGORY_SELECTED: Record<string, string> = {
  quran: "bg-emerald-100 border-emerald-500 text-emerald-900 ring-2 ring-emerald-400",
  arabic: "bg-blue-100 border-blue-500 text-blue-900 ring-2 ring-blue-400",
  islamic_studies: "bg-amber-100 border-amber-500 text-amber-900 ring-2 ring-amber-400",
};

interface Props {
  studentId: string;
  currentSubjectIds: string[];
}

export function AssignSubjectsForm({ studentId, currentSubjectIds }: Props) {
  const [search, setSearch] = useState("");
  const [success, setSuccess] = useState(false);

  const { data: subjects = [], isLoading } = useSubjectOverviews();
  const assign = useAssignSubjects(studentId);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { subject_ids: currentSubjectIds },
  });

  const selected = form.watch("subject_ids");

  const filtered = subjects.filter((s) =>
    s.name?.toLowerCase().includes(search.toLowerCase()),
  );

  const toggle = (id: string) => {
    const current = form.getValues("subject_ids");
    if (current.includes(id)) {
      form.setValue(
        "subject_ids",
        current.filter((x) => x !== id),
        { shouldValidate: true },
      );
    } else {
      form.setValue("subject_ids", [...current, id], { shouldValidate: true });
    }
    setSuccess(false);
  };

  const onSubmit = async (values: FormValues) => {
    try {
      await assign.mutateAsync(values.subject_ids);
      setSuccess(true);
    } catch {
      // error shown inline
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
      <div className="flex items-center gap-2 mb-5">
        <BookOpen className="w-5 h-5 text-[#1A4B7C]" />
        <h3 className="text-[#1A2B4C] font-semibold">Assigned Subjects</h3>
        {selected.length > 0 && (
          <span className="ml-auto text-xs font-medium px-2 py-0.5 rounded-full bg-[#EDF3FA] text-[#1A4B7C]">
            {selected.length} selected
          </span>
        )}
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          placeholder="Search subjects..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Subject grid */}
      <form onSubmit={form.handleSubmit(onSubmit)}>
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-14 bg-gray-100 animate-pulse rounded-lg" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-6">
            {search ? "No subjects match your search." : "No subjects available."}
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
            {filtered.map((subj) => {
              const isSelected = selected.includes(subj.id!);
              const cat = subj.category ?? "quran";
              const baseClass = CATEGORY_COLORS[cat] ?? CATEGORY_COLORS.quran;
              const selectedClass = CATEGORY_SELECTED[cat] ?? CATEGORY_SELECTED.quran;

              return (
                <button
                  key={subj.id}
                  type="button"
                  onClick={() => toggle(subj.id!)}
                  className={`flex items-center justify-between px-4 py-3 rounded-lg border text-sm font-medium transition-all ${
                    isSelected ? selectedClass : baseClass
                  } hover:opacity-90`}
                >
                  <span>{subj.name}</span>
                  {isSelected && <Check className="w-4 h-4 shrink-0" />}
                </button>
              );
            })}
          </div>
        )}

        {form.formState.errors.subject_ids && (
          <p className="text-xs text-red-500 mb-3">
            {form.formState.errors.subject_ids.message}
          </p>
        )}

        {assign.error && (
          <p className="text-xs text-red-500 mb-3">
            {(assign.error as Error).message}
          </p>
        )}

        {success && (
          <p className="text-xs text-emerald-600 mb-3">
            Subjects saved successfully.
          </p>
        )}

        <div className="flex justify-end">
          <Button type="submit" disabled={assign.isPending}>
            {assign.isPending ? "Saving..." : "Save Subjects"}
          </Button>
        </div>
      </form>
    </div>
  );
}
