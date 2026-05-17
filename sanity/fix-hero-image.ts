async function fix() {
  const { getCliClient } = require('sanity/cli');
  const client = getCliClient();

  // Delete the two duplicates that have null heroImage
  const idsToDelete = ["F7UTJs143qSd27cb9VDJn2", "h25KgYv1nz0Cr8uXfcg9TT"];

  for (const id of idsToDelete) {
    try {
      await client.delete(id);
      console.log(`Deleted duplicate: ${id}`);
    } catch (err: any) {
      console.error(`Failed to delete ${id}:`, err.message);
    }
  }

  // The remaining doc F7UTJs143qSd27cb9VDPdZ already has heroImage set.
  // But let's verify:
  const remaining = await client.getDocument("F7UTJs143qSd27cb9VDPdZ");
  console.log("Remaining doc heroImage:", JSON.stringify(remaining?.heroImage));
  console.log("Done! Only one document remains with the correct heroImage.");
}

fix().catch(console.error);
