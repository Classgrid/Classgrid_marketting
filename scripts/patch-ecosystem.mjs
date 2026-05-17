import { createClient } from '@sanity/client';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
});

const appEcosystem = {
  faculty: [
    { _key: 'f1', _type: 'homeEcosystemFeature', label: 'Attendance', icon: 'CheckSquare', description: 'Faculty /work → Attendance card. Backend supports starting sessions, quick marking, reports, and appeals.' },
    { _key: 'f2', _type: 'homeEcosystemFeature', label: 'Assignments', icon: 'ClipboardList', description: 'Faculty /work → Assignments card. Backend supports creating assignments, viewing submissions, grading, and bulk grading.' },
    { _key: 'f3', _type: 'homeEcosystemFeature', label: 'Academic Planning', icon: 'BookOpen', description: 'Faculty /work → Academic Planning card. Maps to Teacher Planner APIs for lesson planning and goals.' },
    { _key: 'f4', _type: 'homeEcosystemFeature', label: 'My Time Table', icon: 'Calendar', description: 'Faculty /work → My Time Table card, with timetable APIs for today’s schedule and slots.' },
    { _key: 'f5', _type: 'homeEcosystemFeature', label: 'Online Exam Builder', icon: 'FileQuestion', description: 'Faculty /work → Online Exam Builder card. Backend supports exam creation, AI/OCR questions, grading, analytics, and proctor reports.' },
    { _key: 'f6', _type: 'homeEcosystemFeature', label: 'Manage Leaves', icon: 'CalendarX', description: 'Faculty /work → Manage Leaves card. Backend supports teacher leave queues, approvals, rejections, and calendars.' },
  ],
  student: [
    { _key: 's1', _type: 'homeEcosystemFeature', label: 'Assignments', icon: 'UploadCloud', description: 'Student /student/work → Assignments card. Backend supports viewing, submitting, and unsubmitting assignments.' },
    { _key: 's2', _type: 'homeEcosystemFeature', label: 'Attendance', icon: 'ClipboardCheck', description: 'Student /student/work → Attendance card. Backend supports overview, detailed records, class attendance, and appeals.' },
    { _key: 's3', _type: 'homeEcosystemFeature', label: 'My Time Table', icon: 'Calendar', description: 'Student /student/work → My Time Table card, backed by /me/today timetable APIs.' },
    { _key: 's4', _type: 'homeEcosystemFeature', label: 'Examination', icon: 'MonitorCheck', description: 'Student /student/work → Examination card. Backend supports student exam dashboard, start exam, autosave, submit, proctoring, and hall ticket.' },
    { _key: 's5', _type: 'homeEcosystemFeature', label: 'Result', icon: 'Trophy', description: 'Student /student/work → Result card. Backend supports student result view, SGPA/CGPA, ranks, and published marks.' },
    { _key: 's6', _type: 'homeEcosystemFeature', label: 'Fees', icon: 'CreditCard', description: 'Student /student/work → Fees card. Backend supports student fee summary, ledger/records, Razorpay order, and payment verification.' },
  ],
  parent: [
    { _key: 'p1', _type: 'homeEcosystemFeature', label: 'Track Application', icon: 'Route', description: 'Parent Tracker /parent/:orgId after login → Application Progress pipeline.' },
    { _key: 'p2', _type: 'homeEcosystemFeature', label: 'Phone Verification', icon: 'Phone', description: 'Parent Tracker initial screen → phone number verification.' },
    { _key: 'p3', _type: 'homeEcosystemFeature', label: 'Student Status Card', icon: 'UserCheck', description: 'Parent Tracker result view → student info and application status badge.' },
    { _key: 'p4', _type: 'homeEcosystemFeature', label: 'Document Status', icon: 'FileCheck2', description: 'Parent Tracker result view → document checklist with verified/rejected/pending states.' },
    { _key: 'p5', _type: 'homeEcosystemFeature', label: 'Fee Payment Alert', icon: 'CreditCard', description: 'Parent Tracker result view when status is fee pending → fee deadline/action alert.' },
    { _key: 'p6', _type: 'homeEcosystemFeature', label: 'Admission Letter', icon: 'Download', description: 'Parent Tracker enrolled state → downloadable admission letter and fee receipt.' },
  ],
};

async function patchHome() {
  const docId = 'drafts.appEcosystem';
  console.log(`Patching document: ${docId}`);
  try {
    await client
      .patch(docId)
      .set(appEcosystem)
      .commit();
    console.log('Successfully updated!');
  } catch(e) {
    console.log('Failed to patch, creating instead...');
    await client.createIfNotExists({
      _id: docId,
      _type: 'appEcosystem',
      ...appEcosystem
    });
    console.log('Created successfully!');
  }
}

patchHome().catch(console.error);
