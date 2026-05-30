import { createClient } from '@sanity/client'

const client = createClient({
  projectId: 'a4wk6kp5',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2024-05-30',
  token: 'skl5fXWCsJGBUGFDt0UAafjCrBHRvIBcvKu8AE3e9oE54n2Cvkm9uhb7qwQLCZc4xyMhNaUVY60LoGjS9Jx5Xti2vP6DhIpeRXDvn0g8MRenQB4dboyWPSZsPIhuOEekG0qHAhXfcCt1ZBjSRqNXJE0S7R2ksWpi4whznisrNhvJlg4Ajk7M'
})

// Find the "Getting Started" category
const category = await client.fetch(`*[_type == "helpCategory" && title == "Getting Started"][0]`)
console.log('Category:', JSON.stringify(category, null, 2))

// Find articles in that category
const articles = await client.fetch(
  `*[_type == "helpArticle" && category._ref == $catId]{_id, "title": title.en, "slug": slug.current}`,
  { catId: category._id }
)
console.log('Articles in Getting Started:', JSON.stringify(articles, null, 2))
