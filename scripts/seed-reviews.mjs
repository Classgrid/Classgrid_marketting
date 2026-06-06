/**
 * seed-reviews.mjs — Seed 55 realistic community reviews into Sanity CMS
 * Run: node scripts/seed-reviews.mjs
 * Clear: node scripts/seed-reviews.mjs --clear
 */

import { createClient } from "@sanity/client";

const client = createClient({
  projectId: "a4wk6kp5",
  dataset: "production",
  apiVersion: "2026-03-30",
  token: process.env.SANITY_API_WRITE_TOKEN || "skl5fXWCsJGBUGFDt0UAafjCrBHRvIBcvKu8AE3e9oE54n2Cvkm9uhb7qwQLCZc4xyMhNaUVY60LoGjS9Jx5Xti2vP6DhIpeRXDvn0g8MRenQB4dboyWPSZsPIhuOEekG0qHAhXfcCt1ZBjSRqNXJE0S7R2ksWpi4whznisrNhvJlg4Ajk7M",
  useCdn: false,
});

const MODE = process.argv.includes("--clear") ? "clear" : "seed";

// ── SEED DATA ──

const firstNames = [
  "Aarav", "Vivaan", "Aditya", "Vihaan", "Arjun", "Sai", "Reyansh", "Ayaan", "Krishna", "Ishaan",
  "Priya", "Ananya", "Diya", "Riya", "Aisha", "Neha", "Shreya", "Kavya", "Pooja", "Meera",
  "Rohan", "Karan", "Raj", "Amit", "Vikram", "Suresh", "Deepak", "Harsh", "Manish", "Rahul",
  "Sneha", "Divya", "Tanvi", "Simran", "Nisha", "Ankita", "Swati", "Ritika", "Pallavi", "Sakshi",
  "Yash", "Pranav", "Kunal", "Siddharth", "Dhruv", "Nitin", "Akash", "Gaurav", "Aman", "Varun",
  "Jaya", "Lakshmi", "Saanvi", "Kiara", "Zara",
];

const lastNames = [
  "Sharma", "Verma", "Patel", "Gupta", "Singh", "Kumar", "Joshi", "Reddy", "Nair", "Iyer",
  "Deshmukh", "Kulkarni", "Patil", "Shinde", "Jadhav", "More", "Pawar", "Chavan", "Kadam", "Salunkhe",
  "Mehta", "Shah", "Thakur", "Mishra", "Pandey", "Yadav", "Tiwari", "Dubey", "Srivastava", "Agarwal",
];

const institutions = [
  "MIT Pune", "VIT Pune", "COEP Technological University", "Symbiosis Institute",
  "Fergusson College", "SP College Pune", "PICT Pune", "Sinhgad College of Engineering",
  "AISSMS College of Engineering", "DY Patil College", "Savitribai Phule Pune University",
  "Bharati Vidyapeeth", "JSPM College", "Marathwada Mitra Mandal COE", "VIIT Pune",
  "Cummins College of Engineering", "RSCOE Pune", "PCCOE Pune", "RAIT Mumbai", "KJSCE Mumbai",
  "St. Xavier's College Mumbai", "IIT Bombay", "NIT Nagpur", "VNIT Nagpur",
  "Government College of Engineering Aurangabad", "Walchand College Sangli",
  "Dr. Babasaheb Ambedkar University", "Amravati University", "Shivaji University Kolhapur",
  "MGM College Nanded",
];

// All real Classgrid modules
const modules = [
  "Overall", "Attendance", "Digital Classroom", "Timetable", "Academic Planning",
  "Homework", "Notes Sharing", "Teacher Planner", "Subject Management", "Course Management",
  "Online Exams", "Exam Management", "Quiz Systems", "Results & Grades", "Internal Assessment",
  "CET/JEE/NEET", "Mock Tests", "AI Viva", "Test Series",
  "Admissions", "Fees", "Leave & Payroll", "Canteen", "Library", "Alumni",
  "AI Assistant", "Analytics", "Compliance", "Certificates", "Holidays",
  "ID Cards", "Events", "Feedback", "Website Builder",
];

