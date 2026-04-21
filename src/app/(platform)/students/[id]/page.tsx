"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { StudentProfileCard } from "@/features/students/StudentProfileCard";
import { PersonalInfoCard } from "@/features/students/PersonalInfoCard";
import { GuardianInfoCard } from "@/features/students/GuardianInfoCard";
import { AchievementsCard } from "@/features/students/AchievementsCard";
import { AcademicPerformance } from "@/features/students/AcademicPerformance";
import { EnrolledCourses } from "@/features/students/EnrolledCourses";
import { AttendanceCalendar } from "@/features/students/AttendanceCalendar";
import { ScheduleSessions } from "@/features/students/ScheduleSessions";
import { useState } from "react";

// Mock data
const mockStudent = {
  name: "Yusuf Ahmed",
  id: "S-2106",
  ageGroup: "9-12 Years",
  status: "Active" as const,
  avatar: "https://i.pravatar.cc/150?u=yusuf",

  personalInfo: {
    gender: "Male",
    dateOfBirth: "May 18, 2014",
    phone: "+62 812 9988 7766",
    address: "14 Via Milano, Rome, Italy",
  },

  guardianInfo: {
    father: {
      name: "Ahmed Mansour",
      phone: "+39 331 222 5566",
    },
    mother: {
      name: "Fatima Mansour",
      phone: "+39 331 444 7788",
    },
  },

  achievements: [
    {
      id: 1,
      title: "Hifz Milestone: Juz 30",
      description: "Completed with Excellence",
    },
  ],

  academicPerformance: {
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
      "Yusuf shows consistent excellence in his Tajweed studies and dedication in memorization. Keep aiming high!",
  },

  enrolledCourses: [
    { id: 1, subject: "Quran Hifz", progress: 75 },
    { id: 2, subject: "Tajweed", progress: 40 },
    { id: 3, subject: "Islamic Studies", progress: 90 },
  ],

  attendanceRecords: [
    { date: "2025-03-02", status: "sick" },
    { date: "2025-03-05", status: "late" },
    { date: "2025-03-07", status: "present" },
    { date: "2025-03-08", status: "present" },
    { date: "2025-03-12", status: "late" },
    { date: "2025-03-13", status: "present" },
    { date: "2025-03-14", status: "sick" },
    { date: "2025-03-22", status: "late" },
  ] as {
    date: string;
    status: "present" | "late" | "sick" | "absent" | "none";
  }[],
};

export default function StudentDetailsPage() {
  const [attendanceRecords, setAttendanceRecords] = useState(
    mockStudent.attendanceRecords,
  );

  const handleAttendanceChange = (
    date: string,
    status: "present" | "late" | "sick" | "absent" | "none",
  ) => {
    if (status === "none") {
      setAttendanceRecords((prev) => prev.filter((r) => r.date !== date));
    } else {
      setAttendanceRecords((prev) => {
        const index = prev.findIndex((r) => r.date === date);
        if (index >= 0) {
          const newRecords = [...prev];
          newRecords[index] = { date, status };
          return newRecords;
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
        {/* Left Column: 1/3 width */}
        <div className="w-full lg:w-[350px] flex flex-col gap-6 shrink-0">
          <StudentProfileCard
            name={mockStudent.name}
            id={mockStudent.id}
            ageGroup={mockStudent.ageGroup}
            status={mockStudent.status}
            avatar={mockStudent.avatar}
          />
          <PersonalInfoCard {...mockStudent.personalInfo} />
          <GuardianInfoCard {...mockStudent.guardianInfo} />
          <AchievementsCard achievements={mockStudent.achievements} />
        </div>

        {/* Right Column: 2/3 width */}
        <div className="flex-1 flex flex-col gap-6 min-w-0">
          <AcademicPerformance {...mockStudent.academicPerformance} />

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start h-full">
            <EnrolledCourses courses={mockStudent.enrolledCourses} />
            <AttendanceCalendar
              records={attendanceRecords}
              onRecordChange={handleAttendanceChange}
            />
          </div>
        </div>
      </div>

      {/* Schedule Row */}
      <ScheduleSessions />
    </div>
  );
}
