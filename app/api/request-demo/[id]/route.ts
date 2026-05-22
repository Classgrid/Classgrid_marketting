import { NextResponse } from "next/server";
import { connectMongo } from "@/lib/mongodb";
import { DemoRequest } from "@/lib/models/DemoRequest";

// GET lead details for the verification cover page
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectMongo();
    const lead = await DemoRequest.findById(params.id);

    if (!lead) {
      return NextResponse.json({ message: "Lead not found" }, { status: 404 });
    }

    return NextResponse.json({ lead });
  } catch (error) {
    console.error("[request-demo-GET] Error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