const reviewTexts = [
  // Attendance
  "The attendance system replaced our old biometric machines completely. Real-time GPS tracking means we always know who's on campus. Parents get instant notifications the moment their child is marked present — that alone reduced truancy by 35%.",
  "Face-recognition attendance was something we never imagined at our institution. Students just walk in and it's done. Zero manual effort, zero errors. Our faculty save nearly 15 minutes per lecture now.",
  // Digital Classroom
  "The digital classroom transformed how we deliver education. Faculty can share study material, host live discussions, and post assignments all from one screen. Students access everything from their phones — no more WhatsApp group chaos.",
  "Class activity streams keep everything organized. Students see announcements, resources, and discussions in one timeline. It's like having a social media feed but purely academic.",
  // Timetable
  "Automated timetable generation solved our biggest annual headache. What used to take our admin team 2 weeks now takes 10 minutes. Zero clashes, perfect faculty allocation every time.",
  "Substitution management through the timetable module is brilliant. When a teacher is on leave, the system auto-suggests available faculty based on subject expertise.",
  // Exams
  "The online exam platform with anti-cheat proctoring gave us confidence to conduct semester exams remotely. Tab-switch detection and webcam monitoring make cheating practically impossible.",
  "Hall ticket generation, seating arrangement, and result publishing — all automated. Our exam cell went from a team of 8 to 3 people handling the same workload.",
  "AI-powered viva assessments have been a revelation. Students practice with the AI bot before their actual viva, and faculty use the analytics to identify weak areas in real-time.",
  // Fees
  "Fee collection went from a nightmare to a dream. Parents pay through UPI, cards, or net banking. Automated receipts, payment reminders, and late-fee calculations — all handled.",
  "The installment tracking system is so well designed. Parents can see their payment schedule, download receipts, and even request deadline extensions through the portal.",
  // Admissions
  "Admission management cut our enrollment cycle from 3 weeks to 4 days. Online applications, document verification, and merit list generation — completely paperless.",
  "The application form builder lets us create custom forms for different courses. We receive applications from 5 states and everything is organized in one dashboard.",
  // AI Assistant
  "The AI assistant is like having a 24/7 help desk. Students ask questions about their syllabus, fee status, and exam schedule — and get instant, accurate answers. Even at 2 AM.",
  "Faculty use the AI assistant to generate quiz questions from uploaded PDFs. It saves hours of manual work and the questions are surprisingly well-crafted.",
  // Analytics
  "Advanced analytics gave our management team something they never had — real-time institutional health metrics. Attendance trends, fee collection rates, exam performance — all in one dashboard.",
  "The department-level analytics helped us identify that students in one particular section were consistently underperforming. We reassigned teaching resources and saw a 20% improvement in one semester.",
  // Canteen
  "Digital canteen management eliminated cash handling entirely. Students top up their account, scan QR codes for meals, and the inventory auto-adjusts. Kitchen staff love it.",
  // Library
  "Our library had 15,000+ books with no digital catalog. Within a week, Classgrid had everything indexed with barcode scanning. Auto-reminders for overdue books saved us from awkward follow-ups.",
  // Leave & Payroll
  "Staff leave management used to be a register-based mess. Now HODs approve leaves from their phone, salary deductions calculate automatically, and payroll runs like clockwork.",
  // Certificates
  "Certificate generation is something we didn't know we needed until we had it. Bonafide certificates, transfer certificates, participation certificates — all generated in seconds with QR verification.",
  // Events
  "Our annual cultural fest used to require weeks of coordination across departments. With the events module, registration, scheduling, and attendance — everything was digital and smooth.",
  // ID Cards
  "Digital ID cards with QR codes replaced our old plastic cards. Students use them for library access, exam hall entry, and even canteen payments. One card for everything.",
  // Compliance
  "NAAC documentation preparation went from 3 months of panic to a structured, continuous process. Audit trail data exports in the required format saved our IQAC coordinator immense effort.",
  // Feedback
  "The anonymous feedback system gave students a real voice. Faculty ratings are structured, actionable, and management can track improvements semester over semester.",
  // Homework
  "The homework module changed how assignments work at our school. Teachers post assignments with deadlines, students upload submissions, and plagiarism checks run automatically. Parents can track completion rates.",
  // Notes Sharing
  "Cross-class note sharing eliminated the 'I missed the lecture' excuse. Toppers voluntarily share notes and the entire class benefits. It's peer learning at scale.",
  // Teacher Planner
  "The teacher planner keeps our faculty accountable. Lesson plans, syllabus completion tracking, and workload distribution — management finally has visibility into classroom execution.",
  // Quiz Systems
  "Interactive quizzes turned boring revision sessions into engaging competitions. Students compete for top scores and teachers get real-time analytics on which topics need more coverage.",
  // Mock Tests
  "Our coaching students take 3 mock tests per week through Classgrid. Instant scoring, rank prediction, and topic-wise analysis helped us improve our JEE selection rate by 28%.",
  // Test Series
  "Test series management handles 500+ students across 8 batches seamlessly. Scheduling, question paper rotation, and result analytics — all automated and conflict-free.",
  // Website Builder
  "The institution website builder let us launch a professional website in 2 days. Dynamic pages, admission landing pages, and automatic updates from the platform. No separate web team needed.",
  // Alumni
  "The alumni network module keeps our graduates connected. Placement tracking, event invitations, and mentorship matching — it's building a real community around our institution.",
  // Overall
  "We evaluated 5 ERP systems before choosing Classgrid. The UI/UX is on a completely different level. Every feature feels intentional, not like an afterthought bolted on.",
  "Classgrid replaced 4 different tools we were using. One platform for attendance, fees, exams, and communication — that's the dream come true for any institution.",
  "What impressed me most is how fast new features ship. Every month there's something new that actually solves a real problem. The team clearly listens to their users.",
  "We went 100% paperless in admin operations within 2 months of adopting Classgrid. Our annual paper cost dropped by ₹4 lakhs.",
  "The mobile app is clean and fast. Even non-tech-savvy faculty members picked it up in a day. The UX is intuitive enough that we didn't need training sessions.",
  "Performance is rock solid. We have 3000+ students and the platform never lags. Page loads are instant, even on older devices with poor connectivity.",
  "Cross-platform sync is flawless — I started editing a timetable on my laptop and finished on my phone without missing a beat.",
  "Classgrid support team responds within hours, not days. That alone sets them apart from every other ERP vendor we've worked with.",
  "Data security gave us confidence from day one. End-to-end encryption, role-based access, and regular backups — exactly what an educational institution needs.",
  "The onboarding experience was exceptional. The team conducted personalized training sessions for each department and followed up for 2 weeks after launch.",
  "Multi-branch operations are seamless. Our 3 campuses across Maharashtra now share one unified system with branch-level access controls.",
  "The notification system keeps everyone in the loop — exam schedules, fee reminders, announcements — all automated and customizable per department.",
  "Student satisfaction surveys showed an 85% approval rating after we switched to Classgrid. Faculty satisfaction was even higher at 91%.",
  "Real-time attendance alerts to parents have reduced truancy at our institution by 40%. Parents appreciate the transparency more than anything.",
  "Classgrid's competitive pricing makes enterprise-grade features accessible even for smaller colleges. We're a 600-student institution and we get the same features as universities.",
  "The role-based access control is perfectly designed. Admins, HODs, faculty, students, and parents — each role sees exactly what they need, nothing more.",
  "Bulk data upload saved us from manually entering 2000+ student records. CSV import with field mapping handled everything in under 30 minutes.",
  "The custom report builder generates exactly the reports our management needs for board meetings. No more spending days in Excel.",
  "Our placement cell uses Classgrid's analytics to prepare placement reports. Company-wise data, package trends, and department comparisons — all automated.",
  "Inter-department communication improved dramatically. Announcements reach the right people instantly without getting lost in email chains.",
  "Holiday management seems simple but it's critical. Academic calendar integration ensures timetables, fee deadlines, and exam schedules automatically adjust around holidays.",
];

