import { redirect } from "next/navigation";

/**
 * Sign-up is closed — accounts are created by admins only.
 * Redirect anyone who lands here back to the login page.
 */
export default function Page() {
  redirect("/auth/login");
}
