import { NextResponse } from "next/server";
import { connectMongo } from "@/lib/mongodb";
import { DemoRequest } from "@/lib/models/DemoRequest";
import { cookies } from "next/headers";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { otp } = await req.json();
    const { id } = await params;

    // Security: Validate browser session cookie
    const cookieStore = await cookies();
    const session = cookieStore.get("demo_session");
    if (!session || session.value !== id) {
      return NextResponse.json({ ok: false, message: "Unauthorized or expired session." }, { status: 401 });
    }

    await connectMongo();
    const lead = await DemoRequest.findById(id);
    if (!lead) {
      return NextResponse.json({ ok: false, message: "Lead not found" }, { status: 404 });
    }

    if (lead.isEmailVerified) {
      return NextResponse.json({ ok: true, message: "Already verified." });
    }

    if (!lead.otp || lead.otp !== otp) {
      return NextResponse.json({ ok: false, message: "Invalid verification code." }, { status: 400 });
    }

    if (!lead.otpExpiresAt || new Date() > lead.otpExpiresAt) {
      return NextResponse.json({ ok: false, message: "Verification code expired. Please resend." }, { status: 400 });
    }

    // Mark as verified using updateOne to bypass full document validation
    await DemoRequest.updateOne(
      { _id: lead._id },
      { 
        $set: { isEmailVerified: true },
        $unset: { otp: 1, otpExpiresAt: 1 }
      }
    );

    return NextResponse.json({ ok: true, message: "Email verified successfully!" });
  } catch (error) {
    console.error("[verify-otp] Error:", error);
    return NextResponse.json({ ok: false, message: "Server error" }, { status: 500 });
  }
}
