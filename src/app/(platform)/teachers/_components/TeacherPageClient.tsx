"use client";

import { useState } from "react";
import { useTeachers } from "@/features/teachers/api/queries";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { TeachersTable } from "@/features/teachers/TeachersTable";
import { TeacherFormModal } from "@/features/teachers/AddTeacher";

interface Props {
  role: "admin" | "supervisor" | "teacher" | "student";
}

export function TeachersPageClient({ role }: Props) {
  const { data: teachers = [], isLoading } = useTeachers();
  const [modalOpen, setModalOpen] = useState(false);
  const [editTeacher, setEditTeacher] = useState<
    (typeof teachers)[number] | null
  >(null);

  const isAdmin = role === "admin";

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Teachers</h1>
        {isAdmin && (
          <Button onClick={() => setModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Teacher
          </Button>
        )}
      </div>

      <TeachersTable
        teachers={teachers}
        isLoading={isLoading}
        isAdmin={isAdmin}
        onEdit={(t) => {
          setEditTeacher(t);
          setModalOpen(true);
        }}
      />

      <TeacherFormModal
        open={modalOpen}
        onOpenChange={(open) => {
          setModalOpen(open);
          if (!open) setEditTeacher(null);
        }}
        teacher={editTeacher}
      />
    </div>
  );
}
