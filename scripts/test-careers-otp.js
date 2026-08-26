// Quick test: Send a careers OTP to Nikhil's phone
require("dotenv").config({ path: ".env.local" });

const GRAPH_VERSION = process.env.WHATSAPP_GRAPH_API_VERSION || "v22.0";
const PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID || process.env.WHATSAPP_PHONE_ID;
const ACCESS_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN;
const TEMPLATE_NAME = "careers_otp_2";

async function sendTestOtp() {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const phone = "918623947038"; // Nikhil's number
  
  console.log(`\n🔑 Generated OTP: ${otp}`);
  console.log(`📱 Sending to: +${phone}`);
  console.log(`📋 Template: ${TEMPLATE_NAME}`);
  console.log(`🔗 Phone Number ID: ${PHONE_NUMBER_ID}`);
  console.log(`🌐 Graph API: ${GRAPH_VERSION}\n`);

  const url = `https://graph.facebook.com/${GRAPH_VERSION}/${PHONE_NUMBER_ID}/messages`;
  
  const payload = {
    messaging_product: "whatsapp",
    to: phone,
    type: "template",
    template: {
      name: TEMPLATE_NAME,
      language: { code: "en" },
      components: [
        {
          type: "body",
          parameters: [{ type: "text", text: otp }],
        },
        {
          type: "button",
          sub_type: "url",
          index: "0",
          parameters: [{ type: "text", text: otp }],
        }
      ],
    },
  };

  console.log("📤 Sending WhatsApp template message...\n");

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
    console.log("✅ SUCCESS! OTP sent via WhatsApp!");
    console.log("Response:", JSON.stringify(json, null, 2));
  } else {
    console.error("❌ FAILED!");
    console.error("Status:", res.status);
    console.error("Error:", JSON.stringify(json, null, 2));
  }
}

sendTestOtp().catch(console.error);
