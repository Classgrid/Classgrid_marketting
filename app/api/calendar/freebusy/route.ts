import { NextResponse } from "next/server";
import { google } from "googleapis";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const dateParam = searchParams.get("date");
  
  if (!dateParam) {
    return NextResponse.json({ ok: false, message: "Date is required" }, { status: 400 });
  }

  try {
    const selectedDate = new Date(dateParam);
    
    // Block Weekends (0 = Sunday, 6 = Saturday)
    if (selectedDate.getDay() === 0 || selectedDate.getDay() === 6) {
      return NextResponse.json({ ok: true, availableSlots: [] });
    }

    const startOfDay = new Date(selectedDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(selectedDate);
    endOfDay.setHours(23, 59, 59, 999);

    // Default fallback times if Google sync fails
    const DEFAULT_SLOTS = ["11:00am", "11:30am", "12:00pm", "12:30pm", "1:00pm", "1:30pm", "2:00pm", "2:30pm", "3:00pm", "3:30pm"];

    if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET || !process.env.ADMIN_GOOGLE_REFRESH_TOKEN) {
      console.warn("[freebusy] Google credentials missing. Using default static slots.");
      return NextResponse.json({ ok: true, availableSlots: DEFAULT_SLOTS });
    }

    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET
    );
    oauth2Client.setCredentials({ refresh_token: process.env.ADMIN_GOOGLE_REFRESH_TOKEN });

    const calendar = google.calendar({ version: "v3", auth: oauth2Client });

    // Ask Google when you are busy today
    const freeBusyRes = await calendar.freebusy.query({
      requestBody: {
        timeMin: startOfDay.toISOString(),
        timeMax: endOfDay.toISOString(),
        timeZone: "Asia/Kolkata",
        items: [{ id: "primary" }]
      }
    });

    const busySlots = freeBusyRes.data.calendars?.primary?.busy || [];

    const availableSlots: string[] = [];
    const startHour = 11; // 11:00 AM Start
    const endHour = 15;   // 3:00 PM End Hour
    const endMinute = 30; // 3:30 PM is the last slot

    for (let h = startHour; h <= endHour; h++) {
      for (let m of [0, 30]) {
        if (h === endHour && m > endMinute) continue;

        const slotStart = new Date(selectedDate);
        slotStart.setHours(h, m, 0, 0);
        const slotEnd = new Date(slotStart.getTime() + 30 * 60000); // 30 min duration

        // Hide past times if the date is today
        if (slotStart < new Date()) continue;

        // Check if this slot overlaps with any busy event on your calendar
        let isBusy = false;
        for (const busy of busySlots) {
          const busyStart = new Date(busy.start!);
          const busyEnd = new Date(busy.end!);

          // If the slot falls inside a busy time
          if (slotStart < busyEnd && slotEnd > busyStart) {
            isBusy = true;
            break;
          }
        }

        if (!isBusy) {
          // If free, add to list!
          const timeString = slotStart.toLocaleString("en-IN", {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
            timeZone: "Asia/Kolkata"
          }).replace(/\s/g, '').toLowerCase();
          availableSlots.push(timeString);
        }
      }
    }

    return NextResponse.json({ ok: true, availableSlots });
  } catch (error) {
    console.error("[freebusy] Error fetching availability:", error);
    // Safe fallback so the website doesn't break
    const DEFAULT_SLOTS = ["11:00am", "11:30am", "12:00pm", "12:30pm", "1:00pm", "1:30pm", "2:00pm", "2:30pm", "3:00pm", "3:30pm"];
    return NextResponse.json({ ok: true, availableSlots: DEFAULT_SLOTS });
  }
}
