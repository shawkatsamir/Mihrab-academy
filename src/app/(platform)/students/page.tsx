import { getAuthenticatedUser } from "@/lib/auth/getAuthenticatedUser";
import { StudentsPageClient } from "./_components/StudentsPageClient";

export default async function StudentsPage() {
  const { role } = await getAuthenticatedUser();
  return <StudentsPageClient isAdmin={role === "admin"} />;
}
