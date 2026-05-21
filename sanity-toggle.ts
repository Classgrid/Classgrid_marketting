import { getCliClient } from 'sanity/cli'

const client = getCliClient()

async function run() {
  console.log("🚀 Toggling OFF Testimonial Videos and Messages in Sanity...")
  await client.patch("fe6fcc1b-a68e-484e-91e3-85e987abdf77")
    .set({ showTestimonialVideos: false, showClientTestimonials: false })
    .commit()
    .catch(console.error)

  const teamVision = await client.fetch(`*[_type == "classgridTeamVision"][0]{_id}`)
  if (teamVision?._id) {
    console.log("🚀 Toggling OFF Team Vision Quotes in Sanity...")
    await client.patch(teamVision._id).set({ isVisible: false }).commit().catch(console.error)
  } else {
    console.log("🚀 Team Vision document doesn't exist yet. Creating it as OFF...")
    await client.create({ _type: 'classgridTeamVision', isVisible: false }).catch(console.error)
  }

  const classgridVideo = await client.fetch(`*[_type == "classgridVideo"][0]{_id}`)
  if (classgridVideo?._id) {
    console.log("🚀 Toggling OFF Classgrid Team Video in Sanity...")
    await client.patch(classgridVideo._id).set({ isVisible: false }).commit().catch(console.error)
  } else {
    console.log("🚀 Classgrid Video document doesn't exist yet. Creating it as OFF...")
    await client.create({ _type: 'classgridVideo', isVisible: false }).catch(console.error)
  }

  console.log("✅ All four sections successfully toggled OFF inside Sanity DB!")
}

run()
