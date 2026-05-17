import { handleInboundTextMessage } from "@/lib/whatsapp/handle-inbound";
import { markWebhookMessageAnswered, wasWebhookMessageAlreadyAnswered } from "@/lib/whatsapp/webhook-dedupe";

type WaTextBody = { body?: string };

type WaMessage = {
  from?: string;
  id?: string;
  type?: string;
  text?: WaTextBody;
};

type WaWebhookValue = {
  messages?: WaMessage[];
};

type WaChange = {
  field?: string;
  value?: WaWebhookValue;
};

type WaEntry = {
  changes?: WaChange[];
};

export type WaWebhookPayload = {
  object?: string;
  entry?: WaEntry[];
};

export async function processWhatsAppWebhookPayload(payload: WaWebhookPayload): Promise<void> {
  if (payload.object !== "whatsapp_business_account") return;
  const entries = payload.entry ?? [];

  for (const entry of entries) {
    for (const change of entry.changes ?? []) {
      if (change.field !== "messages") continue;
      const messages = change.value?.messages ?? [];
      for (const m of messages) {
        if (m.type !== "text" || !m.from || !m.id) continue;
        if (wasWebhookMessageAlreadyAnswered(m.id)) continue;
        const body = typeof m.text?.body === "string" ? m.text.body : "";
        const sent = await handleInboundTextMessage({ from: m.from, messageId: m.id, body });
        if (sent) markWebhookMessageAnswered(m.id);
      }
    }
  }
}
