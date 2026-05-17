async function patch() {
  const { getCliClient } = require('sanity/cli');
  const client = getCliClient();

  try {
    const res = await client
      .patch("F7UTJs143qSd27cb9VDPdZ")
      .set({ year: "March 15, 2025" })
      .commit();
    console.log("Updated year to full date:", res.year);
  } catch (error) {
    console.error("Failed:", error);
  }
}
patch();
