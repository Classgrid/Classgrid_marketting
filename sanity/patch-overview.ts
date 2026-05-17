async function patch() {
  const { getCliClient } = require('sanity/cli');
  const client = getCliClient();

  try {
    const res = await client
      .patch("F7UTJs143qSd27cb9VDPdZ")
      .set({
        overview: "Global Education Trust, one of Maharashtra's largest educational networks, faced the monumental challenge of unifying 25 campuses under a single digital platform. Legacy systems, manual processes, and fragmented communication were costing them lakhs in administrative overhead. This case study documents how ClassGrid transformed their operations from end to end.",
        conclusion: "The deployment of ClassGrid across Global Education Trust's 25-campus network stands as one of the most comprehensive digital transformation projects in Indian education. By replacing fragmented legacy systems with a unified, intelligent platform, the Trust achieved 100% process automation, eliminated manual errors, and delivered a 10x return on investment within the first year. This project proves that even the most complex educational ecosystems can achieve unprecedented levels of efficiency and transparency with the right technology partner."
      })
      .commit();
    console.log("✅ Patched overview and conclusion:", res._id);
  } catch (error) {
    console.error("Failed:", error);
  }
}
patch();
