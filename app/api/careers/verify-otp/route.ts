import { NextRequest, NextResponse } from "next/server";
import { connectMongo } from "@/lib/mongodb";
import WhatsAppOTP from "@/lib/models/WhatsAppOTP";
import { checkRateLimit } from "@/lib/rate-limit";
import jwt from "jsonwebtoken";

const PHONE_REGEX = /^[6-9]\d{9}$/;
const MAX_ATTEMPTS = 3;

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("Missing JWT_SECRET env var");
  return secret;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const rawPhone = String(body.phone || "").trim().replace(/^\+91/, "").replace(/\s+/g, "");
    const otpInput = String(body.otp || "").trim();

    if (!PHONE_REGEX.test(rawPhone)) {
      return NextResponse.json(
        { verified: false, message: "Invalid phone number." },
        { status: 400 }
      );
    }

    if (!/^\d{6}$/.test(otpInput)) {
      return NextResponse.json(
        { verified: false, message: "OTP must be a 6-digit number." },
        { status: 400 }
      );
    }

    // Rate limit verification attempts (prevent brute force)
    const rateKey = `careers_otp_verify_${rawPhone}`;
    const allowed = checkRateLimit(rateKey, 10, 15 * 60 * 1000); // 10 attempts per 15 min
    if (!allowed) {
      return NextResponse.json(
        { verified: false, message: "Too many verification attempts. Please try again later." },
        { status: 429 }
      );
    }

    await connectMongo();
    const otpRecord = await WhatsAppOTP.findOne({ phone: rawPhone });

    if (!otpRecord) {
      return NextResponse.json(
        { verified: false, message: "No OTP found. Please request a new one." },
        { status: 400 }
      );
    }

    // Check expiry
    if (otpRecord.expiresAt < new Date()) {
      await WhatsAppOTP.deleteOne({ _id: otpRecord._id });
      return NextResponse.json(
        { verified: false, message: "OTP has expired. Please request a new one." },
        { status: 400 }
      );
    }

    // Check max attempts
    if (otpRecord.attempts >= MAX_ATTEMPTS) {
      await WhatsAppOTP.deleteOne({ _id: otpRecord._id });
      return NextResponse.json(
        { verified: false, message: "Too many wrong attempts. Please request a new OTP." },
        { status: 400 }
      );
    }

    // Check OTP match
    if (otpRecord.otp !== otpInput) {
      otpRecord.attempts += 1;
      await otpRecord.save();
      const remaining = MAX_ATTEMPTS - otpRecord.attempts;
      return NextResponse.json(
        { verified: false, message: `Incorrect OTP. ${remaining} attempt${remaining !== 1 ? "s" : ""} remaining.` },
        { status: 400 }
      );
    }

    // OTP is valid — delete it and issue a signed token
    await WhatsAppOTP.deleteOne({ _id: otpRecord._id });

    const token = jwt.sign(
      { phone: rawPhone, purpose: "careers_phone_verification" },
      getJwtSecret(),
      { expiresIn: "15m" }
    );

    console.log(`[careers-otp] ✅ Phone verified: ${rawPhone.slice(0, 4)}****${rawPhone.slice(-2)}`);
    return NextResponse.json({
      verified: true,
      token,
      message: "Phone number verified successfully!",
    });
  } catch (error: any) {
    console.error("[careers-otp-verify] Error:", error.message || error);
    return NextResponse.json(
      { verified: false, message: "Verification failed. Please try again." },
      { status: 500 }
    );
  }
}
