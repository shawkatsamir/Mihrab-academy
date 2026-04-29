import { StudentProfileCard } from "@/features/students/components/StudentProfileCard";
import { TeacherInfoCard } from "./TeacherInfoCard";
import { LogoutButton } from "./LogoutButton";
import type { TeacherProfileData } from "../actions/getMyProfile";

interface Props {
  data: TeacherProfileData;
}

export function TeacherProfileView({ data }: Props) {
  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <div className="w-full lg:w-[320px] flex flex-col gap-4 shrink-0">
        <StudentProfileCard
          name={data.name}
          id={data.shortId}
          ageGroup="Teacher"
          status={data.isActive ? "Active" : "Inactive"}
          avatar={data.photoUrl ?? undefined}
        />
        <LogoutButton />
      </div>

      <div className="flex-1 min-w-0">
        <TeacherInfoCard
          email={data.email}
          bio={data.bio}
          pricePerHour={data.pricePerHour}
          zoomPersonalLink={data.zoomPersonalLink}
          sogoEmail={data.sogoEmail}
          supervisorName={data.supervisorName}
          totalHours={data.totalHours}
          totalSalaryCents={data.totalSalaryCents}
        />
      </div>
    </div>
  );
}
