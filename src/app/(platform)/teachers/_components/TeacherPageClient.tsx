"use client";

import { useState } from "react";
import {
  useTeachers,
  useTeachersBySupervisor,
} from "@/features/teachers/api/queries";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { TeachersTable } from "@/features/teachers/TeachersTable";
import { TeacherFormModal } from "@/features/teachers/AddTeacher";

interface Props {
  role: "admin" | "supervisor" | "teacher" | "student";
  /** Auth user id — used to scope data when role === "supervisor" */
  userId: string;
}

/** Supervisor-scoped inner component — only runs the scoped query */
function SupervisorView({ userId }: { userId: string }) {
  const { data: teachers = [], isLoading } = useTeachersBySupervisor(userId);
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">My Teachers</h1>
      </div>
      <TeachersTable
        teachers={teachers}
        isLoading={isLoading}
        isAdmin={false}
        onEdit={() => {}}
      />
    </div>
  );
}

/** Admin view — sees all teachers + can create/edit */
function AdminView() {
  const { data: teachers = [], isLoading } = useTeachers();
  const [modalOpen, setModalOpen] = useState(false);
  const [editTeacher, setEditTeacher] = useState<
    (typeof teachers)[number] | null
  >(null);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Teachers</h1>
        <Button onClick={() => setModalOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Teacher
        </Button>
      </div>

      <TeachersTable
        teachers={teachers}
        isLoading={isLoading}
        isAdmin={true}
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

export function TeachersPageClient({ role, userId }: Props) {
  if (role === "supervisor") {
    return <SupervisorView userId={userId} />;
  }
  return <AdminView />;
}
