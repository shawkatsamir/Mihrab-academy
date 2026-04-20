"use client";
import { cn } from "@/lib/utils";
import { useState } from "react";

const performanceMetrics = [
  {
    label: "Session Punctuality",
    actual: 95,
    target: 90,
    status: "Excellent",
    color: "bg-[#FCEBEB]",
  },
  {
    label: "Student Avg. Progress",
    actual: 85,
    target: 90,
    status: "Good",
    color: "bg-[#FCEBEB]",
  },
  {
    label: "Student Attendance",
    actual: 76,
    target: 90,
    status: "Needs Improvement",
    color: "bg-[#FCEBEB]",
  },
  {
    label: "Parent Feedback",
    actual: 65,
    target: 85,
    status: "Below Standard",
    color: "bg-[#FCEBEB]",
  },
];

export default function TeacherPerformance() {
  const [performancePeriod, setPerformancePeriod] = useState("Last Month");

  return (
    <div className="bg-admin-surface rounded-xl border border-admin-border p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-base font-semibold text-[#1A2B4C]">Performance</h2>
        <select
          value={performancePeriod}
          onChange={(e) => setPerformancePeriod(e.target.value)}
          className="bg-[#E6F1FB] text-[#0C447C] text-xs font-medium px-3 py-1.5 rounded-md border-none outline-none cursor-pointer"
        >
          <option>Last Month</option>
          <option>This Semester</option>
        </select>
      </div>

      <div className="space-y-4">
        {performanceMetrics.map((metric, idx) => (
          <div
            key={idx}
            className="bg-white rounded-xl p-4 shadow-sm border border-admin-border/50"
          >
            <div className="flex justify-between items-start mb-2">
              <span className="text-sm font-medium text-[#1A2B4C]">
                {metric.label}
              </span>
              <div className="text-sm">
                <span className="font-bold text-[#1A2B4C]">
                  {metric.actual}%
                </span>
                <span className="text-admin-text-muted">/{metric.target}%</span>
              </div>
            </div>
            <div className="flex justify-between items-end">
              <span className="text-xs text-admin-text-secondary">
                {metric.status}
              </span>
              <div className="w-32 h-2 bg-admin-surface rounded-full overflow-hidden flex relative">
                <div
                  className={cn("h-full rounded-full", metric.color)}
                  style={{ width: `${metric.actual}%` }}
                ></div>
                {/* Target Indicator Line */}
                <div
                  className="absolute top-0 bottom-0 w-0.5 bg-[#1A2B4C]"
                  style={{ left: `${metric.target}%` }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
