import { Award, MoreHorizontal } from "lucide-react";

interface Achievement {
  id: string | number;
  title: string;
  description: string;
}

interface AchievementsCardProps {
  achievements: Achievement[];
}

export function AchievementsCard({ achievements }: AchievementsCardProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-[#1A2B4C] font-semibold">Achievements</h3>
        <button className="text-gray-400 hover:text-gray-600 transition-colors">
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-4">
        {achievements.map((achievement) => (
          <div
            key={achievement.id}
            className="flex items-center gap-4 bg-gray-50 p-3 rounded-lg"
          >
            <div className="w-10 h-10 rounded-full bg-[#FEF2F2] text-[#DC2626] flex items-center justify-center shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-medium text-gray-900">
                {achievement.title}
              </div>
              <div className="text-xs text-gray-500 mt-0.5">
                {achievement.description}
              </div>
            </div>
          </div>
        ))}
        {achievements.length === 0 && (
          <div className="text-center text-sm text-gray-500 py-2">
            No achievements yet
          </div>
        )}
      </div>
    </div>
  );
}
