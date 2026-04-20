import { CheckCircle2, Star, Users } from "lucide-react";

const activities = [
  {
    icon: CheckCircle2,
    color: "text-admin-primary",
    bg: "bg-admin-surface",
    text: (
      <>
        marked Session #142 attendance —{" "}
        <span className="text-admin-primary font-medium">Present</span>
      </>
    ),
    actor: "Omar S.",
    time: "2 min ago",
  },
  {
    icon: Star,
    color: "text-admin-warning",
    bg: "bg-admin-warning-light",
    text: "rated Session #141 — 5 stars",
    actor: "Parent (Yusuf A.)",
    time: "1 hr ago",
  },
  {
    icon: Users,
    color: "text-admin-secondary",
    bg: "bg-admin-secondary-light",
    text: "assigned Sara to Supervisor Ahmed",
    actor: "Admin",
    time: "3 hrs ago",
  },
];

export function RecentActivity() {
  return (
    <div className="bg-admin-card rounded-xl border border-admin-border shadow-sm flex flex-col">
      <div className="p-5 border-b border-admin-border">
        <h2 className="text-base font-semibold text-admin-text-primary">
          Recent Activity
        </h2>
      </div>
      <div className="p-5 flex-1 flex flex-col gap-6">
        {activities.map((act, i) => {
          const Icon = act.icon;
          return (
            <div key={i} className="flex gap-4 relative">
              {i < activities.length - 1 && (
                <div className="absolute left-4 top-8 bottom-[-24px] w-px bg-admin-border" />
              )}
              <div
                className={`w-8 h-8 rounded-full ${act.bg} border border-admin-border flex items-center justify-center shrink-0 z-10`}
              >
                <Icon className={`w-4 h-4 ${act.color}`} />
              </div>
              <div>
                <p className="text-sm text-admin-text-primary">
                  <span className="font-medium">{act.actor}</span> {act.text}
                </p>
                <p className="text-xs text-admin-text-muted mt-1">{act.time}</p>
              </div>
            </div>
          );
        })}
      </div>
      <div className="p-3 border-t border-admin-border text-center">
        <button className="text-sm font-medium text-admin-text-secondary hover:text-admin-primary transition-colors">
          View all activity
        </button>
      </div>
    </div>
  );
}
