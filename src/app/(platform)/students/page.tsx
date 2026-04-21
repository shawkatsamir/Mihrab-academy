"use client";

import { StudentCard, Student } from "@/features/students/StudentCard";
import { Search, Filter } from "lucide-react";

const mockStudents: Student[] = [
  {
    id: 1,
    name: "Yusuf Ahmed",
    initials: "YA",
    ageGroup: "9-12 YEARS",
    subject: "Quran Memorization",
    planProgress: 65,
    lastSession: "2 days ago",
    attendance: 95,
  },
  {
    id: 2,
    name: "Aisha Omar",
    initials: "AO",
    ageGroup: "6-8 YEARS",
    subject: "Tajweed Basics",
    planProgress: 80,
    lastSession: "1 day ago",
    attendance: 98,
    avatar: "https://i.pravatar.cc/150?u=aisha",
  },
  {
    id: 3,
    name: "Omar Hassan",
    initials: "OH",
    ageGroup: "13-16 YEARS",
    subject: "Islamic Studies",
    planProgress: 45,
    lastSession: "5 days ago",
    attendance: 82,
  },
  {
    id: 4,
    name: "Zainab Ali",
    initials: "ZA",
    ageGroup: "9-12 YEARS",
    subject: "Quran Hifz",
    planProgress: 92,
    lastSession: "Today",
    attendance: 100,
    avatar: "https://i.pravatar.cc/150?u=zainab",
  },
  {
    id: 5,
    name: "Bilal Tariq",
    initials: "BT",
    ageGroup: "13-16 YEARS",
    subject: "Arabic Language",
    planProgress: 30,
    lastSession: "1 week ago",
    attendance: 75,
  },
  {
    id: 6,
    name: "Fatima Noor",
    initials: "FN",
    ageGroup: "6-8 YEARS",
    subject: "Quran Memorization",
    planProgress: 88,
    lastSession: "2 days ago",
    attendance: 96,
  },
];

export default function StudentsPage() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto p-6">
      {/* Header and Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1A2B4C]">
            Students Directory
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Manage and view all enrolled students
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search students..."
              className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1A2B4C] w-full sm:w-64"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
            <Filter className="w-4 h-4" />
            Filters
          </button>
        </div>
      </div>

      {/* Grid of Student Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockStudents.map((student) => (
          <StudentCard key={student.id} student={student} />
        ))}
      </div>
    </div>
  );
}
