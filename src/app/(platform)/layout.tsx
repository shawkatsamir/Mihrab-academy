import { getAuthenticatedUser } from "@/lib/auth/getAuthenticatedUser";
import AdminHeader from "@/shared/layout/AdminHeader";
import { Sidebar } from "@/shared/layout/Sidebar";

/**
 * Platform layout — requires a valid authenticated session.
 * This is the outermost guard for ALL (platform) routes.
 * Individual pages perform additional role checks as needed.
 */
export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Verify session — redirects to /auth/login if no user
  await getAuthenticatedUser();

  return (
    <div className="flex h-screen w-full bg-admin-surface overflow-hidden">
      {/* Sidebar area */}
      <div className="hidden md:flex h-full shrink-0">
        <Sidebar />
      </div>

      {/* Main content wrapper */}
      <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden">
        <AdminHeader />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
