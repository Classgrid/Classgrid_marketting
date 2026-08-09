import { NextRequest, NextResponse } from "next/server";
import { decryptEmail } from "@/lib/crypto";

export async function GET(req: NextRequest) {
  try {
    const token = req.nextUrl.searchParams.get("token");
    
    if (!token) {
      return NextResponse.json({ error: "Missing token" }, { status: 400 });
    }

    const email = decryptEmail(token);
    
    if (!email) {
      return NextResponse.json({ error: "Invalid token" }, { status: 400 });
    }

    return NextResponse.json({ email }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
