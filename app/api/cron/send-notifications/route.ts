import { NextResponse } from "next/server";

export async function GET(req: Request) {
  return NextResponse.json({
    message: "Cron job migrated to backend EC2 server. This endpoint is no longer active.",
  }, { status: 200 });
}
