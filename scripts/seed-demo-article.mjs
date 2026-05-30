import { createClient } from '@sanity/client'

const client = createClient({
  projectId: 'a4wk6kp5',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2024-05-30',
  token: 'skl5fXWCsJGBUGFDt0UAafjCrBHRvIBcvKu8AE3e9oE54n2Cvkm9uhb7qwQLCZc4xyMhNaUVY60LoGjS9Jx5Xti2vP6DhIpeRXDvn0g8MRenQB4dboyWPSZsPIhuOEekG0qHAhXfcCt1ZBjSRqNXJE0S7R2ksWpi4whznisrNhvJlg4Ajk7M'
})

let k = 0
const key = () => `k${++k}`
const block = (text) => ({ _type: 'block', _key: key(), style: 'normal', markDefs: [], children: [{ _type: 'span', _key: key(), text, marks: [] }] })
const h2 = (text) => ({ _type: 'block', _key: key(), style: 'h2', markDefs: [], children: [{ _type: 'span', _key: key(), text, marks: [] }] })
const h3 = (text) => ({ _type: 'block', _key: key(), style: 'h3', markDefs: [], children: [{ _type: 'span', _key: key(), text, marks: [] }] })

const ARTICLE_ID = '3rpjI1abmKeJaJDXiS4TYs'

const content = [
  h2('Getting Started with Classgrid'),
  block('Welcome to Classgrid. This guide will walk you through everything you need to know when you are getting started — from booking your first demo, to understanding the onboarding process, and learning about Classgrid Talk.'),

  h2('How to Book a Demo'),
  block('Booking a live demo is the fastest way to see Classgrid in action. Our team personally walks you through the platform, answers every question you have, and shows you exactly how Classgrid fits your institution. The entire process takes just a few minutes to set up. Here is exactly how it works, from start to finish.'),

  h3('Step 1 — Fill in Your Details'),
  block('Go to classgrid.in and click the "Book a Demo" button in the top navigation bar. A form will appear asking you to fill in the following details:'),
  block('Institution Name — Enter the full name of your school, college, or coaching institute.'),
  block('Your Name — Enter the name of the person requesting the demo. This is usually the Admin, Principal, or Owner.'),
  block('Email Address — Enter a valid email address. Your verification code and the final Google Meet link will be sent to this email, so make sure it is correct.'),
  block('Phone Number — Enter your WhatsApp-enabled phone number. Our team may use this to reach you if needed.'),
  block('State and City — Select the state and city where your institution is located.'),
  block('Your Role — Select your role at the institution. Options include Admin, Principal, Owner, IT Manager, and others.'),
  block('Message (optional) — If there is anything specific you want our team to focus on during the demo, mention it here. For example: "I want to see how the fee management module works" or "We have 5,000 students and want to know if Classgrid can handle that."'),
  block('Once all the details are filled in, click the "Request Demo" button to submit the form.'),

  h3('Step 2 — Email Verification'),
  block('After submitting the form, you will immediately receive a 6-digit verification code on the email address you provided. Open your inbox and look for an email from Classgrid. If you do not see it within a minute, check your spam or junk folder.'),
  block('Enter the 6-digit code on the next screen to verify your email address. This step confirms that the email you provided is valid and that the demo slot will be reserved for you specifically.'),
  block('If the code expires or you did not receive it, use the "Resend Code" button on the verification screen to get a new one.'),

  h3('Step 3 — Select Your Preferred Date and Time'),
  block('Once your email is verified, a calendar will appear on the screen. You can choose any available date within the next 60 days. Here is what you need to know about available slots:'),
  block('Demo slots are available Monday to Friday only. Weekends (Saturday and Sunday) are blocked and will not show as available.'),
  block('Available time slots are between 1:00 PM and 8:00 PM Indian Standard Time (IST).'),
  block('Each demo session is 30 minutes long.'),
  block('Slots that are already booked by other institutions will not appear. Only genuinely free slots are shown on the calendar. This is done using a live connection to our team\'s Google Calendar, so the availability is always accurate.'),
  block('Select a date, then pick a time slot from the options shown, and click Confirm.'),

  h3('Step 4 — Receive Your Google Meet Link'),
  block('Immediately after confirming your slot, a confirmation email will be sent to your email address. This email contains your Google Meet link — the video call link you will use to join the demo at the scheduled time.'),
  block('The confirmation page on the website will also show your booking summary, including the date, time, and meeting link.'),
  block('Save this email. If you want your colleagues to join the demo as well, simply forward this email to them and they can join using the same Google Meet link.'),

  h3('Step 5 — Join the Classgrid Demo Session'),
  block('On the day of your demo, open the Google Meet link a couple of minutes before the scheduled time. No special software is needed — Google Meet works directly in your browser.'),
  block('Our team will walk you through the Classgrid platform live. Here is what typically happens during the demo session:'),
  block('We start with a quick overview of the Classgrid dashboard so you can see the full picture of how the platform works.'),
  block('Then we go into the specific modules that are most relevant to your institution, such as Student Management, Fee Collection, Attendance, Academics, or Admissions.'),
  block('We show you how your staff, teachers, and students would each use Classgrid in their daily workflow.'),
  block('You can ask any questions at any point during the session. Our team will answer everything openly, including pricing, implementation timelines, and how we handle data migration from your current system.'),
  block('At the end, if you are interested in moving forward, we explain the onboarding process and next steps.'),
  block('The session is scheduled for 30 minutes, but our team is happy to continue if you have more questions.'),

  h2('What is Classgrid Talk?'),
  block('Classgrid Talk is the section of our website where real educators and administrators who already use Classgrid share their honest experiences with the platform. These are genuine testimonials from Principals, Academic Coordinators, Owners, and other staff at schools, colleges, and coaching institutes across India — not marketing copy, not made-up quotes.'),
  block('Each Classgrid Talk entry includes:'),
  block('The name and photo of the person giving the review.'),
  block('Their role at the institution and the institution\'s name.'),
  block('A written quote in their own words describing their experience with Classgrid.'),
  block('The logo of their institution.'),
  block('A star rating out of 5.'),
  block('Classgrid Talk entries are displayed as a carousel on the homepage and on relevant pages across the website. They are ordered by our team to highlight the most impactful stories first.'),

  h3('Why Does Classgrid Talk Exist?'),
  block('Before you make a decision to switch your institution to a new platform, you deserve to hear from people who have already made that decision. Classgrid Talk exists so that you can read what real Principals, Admins, and Owners think about the platform — in their own words, without any filter.'),
  block('Most software companies show you polished marketing material. Classgrid Talk shows you what it is actually like to run your institution on Classgrid, straight from the people who are doing it every day.'),

  h3('How Does Classgrid Talk Work?'),
  block('After an institution has been using Classgrid for some time, our team reaches out to them and asks if they would like to share their experience. If they agree, we collect their photo, institution logo, and a written quote from them.'),
  block('All entries are reviewed before being published. We do not alter or paraphrase what the person has written — the words are entirely their own.'),
  block('Classgrid Talk entries are then published on the website and appear in the testimonials carousel on the homepage.'),
  block('If you would like your institution to be featured in Classgrid Talk after you start using the platform, email us at support@classgrid.in and we will arrange it.'),

  h3('Need Help?'),
  block('If you have any trouble during the booking process, or if you want to speak to someone from our team directly, contact us at support@classgrid.in or use the Help button available on every page of the Classgrid website.'),
]

