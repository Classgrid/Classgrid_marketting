import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { processIncomingEmail } from "./lib/email-ai/email-processor";
import type { ZohoEmailContent } from "./lib/email-ai/zoho-mail";

async function runSimulation() {
  console.log("🚀 Starting Email AI Simulation...");

  // Mocking an incoming email from the user
  const mockEmail: ZohoEmailContent = {
    messageId: `mock-${Date.now()}`,
    folderId: "mock-folder",
    threadId: `mock-thread-${Date.now()}`,
    subject: "Question about Classgrid pricing",
    sender: "Nikhil Shinde <nikhilsubsun123@gmail.com>",
    senderName: "Nikhil Shinde",
    senderEmail: "nikhilsubsun123@gmail.com",
    textContent: "Hi team,\n\nI am interested in using Classgrid for my school. Can you tell me how much it costs for 500 students?\n\nThanks,\nNikhil",
    htmlContent: "<p>Hi team,</p><p>I am interested in using Classgrid for my school. Can you tell me how much it costs for 500 students?</p><p>Thanks,<br/>Nikhil</p>",
    receivedTime: Date.now(),
    headers: {
      "message-id": `<mock-${Date.now()}@mail.gmail.com>`
    }
  };

  try {
    console.log("Simulating incoming email to processIncomingEmail()...");
    const result = await processIncomingEmail(mockEmail);
    console.log("\n✅ SIMULATION FINISHED!");
    console.log("Result:", result);
    console.log("\nCheck your nikhilsubsun123@gmail.com inbox for the AI's reply!");
  } catch (err) {
    console.error("Simulation failed:", err);
  }
}

runSimulation();
