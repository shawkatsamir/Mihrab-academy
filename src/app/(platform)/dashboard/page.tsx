import { getAuthenticatedUser } from "@/lib/auth/getAuthenticatedUser";
import { DashboardClient } from "./_components/DashboardClient";

export default async function Page() {
  // Dashboard is admin-only; other roles land on /sessions (via getDefaultRoute)
  await getAuthenticatedUser(["admin"]);
  return <DashboardClient />;
}
