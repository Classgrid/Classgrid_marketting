import { google } from "googleapis";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" }); // Load from .env.local

async function addTestEvent() {
  console.log("Checking credentials and connecting to Google Calendar...");
  
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.ADMIN_GOOGLE_REFRESH_TOKEN) {
    console.error("❌ Missing Google credentials in .env file!");
    return;
  }

  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET
  );
  oauth2Client.setCredentials({ refresh_token: process.env.ADMIN_GOOGLE_REFRESH_TOKEN });

  const calendar = google.calendar({ version: "v3", auth: oauth2Client });

  // Let's create an event for Wednesday, May 27 from 11:00 AM to 3:00 PM IST
  const targetDate = new Date("2026-05-27T00:00:00+05:30"); // May 27, 2026
  
  const start = new Date(targetDate);
  start.setHours(11, 0, 0, 0); // 11:00 AM
  const end = new Date(targetDate);
  end.setHours(15, 0, 0, 0);   // 3:00 PM

  const event = {
    summary: "Test: Fake Dentist Appointment (Classgrid)",
    description: "This is a test event created by Antigravity to block out time on the demo calendar.",
    start: {
      dateTime: start.toISOString(),
      timeZone: "Asia/Kolkata",
    },
    end: {
      dateTime: end.toISOString(),
      timeZone: "Asia/Kolkata",
    },
  };

  try {
    const response = await calendar.events.insert({
      calendarId: "primary",
      requestBody: event,
    });
    console.log("✅ Success! Event created on your Google Calendar.");
    console.log(`📅 Blocked Time: 2:00 PM - 3:00 PM IST`);
    console.log(`🔗 Calendar Link: ${response.data.htmlLink}`);
    console.log("\n👉 Now go to your Classgrid website, select today's date, and watch how the 2:00 PM and 2:30 PM slots have MAGICALLY DISAPPEARED! ✨");
  } catch (error) {
    console.error("❌ Failed to create event:", error);
  }
}

addTestEvent();
