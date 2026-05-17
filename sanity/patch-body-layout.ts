async function patch() {
  const { getCliClient } = require('sanity/cli');
  const client = getCliClient();

  const body = [
    // Section 1: The Challenge (Image Left)
    { _type: 'block', _key: 'e1', style: 'h2', children: [{ _type: 'span', _key: 'es1', text: 'The Challenge' }] },
    { _type: 'block', _key: 'e2', style: 'normal', children: [{ _type: 'span', _key: 'es2', text: '25 campuses. Zero unified visibility.' }] },
    { _type: 'block', _key: 'e3', style: 'normal', children: [{ _type: 'span', _key: 'es3', text: 'Each institution operated independently — separate fee systems, manual attendance, fragmented communication. Data silos made network-wide reporting impossible.' }] },
    {
      _type: 'image', _key: 'ei1', layout: 'left',
      asset: { _type: 'reference', _ref: 'image-db34fe0813c2f0c824fe050db8800761f0e438c5-800x600-jpg' }
    },

    // Section 2: Finding the Right Partner (Image Right)
    { _type: 'block', _key: 'e4', style: 'h2', children: [{ _type: 'span', _key: 'es4', text: 'Finding the Right Partner' }] },
    { _type: 'block', _key: 'e5', style: 'normal', children: [{ _type: 'span', _key: 'es5', text: 'We evaluated dozens of platforms. Few could deploy across 25 locations simultaneously without operational disruption.' }] },
    { _type: 'block', _key: 'e6', style: 'normal', children: [{ _type: 'span', _key: 'es6', text: 'ClassGrid stood out — modern architecture, mobile-first design, deep understanding of Indian education.' }] },
    {
      _type: 'image', _key: 'ei2', layout: 'right',
      asset: { _type: 'reference', _ref: 'image-db34fe0813c2f0c824fe050db8800761f0e438c5-800x600-jpg' }
    },

    // Section 3: Finance Transformation (Image Center)
    { _type: 'block', _key: 'e7', style: 'h2', children: [{ _type: 'span', _key: 'es7', text: 'Finance, Transformed' }] },
    { _type: 'block', _key: 'e8', style: 'normal', children: [{ _type: 'span', _key: 'es8', text: '40% reduction in late payments within the first semester.' }] },
    { _type: 'block', _key: 'e9', style: 'normal', children: [{ _type: 'span', _key: 'es9', text: 'Automated reminders. Real-time dashboards. Reconciliation that once took two weeks is now instantaneous.' }] },
    {
      _type: 'image', _key: 'ei3', layout: 'center',
      asset: { _type: 'reference', _ref: 'image-db34fe0813c2f0c824fe050db8800761f0e438c5-800x600-jpg' }
    },

    // Section 4: Attendance & Communication (Image Right explicitly)
    { _type: 'block', _key: 'e10', style: 'h2', children: [{ _type: 'span', _key: 'es10', text: 'Real-Time Visibility' }] },
    { _type: 'block', _key: 'e11', style: 'normal', children: [{ _type: 'span', _key: 'es11', text: 'Faculty mark attendance in seconds via mobile. Instant parent alerts for absences.' }] },
    { _type: 'block', _key: 'e12', style: 'normal', children: [{ _type: 'span', _key: 'es12', text: '15% improvement in student attendance across the entire network.' }] },
    {
      _type: 'image', _key: 'ei4', layout: 'right',
      asset: { _type: 'reference', _ref: 'image-db34fe0813c2f0c824fe050db8800761f0e438c5-800x600-jpg' }
    },
  ];

  try {
    const res = await client
      .patch("F7UTJs143qSd27cb9VDPdZ")
      .set({ body })
      .commit();
    console.log("✅ Body content updated with explicit layout field:", res._id);
  } catch (error) {
    console.error("Failed:", error);
  }
}
patch();
