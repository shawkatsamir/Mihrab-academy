"use server";

import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { getAuthenticatedUser } from "@/lib/auth/getAuthenticatedUser";
import { getTeacherStats } from "@/features/teachers/actions/getTeacherStats";
import type { Database } from "@/lib/supabase/database.types";

const supabaseAdmin = createSupabaseClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } },
);

export type StudentProfileData = {
  role: "student";
  id: string;
  name: string;
  photoUrl: string | null;
  isActive: boolean;
  shortId: string;
  ageGroupLabel: string;
  dateOfBirth: string | null;
  parentWhatsapp: string | null;
  enrollmentDate: string;
};

export type TeacherProfileData = {
  role: "teacher";
  id: string;
  name: string;
  photoUrl: string | null;
  isActive: boolean;
  shortId: string;
  email: string | null;
  bio: string | null;
  pricePerHour: number | null;
  zoomPersonalLink: string | null;
  sogoEmail: string | null;
  supervisorName: string | null;
  totalHours: number;
  totalSalaryCents: number;
  createdAt: string;
};

export type SupervisorProfileData = {
  role: "supervisor";
  id: string;
  name: string;
  photoUrl: string | null;
  isActive: boolean;
  shortId: string;
  email: string | null;
  teacherCount: number;
  createdAt: string;
};

export type MyProfileData =
  | StudentProfileData
  | TeacherProfileData
  | SupervisorProfileData;

export async function getMyProfile(): Promise<MyProfileData> {
  const { user, role } = await getAuthenticatedUser([
    "student",
    "teacher",
    "supervisor",
  ]);
  const id = user.id;

  if (role === "student") {
    const { data, error } = await supabaseAdmin
      .from("students")
      .select(
        `
        id,
        date_of_birth,
        parent_whatsapp,
        enrollment_date,
        age_groups(label),
        profiles!fk_students_profile(full_name, photo_url, is_active)
      `,
      )
      .eq("id", id)
      .single();

    if (error) throw new Error(error.message);

    const profiles = Array.isArray(data.profiles)
      ? data.profiles[0]
      : data.profiles;
    const ageGroup = Array.isArray(data.age_groups)
      ? data.age_groups[0]
      : data.age_groups;

    return {
      role: "student",
      id: data.id,
      name: profiles?.full_name ?? "Unknown",
      photoUrl: profiles?.photo_url ?? null,
      isActive: profiles?.is_active ?? false,
      shortId: data.id.slice(0, 8).toUpperCase(),
      ageGroupLabel: ageGroup?.label ?? "—",
      dateOfBirth: data.date_of_birth,
      parentWhatsapp: data.parent_whatsapp,
      enrollmentDate: data.enrollment_date,
    };
  }

  if (role === "teacher") {
    const { data, error } = await supabaseAdmin
      .from("teachers")
      .select(
        `
        id,
        bio,
        price_per_hour,
        zoom_personal_link,
        sogo_email,
        created_at,
        profiles(full_name, photo_url, is_active),
        supervisor_assignments(
          supervisor_id,
          supervisors(
            profiles(full_name)
          )
        )
      `,
      )
      .eq("id", id)
      .single();

    if (error) throw new Error(error.message);

    const profiles = Array.isArray(data.profiles)
      ? data.profiles[0]
      : data.profiles;

    const assignment = (data.supervisor_assignments ?? [])[0];
    const supProfiles = assignment?.supervisors?.profiles;
    const supervisorName = Array.isArray(supProfiles)
      ? (supProfiles[0]?.full_name ?? null)
      : (supProfiles?.full_name ?? null);

    const { data: authUser } = await supabaseAdmin.auth.admin.getUserById(id);
    const email = authUser?.user?.email ?? null;

    const stats = await getTeacherStats(id);

    return {
      role: "teacher",
      id: data.id,
      name: profiles?.full_name ?? "Unknown",
      photoUrl: profiles?.photo_url ?? null,
      isActive: profiles?.is_active ?? false,
      shortId: data.id.slice(0, 8).toUpperCase(),
      email,
      bio: data.bio,
      pricePerHour: data.price_per_hour,
      zoomPersonalLink: data.zoom_personal_link,
      sogoEmail: data.sogo_email,
      supervisorName,
      totalHours: stats.totalHours,
      totalSalaryCents: stats.totalSalaryCents,
      createdAt: data.created_at,
    };
  }

  // supervisor
  const { data, error } = await supabaseAdmin
    .from("supervisors")
    .select(
      `
      id,
      created_at,
      profiles(full_name, photo_url, is_active),
      supervisor_assignments(teacher_id)
    `,
    )
    .eq("id", id)
    .single();

  if (error) throw new Error(error.message);

  const profiles = Array.isArray(data.profiles)
    ? data.profiles[0]
    : data.profiles;
  const teacherCount = (data.supervisor_assignments ?? []).length;

  const { data: authUser } = await supabaseAdmin.auth.admin.getUserById(id);
  const email = authUser?.user?.email ?? null;

  return {
    role: "supervisor",
    id: data.id,
    name: profiles?.full_name ?? "Unknown",
    photoUrl: profiles?.photo_url ?? null,
    isActive: profiles?.is_active ?? false,
    shortId: data.id.slice(0, 8).toUpperCase(),
    email,
    teacherCount,
    createdAt: data.created_at,
  };
}
