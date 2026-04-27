"use client";

import dynamic from "next/dynamic";

import { StatCards } from "@/features/dashboard/StatsCards";
import { TodaySessions } from "@/features/dashboard/TodaySessions";
import { TeacherPerformance } from "@/features/dashboard/TeacherPerformance";
import { RecentActivity } from "@/features/dashboard/RecentActivity";
import { MessagesPanel } from "@/features/dashboard/MessagePanal";

// Recharts is browser-only and heavy. Dynamic import with ssr:false:
//  1. Removes it from the server compilation path (fewer modules, faster TTF).
//  2. Lets the page shell render instantly; the chart streams in after hydration.
const AttendanceChart = dynamic(
  () =>
    import("@/features/dashboard/AttendanceChart").then((m) => ({
      default: m.AttendanceChart,
    })),
  {
    ssr: false,
    loading: () => (
      <div className="lg:col-span-2 bg-admin-card rounded-xl border border-admin-border shadow-sm min-h-[350px] animate-pulse" />
    ),
  },
);

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
