"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/shared/ui/Dialog";
import { Button } from "@/shared/ui/Button";
import { useSupervisors } from "@/features/supervisors/api/queries";
import {
  useAssignSupervisor,
  useUnassignSupervisor,
} from "@/features/teachers/api/queries";
import { UserCheck, UserX } from "lucide-react";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  teacherId: string;
  teacherName: string;
  /** Currently assigned supervisor id — null if none */
  currentSupervisorId: string | null;
  /** Currently assigned supervisor name — null if none */
  currentSupervisorName: string | null;
}

export function AssignSupervisorModal({
  open,
  onOpenChange,
  teacherId,
  teacherName,
  currentSupervisorId,
  currentSupervisorName,
}: Props) {
  const { data: supervisors = [], isLoading: loadingSupervisors } =
    useSupervisors();

  const [selectedId, setSelectedId] = useState<string>(
    currentSupervisorId ?? "",
  );
  const [error, setError] = useState<string | null>(null);

  const assignMutation = useAssignSupervisor();
  const unassignMutation = useUnassignSupervisor();

  const isPending = assignMutation.isPending || unassignMutation.isPending;

  const handleSave = async () => {
    setError(null);
    try {
      if (!selectedId) {
        // "None" selected — remove existing assignment
        await unassignMutation.mutateAsync({ teacherId });
      } else {
        await assignMutation.mutateAsync({ teacherId, supervisorId: selectedId });
      }
      onOpenChange(false);
    } catch (err: any) {
      setError(err.message ?? "Something went wrong");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-[#0C447C]" />
            Assign Supervisor
          </DialogTitle>
          <DialogDescription>
            Assign a supervisor to{" "}
            <span className="font-medium text-[#1A2B4C]">{teacherName}</span>.
            {currentSupervisorName && (
              <span className="block mt-1 text-xs text-gray-400">
                Currently: {currentSupervisorName}
              </span>
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-1">
          {/* Supervisor select */}
          <select
            value={selectedId}
            onChange={(e) => setSelectedId(e.target.value)}
            disabled={loadingSupervisors || isPending}
            className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-[#1A2B4C] focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer disabled:opacity-50"
          >
            <option value="">— No supervisor —</option>
            {supervisors.map((s) => (
              <option key={s.id} value={s.id}>
                {s.profiles?.full_name ?? s.id}
              </option>
            ))}
          </select>

          {/* Remove shortcut */}
          {currentSupervisorId && selectedId !== "" && (
            <button
              type="button"
              onClick={() => setSelectedId("")}
              className="flex items-center gap-1.5 text-xs text-red-500 hover:text-red-700 transition-colors"
            >
              <UserX className="w-3.5 h-3.5" />
              Remove current supervisor
            </button>
          )}

          {error && <p className="text-sm text-red-500">{error}</p>}

          <div className="flex justify-end gap-2 pt-1">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={isPending}>
              {isPending ? "Saving..." : "Save"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
