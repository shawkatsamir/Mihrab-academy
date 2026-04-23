"use server";

import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";
import type { Database, TablesInsert } from "@/lib/supabase/database.types";
import { requireRole } from "@/lib/auth/getAuthenticatedUser";

const supabaseAdmin = createSupabaseClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } },
);

export async function createSubject(values: TablesInsert<"subjects">) {
  const { user } = await requireRole(["admin"]);

  const { data, error } = await supabaseAdmin
    .from("subjects")
    .insert({ ...values, created_by: user.id })
    .select()
    .single();

  if (error) throw new Error(error.message);

  revalidatePath("/subjects");
  return data;
}
