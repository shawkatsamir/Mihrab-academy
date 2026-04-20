"use client";
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

const data = [
  { name: "Mon", target: 85, actual: 75 },
  { name: "Tue", target: 82, actual: 70 },
  { name: "Wed", target: 88, actual: 85 },
  { name: "Thu", target: 92, actual: 90 },
  { name: "Fri", target: 85, actual: 80 },
];

export default function AttendanceChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart
        data={data}
        margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
      >
        <XAxis
          dataKey="name"
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 12 }}
        />
        <YAxis
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 12 }}
          domain={[0, 100]}
        />
        <Tooltip
          cursor={{ fill: "rgba(0,0,0,0.05)" }}
          contentStyle={{ borderRadius: "8px" }}
        />
        <Bar
          dataKey="actual"
          barSize={20}
          fill="#FCEBEB"
          radius={[4, 4, 0, 0]}
        />
        <Line
          type="monotone"
          dataKey="target"
          stroke="#1A2B4C"
          strokeWidth={2}
          dot={{ fill: "#1A2B4C", r: 4 }}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
}
