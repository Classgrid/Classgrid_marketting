import { NextResponse } from "next/server";
import { connectMongo } from "@/lib/mongodb";
import { DemoRequest } from "@/lib/models/DemoRequest";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // 1. Connect to MongoDB Atlas (Vercel talks directly to the DB)
    await connectMongo();

    // 2. Save the Lead
    const lead = await DemoRequest.create({
      institutionName: body.institutionName,
      orgType: body.orgType,
      adminName: body.adminName,
      adminEmail: body.adminEmail,
      adminPhone: body.adminPhone,
      state: body.state,
      city: body.city,
      message: body.message,
      status: "pending",
    });

    // NOTE: You can also add Brevo / Sendgrid email sending logic here later 
    // to email yourself when a new demo is booked!

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
