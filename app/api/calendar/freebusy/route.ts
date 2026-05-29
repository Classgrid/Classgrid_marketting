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
    
    // Convert to exact YYYY-MM-DD in Asia/Kolkata
    const formatter = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kolkata', year: 'numeric', month: '2-digit', day: '2-digit' });
    const dateStr = formatter.format(selectedDate);

    // Create start and end of day exactly in IST
    const startOfDay = new Date(`${dateStr}T00:00:00+05:30`);
    const endOfDay = new Date(`${dateStr}T23:59:59+05:30`);

    // Block Weekends (Sun, Sat) in Asia/Kolkata
    const dayOfWeek = new Intl.DateTimeFormat('en-US', { timeZone: 'Asia/Kolkata', weekday: 'short' }).format(startOfDay);
    if (dayOfWeek === 'Sun' || dayOfWeek === 'Sat') {
      return NextResponse.json({ ok: true, availableSlots: [] });
    }

    // Default fallback times if Google sync fails
    const DEFAULT_SLOTS = ["1:00pm", "1:30pm", "2:00pm", "2:30pm", "3:00pm", "3:30pm", "4:00pm", "4:30pm", "5:00pm", "5:30pm", "6:00pm", "6:30pm", "7:00pm", "7:30pm", "8:00pm"];

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
    const startHour = 13; // 1:00 PM Start (13:00 IST)
    const endHour = 20;   // 8:00 PM End Hour (20:00 IST)
    const endMinute = 0;  // 8:00 PM is the last slot

    for (let h = startHour; h <= endHour; h++) {
      for (let m of [0, 30]) {
        if (h === endHour && m > endMinute) continue;

        // Create exact slot start time in IST
        const hh = h.toString().padStart(2, "0");
        const mm = m.toString().padStart(2, "0");
        const slotStart = new Date(`${dateStr}T${hh}:${mm}:00+05:30`);
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
    const DEFAULT_SLOTS = ["1:00pm", "1:30pm", "2:00pm", "2:30pm", "3:00pm", "3:30pm", "4:00pm", "4:30pm", "5:00pm", "5:30pm", "6:00pm", "6:30pm", "7:00pm", "7:30pm", "8:00pm"];
    return NextResponse.json({ ok: true, availableSlots: DEFAULT_SLOTS });
  }
}