const faqs = [
  {
    _key: key(),
    question: 'Is the demo free?',
    answer: [block('Yes, completely free. There is no charge and no obligation to purchase after the demo.')]
  },
  {
    _key: key(),
    question: 'Can I reschedule my demo?',
    answer: [block('Yes. If something comes up and you cannot make it, email us at support@classgrid.in with your booking details and we will find a new slot for you.')]
  },
  {
    _key: key(),
    question: 'Can I invite my team to the demo?',
    answer: [block('Absolutely. Just forward the confirmation email with the Google Meet link to your colleagues and they can join.')]
  },
  {
    _key: key(),
    question: 'What should I prepare before the demo?',
    answer: [block('Nothing special. Just join on time. If you have specific questions in mind, write them down beforehand so you do not forget to ask.')]
  },
  {
    _key: key(),
    question: 'How many people from Classgrid will be on the call?',
    answer: [block('Usually one or two members of our team — someone from the product side and someone from the implementation side.')]
  },
  {
    _key: key(),
    question: 'What happens after the demo?',
    answer: [block('If you are interested, we will share a proposal. If you are not ready yet, there is no pressure. You can reach out again whenever you are ready.')]
  }
]

await client
  .patch(ARTICLE_ID)
  .set({
    content: { en: content },
    faqs: faqs
  })
  .commit()

console.log('✅ "Getting Started with Classgrid" updated with dedicated FAQs field!')
