import { Bell } from "lucide-react";
import { Img } from "../ui/Image";
import type { Database } from "@/lib/supabase/database.types";

type UserRole = Database["public"]["Enums"]["user_role"];

const ROLE_LABEL: Record<UserRole, string> = {
  admin: "Admin",
  supervisor: "Supervisor",
  teacher: "Teacher",
  student: "Student",
};

interface Props {
  role: UserRole;
  fullName: string;
}

export default function AdminHeader({ role, fullName }: Props) {
  return (
    <header className="h-16 border-b border-admin-border bg-admin-card px-8 flex items-center justify-end sticky top-0 z-30">
      <div className="flex items-center gap-6">
        <span className="text-sm text-admin-text-secondary font-medium hidden md:inline-block">
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
          })}
        </span>

        <button className="relative p-2 text-admin-text-secondary hover:bg-admin-hover rounded-full transition-colors border border-transparent hover:border-admin-border">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-admin-danger rounded-full border-2 border-admin-card" />
        </button>

        <div className="flex items-center gap-3 pl-6 border-l border-admin-border">
          <div className="flex-col text-right hidden sm:flex">
            <span className="text-sm font-medium text-admin-text-primary">
              {fullName || "User"}
            </span>
            <span className="text-[10px] bg-admin-secondary-light text-admin-secondary px-2 py-0.5 rounded-full w-fit ml-auto mt-0.5 font-medium">
              {ROLE_LABEL[role]}
            </span>
          </div>
          <Img
            src={`https://i.pravatar.cc/150?u=${fullName}`}
            alt={fullName || "User"}
            className="w-9 h-9 rounded-full object-cover cursor-pointer border-2 border-transparent hover:border-admin-primary transition-all"
            width={36}
            height={36}
          />
        </div>
      </div>
    </header>
  );
}
