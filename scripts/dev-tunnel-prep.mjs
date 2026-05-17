/**
 * Runs before `npm run dev` (package.json "predev").
 * Stops duplicate ngrok (ERR_NGROK_334) and frees port 3000 (stale Next.js).
 */
import { spawnSync } from "node:child_process";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const killPort = require("kill-port");

if (process.platform === "win32") {
  spawnSync("taskkill", ["/F", "/IM", "ngrok.exe"], { stdio: "ignore", shell: true });
} else {
  spawnSync("sh", ["-c", "pkill ngrok 2>/dev/null || true"], { stdio: "ignore" });
}

try {
  await killPort(3000);
} catch {
  /* no listener on 3000 — ok */
}

console.log("[predev] Cleared ngrok + port 3000 (if anything was running).");
