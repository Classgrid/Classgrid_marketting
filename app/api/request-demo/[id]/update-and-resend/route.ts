import { NextResponse } from "next/server";
import { connectMongo } from "@/lib/mongodb";
import { DemoRequest } from "@/lib/models/DemoRequest";

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    await connectMongo();

    // Atomic Rate Limit: prevent concurrent spamming (race conditions)
    // We only update if `otpExpiresAt` doesn't exist, OR it has expired (which is 60 seconds).
    const oneMinuteFromNow = new Date(Date.now() + 60 * 1000);
    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();

    const updatedLead = await DemoRequest.findOneAndUpdate(
      { 
        _id: params.id,
        $or: [
          { otpExpiresAt: { $exists: false } },
          { otpExpiresAt: null },
          { otpExpiresAt: { $lt: new Date(Date.now()) } } // If it has expired, they can request a new one
        ]
      },
      {
        $set: {
          institutionName: body.institutionName,
          orgType: body.orgType,
          adminName: body.adminName,
          adminEmail: body.adminEmail,
          adminPhone: body.adminPhone,
          otp: newOtp,
          otpExpiresAt: oneMinuteFromNow
        }
      },
      { new: true } // Return the updated document
    );

    if (!updatedLead) {
      // If it returned null, it means either the lead doesn't exist OR the rate limit blocked it
      const existingLead = await DemoRequest.findById(params.id);
      if (!existingLead) {
        return NextResponse.json({ message: "Lead not found" }, { status: 404 });
      }
      return NextResponse.json(
        { ok: false, message: "Please wait 60 seconds before requesting a new code." },
        { status: 429 }
      );
    }

    const lead = updatedLead;

    // Send new OTP via Brevo using existing Classgrid SMTP Mailer
    if (process.env.BREVO_SMTP_HOST) {
      try {
        const { getSmtpTransporter, getSenderAddress } = await import("@/lib/smtp-mailer");
        const { getDemoOtpEmailHtml } = await import("@/lib/email-templates");
        const transporter = getSmtpTransporter();

        await transporter.sendMail({
          from: getSenderAddress(),
          to: lead.adminEmail,
          subject: "Your New Classgrid Demo Verification Code",
          html: getDemoOtpEmailHtml(lead.adminName, newOtp),
        });
        console.log(`[resend-otp] Sent OTP ${newOtp} to ${lead.adminEmail}`);
      } catch (err) {
        console.error("[resend-otp] Email error:", err);
      }
    }

    return NextResponse.json({ ok: true, message: "Details updated and OTP resent." });
  } catch (error) {
    console.error("[update-and-resend] Error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
