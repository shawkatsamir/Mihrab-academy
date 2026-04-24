import { getAuthenticatedUser } from "@/lib/auth/getAuthenticatedUser";
import { SessionsPageClient } from "./_components/SessionsPageClient";

export default async function SessionsPage() {
  const { role } = await getAuthenticatedUser();
  return <SessionsPageClient role={role} />;
}
