"use client";

import { StudentProfileView } from "./StudentProfileView";
import { TeacherProfileView } from "./TeacherProfileView";
import { SupervisorProfileView } from "./SupervisorProfileView";
import type { MyProfileData } from "../actions/getMyProfile";

interface Props {
  data: MyProfileData;
}

export function ProfileClient({ data }: Props) {
  return (
    <div className="max-w-[1200px] mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold text-[#1A2B4C]">My Profile</h1>

      {data.role === "student" && <StudentProfileView data={data} />}
      {data.role === "teacher" && <TeacherProfileView data={data} />}
      {data.role === "supervisor" && <SupervisorProfileView data={data} />}
    </div>
  );
}
