import { MoreHorizontal } from "lucide-react";

interface Guardian {
  name: string;
  phone: string;
}

interface GuardianInfoCardProps {
  father: Guardian;
  mother: Guardian;
}

export function GuardianInfoCard({ father, mother }: GuardianInfoCardProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-[#1A2B4C] font-semibold">Parent/Guardian Info</h3>
        <button className="text-gray-400 hover:text-gray-600 transition-colors">
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">Father</span>
          <div className="text-right">
            <div className="text-sm font-medium text-gray-900">
              {father.name}
            </div>
            <div className="text-xs text-gray-400 mt-0.5">{father.phone}</div>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">Mother</span>
          <div className="text-right">
            <div className="text-sm font-medium text-gray-900">
              {mother.name}
            </div>
            <div className="text-xs text-gray-400 mt-0.5">{mother.phone}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
