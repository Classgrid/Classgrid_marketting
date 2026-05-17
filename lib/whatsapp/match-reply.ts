import supportFaq from "./support-faq.json";

export type FaqEntry = {
  id: string;
  keywords: string[];
  reply: string;
};

const entries = supportFaq as FaqEntry[];

function normalize(s: string): string {
  return s
    .toLowerCase()
    .replace(/\s+/g, " ")
    .replace(/[^a-z0-9\u0080-\uFFFF\s]/gi, " ")
    .trim();
}

/**
 * Returns the best FAQ reply for inbound user text, or null if no confident match.
 */
export function matchFaqReply(inboundText: string): string | null {
  const text = normalize(inboundText);
  if (!text) return null;

  let best: { score: number; reply: string } | null = null;

  for (const entry of entries) {
    for (const phrase of entry.keywords) {
      const p = normalize(phrase);
      if (!p) continue;
      if (text.includes(p)) {
        const score = p.length;
        if (!best || score > best.score) {
          best = { score, reply: entry.reply };
        }
      }
    }
  }

  return best?.reply ?? null;
}

export function defaultSupportReply(): string {
  return [
    "Thanks for messaging ClassGrid.",
    "",
    "Try: *What is ClassGrid?* • *Pricing* • *Colleges* • *Parents login* • *Create account*",
    "",
    "Website: https://classgrid.in",
    "Email: support@classgrid.in",
  ].join("\n");
}
