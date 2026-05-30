import { createClient } from '@sanity/client'

const client = createClient({
  projectId: 'a4wk6kp5',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2024-05-30',
  token: 'skl5fXWCsJGBUGFDt0UAafjCrBHRvIBcvKu8AE3e9oE54n2Cvkm9uhb7qwQLCZc4xyMhNaUVY60LoGjS9Jx5Xti2vP6DhIpeRXDvn0g8MRenQB4dboyWPSZsPIhuOEekG0qHAhXfcCt1ZBjSRqNXJE0S7R2ksWpi4whznisrNhvJlg4Ajk7M'
})

async function run() {
  console.log("Fetching existing feedbacks to delete...");
  const existing = await client.fetch(`*[_type == "websiteFeedback"]._id`);
  console.log(`Found ${existing.length} feedbacks to delete.`);
  
  if (existing.length > 0) {
    for (let i = 0; i < existing.length; i += 100) {
      const batch = existing.slice(i, i + 100);
      const transaction = client.transaction();
      batch.forEach(id => transaction.delete(id));
      await transaction.commit();
      console.log(`Deleted batch of ${batch.length}`);
    }
  }

  console.log("Creating 50 random feedback entries...");

  // Only pages that actually have the FeedbackWidget
  const pages = [
    { url: '/blog/how-classgrid-transforms-school-management', title: 'How Classgrid Transforms School Management', type: 'blog' },
    { url: '/blog/future-of-edtech-in-india', title: 'Future of EdTech in India', type: 'blog' },
    { url: '/blog/digital-classroom-revolution', title: 'Digital Classroom Revolution', type: 'blog' },
    { url: '/compare/classgrid-vs-entab', title: 'Classgrid vs Entab', type: 'compare' },
    { url: '/compare/classgrid-vs-fedena', title: 'Classgrid vs Fedena', type: 'compare' },
    { url: '/help-center/article/getting-started-with-classgrid', title: 'Getting Started with Classgrid', type: 'help-article' },
    { url: '/help-center/article/managing-student-records', title: 'Managing Student Records', type: 'help-article' },
    { url: '/case-studies/springfields-academy', title: 'Case Study: Springfields Academy', type: 'case-study' },
    { url: '/solutions/for-schools', title: 'Solutions for Schools', type: 'solution' },
    { url: '/solutions/for-colleges', title: 'Solutions for Colleges', type: 'solution' },
  ];
  
  const reactions = ['great', 'great', 'great', 'okay', 'okay', 'bad', 'terrible'];
  const messages = [
    "This was incredibly helpful, thank you!",
    "I still don't understand how to configure this.",
    "Pretty good, but could use more screenshots.",
    "",
    "",
    "",
    "Not useful at all.",
    "Love the new design!",
  ];

  const transaction = client.transaction();
  
  for (let i = 0; i < 50; i++) {
    const page = pages[Math.floor(Math.random() * pages.length)];
    const reaction = reactions[Math.floor(Math.random() * reactions.length)];
    const message = messages[Math.floor(Math.random() * messages.length)];

    transaction.create({
      _type: 'websiteFeedback',
      pageUrl: page.url,
      pageTitle: page.title,
      reaction,
      message: message || undefined,
      pageType: page.type,
      status: 'new',
      submittedAt: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toISOString()
    });
  }

  await transaction.commit();
  console.log("50 new feedbacks successfully generated!");
}

run().catch(console.error);

