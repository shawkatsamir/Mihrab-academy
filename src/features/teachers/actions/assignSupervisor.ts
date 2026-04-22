"use server";

import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { Database } from "@/lib/supabase/database.types";
import type { TablesInsert } from "@/lib/supabase/database.types";

const supabaseAdmin = createSupabaseClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  },
);

/** Derived directly from the DB schema — no manual duplication */
type AssignmentInsert = TablesInsert<"supervisor_assignments">;

/**
 * Assign (or re-assign) a supervisor to a teacher.
 *
 * Business rule:
 *  - A teacher can only have ONE active supervisor at a time.
 *  - We delete any existing assignment first, then insert the new one.
 *  - Only admins can perform this action.
 */
export async function assignSupervisor({
  teacherId,
  supervisorId,
}: {
  teacherId: string;
  supervisorId: string;
}) {
  // 1. Auth guard — only admins
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  const role = user.user_metadata?.role || profile?.role || "admin";
  if (role !== "admin") {
    throw new Error("Forbidden: Only admins can assign supervisors");
  }

  // 2. Remove any existing assignment for this teacher
  const { error: deleteErr } = await supabaseAdmin
    .from("supervisor_assignments")
    .delete()
    .eq("teacher_id", teacherId);

  if (deleteErr) throw new Error(deleteErr.message);

  // 3. Insert new assignment — type is derived from DB schema
  const record: AssignmentInsert = {
    teacher_id: teacherId,
    supervisor_id: supervisorId,
    assigned_by: user.id,
  };

  const { error: insertErr } = await supabaseAdmin
    .from("supervisor_assignments")
    .insert(record);

  if (insertErr) throw new Error(insertErr.message);

  revalidatePath(`/teachers/${teacherId}`);
  revalidatePath("/teachers");
  return { success: true };
}

/**
 * Remove a supervisor assignment from a teacher.
 * Only admins can perform this action.
 */
export async function unassignSupervisor({ teacherId }: { teacherId: string }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  const role = user.user_metadata?.role || profile?.role || "admin";
  if (role !== "admin") {
    throw new Error("Forbidden: Only admins can unassign supervisors");
  }

  const { error } = await supabaseAdmin
    .from("supervisor_assignments")
    .delete()
    .eq("teacher_id", teacherId);

  if (error) throw new Error(error.message);

  revalidatePath(`/teachers/${teacherId}`);
  revalidatePath("/teachers");
  return { success: true };
}
