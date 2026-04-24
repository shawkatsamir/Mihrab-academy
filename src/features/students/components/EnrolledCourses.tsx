import { MoreHorizontal } from "lucide-react";

interface Course {
  id: string | number;
  subject: string;
  progress: number;
}

interface EnrolledCoursesProps {
  courses: Course[];
}

export function EnrolledCourses({ courses }: EnrolledCoursesProps) {
  // Utility function to get progress bar color based on percentage or index
  const getProgressColor = (index: number) => {
    const colors = [
      "bg-[#1A4B7C]", // Dark Blue
      "bg-[#D85A30]", // Orange/Red
      "bg-[#1A2B4C]", // Very Dark Blue
    ];
    return colors[index % colors.length];
  };

  const getProgressBgColor = (index: number) => {
    const bgColors = ["bg-[#EDF3FA]", "bg-[#FCEBEB]", "bg-[#F4F4F4]"];
    return bgColors[index % bgColors.length];
  };

  const getPercentageBg = (index: number) => {
    const bgColors = [
      "bg-[#EDF3FA] text-[#1A4B7C]",
      "bg-[#FCEBEB] text-[#D85A30]",
      "bg-[#1A2B4C] text-white",
    ];
    return bgColors[index % bgColors.length];
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 flex flex-col h-full">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-[#1A2B4C] font-semibold">Enrolled Courses</h3>
        <button className="text-gray-400 hover:text-gray-600 transition-colors">
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-6 flex-1">
        {courses.map((course, index) => (
          <div
            key={course.id}
            className="space-y-3 p-4 rounded-xl border border-gray-50 bg-white shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)]"
          >
            <div className="flex justify-between items-start">
              <div>
                <h4 className="text-sm font-semibold text-gray-900">
                  {course.subject}
                </h4>
                {/* Teacher row omitted as per requirements */}
              </div>
              <span
                className={`text-xs font-bold px-2 py-1 rounded-md ${getPercentageBg(index)}`}
              >
                {course.progress}%
              </span>
            </div>

            <div
              className={`h-1.5 w-full rounded-full overflow-hidden ${getProgressBgColor(index)}`}
            >
              <div
                className={`h-full rounded-full ${getProgressColor(index)}`}
                style={{ width: `${course.progress}%` }}
              />
            </div>
          </div>
        ))}

        {courses.length === 0 && (
          <div className="text-center text-sm text-gray-500 py-4">
            No courses enrolled
          </div>
        )}
      </div>
    </div>
  );
}
