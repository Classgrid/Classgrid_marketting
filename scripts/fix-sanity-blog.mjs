import { createClient } from '@sanity/client';

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'a4wk6kp5',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2026-05-01',
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
});

async function fixBlog() {
  const docId = 'post-mongodb-for-startups-2026'; // Try published doc first
  
  try {
    const doc = await client.getDocument(docId);
    
    if (!doc) {
      console.log('Published doc not found, trying draft...');
      const draftDoc = await client.getDocument(`drafts.${docId}`);
      if (!draftDoc) {
        console.error('Could not find document in Sanity');
        return;
      }
    }

    // We will just replace the entire body array with the corrected one
    // to ensure both the quote and the $11,500 sentence are perfectly fixed.
    
    let keyCounter = 0;
    function nextKey(prefix = 'k') { return `${prefix}-${++keyCounter}`; }
    function span(text, marks = []) { return { _key: nextKey('s'), _type: 'span', text, marks }; }
    function block(style, children, extra = {}) { return { _key: nextKey('b'), _type: 'block', style, markDefs: [], children: Array.isArray(children) ? children : [span(children)], ...extra, }; }
    function heading(level, text) { return block(`h${level}`, [span(text)]); }
    function paragraph(text) { return block('normal', [span(text)]); }
    
    // Exact email quote with spaces
    const exactEmailQuote = [
      block('blockquote', [span('Welcome to the MongoDB for Startups')]),
      block('blockquote', [span('')]),
      block('blockquote', [span('program')]),
      block('blockquote', [span('')]),
      block('blockquote', [span('Hi Nikhil,')]),
      block('blockquote', [span('')]),
      block('blockquote', [span('Congratulations! We’re excited to welcome you into the MongoDB for Startups community.')]),
      block('blockquote', [span('')]),
      block('blockquote', [span("We're excited to have you join our community of passionate startups. We are here to support you and ensure you make the most out of MongoDB.")]),
    ];

    const blogBody = [
      paragraph('Every module in Classgrid — from attendance to admissions, fees to examinations, chat to notifications — writes and reads from one place: MongoDB Atlas. It powers the entire platform.'),
      
      paragraph('Today, we are proud to announce that Classgrid has been officially accepted into the MongoDB for Startups program.'),
      
      ...exactEmailQuote,

      heading(3, 'A program built for every stage'),
      paragraph('MongoDB for Startups is not a one-size-fits-all program. It is a tiered ecosystem designed to support founders at every stage — from MVP to global scale. Companies in the program represent more than $200 billion in combined valuation, including names like Vanta, Persona, and Spendflo.'),
      
      paragraph('The program offers four tiers:'),
      block('normal', [span('Inspire — For bootstrapped startups validating their idea')], { listItem: 'bullet', level: 1 }),
      block('normal', [span('Grow — For early-funded startups accelerating growth')], { listItem: 'bullet', level: 1 }),
      block('normal', [span('Innovate — For rising VC-backed startups scaling product adoption')], { listItem: 'bullet', level: 1 }),
      block('normal', [span('Scale — For rapidly scaling startups going global')], { listItem: 'bullet', level: 1 }),
      
      paragraph('As a bootstrapped, solo-founder startup, Classgrid enters the program at the foundational level — with a clear path to grow as the platform scales.'),

      heading(3, 'What does MongoDB for Startups give us?'),
      
      heading(4, '🍃 MongoDB Atlas Credits'),
      paragraph('MongoDB Atlas is the managed cloud database that powers every student record, every attendance log, every fee transaction, and every chat message on Classgrid. These credits give us runway to scale our database clusters as more institutions come onboard — without worrying about immediate infrastructure costs.'),

      heading(4, '🤖 Voyage AI Tokens'),
      paragraph('MongoDB for Startups now includes access to Voyage AI — advanced embedding and reranker models for high-performance retrieval. This gives Classgrid domain-specific AI models and state-of-the-art retrieval capabilities, enabling smarter search and intelligent features across the platform.'),

      heading(4, '⚡ Fireworks AI & Temporal Matching Credits'),
      paragraph('The program partners with Fireworks AI and Temporal to provide eligible startups with matching credits across complementary technologies — so we can build the right stack from day one without accumulating technical debt.'),

      heading(4, '🧑‍💻 Technical Expertise & Advisor Sessions'),
      paragraph('Direct access to MongoDB\'s technical experts for consultations on database architecture, data migration strategies, and performance optimization. As we scale across multiple institution types, having expert guidance on our data layer is invaluable.'),

      heading(4, '🛟 Dedicated Support'),
      paragraph('When your database powers an entire educational institution\'s daily operations — student logins, faculty attendance, fee payments, exam results — downtime is not an option. Dedicated support means faster resolution times and peace of mind for every school that trusts Classgrid.'),

      heading(4, '🤝 Go-to-Market Opportunities'),
      paragraph('Exposure through MongoDB\'s global startup ecosystem and co-marketing opportunities. MongoDB positions itself as not just infrastructure, but a true partner in growth — giving startups like Classgrid visibility within a network of thousands of founders and developers worldwide.'),

      heading(3, 'Why this matters'),
      paragraph('We applied to this program back in early July 2026. We followed up multiple times with no response. And then we stopped expecting a reply.'),
      paragraph('Over a month later — on a night when we were feeling the weight of building alone — the acceptance email arrived. No warning, no prior indication. Just a quiet confirmation that MongoDB had reviewed our application, looked at what we were building, and decided we were worth backing.'),
      paragraph('Sometimes the wins come exactly when you need them most.'),

      heading(3, 'The bigger picture'),
      paragraph('With MongoDB for Startups joining our growing list of infrastructure partners, Classgrid is now backed by:'),
      block('normal', [span('Cloudflare — $10,000 in infrastructure credits + 3 Enterprise domains')], { listItem: 'bullet', level: 1 }),
      block('normal', [span('AWS — $1,000 in cloud credits (EC2, S3, CloudFront)')], { listItem: 'bullet', level: 1 }),
      block('normal', [span('MongoDB — Atlas credits + Voyage AI tokens + technical advisors')], { listItem: 'bullet', level: 1 }),
      block('normal', [span('Amazon SES — 50,000 emails/day production access')], { listItem: 'bullet', level: 1 }),
      block('normal', [span('Anthropic — Claude for Startups community program')], { listItem: 'bullet', level: 1 }),
      block('normal', [span('Razorpay — Live production API keys for billing.classgrid.in')], { listItem: 'bullet', level: 1 }),
      
      heading(3, 'Moving Forward'),
      paragraph('With our database partner now officially in our corner, our focus remains the same: complete the platform, onboard our first institution, and prove that Classgrid can change how education works in India.'),
      paragraph('Thank you, MongoDB, for believing in Classgrid.'),
      paragraph('Stay tuned — there is a lot more coming.'),
    ];

    // Update BOTH published and draft if they exist
    console.log('Patching Sanity documents...');
    await client.patch(docId).set({ 'body.en': blogBody }).commit().catch(() => {});
    await client.patch(`drafts.${docId}`).set({ 'body.en': blogBody }).commit().catch(() => {});
    
    console.log('✅ Fix applied to Sanity successfully!');
  } catch (err) {
    console.error('Error:', err);
  }
}

fixBlog();
