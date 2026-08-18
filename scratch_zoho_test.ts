import { fetchUnreadEmails } from "./lib/email-ai/zoho-mail.js";

async function run() {
  console.log("Fetching unread emails from Zoho...");
  try {
    const emails = await fetchUnreadEmails(10);
    console.log(`Found ${emails.length} unread emails.`);
    emails.forEach(e => {
      console.log(`- From: ${e.senderEmail} | Subject: ${e.subject}`);
    });
  } catch (err) {
    console.error("Error:", err);
  }
}

run();
