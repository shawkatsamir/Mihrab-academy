import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { SupervisorsPageClient } from "./_components/SupervisorPageClient";

export default async function SupervisorsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  const role = user.user_metadata?.role || profile?.role || "admin";
  // Only admin and supervisors can view this page
  if (role === "student" || role === "teacher") redirect("/dashboard");

  return <SupervisorsPageClient role={role} />;
}
