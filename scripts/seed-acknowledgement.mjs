/**
 * One-time script: seeds Subhash Shinde's acknowledgement entry into Sanity.
 * Run with:  node scripts/seed-acknowledgement.mjs
 */
import { createClient } from '@sanity/client'

const client = createClient({
  projectId: 'a4wk6kp5',
  dataset: 'production',
  apiVersion: '2026-03-30',
  useCdn: false,
  // Uses the SANITY_API_TOKEN env var (write token needed)
  token: process.env.SANITY_API_WRITE_TOKEN,
})

const entries = [
  {
    _type: 'acknowledgement',
    name: 'Swaroop Ghorpade',
    category: 'contributor',
    order: 2,
  },
  {
    _type: 'acknowledgement',
    name: 'Krushna Gore',
    category: 'contributor',
    order: 5,
  },
]

async function seed() {
  for (const entry of entries) {
    try {
      const result = await client.create(entry)
      console.log('✅ Created:', result._id, '-', result.name)
    } catch (err) {
      console.error('❌ Failed:', entry.name, '-', err.message)
    }
  }
}

seed()

