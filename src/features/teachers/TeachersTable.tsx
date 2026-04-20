"use client";
import { Img } from "@/shared/ui/Image";
import { useRouter } from "next/navigation";

export interface Teacher {
  id: number | string;
  name: string;
  email: string;
  students: number;
  supervisor: string;
  rating?: number;
  status: string;
  avatar: string;
}

interface TeachersTableProps {
  teachers: Teacher[];
}

export default function TeachersTable({ teachers }: TeachersTableProps) {
  const router = useRouter();

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead className="bg-gray-50 text-xs font-medium text-gray-500 uppercase tracking-wider">
          <tr>
            <th className="py-3 px-6">Name</th>
            <th className="py-3 px-6">Email</th>
            <th className="py-3 px-6">Students</th>
            <th className="py-3 px-6">Supervisor</th>
            <th className="py-3 px-6">Status</th>
          </tr>
        </thead>
        <tbody className="text-sm divide-y divide-gray-100">
          {teachers.map((teacher) => (
            <tr
              key={teacher.id}
              onClick={() => router.push(`/teachers/${teacher.id}`)}
              className="hover:bg-gray-50 cursor-pointer transition-colors group"
            >
              <td className="py-4 px-6 flex items-center gap-3">
                <Img
                  src={teacher.avatar}
                  alt={teacher.name}
                  className="w-8 h-8 rounded-full object-cover"
                  width={32}
                  height={32}
                />
                <span className="font-medium text-gray-900 group-hover:text-[#1A2B4C] transition-colors">
                  {teacher.name}
                </span>
              </td>
              <td className="py-4 px-6 text-gray-500">{teacher.email}</td>
              <td className="py-4 px-6 text-gray-500">{teacher.students}</td>
              <td className="py-4 px-6 text-gray-500">{teacher.supervisor}</td>
              <td className="py-4 px-6">
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-[#EAF3DE] text-[#085041]">
                  {teacher.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
