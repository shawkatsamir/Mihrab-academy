"use client";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

const data = [
  { name: "Jul", extraDuties: 20, teachingHours: 80, totalClasses: 100 },
  { name: "Aug", extraDuties: 25, teachingHours: 85, totalClasses: 110 },
  { name: "Sep", extraDuties: 20, teachingHours: 90, totalClasses: 120 },
  { name: "Oct", extraDuties: 32, teachingHours: 134, totalClasses: 149 },
  { name: "Nov", extraDuties: 25, teachingHours: 100, totalClasses: 130 },
];

export default function TeacherWorkloadAreaChart() {
  return (
    <ResponsiveContainer
      width="100%"
      height="100%"
      minHeight={300}
      minWidth={0}
    >
      <AreaChart
        data={data}
        margin={{ top: 10, right: 0, left: -20, bottom: 0 }}
      >
        <CartesianGrid
          strokeDasharray="3 3"
          vertical={false}
          stroke="rgba(0,0,0,0.04)"
        />
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
          tickFormatter={(val) => `${val}h`}
        />
        <Tooltip contentStyle={{ borderRadius: "8px" }} />
        <Legend iconType="circle" wrapperStyle={{ fontSize: "12px" }} />
        <Area
          type="monotone"
          dataKey="totalClasses"
          fill="#FCEBEB"
          stroke="#FCEBEB"
          fillOpacity={0.6}
        />
        <Area
          type="monotone"
          dataKey="teachingHours"
          fill="#E6F1FB"
          stroke="#E6F1FB"
          fillOpacity={0.6}
        />
        <Area
          type="monotone"
          dataKey="extraDuties"
          fill="#1A2B4C"
          stroke="#1A2B4C"
          fillOpacity={0.6}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
