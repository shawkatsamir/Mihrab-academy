import { notFound } from "next/navigation";
import { getAuthenticatedUser } from "@/lib/auth/getAuthenticatedUser";
import { getStudent } from "@/features/students/actions/getStudents";
import { StudentDetailClient } from "./_components/StudentDetailClient";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function StudentDetailPage({ params }: Props) {
  const { id } = await params;
  await getAuthenticatedUser(["admin"]);

  let student;
  try {
    student = await getStudent(id);
  } catch {
    notFound();
  }

  return <StudentDetailClient student={student} />;
}
