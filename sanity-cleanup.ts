import { getCliClient } from 'sanity/cli'

const client = getCliClient()

async function run() {
  console.log("🧹 Cleaning up old unused data from Sanity DB (Both Drafts and Published)...")
  
  const fieldsToRemove = [
    'showIsometricStack', 
    'showModuleGrid', 
    'showTeamVision', 
    'showTurboComparison', 
    'showWhyClassgrid', 
    'teamVisionTitle', 
    'whyClassgridTitle'
  ];

  // Clean published document
  await client.patch("fe6fcc1b-a68e-484e-91e3-85e987abdf77")
    .unset(fieldsToRemove)
    .commit()
    .catch(() => console.log("No published document found, skipping..."))

  // Clean draft document
  await client.patch("drafts.fe6fcc1b-a68e-484e-91e3-85e987abdf77")
    .unset(fieldsToRemove)
    .commit()
    .catch(() => console.log("No draft document found, skipping..."))

  console.log("✨ Database cleaned successfully!")
}

run()
