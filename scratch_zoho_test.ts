import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { getInboxFolderId, fetchUnreadEmails } from "./lib/email-ai/zoho-mail";

async function test() {
  try {
    console.log("Fetching Inbox Folder ID using REAL Account ID...");
    const folderId = await getInboxFolderId();
    console.log("✅ Success! Folder ID:", folderId);
    
    console.log("\nFetching unread emails...");
    const emails = await fetchUnreadEmails(5);
    console.log(`✅ Success! Found ${emails.length} unread emails.`);
  } catch (error) {
    console.error("TEST FAILED:", error);
  }
}

test();
