import { createClient } from "@sanity/client";
import { readFileSync } from "fs";
import { basename } from "path";

const client = createClient({
  projectId: "a4wk6kp5",
  dataset: "production",
  apiVersion: "2026-03-30",
  token: "skl5fXWCsJGBUGFDt0UAafjCrBHRvIBcvKu8AE3e9oE54n2Cvkm9uhb7qwQLCZc4xyMhNaUVY60LoGjS9Jx5Xti2vP6DhIpeRXDvn0g8MRenQB4dboyWPSZsPIhuOEekG0qHAhXfcCt1ZBjSRqNXJE0S7R2ksWpi4whznisrNhvJlg4Ajk7M",
  useCdn: false,
});

// Upload an image file to Sanity and return the asset reference
async function uploadImage(filePath, label) {
  const buffer = readFileSync(filePath);
  const fileName = basename(filePath);
  console.log(`Uploading ${label}: ${fileName}...`);
  const asset = await client.assets.upload("image", buffer, { filename: fileName });
  console.log(`  ✓ Uploaded → ${asset._id}`);
  return { _type: "image", asset: { _type: "reference", _ref: asset._id } };
}

// Helper to create a text block
function textBlock(text, style = "normal", markDefs = [], children = null) {
  return {
    _type: "block",
    _key: Math.random().toString(36).slice(2, 10),
    style,
    markDefs,
    children: children || [{ _type: "span", _key: Math.random().toString(36).slice(2, 10), text, marks: [] }],
  };
}

// Helper to create a link text block
function linkTextBlock(beforeText, linkText, linkUrl, afterText) {
  const linkKey = Math.random().toString(36).slice(2, 10);
  return {
    _type: "block",
    _key: Math.random().toString(36).slice(2, 10),
    style: "normal",
    markDefs: [{ _type: "link", _key: linkKey, href: linkUrl }],
    children: [
      { _type: "span", _key: Math.random().toString(36).slice(2, 10), text: beforeText, marks: [] },
      { _type: "span", _key: Math.random().toString(36).slice(2, 10), text: linkText, marks: [linkKey] },
      { _type: "span", _key: Math.random().toString(36).slice(2, 10), text: afterText, marks: [] },
    ],
  };
}

// Helper for bold text span
function boldSpan(text) {
  return { _type: "span", _key: Math.random().toString(36).slice(2, 10), text, marks: ["strong"] };
}
function plainSpan(text) {
  return { _type: "span", _key: Math.random().toString(36).slice(2, 10), text, marks: [] };
}

