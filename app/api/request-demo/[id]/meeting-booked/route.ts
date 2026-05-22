import { NextResponse } from "next/server";
import { connectMongo } from "@/lib/mongodb";
import { DemoRequest } from "@/lib/models/DemoRequest";
import { google } from "googleapis";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    await connectMongo();

    const lead = await DemoRequest.findById(id);
    if (!lead) {
      return NextResponse.json({ ok: false, message: "Demo request not found." }, { status: 404 });
    }

    if (!lead.isEmailVerified) {
      return NextResponse.json({ ok: false, message: "Email not verified." }, { status: 403 });
    }

    let meetingUrl = "";

    // If Admin Google Tokens are present, generate the Meet link!
    if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET && process.env.ADMIN_GOOGLE_REFRESH_TOKEN) {
      const oauth2Client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET
      );

      oauth2Client.setCredentials({ refresh_token: process.env.ADMIN_GOOGLE_REFRESH_TOKEN });
      const calendar = google.calendar({ version: "v3", auth: oauth2Client });

      const startDate = new Date(body.scheduledAt);
      const endDate = new Date(startDate.getTime() + 30 * 60000); // 30 min duration

      const event = {
        summary: `Classgrid Demo: ${lead.institutionName} (${lead.adminName})`,
        description: `Demo request from ${lead.adminName} (${lead.orgType})\n\nDetails: ${lead.message || "No additional message."}`,
        start: { dateTime: startDate.toISOString(), timeZone: "Asia/Kolkata" },
        end: { dateTime: endDate.toISOString(), timeZone: "Asia/Kolkata" },
        attendees: [{ email: lead.adminEmail }],
        conferenceData: {
          createRequest: {
            requestId: `cg-demo-${lead._id}-${Date.now()}`,
            conferenceSolutionKey: { type: "hangoutsMeet" }
          }
        },
        guestsCanModify: false,
        guestsCanInviteOthers: false,
      };

      try {
        const response = await calendar.events.insert({
          calendarId: "primary",
          resource: event,
          conferenceDataVersion: 1,
          sendUpdates: "none"
        });

        meetingUrl = response.data.hangoutLink || "";
        console.log(`[meeting-booked] Google Meet generated: ${meetingUrl}`);
      } catch (calErr: any) {
        console.error("[meeting-booked] Google Calendar API Error:", calErr.message);
        // Continue even if Google API fails, so we don't completely break the flow if token expires
      }
    } else {
      console.warn("[meeting-booked] Google credentials missing in .env. Skipping Meet generation.");
    }

    // Save to Database
    lead.status = "demo_scheduled";
    lead.provider = "google_meet";
    lead.scheduledAt = body.scheduledAt;
    lead.meetingUrl = meetingUrl;
    lead.timezone = "Asia/Kolkata";
    
    await lead.save();

    // Send custom Classgrid confirmation email
    if (process.env.BREVO_SMTP_HOST) {
      try {
        const { getSmtpTransporter, getSenderAddress } = await import("@/lib/smtp-mailer");
        const { getDemoConfirmationEmailHtml } = await import("@/lib/email-templates");
        const transporter = getSmtpTransporter();
        const { format } = await import("date-fns");
        
        const scheduledDate = new Date(lead.scheduledAt);
        const formatStr = scheduledDate.getFullYear() === new Date().getFullYear() 
          ? "EEEE, MMMM d 'at' h:mm a" 
          : "EEEE, MMMM d, yyyy 'at' h:mm a";
        const dateStr = format(scheduledDate, formatStr);

        await transporter.sendMail({
          from: getSenderAddress(),
          to: lead.adminEmail,
          subject: "Classgrid Demo Confirmed - Meeting Details Inside",
          html: getDemoConfirmationEmailHtml(lead.adminName, dateStr, meetingUrl),
        });
        console.log(`[meeting-booked] Sent confirmation email to ${lead.adminEmail}`);
      } catch (emailErr: any) {
        console.error("[meeting-booked] Confirmation email failed:", emailErr.message);
      }
    }

    return NextResponse.json({ ok: true, message: "Meeting scheduled successfully.", meetingUrl, lead }, { status: 200 });

  } catch (error: any) {
    console.error("[meeting-booked] Error scheduling meeting:", error);
    return NextResponse.json({ ok: false, message: "Server Error" }, { status: 500 });
  }
}

