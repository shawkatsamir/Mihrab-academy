import { ArrowUpRight, Star } from "lucide-react";

const stats = [
  { label: "Active Students", value: "1,248", change: "+12%", trend: "up" },
  { label: "Sessions Today", value: "142" },
  { label: "Avg Teacher Rating", value: "4.8", suffix: "/5", rating: 5 },
  { label: "Enrolled Courses", value: "3,420", change: "+8%", trend: "up" },
];

export function StatCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, idx) => (
        <div
          key={idx}
          className="bg-admin-card rounded-xl border border-admin-border p-6 shadow-sm"
        >
          <h3 className="text-xs font-medium text-admin-text-secondary uppercase tracking-wider mb-2">
            {stat.label}
          </h3>
          <div className="flex items-end justify-between">
            <span className="text-3xl font-bold text-admin-text-primary">
              {stat.value}
              {stat.suffix && (
                <span className="text-lg text-admin-text-muted font-normal">
                  {stat.suffix}
                </span>
              )}
            </span>
            {stat.trend === "up" && (
              <div className="flex items-center text-admin-primary text-sm font-medium">
                <ArrowUpRight className="w-4 h-4 mr-1" />
                <span>{stat.change}</span>
              </div>
            )}
            {stat.rating && (
              <div className="flex items-center gap-0.5 text-admin-warning">
                {[...Array(stat.rating)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-current" />
                ))}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
