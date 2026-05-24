#!/usr/bin/env node

/**
 * Upload First Blog Post to Sanity
 * 
 * Usage:
 *   node scripts/upload-first-blog.mjs
 *   node scripts/upload-first-blog.mjs --dry-run
 * 
 * Requires SANITY_API_WRITE_TOKEN in .env.local
 */

import { createClient } from '@sanity/client';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

// ── Load env ──
function loadEnv(filePath) {
  if (!fs.existsSync(filePath)) return;
  const lines = fs.readFileSync(filePath, 'utf8').split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq <= 0) continue;
    const key = trimmed.slice(0, eq).trim();
    let val = trimmed.slice(eq + 1).trim();
    val = val.replace(/^["']|["']$/g, '');
    if (!(key in process.env)) process.env[key] = val;
  }
}

loadEnv(path.join(rootDir, '.env.local'));
loadEnv(path.join(rootDir, '.env'));

const PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'a4wk6kp5';
const DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
const TOKEN = process.env.SANITY_API_WRITE_TOKEN;
const DRY_RUN = process.argv.includes('--dry-run');

if (!TOKEN) {
  console.error('❌ Missing SANITY_API_WRITE_TOKEN in environment.');
  process.exit(1);
}

const client = createClient({
  projectId: PROJECT_ID,
  dataset: DATASET,
  apiVersion: '2026-05-01',
  token: TOKEN,
  useCdn: false,
});

// ── Portable Text helpers ──
let keyCounter = 0;
function nextKey(prefix = 'k') {
  return `${prefix}-${++keyCounter}`;
}

function span(text, marks = []) {
  return { _key: nextKey('s'), _type: 'span', text, marks };
}

function block(style, children, extra = {}) {
  return {
    _key: nextKey('b'),
    _type: 'block',
    style,
    markDefs: [],
    children: Array.isArray(children) ? children : [span(children)],
    ...extra,
  };
}

function heading(level, text) {
  return block(`h${level}`, [span(text)]);
}

function paragraph(text) {
  return block('normal', [span(text)]);
}

function boldParagraph(boldText, normalText) {
  return {
    _key: nextKey('b'),
    _type: 'block',
    style: 'normal',
    markDefs: [],
    children: [
      span(boldText, ['strong']),
      span(normalText),
    ],
  };
}

function bulletItem(text, level = 1) {
  return block('normal', [span(text)], { listItem: 'bullet', level });
}

function numberItem(text, level = 1) {
  return block('normal', [span(text)], { listItem: 'number', level });
}

