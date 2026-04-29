import {
  BookOpen,
  Clock,
  DollarSign,
  Link2,
  Mail,
  TrendingUp,
  UserCheck,
} from "lucide-react";

interface TeacherInfoCardProps {
  email: string | null;
  bio: string | null;
  pricePerHour: number | null;
  zoomPersonalLink: string | null;
  sogoEmail: string | null;
  supervisorName: string | null;
  totalHours: number;
  totalSalaryCents: number;
}

export function TeacherInfoCard({
  email,
  bio,
  pricePerHour,
  zoomPersonalLink,
  sogoEmail,
  supervisorName,
  totalHours,
  totalSalaryCents,
}: TeacherInfoCardProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-6">
      <h3 className="text-[#1A2B4C] font-semibold">Teacher Info</h3>

      {bio && (
        <div className="flex items-start gap-3 text-gray-500">
          <BookOpen className="w-4 h-4 mt-0.5 shrink-0" />
          <p className="text-sm text-gray-700 leading-relaxed">{bio}</p>
        </div>
      )}

      <div className="space-y-4">
        {email && (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-gray-500">
              <Mail className="w-4 h-4" />
              <span className="text-sm">Email</span>
            </div>
            <span className="text-sm font-medium text-gray-900 truncate max-w-[180px]">
              {email}
            </span>
          </div>
        )}

        {sogoEmail && (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-gray-500">
              <Mail className="w-4 h-4" />
              <span className="text-sm">Sogo Email</span>
            </div>
            <span className="text-sm font-medium text-gray-900 truncate max-w-[180px]">
              {sogoEmail}
            </span>
          </div>
        )}

        {pricePerHour !== null && (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-gray-500">
              <DollarSign className="w-4 h-4" />
              <span className="text-sm">Rate / Hour</span>
            </div>
            <span className="text-sm font-medium text-gray-900">
              ${pricePerHour}
            </span>
          </div>
        )}

        {supervisorName && (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-gray-500">
              <UserCheck className="w-4 h-4" />
              <span className="text-sm">Supervisor</span>
            </div>
            <span className="text-sm font-medium text-gray-900">
              {supervisorName}
            </span>
          </div>
        )}

        {zoomPersonalLink && (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-gray-500">
              <Link2 className="w-4 h-4" />
              <span className="text-sm">Zoom Link</span>
            </div>
            <a
              href={zoomPersonalLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-[#1A4B7C] hover:underline truncate max-w-[160px]"
            >
              Open Meeting
            </a>
          </div>
        )}

        <hr className="border-gray-100" />

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-gray-500">
            <Clock className="w-4 h-4" />
            <span className="text-sm">Total Hours</span>
          </div>
          <span className="text-sm font-semibold text-[#1A2B4C]">
            {totalHours % 1 === 0 ? totalHours : totalHours.toFixed(2)} hrs
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-gray-500">
            <TrendingUp className="w-4 h-4" />
            <span className="text-sm">Total Earnings</span>
          </div>
          <span className="text-sm font-semibold text-[#10B981]">
            ${(totalSalaryCents / 100).toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
}
