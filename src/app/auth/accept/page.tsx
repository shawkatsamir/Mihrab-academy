import { redirect } from "next/navigation";
import { AcceptInviteButton } from "./AcceptInviteButton";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface Props {
  searchParams: Promise<{
    token_hash?: string;
    email?: string;
    name?: string;
  }>;
}

export default async function AcceptInvitePage({ searchParams }: Props) {
  const { token_hash, email, name } = await searchParams;

  if (!token_hash || !email) {
    redirect("/auth/error?error=Invalid+invitation+link");
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">
              Welcome{name ? `, ${name}` : ""}
            </CardTitle>
            <CardDescription>
              Your account has been created on Mihrab Academy. Set your password
              to get started.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-md bg-muted px-4 py-3 text-sm text-muted-foreground">
              Signing in as <span className="font-medium text-foreground">{email}</span>
            </div>
            <AcceptInviteButton tokenHash={token_hash} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
