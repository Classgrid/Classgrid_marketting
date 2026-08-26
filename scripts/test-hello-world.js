// Quick test: Send hello_world template to Nikhil's phone
require("dotenv").config({ path: ".env.local" });

const GRAPH_VERSION = process.env.WHATSAPP_GRAPH_API_VERSION || "v22.0";
const PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID || process.env.WHATSAPP_PHONE_ID;
const ACCESS_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN;

async function sendHelloWorld() {
  const phone = "918623947038";
  
  const url = `https://graph.facebook.com/${GRAPH_VERSION}/${PHONE_NUMBER_ID}/messages`;
  
  const payload = {
    messaging_product: "whatsapp",
    to: phone,
    type: "template",
    template: {
      name: "hello_world",
      language: { code: "en_US" }
    },
  };

  console.log("📤 Sending hello_world template message...\n");

  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${ACCESS_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const json = await res.json();
  
  if (res.ok) {
    console.log("✅ SUCCESS! hello_world sent via WhatsApp!");
    console.log("Response:", JSON.stringify(json, null, 2));
  } else {
    console.error("❌ FAILED!");
    console.error("Status:", res.status);
    console.error("Error:", JSON.stringify(json, null, 2));
  }
}

sendHelloWorld().catch(console.error);
