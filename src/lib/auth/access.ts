import type { Database } from "@/lib/supabase/database.types";

type UserRole = Database["public"]["Enums"]["user_role"];

// Ordered from most specific to most general.
// Unknown routes fall through to the admin-only default at the bottom.
const ROUTE_ACCESS: Array<{ prefix: string; roles: readonly UserRole[] }> = [
  // Admin-only management routes
  { prefix: "/dashboard", roles: ["admin"] },
  { prefix: "/supervisors", roles: ["admin"] },
  { prefix: "/admin", roles: ["admin"] },

  // Admin + supervisor management routes
  { prefix: "/students", roles: ["admin", "supervisor"] },
  { prefix: "/teachers", roles: ["admin", "supervisor"] },
  { prefix: "/subjects", roles: ["admin", "supervisor"] },

  // All authenticated roles
  { prefix: "/sessions", roles: ["admin", "supervisor", "teacher", "student"] },
  { prefix: "/calendar", roles: ["admin", "supervisor", "teacher", "student"] },
  { prefix: "/profile", roles: ["admin", "supervisor", "teacher", "student"] },
];

/**
 * Returns the correct landing page for a role.
 * Used for post-login redirects and forbidden-access redirects to avoid
 * infinite redirect loops (e.g. a student being bounced to /dashboard
 * which they also cannot access).
 */
export function getDefaultRoute(role: UserRole): string {
  return role === "admin" ? "/dashboard" : "/sessions";
}

/**
 * Returns true if `role` is allowed to access `pathname`.
 * Matches by prefix — the first matching rule wins.
 */
export function canAccessRoute(role: UserRole, pathname: string): boolean {
  const rule = ROUTE_ACCESS.find((r) => pathname.startsWith(r.prefix));
  if (!rule) return role === "admin"; // unrecognised routes: admin only
  return (rule.roles as UserRole[]).includes(role);
}
