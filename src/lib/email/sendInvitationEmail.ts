"use server";

import { Resend } from "resend";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/database.types";

const resend = new Resend(process.env.RESEND_API_KEY);

const supabaseAdmin = createSupabaseClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } },
);

interface SendInvitationEmailParams {
  email: string;
  fullName: string;
}

/**
 * Generates a Supabase recovery token via admin.generateLink, then sends a
 * branded invitation email via Resend that links to /auth/accept.
 *
 * WHY we do this instead of resetPasswordForEmail:
 * Gmail (and other clients) pre-scan every link in incoming emails.
 * resetPasswordForEmail puts the Supabase verification URL directly in the
 * email — the pre-scanner fetches it, consumes the OTP, and the user's click
 * always returns "otp_expired". By linking to our own /auth/accept page first,
 * the pre-scanner only sees HTML. The actual verifyOtp call is triggered by
 * the user clicking "Set Password" (client-side JS), which pre-scanners skip.
 */
export async function sendInvitationEmail({
  email,
  fullName,
}: SendInvitationEmailParams) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  // Generate the recovery token without sending any email
  const { data, error: linkError } =
    await supabaseAdmin.auth.admin.generateLink({
      type: "recovery",
      email,
      options: {
        redirectTo: `${siteUrl}/auth/update-password`,
      },
    });

  if (linkError || !data.properties.hashed_token) {
    throw new Error(
      linkError?.message ?? "Failed to generate invitation token",
    );
  }

  const { hashed_token } = data.properties;
  const acceptUrl = `${siteUrl}/auth/accept?token_hash=${hashed_token}&email=${encodeURIComponent(email)}&name=${encodeURIComponent(fullName)}`;

  const { error: emailError } = await resend.emails.send({
    from: "Mihrab Academy <contact@mihrabacademy.org>",
    to: email,
    subject: "You've been invited to Mihrab Academy",
    html: buildEmailHtml({ fullName, acceptUrl }),
  });

  if (emailError) {
    throw new Error(`Failed to send invitation email: ${emailError.message}`);
  }
}

function buildEmailHtml({
  fullName,
  acceptUrl,
}: {
  fullName: string;
  acceptUrl: string;
}) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>You've been invited to Mihrab Academy</title>
</head>
<body style="margin:0;padding:0;background-color:#f9fafb;font-family:system-ui,-apple-system,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f9fafb;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#ffffff;border-radius:12px;border:1px solid #e5e7eb;overflow:hidden;">

          <!-- Header -->
          <tr>
            <td style="background-color:#1a3c2e;padding:32px;text-align:center;">
              <h1 style="margin:0;color:#ffffff;font-size:22px;font-weight:700;letter-spacing:0.5px;">
                Mihrab Academy
              </h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px 32px;">
              <h2 style="margin:0 0 12px;color:#111827;font-size:20px;font-weight:600;">
                Welcome, ${fullName}
              </h2>
              <p style="margin:0 0 24px;color:#6b7280;font-size:15px;line-height:1.6;">
                Your account has been created on Mihrab Academy. Click the button below to set your password and access your account.
              </p>

              <!-- CTA Button -->
              <table cellpadding="0" cellspacing="0" style="margin:0 0 28px;">
                <tr>
                  <td style="background-color:#1a3c2e;border-radius:8px;">
                    <a href="${acceptUrl}"
                       style="display:inline-block;padding:14px 32px;color:#ffffff;font-size:15px;font-weight:600;text-decoration:none;border-radius:8px;">
                      Set My Password
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin:0;color:#9ca3af;font-size:13px;line-height:1.5;">
                This link expires in 24 hours. If you did not expect this email, you can safely ignore it.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color:#f9fafb;border-top:1px solid #e5e7eb;padding:20px 32px;text-align:center;">
              <p style="margin:0;color:#9ca3af;font-size:12px;">
                Mihrab Academy &mdash; contact@mihrabacademy.org
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
