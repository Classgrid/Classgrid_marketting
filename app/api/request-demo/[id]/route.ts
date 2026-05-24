import { NextResponse } from "next/server";
import { connectMongo } from "@/lib/mongodb";
import { DemoRequest } from "@/lib/models/DemoRequest";
import { cookies } from "next/headers";

// GET lead details for the verification cover page
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Security: Validate the browser session cookie
    const cookieStore = await cookies();
    const session = cookieStore.get("demo_session");

    if (!session || session.value !== id) {
      return NextResponse.json({ message: "Lead not found" }, { status: 404 });
    }

    await connectMongo();
    const lead = await DemoRequest.findById(id);

    if (!lead) {
      return NextResponse.json({ message: "Lead not found" }, { status: 404 });
    }

    return NextResponse.json({ lead });
  } catch (error) {
    console.error("[request-demo-GET] Error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
