import { Mail, Users, CalendarDays } from "lucide-react";
import { format } from "date-fns";

interface SupervisorInfoCardProps {
  email: string | null;
  teacherCount: number;
  createdAt: string;
}

export function SupervisorInfoCard({
  email,
  teacherCount,
  createdAt,
}: SupervisorInfoCardProps) {
  const memberSince = format(new Date(createdAt), "MMM d, yyyy");

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
      <h3 className="text-[#1A2B4C] font-semibold mb-6">Supervisor Info</h3>

      <div className="space-y-4">
        {email && (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-gray-500">
              <Mail className="w-4 h-4" />
              <span className="text-sm">Email</span>
            </div>
            <span className="text-sm font-medium text-gray-900 truncate max-w-[200px]">
              {email}
            </span>
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-gray-500">
            <Users className="w-4 h-4" />
            <span className="text-sm">Teachers Managed</span>
          </div>
          <span className="text-sm font-medium text-gray-900">
            {teacherCount}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-gray-500">
            <CalendarDays className="w-4 h-4" />
            <span className="text-sm">Member Since</span>
          </div>
          <span className="text-sm font-medium text-gray-900">
            {memberSince}
          </span>
        </div>
      </div>
    </div>
  );
}
