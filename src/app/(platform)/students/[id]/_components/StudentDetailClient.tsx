"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { format } from "date-fns";
import { StudentProfileCard } from "@/features/students/components/StudentProfileCard";
import { PersonalInfoCard } from "@/features/students/components/PersonalInfoCard";
import { GuardianInfoCard } from "@/features/students/components/GuardianInfoCard";
import { AchievementsCard } from "@/features/students/components/AchievementsCard";
import { AcademicPerformance } from "@/features/students/components/AcademicPerformance";
import { EnrolledCourses } from "@/features/students/components/EnrolledCourses";
import { AttendanceCalendar } from "@/features/students/components/AttendanceCalendar";
import { ScheduleSessions } from "@/features/students/components/ScheduleSessions";
import { AssignSubjectsForm } from "@/features/students/components/AssignSubjectsForm";

// ─── Mock data (kept intact — will be replaced one by one) ────────────────────
const MOCK_ACHIEVEMENTS = [
  { id: 1, title: "Hifz Milestone: Juz 30", description: "Completed with Excellence" },
];

const MOCK_ACADEMIC = {
  averageScore: 3.9,
  maxScore: 4.0,
  monthlyData: [
    { month: "Jan", score: 3.5 },
    { month: "Feb", score: 3.6 },
    { month: "Mar", score: 3.5 },
    { month: "Apr", score: 3.8 },
    { month: "May", score: 3.9 },
    { month: "Jun", score: 4.0 },
  ],
  description:
    "Consistent excellence in Tajweed studies and dedication in memorization.",
};

const MOCK_ATTENDANCE = [
  { date: "2025-03-02", status: "sick" as const },
  { date: "2025-03-05", status: "late" as const },
  { date: "2025-03-07", status: "present" as const },
  { date: "2025-03-13", status: "present" as const },
  { date: "2025-03-14", status: "sick" as const },
];

// ─── Props ────────────────────────────────────────────────────────────────────
interface Props {
  student: Awaited<ReturnType<typeof import("@/features/students/actions/getStudents").getStudent>>;
}

export function StudentDetailClient({ student }: Props) {
  const [attendanceRecords, setAttendanceRecords] = useState(MOCK_ATTENDANCE);

  // Normalise Supabase's array-shaped joins
  const profiles = Array.isArray(student.profiles)
    ? student.profiles[0]
    : student.profiles;
  const ageGroup = Array.isArray(student.age_groups)
    ? student.age_groups[0]
    : student.age_groups;

  const name = profiles?.full_name ?? "Unknown";

  const currentSubjectIds = (student.student_subjects ?? []).map(
    (ss: any) => ss.subject_id as string,
  );

  const enrolledCourses = (student.student_subjects ?? []).map(
    (ss: any, i: number) => {
      const subj = Array.isArray(ss.subjects) ? ss.subjects[0] : ss.subjects;
      return { id: i + 1, subject: subj?.name ?? "—", progress: 0 };
    },
  );

  const handleAttendanceChange = (
    date: string,
    status: "present" | "late" | "sick" | "absent" | "none",
  ) => {
    if (status === "none") {
      setAttendanceRecords((prev) => prev.filter((r) => r.date !== date));
    } else {
      setAttendanceRecords((prev) => {
        const idx = prev.findIndex((r) => r.date === date);
        if (idx >= 0) {
          const next = [...prev];
          next[idx] = { date, status };
          return next;
        }
        return [...prev, { date, status }];
      });
    }
  };

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto p-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/students"
          className="p-2 border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-2xl font-bold text-[#1A2B4C]">Student Details</h1>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left column — real data */}
        <div className="w-full lg:w-[350px] flex flex-col gap-6 shrink-0">
          <StudentProfileCard
            name={name}
            id={student.id.slice(0, 8).toUpperCase()}
            ageGroup={ageGroup?.label ?? "—"}
            status={profiles?.is_active ? "Active" : "Inactive"}
            avatar={profiles?.photo_url ?? undefined}
          />

          <PersonalInfoCard
            gender="—"
            dateOfBirth={
              student.date_of_birth
                ? format(new Date(student.date_of_birth), "MMM d, yyyy")
                : "—"
            }
            phone={student.parent_whatsapp ?? "—"}
            address="—"
          />

          <GuardianInfoCard
            father={{ name: "—", phone: student.parent_whatsapp ?? "—" }}
            mother={{ name: "—", phone: "—" }}
          />

          {/* Achievements — mock until wired */}
          <AchievementsCard achievements={MOCK_ACHIEVEMENTS} />
        </div>

        {/* Right column */}
        <div className="flex-1 flex flex-col gap-6 min-w-0">
          {/* Academic performance — mock until wired */}
          <AcademicPerformance {...MOCK_ACADEMIC} />

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start h-full">
            {/* Enrolled courses — real subjects, mock progress */}
            <EnrolledCourses
              courses={
                enrolledCourses.length > 0
                  ? enrolledCourses
                  : [{ id: 0, subject: "No subjects assigned yet", progress: 0 }]
              }
            />

            {/* Attendance — mock until wired */}
            <AttendanceCalendar
              records={attendanceRecords}
              onRecordChange={handleAttendanceChange}
            />
          </div>
        </div>
      </div>

      {/* Subject assignment — real */}
      <AssignSubjectsForm
        studentId={student.id}
        currentSubjectIds={currentSubjectIds}
      />

      {/* Schedule — mock until wired */}
      <ScheduleSessions />
    </div>
  );
}
