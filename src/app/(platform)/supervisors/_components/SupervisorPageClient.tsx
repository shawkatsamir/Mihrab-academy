"use client";

import { useState } from "react";
import { useSupervisors } from "@/features/supervisors/api/queries";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { SupervisorsTable } from "@/features/supervisors/SupervisorsTable";
import { SupervisorFormModal } from "@/features/supervisors/AddSupervisor";

interface Props {
  role: "admin" | "supervisor" | "teacher" | "student";
}

export function SupervisorsPageClient({ role }: Props) {
  const { data: supervisors = [], isLoading } = useSupervisors();
  const [modalOpen, setModalOpen] = useState(false);
  const [editSupervisor, setEditSupervisor] = useState<
    (typeof supervisors)[number] | null
  >(null);

  const isAdmin = role === "admin";

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Supervisors</h1>
        {isAdmin && (
          <Button onClick={() => setModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Supervisor
          </Button>
        )}
      </div>

      <SupervisorsTable
        supervisors={supervisors}
        isLoading={isLoading}
        isAdmin={isAdmin}
        onEdit={(s) => {
          setEditSupervisor(s);
          setModalOpen(true);
        }}
      />

      <SupervisorFormModal
        open={modalOpen}
        onOpenChange={(open) => {
          setModalOpen(open);
          if (!open) setEditSupervisor(null);
        }}
        supervisor={editSupervisor}
      />
    </div>
  );
}
