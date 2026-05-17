/**
 * Click-to-chat links for the public site (wa.me). Use the same number as your
 * WhatsApp Business Cloud API / Meta "To" customer-facing line.
 */

/** Default: ClassGrid WhatsApp Business / Cloud API line (+91 81492 77038) */
const FALLBACK_IN = "918149277038";

export function getWhatsAppBusinessDigits(): string {
  const raw = process.env.NEXT_PUBLIC_WHATSAPP_BUSINESS_NUMBER;
  if (!raw?.trim()) return FALLBACK_IN;
  const digits = raw.replace(/\D/g, "");
  return digits.length >= 10 ? digits : FALLBACK_IN;
}

export function buildWhatsAppChatUrl(prefilledMessage?: string): string {
  const n = getWhatsAppBusinessDigits();
  const base = `https://wa.me/${n}`;
  if (prefilledMessage == null || prefilledMessage === "") return base;
  return `${base}?text=${encodeURIComponent(prefilledMessage)}`;
}

/** Short prompts that match common customer questions */
export const whatsAppSupportQuickPrompts: ReadonlyArray<{ label: string; message: string }> = [
  { label: "What is ClassGrid?", message: "What is ClassGrid?" },
  { label: "Book a demo", message: "I'd like to book a demo for my institution." },
  { label: "Pricing plans", message: "Can you share the pricing plans for ClassGrid?" },
  { label: "ERP for colleges", message: "Do you have an ERP solution for colleges?" },
  { label: "Talk to sales", message: "I'd like to speak with someone from the sales team." },
];
