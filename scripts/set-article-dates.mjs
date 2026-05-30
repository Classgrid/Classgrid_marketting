import { createClient } from '@sanity/client'

const client = createClient({
  projectId: 'a4wk6kp5',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2024-05-30',
  token: 'skl5fXWCsJGBUGFDt0UAafjCrBHRvIBcvKu8AE3e9oE54n2Cvkm9uhb7qwQLCZc4xyMhNaUVY60LoGjS9Jx5Xti2vP6DhIpeRXDvn0g8MRenQB4dboyWPSZsPIhuOEekG0qHAhXfcCt1ZBjSRqNXJE0S7R2ksWpi4whznisrNhvJlg4Ajk7M'
})

async function run() {
  // Fetch all help articles
  const articles = await client.fetch(`*[_type == "helpArticle"]{ _id, title, publishedAt, showDates }`)

  console.log(`Found ${articles.length} help articles.\n`)

  const today = new Date().toISOString()
  let updated = 0

  for (const article of articles) {
    // Only set publishedAt if it doesn't already have one
    if (!article.publishedAt) {
      await client
        .patch(article._id)
        .set({
          publishedAt: today,
          showDates: true,
        })
        .commit()

      const title = typeof article.title === 'object' ? article.title.en : article.title
      console.log(`✅ Set publishedAt for: ${title}`)
      updated++
    } else {
      const title = typeof article.title === 'object' ? article.title.en : article.title
      console.log(`⏭️  Already has publishedAt: ${title}`)
    }
  }

  console.log(`\n🎉 Done! Updated ${updated} of ${articles.length} articles with today's date.`)
}

run().catch(console.error)