// ── Blog Body ──
const blogBody = [
  heading(2, 'The Reality on the Ground'),

  paragraph('Walk into any school office in Pune, Nashik, or Nagpur during July — the peak admission season — and you will see the same scene that has played out for decades. A line of parents waiting with photocopies. A clerk typing student names into a dusty register. A principal on the phone, trying to confirm how many seats are left in Class 8. The fee receipt is handwritten. The attendance is marked in a physical register that will likely be misplaced by October.'),

  paragraph('This is not a rural school in a remote taluka. This is the reality in cities like Pune, Mumbai, Thane, and Aurangabad — urban centres that produce thousands of engineers, doctors, and entrepreneurs every year. The classrooms have Smart Boards, but the back-office still runs on paper.'),

  paragraph('Now contrast this with what is happening globally. Schools in the UAE are using AI to personalise lesson plans for each student. Colleges in Singapore have fully automated their admission-to-graduation pipeline. Coaching institutes in South Korea send real-time performance analytics to parents after every test. The gap between Indian education administration and the global standard is not shrinking — it is widening.'),

  heading(2, 'The Three Pillars of the Problem'),

  paragraph('The digital infrastructure problem in Maharashtra\'s educational institutions is not a single issue. It is a combination of three deeply interconnected challenges:'),

  heading(3, '1. Administrative Chaos'),

  paragraph('Most schools and colleges in Maharashtra still operate with fragmented systems. Admissions happen in one software (or on paper), fee collection in another, attendance in a third, and exam results in a fourth. Often, these systems do not talk to each other. The result? The principal cannot answer a simple question like "How many students in FY B.Com have paid their fees and have attendance above 75%?" without calling three different people.'),

  paragraph('For junior colleges affiliated to the Maharashtra State Board, the problem is even worse. HSC exam form deadlines, internal assessment uploads, and ATKT tracking are all managed through a patchwork of government portals, Excel sheets, and manual entries. Every year, colleges scramble to compile data that should be available at the click of a button.'),

  heading(3, '2. The Communication Black Hole'),

  paragraph('Ask any parent of a school-going child in Maharashtra how they receive updates from school. The answer, overwhelmingly, is WhatsApp. Homework updates, PTM schedules, fee reminders, exam timetables — everything comes through a class WhatsApp group managed by a teacher who already has 200 other things to do.'),

  paragraph('The problem with WhatsApp-based communication is not that it does not work. It works too well — until it does not. Messages get buried under good morning images. Parents who have two children in the same school are in multiple groups. Teachers cannot track who has read what. There is no structure, no accountability, and no record.'),

  paragraph('For coaching institutes, this problem is amplified ten-fold. A single coaching centre in Pune might have 500+ students across multiple batches, subjects, and test schedules. Coordinating all of this through WhatsApp and phone calls is a full-time job — and it is usually done by the owner themselves, who should be focusing on teaching quality instead.'),

  heading(3, '3. Zero Data-Driven Decision Making'),

  paragraph('Here is a question that every principal and director should be able to answer instantly: "What is the trend of student enrolment over the last three years, broken down by department?" In most institutions, answering this question requires manually digging through three years of admission registers.'),

  paragraph('What about: "Which teachers have the highest student satisfaction?" or "Which subject has the highest failure rate in the last two semesters?" These are not exotic questions. These are the basic data points that any well-run institution should be tracking. But without digital infrastructure, they simply do not exist.'),

  heading(2, 'What Changed After COVID — And What Did Not'),

  paragraph('The COVID-19 pandemic was supposed to be the great digital accelerator for Indian education. And in many ways, it was. Teachers who had never touched a computer learned to conduct Zoom classes. Students in rural Maharashtra attended lectures on shared smartphones. Google Classroom adoption went through the roof.'),

  paragraph('But here is what nobody talks about: the moment physical classes resumed, almost every institution went right back to paper.'),

  paragraph('The reason is simple. The tools adopted during COVID — Zoom, Google Classroom, WhatsApp — were emergency solutions, not institutional infrastructure. They solved the "how do we teach remotely?" problem but did nothing for the "how do we run the institution better?" problem. A school that used Zoom during lockdown still takes attendance on paper today. A college that used Google Classroom for assignments still manages fee collection through a counter.'),

  paragraph('The real digital transformation of education is not about video calls. It is about building an operating system for the entire institution — one that handles admissions, fees, attendance, exams, communication, analytics, and compliance in a single, integrated platform.'),

  heading(2, 'The AI Revolution Is Coming — Whether Institutions Are Ready or Not'),

  paragraph('As of 2025, AI is no longer a futuristic concept in education. It is here, and it is reshaping everything.'),

  paragraph('Large coaching chains across India are already using AI to generate personalised question papers based on a student\'s weak areas. Some schools in Mumbai have started experimenting with AI-powered attendance systems that use facial recognition. Universities globally are using AI to detect plagiarism, predict dropout rates, and even automate grading.'),

  boldParagraph('But here is the uncomfortable truth: ', 'AI cannot help an institution that does not have its basic digital infrastructure in place. You cannot build AI-powered analytics on top of paper registers. You cannot personalise learning if you do not even have a database of student performance. You cannot automate communication if your only channel is a WhatsApp group.'),

  paragraph('For Maharashtra\'s institutions, the question is not "Should we adopt AI?" The question is "Do we even have the digital foundation that AI requires?"'),

  heading(2, 'The NEP 2020 Push'),

  paragraph('The National Education Policy (NEP) 2020 has put significant emphasis on technology integration in education. It envisions:'),

  bulletItem('Academic Bank of Credits (ABC) that requires digital record-keeping at every institution'),
  bulletItem('Multiple entry and exit options that demand real-time tracking of student progress'),
  bulletItem('Outcome-Based Education (OBE) frameworks that need structured data collection'),
  bulletItem('Emphasis on data-driven governance and transparency'),

  paragraph('For Maharashtra\'s colleges, especially those affiliated to SPPU (Savitribai Phule Pune University), Mumbai University, and RTMNU (Rashtrasant Tukadoji Maharaj Nagpur University), compliance with NEP requirements is becoming non-negotiable. Institutions that do not have digital systems in place will find it increasingly difficult to meet regulatory requirements, apply for NAAC accreditation, or participate in government schemes.'),

  heading(2, 'The Coaching Institute Challenge'),

  paragraph('Maharashtra has one of the largest coaching institute ecosystems in India, particularly in Pune, Mumbai, and Nagpur. From IIT-JEE and NEET preparation to board exam coaching and competitive exam training, the coaching sector is massive — and almost entirely unorganised when it comes to technology.'),

  paragraph('Most coaching institutes, even the well-established ones, struggle with:'),

  bulletItem('Batch management — Keeping track of which student is in which batch, across multiple subjects and levels'),
  bulletItem('Test analysis — Conducting tests is easy; giving meaningful, personalised feedback based on performance is not'),
  bulletItem('Fee follow-ups — Monthly fee collection without a system means constant manual reminders and awkward phone calls'),
  bulletItem('Student retention — Without data on attendance trends and performance drops, institutes cannot identify at-risk students before they leave'),
  bulletItem('Parent communication — Parents want to know how their child is performing, but most coaching centres can only provide this during rare parent-teacher meetings'),

  paragraph('The coaching institute that solves these problems with technology will have a significant competitive advantage. The one that does not will lose students to the one that does.'),

  heading(2, 'What Modern Campus Software Should Actually Look Like'),

  paragraph('The biggest mistake institutions make when "going digital" is buying software that was designed in 2010 for a world that no longer exists. Many school and college ERPs available in India today are desktop-based, have outdated interfaces, and are built as isolated modules that do not share data.'),

  paragraph('The next generation of campus software needs to be fundamentally different:'),

  bulletItem('Cloud-native — Accessible from any device, anywhere. A teacher should be able to mark attendance from their phone while standing in the classroom.'),
  bulletItem('Integrated — Admission, fees, attendance, exams, library, hostel, transport — everything in one platform. No more data silos.'),
  bulletItem('AI-ready — Built with structured data from day one, so that AI features can be layered on top without rebuilding the foundation.'),
  bulletItem('India-first — Designed specifically for the Indian education system, with built-in support for multiple boards, university affiliations, government reporting, and regional languages.'),
  bulletItem('Beautiful — If the software looks like it was made in 2005, teachers will not use it. Modern campus software needs to be as intuitive and well-designed as the apps people use every day.'),

  heading(2, 'The Cost of Waiting'),

  paragraph('Every academic year that an institution runs without digital infrastructure, it accumulates technical debt — not in code, but in lost data, inefficient processes, and missed opportunities.'),

  paragraph('Consider this: A school that digitises its student records starting this year will, within three years, have a complete database of student performance trends, attendance patterns, fee collection history, and communication logs. That data becomes invaluable for making informed decisions about everything from staffing to infrastructure investments.'),

  paragraph('A school that waits three years to start? It will be three years behind, with no historical data and no basis for comparison. In a competitive market where parents are increasingly choosing schools based on transparency and technology adoption, that gap matters.'),

  heading(2, 'The Way Forward'),

  paragraph('The digital transformation of Maharashtra\'s educational institutions is not going to happen overnight. It is a gradual process that starts with a single step: choosing the right platform. Here is what we recommend:'),

  numberItem('Start with the basics — Admissions, fee collection, and attendance. These three processes alone, when digitised, save hundreds of hours per year and eliminate the most common sources of errors.'),
  numberItem('Prioritise mobile access — Any system that requires staff to be in front of a specific computer is already outdated. Choose a platform that works on phones and tablets.'),
  numberItem('Think long-term — Do not buy a system that solves today\'s problem but cannot grow with your institution. Look for platforms that are modular, cloud-based, and regularly updated.'),
  numberItem('Involve your teachers — The best technology fails if the people using it do not believe in it. Provide proper training and give them time to adapt.'),
  numberItem('Demand local support — Education technology is not a one-time purchase. You need a partner who understands your context and speaks your language.'),

  paragraph('The institutions that embrace this transition now will be the ones that thrive in the next decade. The ones that resist it will find themselves increasingly left behind — not just by their competitors, but by the students and parents who expect better.'),

  boldParagraph('The choice is not between digital and traditional. ', 'The choice is between relevant and obsolete.'),

  paragraph('This is the first in a series of articles exploring the intersection of technology and education in India. If you are an educator, administrator, or institution owner, we would love to hear about your experience with digital tools in your institution.'),
];

