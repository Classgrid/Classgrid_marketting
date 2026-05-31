import { createClient } from '@sanity/client'

const client = createClient({
  projectId: 'a4wk6kp5',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2024-05-30',
  token: 'skl5fXWCsJGBUGFDt0UAafjCrBHRvIBcvKu8AE3e9oE54n2Cvkm9uhb7qwQLCZc4xyMhNaUVY60LoGjS9Jx5Xti2vP6DhIpeRXDvn0g8MRenQB4dboyWPSZsPIhuOEekG0qHAhXfcCt1ZBjSRqNXJE0S7R2ksWpi4whznisrNhvJlg4Ajk7M',
})

const keepSlug = 'future-education-infrastructure-india-unified-platforms'

const placeholderSlugs = new Set([
  'pccoe-fee-recovery',
  'dy-patil-compliance',
  'mit-wpu-attendance',
  'symbiosis-automation',
  'podar-communication',
  'vit-reports',
])

const placeholderClients = new Set([
  'PCCOE, Pune',
  'DY Patil University',
  'MIT WPU',
  'Symbiosis Institute',
  'Podar International',
  'VIT Vellore',
])

function isPlaceholder(doc) {
  const slug = doc.slug?.current || doc.slug
  const title = String(doc.title || '').toLowerCase()
  const clientName = String(doc.clientName || '')

  if (slug === keepSlug) return false
  if (placeholderSlugs.has(slug)) return true
  if (placeholderClients.has(clientName)) return true
  if (title.includes('placeholder') || title.includes('demo')) return true

  return false
}

async function run() {
  const docs = await client.fetch(`*[_type == "caseStudy"]{ _id, title, slug, clientName }`)
  const targets = docs.filter(isPlaceholder)

  if (!targets.length) {
    console.log('No placeholder case studies found.')
    return
  }

  console.log(`Deleting ${targets.length} placeholder case study document(s)...`)

  for (const doc of targets) {
    await client.delete(doc._id)
    console.log(`Deleted: ${doc.title || doc._id}`)
  }

  console.log('Placeholder cleanup complete.')
}

run().catch((error) => {
  console.error(error)
  process.exit(1)
})
