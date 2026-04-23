import { getAuthenticatedUser } from "@/lib/auth/getAuthenticatedUser";
import { SubjectsPageClient } from "./_components/SubjectsPageClient";

export default async function SubjectsPage() {
  const { role } = await getAuthenticatedUser();
  return <SubjectsPageClient role={role} />;
}