// ── Content Sections (alternating image+text layouts) ──
const contentSections = [
  {
    _key: 'section-1',
    heading: 'Paper Registers and Manual Processes',
    text: 'Across thousands of schools and colleges in Maharashtra, the daily administrative workflow still revolves around physical registers, handwritten receipts, and Excel spreadsheets. This creates bottlenecks during peak periods like admissions and exams, leading to data errors, delayed reporting, and frustrated parents. The cost of manual processes is not just time — it is accuracy, transparency, and trust.',
    layout: 'left',
    // image: user will upload via Sanity Studio
  },
  {
    _key: 'section-2',
    heading: 'Real-Time Attendance and Fee Tracking',
    text: 'Modern campus platforms enable teachers to mark attendance from their smartphones in under 30 seconds. Fee collection becomes transparent with automated receipts, payment reminders, and real-time dashboards that show exactly who has paid and who has not. For principals and directors, this means instant visibility into the two most critical operational metrics of any institution.',
    layout: 'right',
  },
  {
    _key: 'section-3',
    heading: 'Students in the Age of Smartphones',
    text: 'Today\'s students carry more computing power in their pockets than entire computer labs had a decade ago. They expect digital access to timetables, assignments, exam results, and communication. Coaching centres that provide a mobile app for test results and study material see significantly higher engagement and retention compared to those relying on physical notice boards and WhatsApp forwards.',
    layout: 'left',
  },
  {
    _key: 'section-4',
    heading: 'AI-Powered Insights for Better Decisions',
    text: 'Artificial intelligence can identify patterns that humans miss. Which students are likely to drop out based on attendance trends? Which subjects need additional teaching support based on failure rates? Which fee payment patterns indicate financial stress that the institution can proactively address? These insights are only possible when institutions have structured, digital data — and the right platform to analyse it.',
    layout: 'right',
  },
  {
    _key: 'section-5',
    heading: 'The Coaching Institute Opportunity',
    text: 'Maharashtra\'s coaching sector — from the IIT-JEE factories of Pune to the MPSC preparation centres in Nagpur — represents one of the largest untapped opportunities for digital transformation. Institutes that adopt technology for batch management, automated test analysis, and parent communication will not just save time. They will build a reputation for professionalism and transparency that attracts more students through word of mouth than any billboard ever could.',
    layout: 'left',
  },
];

