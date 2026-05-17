import { NextResponse } from "next/server";
import { sendWhatsAppTemplate } from "@/lib/whatsapp/cloud-api";

export const dynamic = "force-dynamic";

/**
 * Sends an OTP using your *approved* WhatsApp authentication / custom template.
 * Secured with `x-classgrid-internal-secret` matching WHATSAPP_INTERNAL_API_SECRET.
 *
 * Body JSON:
 * { "to": "9198xxxxxxxx", "code": "123456" }
 *
 * Template variable mapping depends on your Meta template — adjust `components` here
 * once your template is approved.
 */
export async function POST(req: Request) {
  const secret = process.env.WHATSAPP_INTERNAL_API_SECRET;
  if (!secret) {
    return NextResponse.json({ error: "WHATSAPP_INTERNAL_API_SECRET not configured" }, { status: 503 });
  }

  const header = req.headers.get("x-classgrid-internal-secret");
  if (header !== secret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const templateName = process.env.WHATSAPP_OTP_TEMPLATE_NAME;
  const language = process.env.WHATSAPP_OTP_TEMPLATE_LANG || "en";

  if (!templateName) {
    return NextResponse.json(
      { error: "Set WHATSAPP_OTP_TEMPLATE_NAME to your approved template name" },
      { status: 503 }
    );
  }

  let body: { to?: string; code?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const to = typeof body.to === "string" ? body.to.replace(/^\+/, "").trim() : "";
  const code = typeof body.code === "string" ? body.code.trim() : "";
  if (!/^\d{10,15}$/.test(to)) {
    return NextResponse.json({ error: "Invalid `to` — use digits only, country code included (no +)" }, { status: 400 });
  }
  if (!/^\d{4,8}$/.test(code)) {
    return NextResponse.json({ error: "Invalid `code`" }, { status: 400 });
  }

  // Default: single body variable {{1}} — change to match your template.
  const components = [
    {
      type: "body" as const,
      parameters: [{ type: "text" as const, text: code }],
    },
  ];

  const result = await sendWhatsAppTemplate({
    toE164: to,
    templateName,
    languageCode: language,
    components,
  });

  if (result.ok === false) {
    return NextResponse.json({ error: result.error }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
