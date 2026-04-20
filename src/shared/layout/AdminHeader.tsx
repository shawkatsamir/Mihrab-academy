import { Bell } from "lucide-react";
import { Img } from "../ui/Image";

export default function AdminHeader() {
  return (
    <header className="h-16 border-b border-admin-border bg-admin-card px-8 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-medium text-admin-text-primary">
          Dashboard
        </h1>
      </div>

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
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-admin-danger rounded-full border-2 border-admin-card"></span>
        </button>

        <div className="flex items-center gap-3 pl-6 border-l border-admin-border">
          <div className="flex-col text-right hidden sm:flex">
            <span className="text-sm font-medium text-admin-text-primary">
              Ahmed Ali
            </span>
            <span className="text-[10px] bg-admin-secondary-light text-admin-secondary px-2 py-0.5 rounded-full w-fit ml-auto mt-0.5 font-medium">
              Admin
            </span>
          </div>
          <Img
            src="https://i.pravatar.cc/150?u=admin"
            alt="Admin"
            className="w-9 h-9 rounded-full object-cover cursor-pointer border-2 border-transparent hover:border-admin-primary transition-all"
            width={24}
            height={24}
          />
        </div>
      </div>
    </header>
  );
}
