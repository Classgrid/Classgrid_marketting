import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  const filePath = path.join(process.cwd(), "docs", "PUBLIC_SYSTEM.md");
  const markdownContent = fs.readFileSync(filePath, "utf-8");

  // Pure, raw text file. Exactly like Vercel. No HTML, no CSS, no scrollbars.
  return new NextResponse(markdownContent, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
