import { getMyProfile } from "@/features/profile/actions/getMyProfile";
import { ProfileClient } from "@/features/profile/components/ProfileClient";

export default async function ProfilePage() {
  const data = await getMyProfile();
  return <ProfileClient data={data} />;
}
