import { MoreHorizontal } from "lucide-react";

const teachers = [
  { name: "Omar S.", rating: 4.9, attendance: "100%" },
  { name: "Fatima M.", rating: 4.8, attendance: "98%" },
  { name: "Hassan R.", rating: 4.7, attendance: "100%" },
  { name: "Aisha K.", rating: 4.6, attendance: "92%" },
];

export function TeacherPerformance() {
  return (
    <div className="bg-admin-card rounded-xl border border-admin-border shadow-sm flex flex-col">
      <div className="p-5 border-b border-admin-border flex items-center justify-between">
        <h2 className="text-base font-semibold text-admin-text-primary">
          Teacher Performance
        </h2>
        <button className="p-1 text-admin-text-muted hover:text-admin-text-primary rounded">
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>
      <div className="p-0 overflow-x-auto">
        <table className="w-full text-left border-collapse text-sm">
          <thead className="bg-admin-surface/50 text-xs text-admin-text-muted uppercase tracking-wider">
            <tr>
              <th className="py-3 px-5 font-medium">Teacher</th>
              <th className="py-3 px-3 font-medium text-center">Rating</th>
              <th className="py-3 px-5 font-medium text-right">Attendance</th>
            </tr>
          </thead>
          <tbody className="text-admin-text-secondary">
            {teachers.map((t, i) => (
              <tr
                key={i}
                className="border-b border-admin-border last:border-0 hover:bg-admin-hover/50 transition-colors"
              >
                <td className="py-3 px-5 font-medium text-admin-text-primary hover:text-admin-primary cursor-pointer">
                  {t.name}
                </td>
                <td className="py-3 px-3 text-center">{t.rating}</td>
                <td className="py-3 px-5 text-right">{t.attendance}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
