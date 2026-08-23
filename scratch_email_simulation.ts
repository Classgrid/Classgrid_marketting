import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { processIncomingEmail } from "./lib/email-ai/email-processor";
import type { ZohoEmailContent } from "./lib/email-ai/zoho-mail";

async function runSimulation() {
  console.log("🚀 Starting Email AI Simulation...");

  const mockEmail: ZohoEmailContent = {
    messageId: `mock-${Date.now()}`,
    folderId: "mock-folder",
    threadId: `mock-thread-${Date.now()}`,
    subject: "Re: Inquiry Regarding ClassGrid ERP for Greenwood High School — A Few Follow-Up Questions",
    sender: "Shivam Hande <nikhilsubsun123@gmail.com>",
    senderName: "Shivam Hande",
    senderEmail: "nikhilsubsun123@gmail.com",
    textContent: `Hi Classgrid Team,

Thank you for the detailed response — this is helpful context. Before we book a demo, a few things would help us evaluate ClassGrid properly:

1. Pricing: Could you share even an approximate per-student or per-year range for a school our size? "Customized" is hard to plan around without a ballpark figure.
2. Implementation timeline: Roughly how many weeks from signing to go-live, including data migration?
3. Parent communication: This wasn't covered in your last note — what channels are available (SMS, app, email), and does the Parent App work well on basic Android phones?
4. References: We'd still like to speak with two or three similar-sized schools already using Classgrid, or see relevant case studies.

Once we have these, we'll be glad to schedule a demo.

Thanks again,
Shivam Hande
Principal, Greenwood High School`,
    htmlContent: `<p>Hi Classgrid Team,</p><p>Thank you for the detailed response — this is helpful context. Before we book a demo, a few things would help us evaluate ClassGrid properly:</p><ol><li>Pricing: Could you share even an approximate per-student or per-year range for a school our size? "Customized" is hard to plan around without a ballpark figure.</li><li>Implementation timeline: Roughly how many weeks from signing to go-live, including data migration?</li><li>Parent communication: This wasn't covered in your last note — what channels are available (SMS, app, email), and does the Parent App work well on basic Android phones?</li><li>References: We'd still like to speak with two or three similar-sized schools already using Classgrid, or see relevant case studies.</li></ol><p>Once we have these, we'll be glad to schedule a demo.</p><p>Thanks again,<br/>Shivam Hande<br/>Principal, Greenwood High School</p>`,
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
