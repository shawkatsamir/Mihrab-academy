"use client";

import { useState } from "react";
import { Search, Plus, UserX } from "lucide-react";
import { useStudents } from "@/features/students/api/queries";
import { StudentCard, type Student } from "@/features/students/components/StudentCard";
import { StudentFormModal } from "@/features/students/components/StudentFormModal";
import { Button } from "@/shared/ui/Button";

interface Props {
  isAdmin: boolean;
}

function toCardProps(row: ReturnType<typeof useStudents>["data"][number]): Student {
  const profiles = Array.isArray(row.profiles) ? row.profiles[0] : row.profiles;
  const ageGroup = Array.isArray(row.age_groups) ? row.age_groups[0] : row.age_groups;
  const subjects = (row.student_subjects ?? []).flatMap((ss: any) =>
    Array.isArray(ss.subjects) ? ss.subjects : [ss.subjects],
  ).filter(Boolean);

  const name = profiles?.full_name ?? "Unknown";
  const initials = name
    .split(" ")
    .map((w: string) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return {
    id: row.id,
    name,
    initials,
    ageGroup: ageGroup?.label ?? "—",
    subject: subjects[0]?.name ?? "—",
    planProgress: 0,
    lastSession: "—",
    attendance: 0,
    avatar: profiles?.photo_url ?? undefined,
  };
}

export function StudentsPageClient({ isAdmin }: Props) {
  const { data: students = [], isLoading } = useStudents();
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editStudent, setEditStudent] = useState<any>(null);

  const filtered = students.filter((s) => {
    const profiles = Array.isArray(s.profiles) ? s.profiles[0] : s.profiles;
    return (profiles?.full_name ?? "").toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1A2B4C]">
            Students Directory
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {students.length} enrolled
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search students..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1A2B4C] w-full sm:w-64"
            />
          </div>
          {isAdmin && (
            <Button onClick={() => { setEditStudent(null); setModalOpen(true); }}>
              <Plus className="w-4 h-4 mr-2" />
              Add Student
            </Button>
          )}
        </div>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-64 bg-gray-100 animate-pulse rounded-xl" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center text-muted-foreground gap-3">
          <UserX className="w-10 h-10 opacity-40" />
          <p className="text-sm">
            {search ? "No students match your search." : "No students enrolled yet."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((row) => (
            <StudentCard
              key={row.id}
              student={toCardProps(row)}
              onEdit={isAdmin ? () => { setEditStudent(row); setModalOpen(true); } : undefined}
            />
          ))}
        </div>
      )}

      {isAdmin && (
        <StudentFormModal
          open={modalOpen}
          onOpenChange={(open) => {
            setModalOpen(open);
            if (!open) setEditStudent(null);
          }}
          student={editStudent}
        />
      )}
    </div>
  );
}
