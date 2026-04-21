"use client";
import { useState } from "react";
import { Users, UserCheck } from "lucide-react";
import StatsCard from "@/features/teachers/StatsCard";
import SupervisorsTable, {
  Supervisor,
} from "@/features/supervisors/SupervisorsTable";
import AddSupervisorDrawer from "@/features/supervisors/AddSupervisor";

const mockSupervisors: Supervisor[] = [
  {
    id: 1,
    name: "Yusuf M.",
    email: "yusuf.m@miharab.com",
    assignedTeachers: 12,
    status: "Active",
    avatar: "https://i.pravatar.cc/150?u=s1",
  },
  {
    id: 2,
    name: "Sarah I.",
    email: "sarah.i@miharab.com",
    assignedTeachers: 8,
    status: "Active",
    avatar: "https://i.pravatar.cc/150?u=s2",
  },
  {
    id: 3,
    name: "Ahmed Ali",
    email: "ahmed.a@miharab.com",
    assignedTeachers: 15,
    status: "On Leave",
    avatar: "https://i.pravatar.cc/150?u=s3",
  },
];

export default function SupervisorsPage() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-6">
      {/* Top Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Supervisors"
          value="14"
          icon={<Users className="w-6 h-6" />}
          color="bg-[#1A2B4C] text-white"
        />
        <StatsCard
          title="Active Supervisors"
          value="12"
          icon={<UserCheck className="w-6 h-6" />}
          color="bg-[#EAF3DE] text-[#085041]"
        />
      </div>

      {/* Supervisors Table Section */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
        <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Supervisors List
          </h2>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsDrawerOpen(true)}
              className="bg-[#1A2B4C] hover:bg-[#0f192d] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Add Supervisor
            </button>
          </div>
        </div>

        <SupervisorsTable supervisors={mockSupervisors} />
      </div>

      <AddSupervisorDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />
    </div>
  );
}
