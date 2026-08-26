import { NextRequest, NextResponse } from "next/server";
import { connectMongo } from "@/lib/mongodb";
import WhatsAppOTP from "@/lib/models/WhatsAppOTP";
import { checkRateLimit } from "@/lib/rate-limit";
import { sendWhatsAppTemplate } from "@/lib/whatsapp/cloud-api";

const PHONE_REGEX = /^[6-9]\d{9}$/;
const OTP_TEMPLATE_NAME = process.env.WHATSAPP_OTP_TEMPLATE_NAME || "careers_otp_2";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const rawPhone = String(body.phone || "").trim().replace(/^\+91/, "").replace(/\s+/g, "");

    if (!PHONE_REGEX.test(rawPhone)) {
      return NextResponse.json(
        { success: false, message: "Please enter a valid 10-digit Indian phone number." },
        { status: 400 }
      );
    }

    // Rate limit: max 3 OTP requests per phone per hour
    const rateKey = `careers_otp_send_${rawPhone}`;
    const allowed = checkRateLimit(rateKey, 3, 60 * 60 * 1000);
    if (!allowed) {
      return NextResponse.json(
        { success: false, message: "Too many OTP requests. Please try again in an hour." },
        { status: 429 }
      );
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 2 * 60 * 1000); // 2 minutes

    // Save to MongoDB (upsert)
    await connectMongo();
    await WhatsAppOTP.updateOne(
      { phone: rawPhone },
      { $set: { otp, expiresAt, attempts: 0 } },
      { upsert: true }
    );

    // Send OTP via WhatsApp Cloud API (Authentication Template)
    const e164Phone = `91${rawPhone}`;
    const result = await sendWhatsAppTemplate({
      toE164: e164Phone,
      templateName: OTP_TEMPLATE_NAME,
      languageCode: "en",
      components: [
        {
          type: "body",
          parameters: [{ type: "text", text: otp }],
        },
        {
          type: "button",
          sub_type: "url",
          index: "0",
          parameters: [{ type: "text", text: otp }],
        }
      ],
    });

    if (result.ok === false) {
      console.error("[careers-otp] WhatsApp send failed:", result.error);
      return NextResponse.json(
        { success: false, message: "Failed to send OTP via WhatsApp. Please try again." },
        { status: 500 }
      );
    }

    console.log(`[careers-otp] ✅ OTP sent to ${rawPhone.slice(0, 4)}****${rawPhone.slice(-2)}`);
    return NextResponse.json({ success: true, message: "OTP sent to your WhatsApp!" });
  } catch (error: any) {
    console.error("[careers-otp] Error:", error.message || error);
    return NextResponse.json(
      { success: false, message: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
