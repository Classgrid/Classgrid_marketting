import { NextResponse } from "next/server";
import { getWhatsAppDailyTrackerEmailHtml } from "@/lib/email-templates";
import { sendWhatsAppKillSwitchAlert } from "@/lib/email";
import { getSmtpTransporter } from "@/lib/smtp-mailer";

export async function GET() {
  try {
    // Send Daily Tracker Email
    const transporter = getSmtpTransporter();
    
    await transporter.sendMail({
      from: `"Classgrid AI" <support@classgrid.in>`,
      to: "team@classgrid.in",
      subject: `🛡️ TEST: WhatsApp API Billing Update (955/1000)`,
      html: getWhatsAppDailyTrackerEmailHtml(955),
    });

    // Send Kill Switch Alert Email
    await sendWhatsAppKillSwitchAlert(955, "2026-08");

    return NextResponse.json({ success: true, message: "Both emails sent successfully via AWS SES!" });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) });
  }
}
