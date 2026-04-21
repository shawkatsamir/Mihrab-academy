"use client";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";

const data = [
  { name: "Omar S.", totalClasses: 18, teachingHours: 12, extraDuties: 4 },
  { name: "Fatima M.", totalClasses: 20, teachingHours: 10, extraDuties: 3 },
  { name: "Hassan R.", totalClasses: 16, teachingHours: 14, extraDuties: 5 },
  { name: "Aisha K.", totalClasses: 18, teachingHours: 12, extraDuties: 4 },
  { name: "Zayd M.", totalClasses: 22, teachingHours: 10, extraDuties: 3 },
];

export default function WorkloadChart() {
  return (
    <ResponsiveContainer width="100%" height="100%" minHeight={250}>
      <BarChart
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
          tickFormatter={(val) => `${val}h`}
        />
        <Tooltip
          cursor={{ fill: "transparent" }}
          contentStyle={{ borderRadius: "8px" }}
        />
        <Legend iconType="circle" wrapperStyle={{ fontSize: "12px" }} />
        <Bar dataKey="totalClasses" stackId="a" fill="#FCEBEB" />
        <Bar dataKey="teachingHours" stackId="a" fill="#E6F1FB" />
        <Bar dataKey="extraDuties" stackId="a" fill="#0C447C" />
      </BarChart>
    </ResponsiveContainer>
  );
}
