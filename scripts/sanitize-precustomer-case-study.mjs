import { createClient } from '@sanity/client';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local', quiet: true });

const TARGET_ID = 'caseStudy-future-education-infrastructure-india-unified-platforms';

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2026-03-30',
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN || process.env.SANITY_API_TOKEN,
});

try {
  const result = await client
    .patch(TARGET_ID)
    .set({
      clientName: 'Indian Higher Education Sector',
      summary:
        'A sector research study on why Indian institutions need unified ERP, LMS, communication, analytics, and AI-ready digital infrastructure to improve visibility, readiness, and continuity.',
      overview:
        'This sector study looks at India higher-education infrastructure as of May 31, 2026. It is a research-backed perspective on market need and platform direction, not a named customer implementation.',
    })
    .unset([
      'clientLogo',
      'championName',
      'championRole',
      'championHeadshot',
      'championQuote',
      'championSocialLink',
      'champions',
    ])
    .commit();

  console.log(`Sanitized pre-customer case study: ${result._id}`);
} catch (error) {
  console.error(`Sanity patch failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  process.exit(1);
}
