"use client";
import { Img } from "@/shared/ui/Image";
import { useRouter } from "next/navigation";

export interface Supervisor {
  id: number | string;
  name: string;
  email: string;
  assignedTeachers: number;
  status: string;
  avatar: string;
}

interface SupervisorsTableProps {
  supervisors: Supervisor[];
}

export default function SupervisorsTable({ supervisors }: SupervisorsTableProps) {
  const router = useRouter();

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead className="bg-gray-50 text-xs font-medium text-gray-500 uppercase tracking-wider">
          <tr>
            <th className="py-3 px-6">Name</th>
            <th className="py-3 px-6">Email</th>
            <th className="py-3 px-6">Assigned Teachers</th>
            <th className="py-3 px-6">Status</th>
          </tr>
        </thead>
        <tbody className="text-sm divide-y divide-gray-100">
          {supervisors.map((supervisor) => (
            <tr
              key={supervisor.id}
              onClick={() => router.push(`/supervisors/${supervisor.id}`)}
              className="hover:bg-gray-50 cursor-pointer transition-colors group"
            >
              <td className="py-4 px-6 flex items-center gap-3">
                <Img
                  src={supervisor.avatar}
                  alt={supervisor.name}
                  className="w-8 h-8 rounded-full object-cover"
                  width={32}
                  height={32}
                />
                <span className="font-medium text-gray-900 group-hover:text-[#1A2B4C] transition-colors">
                  {supervisor.name}
                </span>
              </td>
              <td className="py-4 px-6 text-gray-500">{supervisor.email}</td>
              <td className="py-4 px-6 text-gray-500">{supervisor.assignedTeachers}</td>
              <td className="py-4 px-6">
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-[#EAF3DE] text-[#085041]">
                  {supervisor.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
