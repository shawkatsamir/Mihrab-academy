import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

type UserRole = "admin" | "supervisor" | "teacher" | "student";

const ROUTE_GUARDS: { pattern: RegExp; roles: UserRole[] }[] = [
  { pattern: /^\/admin/, roles: ["admin"] },
  { pattern: /^\/supervisor/, roles: ["admin", "supervisor"] },
  {
    pattern: /^\/teacher/,
    roles: ["admin", "supervisor", "teacher"],
  },
  { pattern: /^\/student/, roles: ["admin", "student"] },
  {
    pattern: /^\/sessions/,
    roles: ["admin", "supervisor", "teacher"],
  },
  {
    pattern: /^\/calendar/,
    roles: ["admin", "supervisor", "teacher", "student"],
  },
  {
    pattern: /^\/dashboard/,
    roles: ["admin", "supervisor", "teacher", "student"],
  },
];

export async function proxy(request: NextRequest) {
  const { pathname, hostname } = request.nextUrl;
  const response = NextResponse.next({ request });

  // ── Skip non-platform routes ─────────────────────────────
  const platformRoutes = [
    "/admin",
    "/calendar",
    "/dashboard",
    "/profile",
    "/sessions",
    "/student",
    "/teachers",
  ];
  const isPlatformRoute = platformRoutes.some((route) =>
    pathname.startsWith(route),
  );
  if (!isPlatformRoute) return response;

  // ── Build Supabase client ────────────────────────────────
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookies) {
          cookies.forEach(({ name, value, options }) => {
            request.cookies.set(name, value);
            response.cookies.set(name, value, options);
          });
        },
      },
    },
  );

  // ── Auth check ───────────────────────────────────────────
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // ── Role from metadata (no DB query) ─────────────────────
  // Default to "admin" if no role is set (useful for local dev when signing up directly)
  const role = (user.user_metadata?.role as UserRole) || "admin";

  // ── Guard check ──────────────────────────────────────────
  const guard = ROUTE_GUARDS.find((g) => g.pattern.test(pathname));
  if (guard && !guard.roles.includes(role)) {
    // Prevent infinite redirect loop if they are already on /dashboard
    if (pathname !== "/dashboard") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
