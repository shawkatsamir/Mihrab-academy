"use client";
import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Mail,
  Phone,
  Calendar,
  User,
  Video,
  Users,
} from "lucide-react";
import TeacherWorkloadAreaChart from "@/features/teachers/TeacherWorkloadAreaChart";
import { Img } from "@/shared/ui/Image";

import TeacherSchedule from "@/features/teachers/TeacherSchedule";
import TeacherPerformance from "@/features/teachers/TeacherPerformance";

// Mock Data
const teacherData = {
  id: "1",
  name: "Omar S.",
  idNumber: "T-1003",
  employmentType: "Full-Time",
  avatar: "https://i.pravatar.cc/150?u=t1",
  subject: "Quran Memorization, Tajweed",
  students: "45 Active Students",
  gender: "Male",
  dob: "April 15, 1990",
  email: "omar.s@miharab.com",
  phone: "+1 234 567 8900",
  address: "123 Islamic Center Dr, NY, USA",
  supervisor: "Yusuf M.",
  zoomUrl: "https://zoom.us/j/9876543210",
};

export default function TeacherDetails({ params }: { params: { id: string } }) {
  const [workloadPeriod, setWorkloadPeriod] = useState("Last 8 months");
  const [supervisor, setSupervisor] = useState("");

  return (
    <div className="space-y-6 mx-auto p-6 pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link
            href="/teachers"
            className="p-2 bg-white border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-2xl font-semibold text-gray-900">
            Teacher Details
          </h1>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <select 
            className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-[#1A2B4C] focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer"
            value={supervisor}
            onChange={(e) => setSupervisor(e.target.value)}
          >
            <option value="" disabled>Assign Supervisor...</option>
            <option value="Yusuf M.">Yusuf M.</option>
            <option value="Ahmed Ali">Ahmed Ali</option>
            <option value="Fatima Z.">Fatima Z.</option>
          </select>
          <button className="px-4 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors w-fit">
            Delete Teacher
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Main Content Area */}
        <div className="xl:col-span-8 space-y-6">
          <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-base font-semibold text-[#1A2B4C]">
                Workload Summary
              </h2>
              <select
                value={workloadPeriod}
                onChange={(e) => setWorkloadPeriod(e.target.value)}
                className="bg-[#E6F1FB] text-[#0C447C] text-xs font-medium px-3 py-1.5 rounded-md border-none outline-none cursor-pointer"
              >
                <option>Last 8 months</option>
                <option>This Year</option>
              </select>
            </div>
            <div className="flex-1 min-h-[300px]">
              <TeacherWorkloadAreaChart />
            </div>
          </div>

          <TeacherSchedule />
        </div>

        {/* Sidebar Info */}
        <div className="xl:col-span-4 space-y-6">
          <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm flex flex-col items-center text-center">
            <div className="w-24 h-24 rounded-2xl bg-[#FCEBEB] mb-4 overflow-hidden border-4 border-white shadow-sm">
              <Img
                src={teacherData.avatar}
                alt={teacherData.name}
                className="w-full h-full object-cover"
                width={100}
                height={100}
              />
            </div>
            <h2 className="text-xl font-bold text-[#1A2B4C] mb-2">
              {teacherData.name}
            </h2>
            <div className="flex gap-2 mb-6">
              <span className="px-2.5 py-1 bg-gray-50 border border-gray-200 rounded-md text-xs font-medium text-gray-600">
                {teacherData.idNumber}
              </span>
              <span className="px-2.5 py-1 bg-[#E6F1FB] text-[#0C447C] rounded-md text-xs font-medium">
                {teacherData.employmentType}
              </span>
            </div>
          </div>

          {/* Personal Info with Supervisor & Zoom injected */}
          <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
            <h2 className="text-base font-semibold text-[#1A2B4C] mb-6">
              Staff Information
            </h2>

            <div className="space-y-5">
              <InfoRow
                icon={<Video className="w-5 h-5" />}
                label="Zoom Meeting URL"
                value={
                  <a
                    href={teacherData.zoomUrl}
                    target="_blank"
                    className="text-blue-600 hover:underline break-all"
                  >
                    {teacherData.zoomUrl}
                  </a>
                }
              />

              <div className="border-t border-gray-100 my-4"></div>

              <InfoRow
                icon={<User className="w-5 h-5" />}
                label="Gender"
                value={teacherData.gender}
              />
              <InfoRow
                icon={<Calendar className="w-5 h-5" />}
                label="Date of Birth"
                value={teacherData.dob}
              />
              <InfoRow
                icon={<Mail className="w-5 h-5" />}
                label="Email Address"
                value={teacherData.email}
              />
              <InfoRow
                icon={<Phone className="w-5 h-5" />}
                label="Phone Number"
                value={teacherData.phone}
              />
            </div>
          </div>

          <TeacherPerformance />
        </div>
      </div>
    </div>
  );
}

function InfoRow({ icon, label, value, highlight = false }: any) {
  return (
    <div className="flex items-start gap-4">
      <div
        className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${highlight ? "bg-[#1A2B4C] text-white" : "bg-[#E6F1FB] text-[#0C447C]"}`}
      >
        {icon}
      </div>
      <div>
        <p className="text-xs text-gray-500 mb-0.5">{label}</p>
        <div className="text-sm font-medium text-[#1A2B4C]">{value}</div>
      </div>
    </div>
  );
}
