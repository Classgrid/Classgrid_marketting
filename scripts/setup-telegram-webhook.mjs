import { readFileSync } from "fs";
import { resolve } from "path";

// Load .env.local manually
const envPath = resolve(process.cwd(), ".env.local");
try {
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
} catch (e) {
  // ok if not found
}

const TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const SECRET = process.env.TELEGRAM_WEBHOOK_SECRET || "classgrid_telegram_secret";

if (!TOKEN) {
  console.log("[telegram] Skipping webhook setup (no TELEGRAM_BOT_TOKEN)");
  process.exit(0);
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function getNgrokUrl() {
  for (let i = 0; i < 30; i++) {
    try {
      const res = await fetch("http://127.0.0.1:4040/api/tunnels");
      const json = await res.json();
      const tunnel = json.tunnels.find((t) => t.public_url && t.public_url.startsWith("https"));
      if (tunnel) return tunnel.public_url;
    } catch (e) {
      // ngrok not up yet
    }
    await sleep(1000);
  }
  return null;
}

async function setupWebhook() {
  console.log("[telegram] Waiting for ngrok tunnel...");
  const publicUrl = await getNgrokUrl();
  
  if (!publicUrl) {
    console.error("[telegram] Could not find ngrok URL after 30 seconds.");
    return;
  }

  const webhookUrl = `${publicUrl}/api/webhooks/telegram`;
  console.log(`[telegram] Found tunnel! Setting webhook to: ${webhookUrl}`);

  const url = `https://api.telegram.org/bot${TOKEN}/setWebhook`;
  
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        url: webhookUrl,
        secret_token: SECRET,
        drop_pending_updates: true
      })
    });
    
    const json = await res.json();
    if (json.ok) {
      console.log("[telegram] ✅ Webhook set successfully!");
    } else {
      console.error("[telegram] ❌ Failed to set webhook:", json);
    }
  } catch (error) {
    console.error("[telegram] ❌ Request failed:", error);
  }
}

setupWebhook().then(() => {
  // Keep the process alive so concurrently's -k flag doesn't kill Next.js and ngrok
  setInterval(() => {}, 1000 * 60 * 60);
});