// ── References ──
const references = [
  {
    _key: 'ref-1',
    title: 'National Education Policy 2020 — Full Document',
    url: 'https://www.education.gov.in/sites/upload_files/mhrd/files/NEP_Final_English.pdf',
    description: 'The complete NEP 2020 policy document from the Ministry of Education, Government of India.',
  },
  {
    _key: 'ref-2',
    title: 'SPPU Official Website — Savitribai Phule Pune University',
    url: 'http://www.unipune.ac.in/',
    description: 'Official portal of SPPU, one of the largest universities in Maharashtra.',
  },
  {
    _key: 'ref-3',
    title: 'NAAC — National Assessment and Accreditation Council',
    url: 'http://www.naac.gov.in/',
    description: 'NAAC accreditation framework that increasingly requires digital documentation.',
  },
  {
    _key: 'ref-4',
    title: 'Academic Bank of Credits (ABC) — UGC Initiative',
    url: 'https://www.abc.gov.in/',
    description: 'The UGC\'s ABC initiative that mandates digital credit tracking across institutions.',
  },
];

// ── Full Document ──
const blogDocument = {
  _id: 'post-maharashtra-education-digital-infrastructure-2025',
  _type: 'post',
  title: {
    en: "Why Maharashtra's Schools, Colleges & Coaching Institutes Can No Longer Ignore Digital Infrastructure",
    hi: "महाराष्ट्र के स्कूल, कॉलेज और कोचिंग संस्थान अब डिजिटल इंफ्रास्ट्रक्चर को नज़रअंदाज़ नहीं कर सकते",
    mr: "महाराष्ट्रातील शाळा, महाविद्यालये आणि कोचिंग संस्था आता डिजिटल पायाभूत सुविधांकडे दुर्लक्ष करू शकत नाहीत",
  },
  slug: { _type: 'slug', current: 'maharashtra-education-digital-infrastructure-2025' },
  excerpt: {
    en: "While the world races toward AI-driven classrooms and cloud-based campus management, thousands of schools, junior colleges, and coaching institutes across Maharashtra still run on paper registers, WhatsApp groups, and Excel sheets. The gap is not just technological — it is existential. This blog explores why going digital is no longer optional, what real institutions are struggling with, and how the next generation of campus software is being built differently.",
    hi: "जबकि दुनिया AI-संचालित कक्षाओं और क्लाउड-आधारित कैम्पस प्रबंधन की ओर बढ़ रही है, महाराष्ट्र भर के हज़ारों स्कूल, जूनियर कॉलेज और कोचिंग संस्थान अभी भी कागज़ी रजिस्टरों, व्हाट्सएप ग्रुप्स और एक्सेल शीट्स पर चल रहे हैं।",
    mr: "जग AI-चलित वर्गखोल्या आणि क्लाउड-आधारित कॅम्पस व्यवस्थापनाकडे धावत असताना, महाराष्ट्रभरातील हजारो शाळा, कनिष्ठ महाविद्यालये आणि कोचिंग संस्था अजूनही कागदी नोंदवह्या, व्हॉट्सअॅप ग्रुप्स आणि एक्सेल शीट्सवर चालत आहेत.",
  },
  publishedAt: new Date().toISOString(),
  category: 'Education',
  tags: [
    'EdTech',
    'Maharashtra',
    'AI in Education',
    'Digital India',
    'School ERP',
    'College Management',
    'Coaching Institute',
    'NEP 2020',
    'SPPU',
    'Online Learning',
  ],
  readingTimeOverride: 12,
  // coverImage: — YOU MUST UPLOAD THIS VIA SANITY STUDIO
  // author fields — set basic info, you'll add images in Studio
  author: 'Nikhil',
  authorBio: 'Founder of ClassGrid — building the next-generation operating system for educational institutions across India. Passionate about bridging the gap between technology and education.',
  authors: [
    {
      _key: 'author-1',
      name: 'Nikhil',
      bio: 'Founder of ClassGrid — building the next-generation operating system for educational institutions across India. Passionate about bridging the gap between technology and education.',
      // image: upload in Sanity Studio
      // profileLink: add your LinkedIn/social link in Studio
    },
    // Add your second team member here in Sanity Studio
  ],
  body: {
    en: blogBody,
    // hi and mr can be added later via Sanity Studio
  },
  contentSections,
  references,
};

