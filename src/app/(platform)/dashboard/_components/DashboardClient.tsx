"use client";

import { StatCards } from "@/features/dashboard/StatsCards";
import { TodaySessions } from "@/features/dashboard/TodaySessions";
import { AttendanceChart } from "@/features/dashboard/AttendanceChart";
import { TeacherPerformance } from "@/features/dashboard/TeacherPerformance";
import { RecentActivity } from "@/features/dashboard/RecentActivity";
import { MessagesPanel } from "@/features/dashboard/MessagePanal";

export function DashboardClient() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <StatCards />

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <TodaySessions />
        <AttendanceChart />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <TeacherPerformance />
        <RecentActivity />
        <MessagesPanel />
      </div>
    </div>
  );
}
