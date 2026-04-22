"use client";

import { use } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { ArrowLeft, Mail, ShieldAlert } from "lucide-react";
import { Img } from "@/shared/ui/Image";
import { Skeleton } from "@/shared/ui/Skeleton";
import { TeachersTable } from "@/features/teachers/TeachersTable";
import { CalendarView, CalendarEvent } from "@/shared/ui/CalendarView";
import { useSupervisor } from "@/features/supervisors/api/queries";
import { useTeachersBySupervisor } from "@/features/teachers/api/queries";

// ── Mock calendar events (will be replaced gradually) ───────────────────────

const mockEvents: CalendarEvent[] = [
  {
    id: "1",
    title: "Omar S. - Quran Session",
    start: new Date(new Date().setHours(9, 0, 0, 0)).toISOString(),
    end: new Date(new Date().setHours(10, 30, 0, 0)).toISOString(),
    backgroundColor: "#E6F1FB",
    borderColor: "#0C447C",
    textColor: "#0C447C",
  },
  {
    id: "2",
    title: "Ali R. - Arabic Grammar",
    start: new Date(new Date().setHours(11, 0, 0, 0)).toISOString(),
    end: new Date(new Date().setHours(12, 0, 0, 0)).toISOString(),
    backgroundColor: "#FCEBEB",
    borderColor: "#D85A30",
    textColor: "#D85A30",
  },
  {
    id: "3",
    title: "Omar S. - Islamic Studies",
    start: new Date(new Date().setHours(14, 0, 0, 0)).toISOString(),
    end: new Date(new Date().setHours(15, 30, 0, 0)).toISOString(),
    backgroundColor: "#EAF3DE",
    borderColor: "#085041",
    textColor: "#085041",
  },
];

// ── Page ────────────────────────────────────────────────────────────────────

export default function SupervisorDetails({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data: supervisor, isLoading } = useSupervisor(id);
  const { data: assignedTeachers = [], isLoading: loadingTeachers } =
    useTeachersBySupervisor(id);

  // ── Loading state ──────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="space-y-6 max-w-7xl mx-auto p-6 pb-10">
        <Skeleton className="h-10 w-48 mb-6" />
        <Skeleton className="h-[400px] w-full rounded-xl" />
      </div>
    );
  }

  // ── Not found ──────────────────────────────────────────────────────────────
  if (!supervisor) {
    return (
      <div className="p-6 text-center text-gray-500">
        Supervisor not found.
      </div>
    );
  }

  // ── Derived values from real data ──────────────────────────────────────────
  const fullName = supervisor.profiles?.full_name ?? "—";
  const avatarUrl = supervisor.profiles?.photo_url ?? null;
  const isActive = supervisor.profiles?.is_active ?? true;
  const email = supervisor.email ?? "—";
  const joinDate = supervisor.profiles?.created_at
    ? format(new Date(supervisor.profiles.created_at), "MMM d, yyyy")
    : "—";

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-6 pb-10">
      {/* ── Page Header ─────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link
            href="/supervisors"
            className="p-2 bg-white border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-2xl font-semibold text-gray-900">
            Supervisor Details
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 flex items-center gap-2 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors w-fit">
            <ShieldAlert className="w-4 h-4" />
            Delete Supervisor
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* ── Main Content (mock — will be replaced gradually) ─────────────── */}
        <div className="xl:col-span-8 space-y-6">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                Assigned Teachers
              </h2>
            </div>
            <TeachersTable
              teachers={assignedTeachers}
              isLoading={loadingTeachers}
              isAdmin={false}
              onEdit={() => {}}
            />
          </div>

          <CalendarView events={mockEvents} title="Supervised Sessions" />
        </div>

        {/* ── Sidebar — REAL DATA ──────────────────────────────────────────── */}
        <div className="xl:col-span-4 space-y-6">
          {/* Avatar + Name + Status card */}
          <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm flex flex-col items-center text-center">
            <div className="w-24 h-24 relative rounded-2xl bg-[#FCEBEB] mb-4 overflow-hidden border-4 border-white shadow-sm flex items-center justify-center">
              {avatarUrl ? (
                <Img
                  src={avatarUrl}
                  alt={fullName}
                  className="w-full h-full object-cover"
                  fill
                />
              ) : (
                <span className="text-3xl font-semibold text-gray-400">
                  {fullName.charAt(0)}
                </span>
              )}
            </div>

            <h2 className="text-xl font-bold text-[#1A2B4C] mb-2">
              {fullName}
            </h2>

            <div className="flex gap-2 mb-6">
              <span
                className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                  isActive
                    ? "bg-[#EAF3DE] text-[#085041]"
                    : "bg-gray-100 text-gray-500"
                }`}
              >
                {isActive ? "Active" : "Inactive"}
              </span>
            </div>

            <div className="w-full flex flex-col gap-2">
              <div className="flex justify-between items-center py-2 border-t border-gray-100">
                <span className="text-sm text-gray-500">Joined</span>
                <span className="text-sm font-semibold text-[#1A2B4C]">
                  {joinDate}
                </span>
              </div>
            </div>
          </div>

          {/* Contact Information card */}
          <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
            <h2 className="text-base font-semibold text-[#1A2B4C] mb-6">
              Contact Information
            </h2>
            <div className="space-y-5">
              <InfoRow
                icon={<Mail className="w-5 h-5" />}
                label="Email Address"
                value={email}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Shared helper ────────────────────────────────────────────────────────────

function InfoRow({ icon, label, value, highlight = false }: any) {
  return (
    <div className="flex items-start gap-4">
      <div
        className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
          highlight
            ? "bg-[#1A2B4C] text-white"
            : "bg-[#E6F1FB] text-[#0C447C]"
        }`}
      >
        {icon}
      </div>
      <div>
        <p className="text-xs text-gray-500 mb-0.5">{label}</p>
        <div className="text-sm font-medium text-[#1A2B4C]">{value}</div>
      </div>
    </div>
  );
}
