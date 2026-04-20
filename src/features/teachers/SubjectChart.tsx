"use client";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";

const data = [
  { name: "Quran", value: 35, percentage: 40, color: "#1D9E75" },
  { name: "Arabic", value: 25, percentage: 29, color: "#7F77DD" },
  { name: "Islamic", value: 20, percentage: 23, color: "#EF9F27" },
  { name: "Tajweed", value: 10, percentage: 12, color: "#D85A30" },
  { name: "Hifz", value: 10, percentage: 12, color: "#9A9890" },
];

export default function SubjectChart() {
  return (
    <div className="flex flex-col h-full w-full">
      <div className="relative h-[200px] w-full flex-shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius="65%"
              outerRadius="90%"
              paddingAngle={2}
              dataKey="value"
              stroke="none"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip contentStyle={{ borderRadius: "8px" }} />
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-xs text-gray-500">Total Teachers</span>
          <span className="text-2xl font-bold text-[#1A2B4C]">86</span>
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-3 flex-1 overflow-y-auto pr-2">
        {data.map((item) => (
          <div
            key={item.name}
            className="flex items-center justify-between text-sm"
          >
            <div className="flex items-center gap-2">
              <span
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-gray-600 font-medium">{item.name}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-gray-900 font-semibold">{item.value}</span>
              <span className="text-gray-400 text-xs w-8 text-right">
                {item.percentage}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
