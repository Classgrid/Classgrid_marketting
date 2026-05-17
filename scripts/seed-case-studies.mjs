import { createClient } from '@sanity/client';

const client = createClient({
  projectId: 'a4wk6kp5',
  dataset: 'production',
  apiVersion: '2026-03-30',
  token: 'skl5fXWCsJGBUGFDt0UAafjCrBHRvIBcvKu8AE3e9oE54n2Cvkm9uhb7qwQLCZc4xyMhNaUVY60LoGjS9Jx5Xti2vP6DhIpeRXDvn0g8MRenQB4dboyWPSZsPIhuOEekG0qHAhXfcCt1ZBjSRqNXJE0S7R2ksWpi4whznisrNhvJlg4Ajk7M',
  useCdn: false,
});

const caseStudies = [
  {
    _type: 'caseStudy',
    title: '₹12L recovered in one semester with zero manual follow-ups',
    slug: { _type: 'slug', current: 'pccoe-fee-recovery' },
    clientName: 'PCCOE, Pune',
    year: '2025',
    category: 'fee-recovery',
    modules: ['finance', 'communication'],
    summary: 'By integrating Classgrid’s Finance module with automated SMS reminders, PCCOE recovered ₹12L in pending fees without a single phone call.',
    metrics: [
      { _key: 'm1', value: '12', suffix: 'L', label: 'Recovered' },
      { _key: 'm2', value: '85', suffix: '%', label: 'On-Time' },
      { _key: 'm3', value: '0', suffix: 'hrs', label: 'Manual Work' },
    ]
  },
  {
    _type: 'caseStudy',
    title: '100% NAAC compliance achieved in just 45 days',
    slug: { _type: 'slug', current: 'dy-patil-compliance' },
    clientName: 'DY Patil University',
    year: '2024',
    category: 'compliance',
    modules: ['compliance', 'reports'],
    summary: 'DY Patil University replaced 40+ spreadsheets with Classgrid, automating their NAAC accreditation reports and saving thousands of faculty hours.',
    metrics: [
      { _key: 'm1', value: '100', suffix: '%', label: 'Compliance' },
      { _key: 'm2', value: '3k+', suffix: 'hrs', label: 'Saved' },
      { _key: 'm3', value: '45', suffix: 'd', label: 'Deployed' },
    ]
  },
  {
    _type: 'caseStudy',
    title: 'Automated 5,000+ daily attendance logs across 12 departments',
    slug: { _type: 'slug', current: 'mit-wpu-attendance' },
    clientName: 'MIT WPU',
    year: '2025',
    category: 'attendance',
    modules: ['attendance', 'reports'],
    summary: 'MIT WPU scaled their attendance tracking system with Classgrid, giving HODs real-time visibility into student absenteeism.',
    metrics: [
      { _key: 'm1', value: '5k+', suffix: '', label: 'Daily Logs' },
      { _key: 'm2', value: '12', suffix: '', label: 'Depts' },
      { _key: 'm3', value: '100', suffix: '%', label: 'Real-time' },
    ]
  },
  {
    _type: 'caseStudy',
    title: 'Paperless admission workflow reduced processing time by 70%',
    slug: { _type: 'slug', current: 'symbiosis-automation' },
    clientName: 'Symbiosis Institute',
    year: '2026',
    category: 'automation',
    modules: ['communication', 'finance'],
    summary: 'Symbiosis digitized their entire admission workflow, allowing students to apply, upload documents, and pay fees in a single portal.',
    metrics: [
      { _key: 'm1', value: '70', suffix: '%', label: 'Faster' },
      { _key: 'm2', value: '10k+', suffix: '', label: 'Applicants' },
      { _key: 'm3', value: '0', suffix: '', label: 'Paper' },
    ]
  },
  {
    _type: 'caseStudy',
    title: 'Seamless parent communication boosted PTA engagement by 3x',
    slug: { _type: 'slug', current: 'podar-communication' },
    clientName: 'Podar International',
    year: '2024',
    category: 'automation',
    modules: ['communication', 'attendance'],
    summary: 'Podar International used Classgrid’s automated messaging to keep parents informed about attendance, fees, and exam schedules instantly.',
    metrics: [
      { _key: 'm1', value: '3x', suffix: '', label: 'Engagement' },
      { _key: 'm2', value: '50k+', suffix: '', label: 'Alerts Sent' },
      { _key: 'm3', value: '100', suffix: '%', label: 'Delivery' },
    ]
  },
  {
    _type: 'caseStudy',
    title: 'Custom report generation dropped from 2 weeks to 2 minutes',
    slug: { _type: 'slug', current: 'vit-reports' },
    clientName: 'VIT Vellore',
    year: '2025',
    category: 'compliance',
    modules: ['reports', 'finance'],
    summary: 'VIT Vellore management can now generate comprehensive cross-departmental financial and academic reports instantly.',
    metrics: [
      { _key: 'm1', value: '2', suffix: 'min', label: 'Gen Time' },
      { _key: 'm2', value: '99', suffix: '%', label: 'Faster' },
      { _key: 'm3', value: '15+', suffix: '', label: 'Report Types' },
    ]
  }
];

async function run() {
  console.log('🚀 Seeding Case Studies...');
  try {
    for (const doc of caseStudies) {
      const result = await client.create(doc);
      console.log(`✅ Created: ${result.title}`);
    }
    console.log('🎉 Done! Note: Images must be uploaded manually in Sanity Studio.');
  } catch (err) {
    console.error('❌ Failed:', err.message);
    process.exit(1);
  }
}

run();