// ── Upload ──
async function main() {
  console.log('');
  console.log('┌─────────────────────────────────────────────────────┐');
  console.log('│  📝 Classgrid — First Blog Post Uploader            │');
  console.log('└─────────────────────────────────────────────────────┘');
  console.log('');
  console.log(`  Project:  ${PROJECT_ID}`);
  console.log(`  Dataset:  ${DATASET}`);
  console.log(`  Dry Run:  ${DRY_RUN}`);
  console.log(`  Slug:     ${blogDocument.slug.current}`);
  console.log('');

  if (DRY_RUN) {
    console.log('🔍 DRY RUN — Preview of document:');
    console.log(JSON.stringify(blogDocument, null, 2).slice(0, 3000));
    console.log('...');
    console.log('');
    console.log('✅ Dry run complete. Run without --dry-run to upload.');
    return;
  }

  try {
    console.log('⏳ Uploading blog post to Sanity...');
    const result = await client.createOrReplace(blogDocument);
    console.log('');
    console.log('✅ Blog post uploaded successfully!');
    console.log(`   Document ID: ${result._id}`);
    console.log(`   Type: ${result._type}`);
    console.log('');
    console.log('📌 NEXT STEPS (do these in Sanity Studio):');
    console.log('   1. Go to https://classgrid.in/studio');
    console.log('   2. Find the blog post: "Why Maharashtra\'s Schools..."');
    console.log('   3. Upload the COVER IMAGE');
    console.log('   4. Upload Author 1 image (your photo) + add profile link');
    console.log('   5. Add Author 2 (team member) with image + profile link');
    console.log('   6. Go to "Visual Content Sections" and upload images for each section');
    console.log('   7. Click PUBLISH');
    console.log('');
    console.log('🎉 Your first blog post is ready!');
  } catch (err) {
    console.error('❌ Upload failed:', err.message);
    process.exit(1);
  }
}

main();
