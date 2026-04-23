"use server";

import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";
import type { Database } from "@/lib/supabase/database.types";
import type { TablesInsert } from "@/lib/supabase/database.types";
import { requireRole } from "@/lib/auth/getAuthenticatedUser";

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
  // Auth guard — only admins, reading role from DB (not user_metadata)
  const { user } = await requireRole(["admin"]);

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
  const { user } = await requireRole(["admin"]);

  const { error } = await supabaseAdmin
    .from("supervisor_assignments")
    .delete()
    .eq("teacher_id", teacherId);

  if (error) throw new Error(error.message);

  revalidatePath(`/teachers/${teacherId}`);
  revalidatePath("/teachers");
  return { success: true };
}