async function main() {
  console.log("Creating blog post...\n");

  // 1. Upload images
  const coverImage = await uploadImage(
    "C:\\Users\\nikhi\\.gemini\\antigravity\\brain\\5aa55d4c-962c-47dd-8b94-9f5843b5e56a\\blog_cover_erp_1777983157554.png",
    "Cover Image"
  );
  const inlineImage = await uploadImage(
    "C:\\Users\\nikhi\\.gemini\\antigravity\\brain\\5aa55d4c-962c-47dd-8b94-9f5843b5e56a\\blog_inline_dashboard_1777983183318.png",
    "Inline Image"
  );

  // 2. Build the blog body (rich portable text)
  const body = [
    // === PARAGRAPH 1: Introduction ===
    textBlock("Why Every School Needs an ERP System in 2026", "h2"),

    textBlock(
      "The education sector has undergone a seismic transformation over the last decade. What was once managed through paper registers, manual attendance sheets, and fragmented communication channels has now moved to centralized digital platforms. An Enterprise Resource Planning (ERP) system is no longer a luxury reserved for large corporations or elite institutions. In 2026, it has become a critical necessity for schools, colleges, coaching centres, and universities of all sizes. The question is no longer whether your institution should adopt an ERP, but rather how quickly you can implement one before falling behind your peers."
    ),

    textBlock(
      "The traditional approach to school management is riddled with inefficiencies. Teachers spend valuable classroom hours on administrative tasks like taking attendance manually, compiling exam results by hand, and chasing parents for fee payments. Office staff drown in spreadsheets, and principals lack real-time visibility into what is happening across departments. Students and parents, who have grown accustomed to instant digital experiences in every other aspect of their lives, are frustrated by the slow, opaque communication from their educational institutions."
    ),

    textBlock(
      "This is precisely where an integrated school ERP system changes everything. By unifying all operations into a single platform, from admissions and attendance to examinations and finance, an ERP eliminates redundancy, reduces human error, and frees up educators to focus on what they do best: teaching."
    ),

    // === PARAGRAPH 2: Core Benefits with linked text ===
    textBlock("The Core Benefits of a Modern School ERP", "h2"),

    linkTextBlock(
      "A comprehensive ERP like ",
      "ClassGrid",
      "https://classgrid.in",
      " addresses every operational challenge a school faces. Let us break down the major benefits that make ERP adoption a non-negotiable priority in 2026."
    ),

    textBlock("Automated Attendance Tracking", "h3"),
    textBlock(
      "Manual attendance is one of the biggest time sinks in any educational institution. A teacher taking attendance for a class of 60 students spends roughly 5 to 7 minutes at the start of every period. Multiply that across 6 periods a day, 30 teachers, and 200 working days, and you are looking at thousands of lost teaching hours every academic year. With an ERP-powered biometric or app-based attendance system, this entire process is reduced to seconds. Attendance data flows directly into dashboards, generating real-time reports for administrators and automated notifications for parents when their child is absent."
    ),

    textBlock("Streamlined Fee Management", "h3"),
    textBlock(
      "Fee collection in schools has traditionally been a painful process involving long queues, cash handling, manual receipt generation, and endless reconciliation. A school ERP automates the entire fee lifecycle. Parents receive digital invoices, pay online through multiple gateways, and get instant receipts. The system automatically tracks pending dues, generates reminders, and produces financial reports that the accounts team can rely on without cross-checking every entry. Late fee rules, sibling discounts, scholarship adjustments, and installment plans are all handled by the system with zero manual intervention."
    ),

    textBlock("Examination and Result Management", "h3"),
    textBlock(
      "Creating exam timetables, assigning invigilators, collecting marks from dozens of teachers, calculating grades, generating report cards, and distributing them to parents is a process that typically consumes weeks of administrative effort every term. An ERP compresses this into days. Teachers enter marks directly into the system, which automatically applies grading rules, calculates averages and ranks, and generates beautifully formatted digital report cards that parents can access through their mobile app. The entire process is transparent, auditable, and error-free."
    ),

    // Inline image
    {
      _type: "image",
      _key: Math.random().toString(36).slice(2, 10),
      asset: inlineImage.asset,
      alt: "A modern school ERP dashboard showing attendance, fees, and exam analytics",
      caption: "A unified ERP dashboard gives administrators complete visibility across all departments.",
    },

    // === TABLE ===
    textBlock("ERP vs Traditional School Management: A Comparison", "h2"),

    textBlock(
      "The following table illustrates the stark differences between managing a school with traditional methods versus using a modern ERP platform:"
    ),

    {
      _type: "table",
      _key: Math.random().toString(36).slice(2, 10),
      rows: [
        { _type: "tableRow", _key: Math.random().toString(36).slice(2, 10), cells: ["Feature", "Traditional Method", "With School ERP"] },
        { _type: "tableRow", _key: Math.random().toString(36).slice(2, 10), cells: ["Attendance Tracking", "Manual roll call (5-7 min/class)", "Biometric/App (under 10 seconds)"] },
        { _type: "tableRow", _key: Math.random().toString(36).slice(2, 10), cells: ["Fee Collection", "Cash/cheque at counter", "Online payment with auto-receipts"] },
        { _type: "tableRow", _key: Math.random().toString(36).slice(2, 10), cells: ["Exam Results", "Manual calculation, weeks of work", "Auto-graded, instant report cards"] },
        { _type: "tableRow", _key: Math.random().toString(36).slice(2, 10), cells: ["Parent Communication", "Paper circulars, WhatsApp groups", "In-app notifications, real-time updates"] },
        { _type: "tableRow", _key: Math.random().toString(36).slice(2, 10), cells: ["Timetable Management", "Manual Excel sheets", "AI-powered auto-scheduling"] },
        { _type: "tableRow", _key: Math.random().toString(36).slice(2, 10), cells: ["Data Security", "Paper files, prone to loss", "Cloud-encrypted, role-based access"] },
        { _type: "tableRow", _key: Math.random().toString(36).slice(2, 10), cells: ["Staff Performance", "Subjective reviews", "Data-driven analytics and KPIs"] },
        { _type: "tableRow", _key: Math.random().toString(36).slice(2, 10), cells: ["Admission Process", "Walk-in only, paper forms", "Online applications, merit lists, auto-enrollment"] },
      ],
    },

    textBlock(
      "As the table clearly demonstrates, every single aspect of school management becomes faster, more accurate, and more transparent with an ERP system. The institutions that continue relying on outdated manual methods are not just wasting resources, they are actively falling behind."
    ),

    // === PARAGRAPH 3: Future and Conclusion ===
    textBlock("The Future: AI-Powered Education Operations", "h2"),

    textBlock(
      "The next frontier for school ERPs is artificial intelligence. In 2026, leading platforms have already begun integrating AI capabilities that go far beyond simple automation. Predictive analytics can identify students at risk of dropping out based on attendance patterns and academic performance, allowing counselors to intervene proactively. Natural language processing powers intelligent chatbots that can answer parent queries about fee balances, exam schedules, and school policies around the clock without requiring any staff involvement."
    ),

    textBlock(
      "AI-driven timetable generation considers teacher preferences, room availability, subject distribution rules, and even optimal learning times to create schedules that would take a human coordinator days to produce. Smart exam evaluation tools can assist teachers in grading subjective answers, providing consistency and reducing the burden on faculty during peak examination periods."
    ),

    linkTextBlock(
      "Platforms like ",
      "ClassGrid's AI-powered ERP",
      "https://classgrid.in/solutions/erp",
      " are leading this revolution by embedding AI directly into everyday school workflows. From automated report generation to intelligent admission screening, the technology is designed to augment human decision-making rather than replace it."
    ),

    textBlock("Making the Transition: What Schools Should Consider", "h3"),

    textBlock(
      "Adopting an ERP is not merely a technology purchase. It is an organizational transformation. Schools need to consider factors like data migration from existing systems, training for teachers and administrative staff, customization for their specific workflows, and ongoing support from the vendor. The best ERP providers offer dedicated onboarding teams, comprehensive training programs, and 24/7 support to ensure a smooth transition."
    ),

    textBlock(
      "Cost is another common concern, but the return on investment is typically realized within the first academic year itself. The hours saved on manual work, the reduction in errors, the improvement in fee collection rates, and the enhanced parent satisfaction all contribute to measurable operational and financial gains. Many institutions report saving 30 to 40 percent of their administrative costs within 12 months of ERP adoption."
    ),

    // Blockquote
    {
      _type: "block",
      _key: Math.random().toString(36).slice(2, 10),
      style: "blockquote",
      markDefs: [],
      children: [
        plainSpan("An ERP is not just software. It is the backbone of a modern educational institution. Schools that embrace it today will define the standard of excellence for tomorrow."),
      ],
    },

    textBlock("Conclusion", "h2"),

    textBlock(
      "The evidence is overwhelming: schools that adopt modern ERP systems outperform their peers on every measurable metric, from operational efficiency and financial management to parent satisfaction and student outcomes. In 2026, with technology more accessible and affordable than ever, there is simply no justification for continuing with fragmented, manual processes that waste time, money, and human potential."
    ),

    textBlock(
      "Whether you run a small coaching centre with 200 students or a large university with 20,000, the benefits of an integrated ERP platform are universal. The time to act is now. Your students, parents, teachers, and administrators deserve a system that works as hard as they do."
    ),

    linkTextBlock(
      "Ready to transform your institution? ",
      "Book a free demo with ClassGrid today",
      "https://classgrid.in/pricing",
      " and see the difference a modern ERP can make."
    ),
  ];

  // 3. Create the blog post document
  const post = {
    _id: "post-why-every-school-needs-erp-2026",
    _type: "post",
    title: {
      _type: "localeString",
      en: "Why Every School Needs an ERP System in 2026",
    },
    slug: { _type: "slug", current: "why-every-school-needs-an-erp-system-in-2026" },
    excerpt: {
      _type: "localeText",
      en: "Manual processes are holding schools back. Discover why an integrated ERP system is the single most impactful technology investment any educational institution can make in 2026, and how platforms like ClassGrid are leading the transformation.",
    },
    coverImage,
    publishedAt: "2026-05-05T12:00:00.000Z",
    category: "ERP",
    author: "Komal Shinde",
    body: {
      en: body,
    },
    references: [
      { _key: Math.random().toString(36).slice(2, 10), title: "ClassGrid Official Website", url: "https://classgrid.in" },
      { _key: Math.random().toString(36).slice(2, 10), title: "ClassGrid ERP Solutions", url: "https://classgrid.in/solutions/erp" },
      { _key: Math.random().toString(36).slice(2, 10), title: "Book a Demo", url: "https://classgrid.in/pricing" },
    ],
  };

  await client.createOrReplace(post);
  console.log("\n✅ Blog post created successfully!");
  console.log(`   Title: ${post.title.en}`);
  console.log(`   Slug: ${post.slug.current}`);
  console.log(`   Author: ${post.author}`);
  console.log(`   Date: ${post.publishedAt}`);
}

main().catch((err) => {
  console.error("Failed to create blog post:", err);
  process.exit(1);
});
