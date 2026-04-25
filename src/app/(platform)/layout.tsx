import { getAuthenticatedUser } from "@/lib/auth/getAuthenticatedUser";
import AdminHeader from "@/shared/layout/AdminHeader";
import { Sidebar } from "@/shared/layout/Sidebar";

/**
 * Platform layout — requires a valid authenticated session.
 * Reads the user's role once here and threads it down to the nav components
 * so they render the correct items without each making their own DB call.
 */
export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { role, fullName } = await getAuthenticatedUser();

  return (
    <div className="flex h-screen w-full bg-admin-surface overflow-hidden">
      {/* Sidebar area */}
      <div className="hidden md:flex h-full shrink-0">
        <Sidebar role={role} />
      </div>

      {/* Main content wrapper */}
      <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden">
        <AdminHeader role={role} fullName={fullName} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
