import {
  LayoutGrid,
  Users,
  GraduationCap,
  Video,
  Calendar,
  BookOpen,
  ClipboardList,
  Star,
  Folder,
  Settings,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { Database } from "@/lib/supabase/database.types";

type UserRole = Database["public"]["Enums"]["user_role"];

export type NavSubItem = { name: string; path: string };

export type NavItem = {
  name: string;
  icon: LucideIcon;
  path?: string;
  external?: boolean;
  badge?: number;
  subItems?: NavSubItem[];
};

export type NavGroup = { label: string; items: NavItem[] };

const adminNavGroups: NavGroup[] = [
  {
    label: "OVERVIEW",
    items: [{ name: "Dashboard", icon: LayoutGrid, path: "/dashboard" }],
  },
  {
    label: "PEOPLE",
    items: [
      {
        name: "Staff",
        icon: Users,
        subItems: [
          { name: "Teachers", path: "/teachers" },
          { name: "Supervisors", path: "/supervisors" },
        ],
      },
      { name: "Students", icon: GraduationCap, path: "/students" },
    ],
  },
  {
    label: "LEARNING",
    items: [
      { name: "Sessions", icon: Video, path: "/sessions" },
      { name: "Calendar", icon: Calendar, path: "/calendar" },
      {
        name: "Curriculum",
        icon: BookOpen,
        subItems: [
          { name: "Subjects", path: "/subjects" },
          { name: "Plan Templates", path: "/admin/study-plans/templates" },
        ],
      },
    ],
  },
  {
    label: "QUALITY",
    items: [
      { name: "Attendance", icon: ClipboardList, path: "/admin/attendance" },
      { name: "Evaluations", icon: Star, path: "/admin/evaluations" },
    ],
  },
  {
    label: "CONTENT",
    items: [{ name: "Content Library", icon: Folder, path: "/admin/content" }],
  },
  {
    label: "SYSTEM",
    items: [{ name: "Settings", icon: Settings, path: "/admin/settings" }],
  },
];

// Shared nav for supervisor / teacher / student
const restrictedNavGroups: NavGroup[] = [
  {
    label: "LEARNING",
    items: [
      { name: "Sessions", icon: Video, path: "/sessions" },
      { name: "Calendar", icon: Calendar, path: "/calendar" },
    ],
  },
  {
    label: "ACCOUNT",
    items: [{ name: "My Profile", icon: Users, path: "/profile" }],
  },
];

export function getNavGroups(role: UserRole): NavGroup[] {
  return role === "admin" ? adminNavGroups : restrictedNavGroups;
}

export function getPanelLabel(role: UserRole): string {
  switch (role) {
    case "admin":
      return "Admin Panel";
    case "supervisor":
      return "Supervisor Panel";
    case "teacher":
      return "Teacher Panel";
    case "student":
      return "Student Panel";
  }
}
