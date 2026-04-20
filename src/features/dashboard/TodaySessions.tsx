import { cn } from "@/lib/utils";
import { Img } from "@/shared/ui/Image";

interface Session {
  time: string;
  teacher: { name: string; avatar: string };
  student: string;
  subject: { name: string; type: "quran" | "arabic" | "islamic" };
  status: "live" | "upcoming" | "completed" | "cancelled";
}

const sessions: Session[] = [
  {
    time: "10:00",
    teacher: { name: "Omar S.", avatar: "https://i.pravatar.cc/150?u=t1" },
    student: "Yusuf A.",
    subject: { name: "Quran", type: "quran" },
    status: "live",
  },
  {
    time: "10:30",
    teacher: { name: "Fatima M.", avatar: "https://i.pravatar.cc/150?u=t2" },
    student: "Aisha K.",
    subject: { name: "Arabic", type: "arabic" },
    status: "upcoming",
  },
  {
    time: "09:00",
    teacher: { name: "Hassan R.", avatar: "https://i.pravatar.cc/150?u=t3" },
    student: "Ibrahim D.",
    subject: { name: "Islamic", type: "islamic" },
    status: "completed",
  },
  {
    time: "08:30",
    teacher: { name: "Omar S.", avatar: "https://i.pravatar.cc/150?u=t1" },
    student: "Zayd M.",
    subject: { name: "Quran", type: "quran" },
    status: "cancelled",
  },
];

const subjectClasses = {
  quran: "bg-admin-primary-light text-admin-primary",
  arabic: "bg-admin-secondary-light text-admin-secondary",
  islamic: "bg-admin-warning-light text-admin-warning",
};

const statusClasses = {
  live: "bg-[#EAF3DE] text-[#085041]",
  upcoming: "bg-admin-student-light text-admin-student",
  completed: "bg-[#F1EFE8] text-[#444441]",
  cancelled: "bg-admin-danger-light text-[#791F1F]",
};

export function TodaySessions() {
  return (
    <div className="lg:col-span-3 bg-admin-card rounded-xl border border-admin-border shadow-sm overflow-hidden flex flex-col">
      <div className="p-5 border-b border-admin-border flex items-center justify-between">
        <h2 className="text-base font-semibold text-admin-text-primary">
          Today&apos;s Sessions
        </h2>
        <button className="text-sm font-medium text-admin-primary hover:text-admin-primary/80">
          View full schedule
        </button>
      </div>
      <div className="flex-1 overflow-y-auto">
        <table className="w-full text-left border-collapse">
          <tbody>
            {sessions.map((s, i) => (
              <tr
                key={i}
                className="border-b border-admin-border last:border-0 hover:bg-admin-hover/50 transition-colors cursor-pointer"
              >
                <td className="py-3 pl-5 pr-3 w-24">
                  <span
                    className={cn(
                      "text-sm font-medium",
                      s.status === "cancelled"
                        ? "text-admin-text-muted line-through"
                        : "text-admin-text-secondary",
                    )}
                  >
                    {s.time}
                  </span>
                </td>
                <td className="py-3 px-3">
                  <div className="flex items-center gap-2">
                    <Img
                      src={s.teacher.avatar}
                      alt={s.teacher.name}
                      width={24}
                      height={24}
                      className={cn(
                        "w-6 h-6 rounded-full",
                        s.status === "completed" || s.status === "cancelled"
                          ? "grayscale opacity-70"
                          : "",
                      )}
                    />
                    <span
                      className={cn(
                        "text-sm font-medium",
                        s.status === "cancelled"
                          ? "text-admin-text-muted line-through"
                          : "text-admin-text-primary",
                      )}
                    >
                      {s.teacher.name}
                    </span>
                  </div>
                </td>
                <td className="py-3 px-3">
                  <span
                    className={cn(
                      "text-sm",
                      s.status === "cancelled"
                        ? "text-admin-text-muted line-through"
                        : "text-admin-text-secondary",
                    )}
                  >
                    {s.student}
                  </span>
                </td>
                <td className="py-3 px-3">
                  <span
                    className={cn(
                      "inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium",
                      subjectClasses[s.subject.type],
                      s.status === "cancelled" && "opacity-50",
                    )}
                  >
                    {s.subject.name}
                  </span>
                </td>
                <td className="py-3 pr-5 pl-3 text-right">
                  <span
                    className={cn(
                      "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium",
                      statusClasses[s.status],
                    )}
                  >
                    {s.status === "live" && (
                      <span className="w-1.5 h-1.5 rounded-full bg-admin-primary animate-pulse" />
                    )}
                    {s.status.charAt(0).toUpperCase() + s.status.slice(1)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
