import { createClient } from '@sanity/client'

const client = createClient({
  projectId: 'a4wk6kp5',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2024-05-30',
  token: 'skl5fXWCsJGBUGFDt0UAafjCrBHRvIBcvKu8AE3e9oE54n2Cvkm9uhb7qwQLCZc4xyMhNaUVY60LoGjS9Jx5Xti2vP6DhIpeRXDvn0g8MRenQB4dboyWPSZsPIhuOEekG0qHAhXfcCt1ZBjSRqNXJE0S7R2ksWpi4whznisrNhvJlg4Ajk7M',
})

const slug = 'future-education-infrastructure-india-unified-platforms'
const placeholderSlugs = [
  'pccoe-fee-recovery',
  'dy-patil-compliance',
  'mit-wpu-attendance',
  'symbiosis-automation',
  'podar-communication',
  'vit-reports',
]

async function run() {
  const result = await client.fetch(
    `{
      "doc": *[_type == "caseStudy" && slug.current == $slug][0]{
        _id,
        title,
        "slug": slug.current,
        year,
        clientName,
        institutionType,
        category,
        modules,
        summary,
        "hasHeroImage": defined(heroImage.asset),
        "metricsCount": count(metrics),
        "bodyCount": count(body),
        "bodyImageCount": count(body[_type == "image"]),
        "tableCount": count(body[_type == "table"]),
        "galleryCount": count(galleryImages),
        "championsCount": count(champions),
        "hasChampionHeadshot": defined(championHeadshot.asset)
      },
      "placeholders": *[_type == "caseStudy" && slug.current in $placeholderSlugs]{
        _id,
        title,
        "slug": slug.current,
        clientName
      }
    }`,
    { slug, placeholderSlugs }
  )

  console.log(JSON.stringify(result, null, 2))
}

run().catch((error) => {
  console.error(error)
  process.exit(1)
})
