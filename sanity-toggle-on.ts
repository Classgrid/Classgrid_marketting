import { getCliClient } from 'sanity/cli'

const client = getCliClient()

async function run() {
  console.log("🚀 Toggling ON Testimonials Controls in Sanity...")
  await client.patch("fe6fcc1b-a68e-484e-91e3-85e987abdf77")
    .set({ showTestimonialVideos: true, showClientTestimonials: true })
    .commit()
    .catch(console.error)

  const teamVision = await client.fetch(`*[_type == "classgridTeamVision"][0]{_id}`)
  if (teamVision?._id) {
    console.log("🚀 Toggling ON Team Vision Quotes in Sanity...")
    await client.patch(teamVision._id).set({ isVisible: true }).commit().catch(console.error)
  }

  const classgridVideo = await client.fetch(`*[_type == "classgridVideo"][0]{_id}`)
  if (classgridVideo?._id) {
    console.log("🚀 Toggling ON Classgrid Team Video in Sanity...")
    await client.patch(classgridVideo._id).set({ isVisible: true }).commit().catch(console.error)
  }

  console.log("✅ All four sections successfully toggled ON inside Sanity DB!")
}

run()
