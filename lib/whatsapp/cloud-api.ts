const GRAPH_VERSION = process.env.WHATSAPP_GRAPH_API_VERSION || "v22.0";

function getToken(): string {
  const t = process.env.WHATSAPP_ACCESS_TOKEN;
  if (!t) throw new Error("Missing WHATSAPP_ACCESS_TOKEN");
  return t;
}

function getPhoneNumberId(): string {
  const id = process.env.WHATSAPP_PHONE_NUMBER_ID;
  if (!id) throw new Error("Missing WHATSAPP_PHONE_NUMBER_ID");
  return id;
}

export type SendTextParams = {
  toE164: string;
  body: string;
  previewUrl?: boolean;
};

/**
 * Sends a plain text message inside the customer care / 24h session window.
 * @param toE164 WhatsApp ID without + (e.g. 9198xxxxxxxx)
 */
export async function sendWhatsAppText(params: SendTextParams): Promise<{ ok: true } | { ok: false; error: string }> {
  const url = `https://graph.facebook.com/${GRAPH_VERSION}/${getPhoneNumberId()}/messages`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getToken()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      to: params.toE164.replace(/^\+/, ""),
      type: "text",
      text: {
        preview_url: Boolean(params.previewUrl),
        body: params.body,
      },
    }),
  });

  const json = (await res.json().catch(() => ({}))) as { error?: { message?: string } };
  if (!res.ok) {
    const msg = json?.error?.message || res.statusText || "Graph API error";
    return { ok: false, error: msg };
  }
  return { ok: true };
}

export type TemplateComponent = {
  type: "body" | "button";
  parameters: Array<{ type: "text"; text: string }>;
  sub_type?: "url" | "quick_reply";
  index?: string;
};

/**
 * Sends an approved template (e.g. AUTHENTICATION OTP). Shape must match your template in Meta Business Manager.
 */
export async function sendWhatsAppTemplate(params: {
  toE164: string;
  templateName: string;
  languageCode: string;
  components?: TemplateComponent[];
}): Promise<{ ok: true } | { ok: false; error: string }> {
  const url = `https://graph.facebook.com/${GRAPH_VERSION}/${getPhoneNumberId()}/messages`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getToken()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      to: params.toE164.replace(/^\+/, ""),
      type: "template",
      template: {
        name: params.templateName,
        language: { code: params.languageCode },
        components: params.components ?? [],
      },
    }),
  });

  const json = (await res.json().catch(() => ({}))) as { error?: { message?: string } };
  if (!res.ok) {
    const msg = json?.error?.message || res.statusText || "Graph API error";
    return { ok: false, error: msg };
  }
  return { ok: true };
}
