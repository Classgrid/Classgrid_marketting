import { NextResponse } from "next/server";
import { connectMongo } from "@/lib/mongodb";
import { DemoRequest } from "@/lib/models/DemoRequest";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // 1. Connect to MongoDB Atlas
    await connectMongo();

    // Prevent duplicate demo requests for the same email
    const existingLead = await DemoRequest.findOne({ adminEmail: body.adminEmail });
    if (existingLead) {
      return NextResponse.json(
        { ok: false, message: "A demo request with this email already exists. Please check your inbox or contact support." },
        { status: 400 }
      );
    }

    // 2. Save the Lead WITHOUT OTP (Wait for user to request it on cover page)
    const lead = await DemoRequest.create({
      institutionName: body.institutionName,
      orgType: body.orgType,
      adminName: body.adminName,
      adminEmail: body.adminEmail,
      adminPhone: body.adminPhone,
      state: body.state,
      district: body.district,
      taluka: body.taluka,
      cityVillage: body.cityVillage,
      role: body.role,
      message: body.message,
      source: body.source,
      status: "pending",
      isEmailVerified: false,
    });

    // 3. Set a secure browser session cookie
    const cookieStore = await cookies();
    cookieStore.set("demo_session", lead._id.toString(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24, // 1 day expiration
      path: "/",
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
