async function patch() {
  const { getCliClient } = require('sanity/cli');
  const client = getCliClient();

  // Short, editorial body content — OpenAI style
  const body = [
    // Section 1: The Challenge
    {
      _type: 'block', _key: 'e1', style: 'h2',
      children: [{ _type: 'span', _key: 'es1', text: 'The Challenge' }]
    },
    {
      _type: 'block', _key: 'e2', style: 'normal',
      children: [{ _type: 'span', _key: 'es2', text: '25 campuses. Zero unified visibility.' }]
    },
    {
      _type: 'block', _key: 'e3', style: 'normal',
      children: [{ _type: 'span', _key: 'es3', text: 'Each institution operated independently — separate fee systems, manual attendance, fragmented communication. Data silos made network-wide reporting impossible.' }]
    },
    {
      _type: 'image', _key: 'ei1',
      asset: { _type: 'reference', _ref: 'image-db34fe0813c2f0c824fe050db8800761f0e438c5-800x600-jpg' }
    },

    // Section 2: Finding the Right Partner
    {
      _type: 'block', _key: 'e4', style: 'h2',
      children: [{ _type: 'span', _key: 'es4', text: 'Finding the Right Partner' }]
    },
    {
      _type: 'block', _key: 'e5', style: 'normal',
      children: [{ _type: 'span', _key: 'es5', text: 'We evaluated dozens of platforms. Few could deploy across 25 locations simultaneously without operational disruption.' }]
    },
    {
      _type: 'block', _key: 'e6', style: 'normal',
      children: [{ _type: 'span', _key: 'es6', text: 'ClassGrid stood out — modern architecture, mobile-first design, deep understanding of Indian education.' }]
    },
    {
      _type: 'image', _key: 'ei2',
      asset: { _type: 'reference', _ref: 'image-db34fe0813c2f0c824fe050db8800761f0e438c5-800x600-jpg' }
    },

    // Section 3: Finance Transformation
    {
      _type: 'block', _key: 'e7', style: 'h2',
      children: [{ _type: 'span', _key: 'es7', text: 'Finance, Transformed' }]
    },
    {
      _type: 'block', _key: 'e8', style: 'normal',
      children: [{ _type: 'span', _key: 'es8', text: '40% reduction in late payments within the first semester.' }]
    },
    {
      _type: 'block', _key: 'e9', style: 'normal',
      children: [{ _type: 'span', _key: 'es9', text: 'Automated reminders. Real-time dashboards. Reconciliation that once took two weeks is now instantaneous.' }]
    },
    {
      _type: 'image', _key: 'ei3',
      asset: { _type: 'reference', _ref: 'image-db34fe0813c2f0c824fe050db8800761f0e438c5-800x600-jpg' }
    },

    // Section 4: Attendance & Communication
    {
      _type: 'block', _key: 'e10', style: 'h2',
      children: [{ _type: 'span', _key: 'es10', text: 'Real-Time Visibility' }]
    },
    {
      _type: 'block', _key: 'e11', style: 'normal',
      children: [{ _type: 'span', _key: 'es11', text: 'Faculty mark attendance in seconds via mobile. Instant parent alerts for absences.' }]
    },
    {
      _type: 'block', _key: 'e12', style: 'normal',
      children: [{ _type: 'span', _key: 'es12', text: '15% improvement in student attendance across the entire network.' }]
    },
    {
      _type: 'image', _key: 'ei4',
      asset: { _type: 'reference', _ref: 'image-db34fe0813c2f0c824fe050db8800761f0e438c5-800x600-jpg' }
    },

    // Section 5: Data Democratization
    {
      _type: 'block', _key: 'e13', style: 'h2',
      children: [{ _type: 'span', _key: 'es13', text: 'Data Without Boundaries' }]
    },
    {
      _type: 'block', _key: 'e14', style: 'normal',
      children: [{ _type: 'span', _key: 'es14', text: 'For the first time, unified real-time insights across all 25 campuses.' }]
    },
    {
      _type: 'block', _key: 'e15', style: 'normal',
      children: [{ _type: 'span', _key: 'es15', text: 'From financial performance to individual student records — accessible in clicks, not weeks.' }]
    },
    {
      _type: 'image', _key: 'ei5',
      asset: { _type: 'reference', _ref: 'image-db34fe0813c2f0c824fe050db8800761f0e438c5-800x600-jpg' }
    },

    // Section 6: Looking Ahead
    {
      _type: 'block', _key: 'e16', style: 'h2',
      children: [{ _type: 'span', _key: 'es16', text: 'Looking Ahead' }]
    },
    {
      _type: 'block', _key: 'e17', style: 'normal',
      children: [{ _type: 'span', _key: 'es17', text: 'ClassGrid is not just a vendor. It is a strategic partner in our digital transformation.' }]
    },
    {
      _type: 'block', _key: 'e18', style: 'normal',
      children: [{ _type: 'span', _key: 'es18', text: 'Next: AI-driven analytics and personalized learning, built on the foundation we have today.' }]
    },
    {
      _type: 'image', _key: 'ei6',
      asset: { _type: 'reference', _ref: 'image-db34fe0813c2f0c824fe050db8800761f0e438c5-800x600-jpg' }
    },
  ];

  try {
    const res = await client
      .patch("F7UTJs143qSd27cb9VDPdZ")
      .set({ body })
      .commit();
    console.log("✅ Body content updated with short editorial paragraphs:", res._id);
  } catch (error) {
    console.error("Failed:", error);
  }
}
patch();
