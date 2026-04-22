"use client";
import Link from "next/link";
import { ArrowLeft, Mail, ShieldAlert } from "lucide-react";
import { Img } from "@/shared/ui/Image";
import { TeachersTable } from "@/features/teachers/TeachersTable";
import { CalendarView, CalendarEvent } from "@/shared/ui/CalendarView";

// Mock Data
const supervisorData = {
  id: "1",
  name: "Yusuf M.",
  status: "Active",
  avatar: "https://i.pravatar.cc/150?u=s1",
  email: "yusuf.m@miharab.com",
};

const assignedTeachersMock: any[] = [
  {
    id: "1",
    bio: "Quran Session",
    price_per_session: 5000,
    profiles: {
      full_name: "Omar S.",
      photo_url: "https://i.pravatar.cc/150?u=t1",
      is_active: true,
      created_at: new Date().toISOString(),
    }
  },
  {
    id: "2",
    bio: "Arabic Grammar",
    price_per_session: 4000,
    profiles: {
      full_name: "Ali R.",
      photo_url: "https://i.pravatar.cc/150?u=t3",
      is_active: true,
      created_at: new Date().toISOString(),
    }
  },
];

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

export default function SupervisorDetails({
  params,
}: {
  params: { id: string };
}) {
  return (
    <div className="space-y-6 max-w-7xl mx-auto p-6 pb-10">
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
        {/* Main Content Area (Calendar and Teachers) */}
        <div className="xl:col-span-8 space-y-6">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                Assigned Teachers
              </h2>
            </div>
            <TeachersTable teachers={assignedTeachersMock} isLoading={false} isAdmin={false} onEdit={() => {}} />
          </div>

          <CalendarView events={mockEvents} title="Supervised Sessions" />
        </div>

        {/* Sidebar Info */}
        <div className="xl:col-span-4 space-y-6">
          <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm flex flex-col items-center text-center">
            <div className="w-24 h-24 rounded-2xl bg-[#FCEBEB] mb-4 overflow-hidden border-4 border-white shadow-sm">
              <Img
                src={supervisorData.avatar}
                alt={supervisorData.name}
                className="w-full h-full object-cover"
                width={100}
                height={100}
              />
            </div>
            <h2 className="text-xl font-bold text-[#1A2B4C] mb-2">
              {supervisorData.name}
            </h2>
            <div className="flex gap-2 mb-6">
              <span className="px-2.5 py-1 bg-[#EAF3DE] text-[#085041] rounded-full text-xs font-medium">
                {supervisorData.status}
              </span>
            </div>
          </div>

          {/* Personal Info */}
          <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
            <h2 className="text-base font-semibold text-[#1A2B4C] mb-6">
              Contact Information
            </h2>
            <div className="space-y-5">
              <InfoRow
                icon={<Mail className="w-5 h-5" />}
                label="Email Address"
                value={supervisorData.email}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ icon, label, value, highlight = false }: any) {
  return (
    <div className="flex items-start gap-4">
      <div
        className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${highlight ? "bg-[#1A2B4C] text-white" : "bg-[#E6F1FB] text-[#0C447C]"}`}
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
