import { notFound } from "next/navigation";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { getAuthenticatedUser } from "@/lib/auth/getAuthenticatedUser";
import { SessionDetailClient } from "./_components/SessionDetailClient";
import type { Database } from "@/lib/supabase/database.types";
import type { EnrichedSessionRow } from "@/features/sessions/api/queries";

const supabaseAdmin = createSupabaseClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } },
);

async function assertSessionAccess(
  id: string,
  userId: string,
  role: Database["public"]["Enums"]["user_role"],
): Promise<void> {
  // Build a query that includes a role-specific ownership filter.
  // If it returns no row the user has no business seeing this session.
  if (role === "student") {
    const { data } = await supabaseAdmin
      .from("v_session_details")
      .select("id")
      .eq("id", id)
      .eq("student_id", userId)
      .single();
    if (!data) notFound();
    return;
  }

  if (role === "teacher") {
    const { data } = await supabaseAdmin
      .from("v_session_details")
      .select("id")
      .eq("id", id)
      .eq("teacher_id", userId)
      .single();
    if (!data) notFound();
    return;
  }

  if (role === "supervisor") {
    const { data: assignments } = await supabaseAdmin
      .from("supervisor_assignments")
      .select("teacher_id")
      .eq("supervisor_id", userId);

    const teacherIds = (assignments ?? []).map((a) => a.teacher_id);
    if (teacherIds.length === 0) notFound();

    const { data } = await supabaseAdmin
      .from("v_session_details")
      .select("id")
      .eq("id", id)
      .in("teacher_id", teacherIds)
      .single();
    if (!data) notFound();
    return;
  }

  // admin — verify the session exists at all
  const { data } = await supabaseAdmin
    .from("v_session_details")
    .select("id")
    .eq("id", id)
    .single();
  if (!data) notFound();
}

export default async function SessionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const { user, role } = await getAuthenticatedUser();

  // Verify the caller is allowed to view this session before fetching all data
  await assertSessionAccess(id, user.id, role);

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
      role={role}
      userId={user.id}
      teacherEval={teacherEval}
      supervisorEval={supervisorEval}
      parentRating={parentRating}
    />
  );
}
