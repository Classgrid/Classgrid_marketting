import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  const filePath = path.join(process.cwd(), "docs", "FRONTEND_ARCHITECTURE_BLUEPRINT.md");
  const markdownContent = fs.readFileSync(filePath, "utf-8");

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>system.md</title>
        <style>
          body {
            background-color: #0a0a0a;
            color: #d4d4d8;
            font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
            padding: 2rem;
            margin: 0;
            line-height: 1.5;
          }
          pre {
            white-space: pre; /* This forces the massive table to NOT wrap! */
            overflow-x: auto; /* Adds a clean horizontal scrollbar */
          }
          ::selection {
            background: #10b981;
            color: #fff;
          }
        </style>
      </head>
      <body>
        <pre>${markdownContent.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</pre>
      </body>
    </html>
  `;

  return new NextResponse(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
    },
  });
}
