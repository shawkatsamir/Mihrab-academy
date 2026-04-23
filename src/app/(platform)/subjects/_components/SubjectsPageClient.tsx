"use client";

import { useState } from "react";
import { useSubjectOverviews } from "@/features/subjects/api/queries";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { SubjectCard } from "@/features/subjects/components/SubjectCard";
import { SubjectFormModal } from "@/features/subjects/components/SubjectFormModal";

interface Props {
  role: "admin" | "supervisor" | "teacher" | "student";
}

export function SubjectsPageClient({ role }: Props) {
  const { data: subjects = [], isLoading } = useSubjectOverviews();
  const [modalOpen, setModalOpen] = useState(false);
  const isAdmin = role === "admin";

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Subjects</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {subjects.length} subjects available
          </p>
        </div>
        {isAdmin && (
          <Button onClick={() => setModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Subject
          </Button>
        )}
      </div>

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-40 bg-gray-100 animate-pulse rounded-lg"
            />
          ))}
        </div>
      ) : subjects.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          No subjects found.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {subjects.map((subject) => (
            <SubjectCard key={subject.id} subject={subject} isAdmin={isAdmin} />
          ))}
        </div>
      )}

      {isAdmin && (
        <SubjectFormModal open={modalOpen} onOpenChange={setModalOpen} />
      )}
    </div>
  );
}
