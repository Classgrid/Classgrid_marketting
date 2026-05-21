import { getCliClient } from 'sanity/cli'
import { v4 as uuidv4 } from 'uuid'

const client = getCliClient()

const visionQuotes = [
  {
    _key: uuidv4(),
    name: "Nikhil Shinde",
    role: "Founder & CEO",
    text: "We built Classgrid because every institution — whether a 50-student coaching centre or a 5,000-student university — deserves the same infrastructure-grade tools.",
  },
  {
    _key: uuidv4(),
    name: "Piyush Gawai",
    role: "Marketing Expert",
    text: "Classgrid gave us the visibility we never had — every campaign, every outreach, every result tied directly back to real student outcomes.",
  },
  {
    _key: uuidv4(),
    name: "Rohan Mehta",
    role: "Head of Product",
    text: "Every feature we ship is obsessively designed around one question: does this make someone's job easier today?",
  },
  {
    _key: uuidv4(),
    name: "Priya Kulkarni",
    role: "Lead Engineer",
    text: "We don't build features. We build operating systems for academic institutions — invisible when they work, transformative when they're adopted.",
  },
  {
    _key: uuidv4(),
    name: "Anjali Desai",
    role: "Customer Success Lead",
    text: "The moment a teacher tells me Classgrid saved them two hours a week — that's when I know we're doing exactly what we set out to do.",
  },
  {
    _key: uuidv4(),
    name: "Vikram Nair",
    role: "Academic Partnerships",
    text: "Our mission is simple — eliminate the friction between teaching and learning so educators can focus on what truly matters.",
  },
]

async function run() {
  console.log("🚀 Pushing 6 Team Vision quotes to Sanity...")

  // Fetch the existing classgridTeamVision document
  const doc = await client.fetch(`*[_type == "classgridTeamVision"][0]{_id}`)

  if (doc?._id) {
    // Patch existing document — append quotes
    await client.patch(doc._id)
      .set({ quotes: visionQuotes })
      .commit()
    console.log(`✅ Updated existing document (${doc._id}) with 6 quotes!`)
  } else {
    // Create new document with quotes
    await client.create({
      _type: 'classgridTeamVision',
      isVisible: true,
      label: 'From Our Team',
      title: 'Our Vision',
      description: 'The people behind Classgrid — why we built it, what drives us, and where we\'re taking education next.',
      quotes: visionQuotes,
    })
    console.log("✅ Created new classgridTeamVision document with 6 quotes!")
  }

  console.log("🎉 Done! Refresh your browser to see the quotes.")
}

run()
