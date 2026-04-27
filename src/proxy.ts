import { NextResponse, type NextRequest } from "next/server";

type UserRole = "admin" | "supervisor" | "teacher" | "student";

// @supabase/ssr derives the storage key from the Supabase project URL hostname.
// e.g. https://xigclanmppbtrwuocvub.supabase.co → sb-xigclanmppbtrwuocvub-auth-token
const PROJECT_REF = new URL(process.env.NEXT_PUBLIC_SUPABASE_URL!).hostname.split(".")[0];
const AUTH_COOKIE = `sb-${PROJECT_REF}-auth-token`;

// createBrowserClient defaults cookieEncoding to "base64url", so every stored
// cookie value is prefixed with "base64-" and the remainder is a base64url string.
// The unchunked form is stored as-is; chunks (>3180 URL-encoded chars) are stored
// as .0, .1, … sub-cookies that join back to the same prefixed string.
const BASE64_PREFIX = "base64-";

const ROUTE_GUARDS: { pattern: RegExp; roles: UserRole[] }[] = [
  { pattern: /^\/admin/, roles: ["admin"] },
  { pattern: /^\/supervisor/, roles: ["admin", "supervisor"] },
  { pattern: /^\/teacher/, roles: ["admin", "supervisor", "teacher"] },
  { pattern: /^\/student/, roles: ["admin", "student"] },
  { pattern: /^\/sessions/, roles: ["admin", "supervisor", "teacher"] },
  { pattern: /^\/calendar/, roles: ["admin", "supervisor", "teacher", "student"] },
  { pattern: /^\/dashboard/, roles: ["admin", "supervisor", "teacher", "student"] },
];

// Decode a base64url string (RFC 4648 §5) to a UTF-8 string.
// Uses TextDecoder so multi-byte characters (e.g. non-ASCII emails) survive intact.
function fromBase64URL(b64url: string): string {
  const b64 = b64url.replace(/-/g, "+").replace(/_/g, "/");
  const padded = b64.padEnd(b64.length + ((4 - (b64.length % 4)) % 4), "=");
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return new TextDecoder().decode(bytes);
}

// Resolve the raw cookie string to the actual session JSON.
// Handles the "base64-" prefix that createBrowserClient stores by default.
function decodeCookieValue(raw: string): string {
  if (raw.startsWith(BASE64_PREFIX)) {
    return fromBase64URL(raw.slice(BASE64_PREFIX.length));
  }
  return raw;
}

// Decode the base64url payload section of a JWT without any crypto verification.
// Verification is not needed here — the real auth check happens in server components
// via supabaseAdmin. Middleware only needs role for route-guarding redirects.
function decodeJWTPayload(token: string): Record<string, unknown> | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    return JSON.parse(fromBase64URL(parts[1]));
  } catch {
    return null;
  }
}

// Read the Supabase session cookie, handling chunked storage (@supabase/ssr splits
// cookies whose URL-encoded length exceeds 3180 chars into .0, .1, … chunks).
function getAuthPayload(request: NextRequest): Record<string, unknown> | null {
  let raw = request.cookies.get(AUTH_COOKIE)?.value;

  if (!raw) {
    const chunks: string[] = [];
    for (let i = 0; ; i++) {
      const chunk = request.cookies.get(`${AUTH_COOKIE}.${i}`)?.value;
      if (!chunk) break;
      chunks.push(chunk);
    }
    if (chunks.length > 0) raw = chunks.join("");
  }

  if (!raw) return null;

  try {
    const session = JSON.parse(decodeCookieValue(raw)) as {
      access_token?: string;
    };
    const token = session.access_token;
    if (!token) return null;

    const payload = decodeJWTPayload(token);
    if (!payload) return null;

    // Treat expired tokens as unauthenticated — redirect to login for refresh
    const exp = payload.exp as number | undefined;
    if (exp && exp * 1000 < Date.now()) return null;

    return payload;
  } catch {
    return null;
  }
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const response = NextResponse.next({ request });

  const platformRoutes = [
    "/admin",
    "/calendar",
    "/dashboard",
    "/profile",
    "/sessions",
    "/student",
    "/teachers",
  ];
  if (!platformRoutes.some((route) => pathname.startsWith(route))) return response;

  const payload = getAuthPayload(request);
  if (!payload) {
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  const userMeta = payload.user_metadata as { role?: UserRole } | undefined;
  const role: UserRole = userMeta?.role ?? "admin";

  const guard = ROUTE_GUARDS.find((g) => g.pattern.test(pathname));
  if (guard && !guard.roles.includes(role)) {
    if (pathname !== "/dashboard") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
