import { NextResponse } from "next/server";
import { connectMongo } from "@/lib/mongodb";
import { DemoRequest } from "@/lib/models/DemoRequest";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // 1. Connect to MongoDB Atlas (Vercel talks directly to the DB)
    await connectMongo();

    // 2. Save the Lead WITHOUT OTP (Wait for user to request it on cover page)
    const lead = await DemoRequest.create({
      institutionName: body.institutionName,
      orgType: body.orgType,
      adminName: body.adminName,
      adminEmail: body.adminEmail,
      adminPhone: body.adminPhone,
      state: body.state, // Missing required field!
      city: body.city,   // Missing required field!
      role: body.role,
      message: body.message,
      source: body.source,
      status: "pending",
      isEmailVerified: false,
    });

    return NextResponse.json(
      {
        ok: true,
        requestId: lead._id.toString(),
        message: "Demo request received successfully.",
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("[request-demo] Error saving to MongoDB:", error);
    return NextResponse.json(
      { ok: false, message: "Failed to process request. Please try again." },
      { status: 500 }
    );
  }
}