const suggestions = [
  "Would love to see a Slack-style messaging feature for quick inter-department chats.",
  "Adding video conferencing natively would reduce our dependency on Zoom.",
  "A dedicated parent mobile app would make things even more convenient.",
  "More customization options for certificate templates would be helpful.",
  "Offline mode for attendance would help in areas with poor connectivity.",
  "Integration with Google Classroom would benefit institutions already using it.",
  "A student-to-student discussion forum within the platform could boost collaboration.",
  "Dark mode for the web dashboard would be great for late-night admin work.",
  "Support for regional languages (Marathi, Hindi) in the student interface would help rural institutions.",
  "Bulk SMS integration for urgent announcements to parents would be useful.",
  null, null, null, null, null, null, null, null, null, null, null, null, null, null, null,
];

const adminReplies = [
  "Thank you for your wonderful feedback! We're thrilled that Classgrid is making a real impact at your institution. 🙌",
  "We appreciate you sharing this! Our engineering team works hard to ensure reliability, and hearing this validates our approach.",
  "Your kind words mean a lot! We'll continue to ship features that solve real institutional problems.",
  "Thank you! The attendance module was one of our first features and we've refined it based on feedback from 50+ institutions.",
  "We're so glad the migration was smooth. Our onboarding team will be thrilled to hear this!",
  "Thank you for choosing Classgrid! The competitive pricing is intentional — we believe great EdTech should be accessible to every institution.",
  "This is exactly the feedback that motivates our team. Thank you for being part of the Classgrid community!",
  "We love hearing success stories like this. Your institution truly represents the vision we're building toward.",
  "Thanks for the kind words! Multi-branch support was a highly requested feature and we're glad it's working well for you.",
  "Really appreciate this review! Our AI team is constantly improving the assistant based on real institutional usage patterns.",
  null, null, null, null, null, null, null, null, null, null, null, null, null, null, null,
];

