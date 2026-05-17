/**
 * test-wa-send.mjs
 * Run: node scripts/test-wa-send.mjs <your-phone-e164-no-plus>
 * Example: node scripts/test-wa-send.mjs 919876543210
 *
 * Reads credentials from .env.local and fires a real Graph API call.
 */
import { readFileSync } from "fs";
import { resolve } from "path";

// ── load .env.local manually ────────────────────────────────────────────────
const envPath = resolve(process.cwd(), ".env.local");
const raw = readFileSync(envPath, "utf8");
for (const line of raw.split(/\r?\n/)) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith("#")) continue;
  const idx = trimmed.indexOf("=");
  if (idx === -1) continue;
  const key = trimmed.slice(0, idx).trim();
  let val = trimmed.slice(idx + 1).trim();
  if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
    val = val.slice(1, -1);
  }
  process.env[key] = val;
}

const GRAPH_VERSION = process.env.WHATSAPP_GRAPH_API_VERSION || "v22.0";
const TOKEN        = process.env.WHATSAPP_ACCESS_TOKEN;
const PHONE_ID     = process.env.WHATSAPP_PHONE_NUMBER_ID;
const TO           = process.argv[2] || process.env.NEXT_PUBLIC_WHATSAPP_BUSINESS_NUMBER;

console.log("\n=== ClassGrid WhatsApp Send Test ===");
console.log("Graph version :", GRAPH_VERSION);
console.log("Phone number ID:", PHONE_ID);
console.log("Sending to     :", TO);
console.log("Token (first 20):", TOKEN ? TOKEN.slice(0, 20) + "…" : "❌ MISSING");
console.log();

if (!TOKEN)    { console.error("❌ WHATSAPP_ACCESS_TOKEN not set"); process.exit(1); }
if (!PHONE_ID) { console.error("❌ WHATSAPP_PHONE_NUMBER_ID not set"); process.exit(1); }
if (!TO)       { console.error("❌ Provide target phone as arg: node scripts/test-wa-send.mjs 91XXXXXXXXXX"); process.exit(1); }

const url = `https://graph.facebook.com/${GRAPH_VERSION}/${PHONE_ID}/messages`;
console.log("POST →", url);

const body = {
  messaging_product: "whatsapp",
  to: TO.replace(/^\+/, ""),
  type: "text",
  text: { preview_url: false, body: "✅ ClassGrid bot test — if you see this it works!" },
};

const res = await fetch(url, {
  method: "POST",
  headers: {
    Authorization: `Bearer ${TOKEN}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify(body),
});

const json = await res.json().catch(() => ({}));

console.log("\nHTTP status:", res.status, res.statusText);
console.log("Response body:", JSON.stringify(json, null, 2));

if (res.ok) {
  console.log("\n✅ Message sent successfully! Check your WhatsApp.");
} else {
  console.log("\n❌ Send FAILED. Error details above ↑");
  console.log("\n🔍 Common causes:");
  console.log("  • 401 — Access token expired. Generate a new one in Meta Developer Console.");
  console.log("  • 100/131030 — Recipient number not in test whitelist (your app is in dev mode).");
  console.log("  • 131047 — 24-hour window expired. You must use a template message first.");
  console.log("  • 131026 — Phone number not registered on WhatsApp.");
}
