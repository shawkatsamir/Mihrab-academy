import { Resend } from "resend";
import { NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  const { name, email, countryCode, phone, message } = await req.json();

  if (!name || !email || !phone || !message) {
    return NextResponse.json({ error: "All fields are required." }, { status: 400 });
  }

  const { error } = await resend.emails.send({
    from: "Mihrab Academy <contact@mihrabacademy.org>",
    to: "contact@mihrabacademy.org",
    replyTo: email,
    subject: `New Contact Message from ${name}`,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;background:#f9fafb;padding:32px;border-radius:12px;">
        <div style="background:#1a3c2e;padding:24px 32px;border-radius:8px 8px 0 0;">
          <h1 style="color:#c9a84c;margin:0;font-size:22px;">New Contact Message</h1>
          <p style="color:#ffffff99;margin:6px 0 0;font-size:13px;">via mihrabacademy.org</p>
        </div>
        <div style="background:#ffffff;padding:32px;border-radius:0 0 8px 8px;border:1px solid #e5e7eb;border-top:none;">
          <table style="width:100%;border-collapse:collapse;">
            <tr>
              <td style="padding:10px 0;color:#6b7280;font-size:13px;width:110px;vertical-align:top;">Name</td>
              <td style="padding:10px 0;color:#111827;font-size:15px;font-weight:600;">${name}</td>
            </tr>
            <tr>
              <td style="padding:10px 0;color:#6b7280;font-size:13px;vertical-align:top;">Email</td>
              <td style="padding:10px 0;"><a href="mailto:${email}" style="color:#1a3c2e;font-size:15px;">${email}</a></td>
            </tr>
            ${phone ? `
            <tr>
              <td style="padding:10px 0;color:#6b7280;font-size:13px;vertical-align:top;">Phone</td>
              <td style="padding:10px 0;color:#111827;font-size:15px;">${countryCode ?? ""} ${phone}</td>
            </tr>` : ""}
            <tr>
              <td colspan="2" style="padding-top:20px;">
                <p style="color:#6b7280;font-size:13px;margin:0 0 8px;">Message</p>
                <div style="background:#f3f4f6;border-radius:6px;padding:16px;color:#1f2937;font-size:15px;line-height:1.6;white-space:pre-wrap;">${message}</div>
              </td>
            </tr>
          </table>
          <p style="margin:28px 0 0;font-size:12px;color:#9ca3af;">Reply directly to this email to respond to ${name}.</p>
        </div>
      </div>
    `,
  });

  if (error) {
    return NextResponse.json({ error: "Failed to send message. Please try again." }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