const categories = ["top", "top", "best", "best", "general", "general", "general", "general", "general"];

const positiveTags = [
  ["Easy to Use", "Time Saver"], ["Reliable", "Fast"], ["Great UI", "Modern"], ["Scalable", "Enterprise"],
  ["Excellent Support"], ["Innovative", "AI-Powered"], ["Secure", "Trusted"], ["Mobile Friendly"],
  ["Feature Rich", "Intuitive"], ["Professional", "Clean UI"], ["Paperless"], ["Cost Effective"],
  ["Real-time Tracking"], ["Parent Friendly"], ["Data-Driven"],
  null, null, null, null, null,
];

// ── Helpers ──
function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function randomDate(daysBack = 240) {
  const d = new Date();
  d.setDate(d.getDate() - Math.floor(Math.random() * daysBack));
  return d.toISOString();
}

// ── SEED ──
async function seed() {
  console.log("🌱 Seeding 55 reviews into Sanity...\n");
  const transaction = client.transaction();

  for (let i = 0; i < 55; i++) {
    const name = `${pick(firstNames)} ${pick(lastNames)}`;
    const rating = pick([5, 5, 5, 5, 5, 5, 4, 4, 4, 3]); // weighted 5s
    const isFeatured = i < 8; // first 8 featured for marquee

    const doc = {
      _type: "communityReview",
      _id: `seed-review-${String(i).padStart(3, "0")}`,
      name,
      institution: pick(institutions),
      rating,
      category: pick(categories),
      moduleName: pick(modules),
      reviewText: reviewTexts[i % reviewTexts.length],
      suggestion: pick(suggestions),
      positives: pick(positiveTags),
      adminReply: pick(adminReplies),
      isVerified: Math.random() > 0.2, // 80% verified
      isFeatured,
      status: "published",
      createdAt: randomDate(),
    };

    transaction.createOrReplace(doc);
    const modLabel = doc.moduleName === "Overall" ? "" : `[${doc.moduleName}]`;
    console.log(`  ✅ #${i + 1}  ${name} — ${rating}⭐  ${modLabel} ${isFeatured ? "📌" : ""}`);
  }

  await transaction.commit();
  console.log("\n🎉 Done! 55 reviews seeded. Visit /reviews to see them.");
}

// ── CLEAR ──
async function clear() {
  console.log("🗑️  Clearing all seeded reviews...\n");
  const ids = Array.from({ length: 55 }, (_, i) => `seed-review-${String(i).padStart(3, "0")}`);
  const transaction = client.transaction();
  ids.forEach((id) => transaction.delete(id));
  await transaction.commit();
  console.log("✅ All 55 seeded reviews deleted.");
}

// ── Run ──
if (MODE === "clear") {
  clear().catch(console.error);
} else {
  seed().catch(console.error);
}
