import Link from "next/link";
import { Img } from "@/shared/ui/Image";
import { Calendar } from "lucide-react";

export interface Student {
  id: string | number;
  name: string;
  initials: string;
  ageGroup: string;
  subject: string;
  planProgress: number;
  lastSession: string;
  attendance: number;
  avatar?: string;
}

interface StudentCardProps {
  student: Student;
  onEdit?: () => void;
}

export function StudentCard({ student, onEdit }: StudentCardProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm flex flex-col hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="p-5 flex items-center gap-4">
        {student.avatar ? (
          <Img
            src={student.avatar}
            alt={student.name}
            width={48}
            height={48}
            className="w-12 h-12 rounded-full object-cover"
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-[#EDF3FA] text-[#1A4B7C] flex items-center justify-center font-bold text-lg">
            {student.initials}
          </div>
        )}
        <div>
          <h3 className="font-semibold text-gray-900 text-lg">
            {student.name}
          </h3>
          <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#EDF3FA] text-[#1A4B7C]">
            {student.ageGroup}
          </span>
        </div>
      </div>

      <div className="h-px bg-gray-100 w-full" />

      {/* Middle Info */}
      <div className="p-5 space-y-4">
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-400">Subject</span>
          <span className="font-medium text-gray-700">{student.subject}</span>
        </div>
      </div>

      <div className="h-px bg-gray-100 w-full" />

      {/* Progress & Stats */}
      <div className="p-5 space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">Plan Progress</span>
            <span className="font-semibold text-gray-900">
              {student.planProgress}%
            </span>
          </div>
          <div className="h-2 w-full bg-[#F4F4F4] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#1A4B7C] rounded-full"
              style={{ width: `${student.planProgress}%` }}
            />
          </div>
        </div>

        <div className="flex justify-between items-center text-sm pt-2">
          <div className="text-gray-400">
            Last Session:{" "}
            <span className="text-gray-700 font-medium">
              {student.lastSession}
            </span>
          </div>
          <span className="px-2.5 py-1 rounded-md text-xs font-medium bg-[#F3EFE9] text-[#5C5549]">
            {student.attendance}% Attendance
          </span>
        </div>
      </div>

      <div className="h-px bg-gray-100 w-full" />

      {/* Footer */}
      <div className="p-4 px-5 flex justify-between items-center">
        <Link
          href={`/students/${student.id}`}
          className="text-[#085041] font-medium text-sm hover:underline"
        >
          View profile
        </Link>
        <div className="flex items-center gap-2">
          {onEdit && (
            <button
              onClick={onEdit}
              className="text-xs text-gray-500 hover:text-gray-800 font-medium transition-colors"
            >
              Edit
            </button>
          )}
          <Calendar className="w-5 h-5 text-gray-500" />
        </div>
      </div>
    </div>
  );
}
