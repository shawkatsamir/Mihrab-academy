// "use client";
// import { useState } from "react";
// import { Users, Clock, PieChart, RefreshCw } from "lucide-react";
// import AddStaffDrawer from "@/features/teachers/AddTeacher";
// import AttendanceChart from "@/features/teachers/AttendanceChart";
// import WorkloadChart from "@/features/teachers/WorkloadChart";
// import SubjectChart from "@/features/teachers/SubjectChart";
// import StatsCard from "@/features/teachers/StatsCard";
// import TeachersTable, { Teacher } from "@/features/teachers/TeachersTable";

// const mockTeachers: Teacher[] = [
//   {
//     id: 1,
//     name: "Omar S.",
//     email: "omar.s@miharab.com",
//     students: 45,
//     supervisor: "Yusuf M.",
//     rating: 4.9,
//     status: "Active",
//     avatar: "https://i.pravatar.cc/150?u=t1",
//   },
//   {
//     id: 2,
//     name: "Fatima M.",
//     email: "fatima.m@miharab.com",
//     students: 38,
//     supervisor: "Sarah I.",
//     rating: 4.8,
//     status: "Active",
//     avatar: "https://i.pravatar.cc/150?u=t2",
//   },
// ];

// export default function TeachersPage() {
//   const [isDrawerOpen, setIsDrawerOpen] = useState(false);

//   return (
//     <div className="space-y-6 max-w-7xl mx-auto p-6">
//       {/* Top Stats Row */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//         <StatsCard
//           title="Total Teachers"
//           value="86"
//           icon={<Users className="w-6 h-6" />}
//           color="bg-[#1A2B4C] text-white"
//         />
//         <StatsCard
//           title="Full-Time Teacher"
//           value="62"
//           icon={<Clock className="w-6 h-6" />}
//           color="bg-[#FCEBEB] text-[#D85A30]"
//         />
//         <StatsCard
//           title="Part-Time Teacher"
//           value="18"
//           icon={<PieChart className="w-6 h-6" />}
//           color="bg-[#E6F1FB] text-[#0C447C]"
//         />
//         <StatsCard
//           title="Substitute Teacher"
//           value="6"
//           icon={<RefreshCw className="w-6 h-6" />}
//           color="bg-[#F5F0FF] text-[#7F77DD]"
//         />
//       </div>

//       {/* Charts Row */}
//       <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
//         <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm flex flex-col">
//           <h2 className="text-base font-semibold text-[#1A2B4C] mb-6">
//             Attendance Overview
//           </h2>
//           <div className="flex-1 min-h-[250px]">
//             <AttendanceChart />
//           </div>
//         </div>

//         <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 p-6 shadow-sm flex flex-col">
//           <h2 className="text-base font-semibold text-[#1A2B4C] mb-6">
//             Workload Distribution
//           </h2>
//           <div className="flex-1 min-h-[250px]">
//             <WorkloadChart />
//           </div>
//         </div>

//         <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm flex flex-col relative">
//           <h2 className="text-base font-semibold text-[#1A2B4C] mb-6">
//             Subject
//           </h2>
//           <div className="flex-1 flex flex-col">
//             <SubjectChart />
//           </div>
//         </div>
//       </div>

//       {/* Teachers Table Section */}
//       <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
//         <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
//           <h2 className="text-lg font-semibold text-gray-900">Teachers List</h2>
//           <div className="flex items-center gap-3">
//             <button
//               onClick={() => setIsDrawerOpen(true)}
//               className="bg-[#1A2B4C] hover:bg-[#0f192d] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
//             >
//               Add Teacher
//             </button>
//           </div>
//         </div>

//         <TeachersTable teachers={mockTeachers} />
//       </div>

//       <AddStaffDrawer
//         isOpen={isDrawerOpen}
//         onClose={() => setIsDrawerOpen(false)}
//       />
//     </div>
//   );
// }

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { TeachersPageClient } from "./_components/TeacherPageClient";

export default async function TeachersPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  const role = user.user_metadata?.role || profile?.role || "admin";
  if (role === "student") redirect("/dashboard");

  return <TeachersPageClient role={role} userId={user.id} />;
}
