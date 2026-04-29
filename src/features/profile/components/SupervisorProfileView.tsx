import { StudentProfileCard } from "@/features/students/components/StudentProfileCard";
import { SupervisorInfoCard } from "./SupervisorInfoCard";
import { LogoutButton } from "./LogoutButton";
import type { SupervisorProfileData } from "../actions/getMyProfile";

interface Props {
  data: SupervisorProfileData;
}

export function SupervisorProfileView({ data }: Props) {
  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <div className="w-full lg:w-[320px] flex flex-col gap-4 shrink-0">
        <StudentProfileCard
          name={data.name}
          id={data.shortId}
          ageGroup="Supervisor"
          status={data.isActive ? "Active" : "Inactive"}
          avatar={data.photoUrl ?? undefined}
        />
        <LogoutButton />
      </div>

      <div className="flex-1 min-w-0">
        <SupervisorInfoCard
          email={data.email}
          teacherCount={data.teacherCount}
          createdAt={data.createdAt}
        />
      </div>
    </div>
  );
}
