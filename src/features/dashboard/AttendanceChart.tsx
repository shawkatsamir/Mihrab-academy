"use client";

import { useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { cn } from "@/lib/utils";

const weekData = [
  { name: "Mon", attendance: 95 },
  { name: "Tue", attendance: 92 },
  { name: "Wed", attendance: 88 },
  { name: "Thu", attendance: 96 },
  { name: "Fri", attendance: 98 },
  { name: "Sat", attendance: 85 },
  { name: "Sun", attendance: 90 },
];

const monthData = [
  { name: "Week 1", attendance: 92 },
  { name: "Week 2", attendance: 94 },
  { name: "Week 3", attendance: 91 },
  { name: "Week 4", attendance: 96 },
];

export function AttendanceChart() {
  const [period, setPeriod] = useState<"week" | "month">("week");
  const data = period === "week" ? weekData : monthData;

  return (
    <div className="lg:col-span-2 bg-admin-card rounded-xl border border-admin-border shadow-sm flex flex-col">
      <div className="p-5 border-b border-admin-border flex items-center justify-between">
        <h2 className="text-base font-semibold text-admin-text-primary">
          Attendance Rate
        </h2>
        <div className="flex p-1 bg-admin-border/50 rounded-lg">
          <button
            onClick={() => setPeriod("week")}
            className={cn(
              "px-3 py-1 text-xs font-medium rounded-md transition-all",
              period === "week"
                ? "bg-admin-card text-admin-text-primary shadow-sm"
                : "text-admin-text-secondary hover:text-admin-text-primary",
            )}
          >
            Week
          </button>
          <button
            onClick={() => setPeriod("month")}
            className={cn(
              "px-3 py-1 text-xs font-medium rounded-md transition-all",
              period === "month"
                ? "bg-admin-card text-admin-text-primary shadow-sm"
                : "text-admin-text-secondary hover:text-admin-text-primary",
            )}
          >
            Month
          </button>
        </div>
      </div>
      <div className="p-5 flex-1 min-h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient
                id="attendanceGradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="5%" stopColor="#1D9E75" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#1D9E75" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(0,0,0,0.04)"
              vertical={false}
            />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 12, fill: "#5F5E5A" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              domain={[0, 100]}
              tick={{ fontSize: 12, fill: "#5F5E5A" }}
              tickFormatter={(value) => `${value}%`}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#FFFFFF",
                border: "0.5px solid rgba(0,0,0,0.08)",
                borderRadius: "8px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
              }}
            />
            <Area
              type="monotone"
              dataKey="attendance"
              stroke="#1D9E75"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#attendanceGradient)"
              activeDot={{
                r: 6,
                fill: "#1D9E75",
                stroke: "#fff",
                strokeWidth: 2,
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
