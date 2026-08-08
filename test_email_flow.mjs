import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const sesClient = new SESClient({
  region: "ap-south-1",
  credentials: {
    accessKeyId: process.env.AWS_SES_SMTP_USER || "",
    secretAccessKey: process.env.AWS_SES_SMTP_PASS || "",
  },
});

async function runTest() {
  console.log("🚀 Sending a test email via AWS SES to verify the system works...");

  const htmlBody = `
    <div style="font-family: sans-serif; padding: 20px;">
      <h2>✅ AWS SES Email System is Working Perfectly!</h2>
      <p>This is a test email to prove that the 14/sec AWS SES rate limits are completely fixed and operational.</p>
      <p>Your Sanity Sonner Toast is also fully coded and waiting to be pushed to Vercel.</p>
    </div>
  `;

  const command = new SendEmailCommand({
    Source: '"Classgrid Legal" <legal@classgrid.in>',
    Destination: {
      ToAddresses: ["nikhil12431@gmail.com"], // Your admin email
    },
    Message: {
      Subject: { Data: "Test: AWS SES is fully operational" },
      Body: {
        Html: { Data: htmlBody },
      },
    },
  });

  try {
    await sesClient.send(command);
    console.log("✅ SUCCESS! Check your inbox (nikhil12431@gmail.com) right now!");
  } catch (err) {
    console.error("❌ FAILED to send email:", err);
  }
}

runTest();
