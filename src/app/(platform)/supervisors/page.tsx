import { getAuthenticatedUser } from "@/lib/auth/getAuthenticatedUser";
import { SupervisorsPageClient } from "./_components/SupervisorPageClient";

export default async function SupervisorsPage() {
  // Only admins can manage supervisors
  const { role } = await getAuthenticatedUser(["admin"]);

  return <SupervisorsPageClient role={role} />;
}
