import { format } from "date-fns";
import { StudentProfileCard } from "@/features/students/components/StudentProfileCard";
import { PersonalInfoCard } from "@/features/students/components/PersonalInfoCard";
import { GuardianInfoCard } from "@/features/students/components/GuardianInfoCard";
import { LogoutButton } from "./LogoutButton";
import type { StudentProfileData } from "../actions/getMyProfile";

interface Props {
  data: StudentProfileData;
}

export function StudentProfileView({ data }: Props) {
  const dateOfBirth = data.dateOfBirth
    ? format(new Date(data.dateOfBirth), "MMM d, yyyy")
    : "—";

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <div className="w-full lg:w-[320px] flex flex-col gap-4 shrink-0">
        <StudentProfileCard
          name={data.name}
          id={data.shortId}
          ageGroup={data.ageGroupLabel}
          status={data.isActive ? "Active" : "Inactive"}
          avatar={data.photoUrl ?? undefined}
        />
        <LogoutButton />
      </div>

      <div className="flex-1 flex flex-col gap-4 min-w-0">
        <PersonalInfoCard
          gender="—"
          dateOfBirth={dateOfBirth}
          phone={data.parentWhatsapp ?? "—"}
          address="—"
        />
        <GuardianInfoCard
          father={{ name: "—", phone: data.parentWhatsapp ?? "—" }}
          mother={{ name: "—", phone: "—" }}
        />
      </div>
    </div>
  );
}
