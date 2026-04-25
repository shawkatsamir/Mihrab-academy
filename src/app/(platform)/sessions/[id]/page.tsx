import { notFound, redirect } from "next/navigation";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import { SessionDetailClient } from "./_components/SessionDetailClient";
import type { Database } from "@/lib/supabase/database.types";
import type { EnrichedSessionRow } from "@/features/sessions/api/queries";

const supabaseAdmin = createSupabaseClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } },
);

export default async function SessionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, id")
    .eq("id", user.id)
    .single();

  const [viewRes, rawRes, teacherEval, supervisorEval, parentRating] =
    await Promise.all([
      supabaseAdmin
        .from("v_session_details")
        .select("*")
        .eq("id", id)
        .single(),
      supabaseAdmin
        .from("sessions")
        .select(
          "shift_reason, cancelled_reason, shifted_from_session_id, created_by",
        )
        .eq("id", id)
        .single(),
      supabaseAdmin
        .from("session_teacher_evals")
        .select("*")
        .eq("session_id", id)
        .maybeSingle()
        .then((r) => r.data),
      supabaseAdmin
        .from("session_supervisor_evals")
        .select("*")
        .eq("session_id", id)
        .maybeSingle()
        .then((r) => r.data),
      supabaseAdmin
        .from("parent_ratings")
        .select("*")
        .eq("session_id", id)
        .maybeSingle()
        .then((r) => r.data),
    ]);

  if (!viewRes.data) notFound();

  const session: EnrichedSessionRow = {
    ...viewRes.data,
    shift_reason: rawRes.data?.shift_reason ?? null,
    cancelled_reason: rawRes.data?.cancelled_reason ?? null,
    shifted_from_session_id: rawRes.data?.shifted_from_session_id ?? null,
    created_by: rawRes.data?.created_by ?? null,
  };

  return (
    <SessionDetailClient
      session={session}
      role={profile?.role ?? "student"}
      userId={profile?.id ?? ""}
      teacherEval={teacherEval}
      supervisorEval={supervisorEval}
      parentRating={parentRating}
    />
  );
}
