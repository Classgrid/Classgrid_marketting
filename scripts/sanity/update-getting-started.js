require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2023-05-03',
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN,
});

const DOC_ID = '3rpjI1abmKeJaJDXiS4TYs';

async function main() {
  // 1. Fetch current doc
  const doc = await client.fetch(`*[_id == "${DOC_ID}"][0]`);
  if (!doc) {
    console.error('Document not found!');
    return;
  }

  let body = doc.markdownBody;

  // ===== UPDATE Step 5 =====
  const oldStep5 = `### Step 5: Schedule Your Meeting

After email verification, the page transitions into a calendar scheduling view with three panels:

**Left Panel** — Shows the meeting details: a 30-minute, one-on-one session via Google Meet in the Asia/Kolkata timezone.

**Center Panel** — A full interactive calendar where you can select any available date within the next 60 days. Past dates and dates beyond the 60-day window are disabled. Use the left and right arrows to navigate between months.

**Right Panel** — Once you select a date, available 30-minute time slots appear on the right. Click a time slot to highlight it, then click **Confirm** to lock in your meeting.`;

  const newStep5 = `### Step 5: Schedule Your Meeting

After email verification, the page transitions into a calendar scheduling view with three panels:

**Left Panel** — Shows the meeting details: a 30-minute, one-on-one session via **Google Meet** or **Zoom** in the Asia/Kolkata timezone. You can choose your preferred meeting platform before selecting a date.

**Center Panel** — A full interactive calendar where you can select any available date within the next 60 days. Past dates and dates beyond the 60-day window are disabled. Use the left and right arrows to navigate between months.

**Right Panel** — Once you select a date, available 30-minute time slots appear on the right. Click a time slot to highlight it, then click **Confirm** to lock in your meeting.`;

  // ===== UPDATE Step 6 =====
  const oldStep6 = `### Step 6: Confirmation and Next Steps

After confirming, three things happen:

1. **A Google Calendar event** is created automatically on the Classgrid team calendar with a unique Google Meet link. The meeting is titled with your institution name.
2. **A confirmation email** is sent to your email address containing the scheduled date, time, and the Google Meet link.
3. **A Classgrid Talk prompt** appears on screen, inviting you to ask pre-demo questions (see below).

You can copy the Google Meet link from the confirmation page and save it for your records.`;

  const newStep6 = `### Step 6: Confirmation and Next Steps

After confirming, three things happen:

1. **A calendar event** is created automatically on the Classgrid team calendar with a unique **Google Meet** or **Zoom** meeting link (depending on your chosen platform). The meeting is titled with your institution name.
2. **A confirmation email** is sent to your email address containing the scheduled date, time, and the meeting link (Google Meet or Zoom).
3. **A Classgrid Talk prompt** appears on screen, inviting you to ask pre-demo questions (see below).

You can copy the Google Meet or Zoom link from the confirmation page and save it for your records.`;

  // ===== UPDATE "What Happens During the Demo?" section =====
  const oldDemoSection = `During your 30-minute Google Meet session, a Classgrid product specialist will:`;
  const newDemoSection = `During your 30-minute Google Meet or Zoom session, a Classgrid product specialist will:`;

  // Apply replacements
  body = body.replace(oldStep5, newStep5);
  body = body.replace(oldStep6, newStep6);
  body = body.replace(oldDemoSection, newDemoSection);

  // Update the lastUpdatedAt date to today (17 July 2026)
  const today = new Date().toISOString();

  // Patch the document
  const result = await client
    .patch(DOC_ID)
    .set({
      markdownBody: body,
      lastUpdatedAt: today,
    })
    .commit();

  console.log('✅ Article updated successfully!');
  console.log('Document ID:', result._id);
  console.log('Updated at:', result._updatedAt);
  
  // Verify the changes
  const updated = await client.fetch(`*[_id == "${DOC_ID}"][0]`);
  
  // Check Step 5 update
  if (updated.markdownBody.includes('**Google Meet** or **Zoom**')) {
    console.log('✅ Step 5: Zoom Meet added successfully');
  } else {
    console.log('❌ Step 5: Zoom Meet NOT found - check replacement');
  }

  // Check Step 6 update
  if (updated.markdownBody.includes('Google Meet or Zoom link from the confirmation page')) {
    console.log('✅ Step 6: Zoom Meet added successfully');
  } else {
    console.log('❌ Step 6: Zoom Meet NOT found - check replacement');
  }

  // Check Demo section update
  if (updated.markdownBody.includes('Google Meet or Zoom session')) {
    console.log('✅ Demo section: Zoom Meet added successfully');
  } else {
    console.log('❌ Demo section: Zoom Meet NOT found - check replacement');
  }

  console.log('\nUpdated lastUpdatedAt to:', updated.lastUpdatedAt);
}

main().catch(console.error);
