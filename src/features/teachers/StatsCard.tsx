import { ReactNode } from "react";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  color: string;
}

export default function StatsCard({
  title,
  value,
  icon,
  color,
}: StatsCardProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm flex items-center justify-between">
      <div>
        <h3 className="text-sm font-medium text-gray-500 mb-1">{title}</h3>
        <span className="text-3xl font-bold text-[#1A2B4C]">{value}</span>
      </div>
      <div
        className={`w-12 h-12 rounded-full flex items-center justify-center ${color}`}
      >
        {icon}
      </div>
    </div>
  );
}
