"use client";

import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface AcademicPerformanceProps {
  averageScore: number;
  maxScore: number;
  monthlyData: { month: string; score: number }[];
  description: string;
}

export function AcademicPerformance({
  averageScore,
  maxScore,
  monthlyData,
  description,
}: AcademicPerformanceProps) {
  // Data for the half-doughnut gauge
  const gaugeData = [
    { name: "Score", value: averageScore },
    { name: "Remaining", value: maxScore - averageScore },
  ];
  const COLORS = ["#1A2B4C", "#EDF3FA"];

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-[#1A2B4C] font-semibold">Academic Performance</h3>
        <select className="bg-[#EDF3FA] text-[#1A4B7C] text-xs font-medium px-3 py-1.5 rounded-md border-none focus:ring-0 cursor-pointer outline-none">
          <option>Last 6 Months</option>
          <option>Last Year</option>
        </select>
      </div>

      <div className="flex flex-col md:flex-row gap-8 items-center">
        {/* Left Side: Gauge & Description */}
        <div className="flex-1 flex flex-col items-center max-w-[280px] w-full mx-auto">
          <div className="h-[120px] w-full relative mb-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={gaugeData}
                  cx="50%"
                  cy="100%"
                  startAngle={180}
                  endAngle={0}
                  innerRadius={80}
                  outerRadius={100}
                  paddingAngle={0}
                  dataKey="value"
                  stroke="none"
                  cornerRadius={4}
                >
                  {gaugeData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute left-0 right-0 bottom-0 text-center flex flex-col items-center justify-end h-full pb-2">
              <div className="text-2xl font-bold text-[#1A2B4C]">
                {averageScore}
                <span className="text-sm text-gray-400 font-medium">
                  /{maxScore}
                </span>
              </div>
              <div className="text-xs text-gray-500">Average Score</div>
            </div>
          </div>
          <div className="bg-[#FAF9F6] p-4 rounded-xl text-center text-sm text-gray-600 w-full leading-relaxed border border-gray-50">
            {description}
          </div>
        </div>

        {/* Right Side: Bar Chart */}
        <div className="flex-1 w-full h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyData} barSize={24}>
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#9CA3AF", fontSize: 12 }}
                dy={10}
              />
              <Tooltip
                cursor={{ fill: "#F3F4F6" }}
                contentStyle={{
                  borderRadius: "8px",
                  border: "none",
                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                }}
              />
              <Bar
                dataKey="score"
                fill="#FCEBEB"
                radius={[4, 4, 4, 4]}
                activeBar={{ fill: "#D85A30" }}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
