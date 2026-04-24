"use client";

import { useMemo } from "react";
import { isToday, isThisWeek } from "date-fns";
import { Activity, CheckCircle2, Clock, XCircle } from "lucide-react";
import { Card, CardContent } from "@/shared/ui/Card";
import type { SessionDetailRow } from "@/features/sessions/api/queries";

export function SessionStatsCards({
  sessions,
}: {
  sessions: SessionDetailRow[];
}) {
  const stats = useMemo(
    () => ({
      liveNow: sessions.filter((s) => s.status === "live").length,
      completedThisWeek: sessions.filter(
        (s) =>
          s.status === "completed" &&
          s.scheduled_at &&
          isThisWeek(new Date(s.scheduled_at), { weekStartsOn: 1 }),
      ).length,
      upcomingToday: sessions.filter(
        (s) =>
          s.status === "scheduled" &&
          s.scheduled_at &&
          isToday(new Date(s.scheduled_at)),
      ).length,
      cancelledOrShifted: sessions.filter(
        (s) => s.status === "cancelled" || s.status === "shifted",
      ).length,
    }),
    [sessions],
  );

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      <StatCard
        label="Live Now"
        value={stats.liveNow}
        icon={<Activity className="h-5 w-5 text-green-600" />}
        bg="bg-green-50 dark:bg-green-950"
        pulse={stats.liveNow > 0}
      />
      <StatCard
        label="Completed This Week"
        value={stats.completedThisWeek}
        icon={<CheckCircle2 className="h-5 w-5 text-blue-600" />}
        bg="bg-blue-50 dark:bg-blue-950"
      />
      <StatCard
        label="Upcoming Today"
        value={stats.upcomingToday}
        icon={<Clock className="h-5 w-5 text-amber-600" />}
        bg="bg-amber-50 dark:bg-amber-950"
      />
      <StatCard
        label="Cancelled / Rescheduled"
        value={stats.cancelledOrShifted}
        icon={<XCircle className="h-5 w-5 text-red-600" />}
        bg="bg-red-50 dark:bg-red-950"
      />
    </div>
  );
}

function StatCard({
  label,
  value,
  icon,
  bg,
  pulse = false,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  bg: string;
  pulse?: boolean;
}) {
  return (
    <Card>
      <CardContent className="flex items-center gap-4 p-5">
        <div className={`relative shrink-0 rounded-full p-2.5 ${bg}`}>
          {icon}
          {pulse && (
            <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 animate-pulse rounded-full bg-green-500 ring-2 ring-background" />
          )}
        </div>
        <div>
          <p className="text-2xl font-bold leading-none">{value}</p>
          <p className="mt-1 text-xs text-muted-foreground">{label}</p>
        </div>
      </CardContent>
    </Card>
  );
}
