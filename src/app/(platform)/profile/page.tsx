import { getMyProfile } from "@/features/profile/actions/getMyProfile";
import { ProfileClient } from "@/features/profile/components/ProfileClient";

// Prevent bfcache — authenticated pages must never be served from the
// browser's back-forward cache after the user has signed out.
export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const data = await getMyProfile();
  return <ProfileClient data={data} />;
}
