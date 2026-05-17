async function patch() {
  const { getCliClient } = require('sanity/cli');
  const client = getCliClient();

  // We are patching the same massive case study document
  const docId = "F7UTJs143qSd27cb9VDPdZ"; 
  
  const body = [
    // 1. Two paragraphs of 10 lines each (Standalone Full Text)
    { _type: 'block', _key: 'b1', style: 'h2', children: [{ _type: 'span', _key: 's1', text: '1. The Initial State (Full Width Text)' }] },
    { _type: 'block', _key: 'b2', style: 'normal', children: [{ _type: 'span', _key: 's2', text: 'When managing an educational network of unprecedented scale, the operational complexities grow exponentially. Before implementing a unified system, our 25 campuses were operating in isolation. Each institution had its own idiosyncratic processes for fee collection, attendance tracking, and parent communication. This fragmentation resulted in data silos that made network-wide reporting virtually impossible. Administrators spent countless hours reconciling spreadsheets, dealing with data entry errors, and managing disparate software solutions that refused to integrate. The administrative burden was not only costly but was fundamentally detracting from our core mission of providing high-quality education. We realized that a paradigm shift was necessary—we needed a centralized, robust ERP solution that could handle massive data volumes while remaining flexible enough to accommodate the unique needs of each campus.' }] },
    { _type: 'block', _key: 'b3', style: 'normal', children: [{ _type: 'span', _key: 's3', text: 'The search for the right partner was exhaustive. We evaluated numerous legacy systems and modern startups, but few could demonstrate the capability to deploy across 25 distinct locations simultaneously without causing massive operational disruption. ClassGrid stood out because of its modern architecture, mobile-first approach, and a deep understanding of the Indian educational landscape. We decided on a phased rollout, beginning with the finance module. Fee collection had always been a massive pain point, characterized by long queues during admission season, manual receipt generation, and a high rate of delayed payments. By integrating ClassGrid\'s automated fee collection system with our existing payment gateways, we fundamentally transformed this process.' }] },

    // 2. YouTube video on right, text on left
    { _type: 'block', _key: 'b4', style: 'h2', children: [{ _type: 'span', _key: 's4', text: '2. Video Right, Text Left' }] },
    { _type: 'block', _key: 'b5', style: 'normal', children: [{ _type: 'span', _key: 's5', text: 'We integrated a custom YouTube embed directly into the workflow. As you can see on the right, the video explains the core concepts clearly while the text supports it on the left.' }] },
    {
      _type: 'video', _key: 'v1', layout: 'right', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
    },

    // 3. Short table, then paragraph below it (Full Width)
    { _type: 'block', _key: 'b6', style: 'h2', children: [{ _type: 'span', _key: 's6', text: '3. Table and Paragraph (Full Width)' }] },
    {
      _type: 'table', _key: 't1', rows: [
        { _key: 'r1', _type: 'tableRow', cells: ['Metric', 'Before ClassGrid', 'After ClassGrid'] },
        { _key: 'r2', _type: 'tableRow', cells: ['Fee Collection', 'Manual (2 weeks)', 'Automated (Instant)'] },
        { _key: 'r3', _type: 'tableRow', cells: ['Attendance', 'Paper Registers', 'Mobile App'] }
      ]
    },
    { _type: 'block', _key: 'b7', style: 'normal', children: [{ _type: 'span', _key: 's7', text: 'The table above clearly illustrates the massive leap in efficiency we achieved. By moving away from manual processes, we saved thousands of hours.' }] },

    // 4. Image in middle with text on both sides
    { _type: 'block', _key: 'b8', style: 'h2', children: [{ _type: 'span', _key: 's8', text: '4. Image Center (Split Layout 1)' }] },
    { _type: 'block', _key: 'b9', style: 'normal', children: [{ _type: 'span', _key: 's9', text: 'Text on the left side of the image explaining the context.' }] },
    { _type: 'block', _key: 'b10', style: 'normal', children: [{ _type: 'span', _key: 's10', text: 'Text on the right side of the image continuing the story.' }] },
    {
      _type: 'image', _key: 'i1', layout: 'center',
      asset: { _type: 'reference', _ref: 'image-db34fe0813c2f0c824fe050db8800761f0e438c5-800x600-jpg' }
    },

    // 5. Image in middle with text on both sides AGAIN
    { _type: 'block', _key: 'b11', style: 'h2', children: [{ _type: 'span', _key: 's11', text: '5. Image Center (Split Layout 2)' }] },
    { _type: 'block', _key: 'b12', style: 'normal', children: [{ _type: 'span', _key: 's12', text: 'Another image in the center. We can chain these together infinitely.' }] },
    { _type: 'block', _key: 'b13', style: 'normal', children: [{ _type: 'span', _key: 's13', text: 'And the text flows perfectly around it, balancing the composition.' }] },
    {
      _type: 'image', _key: 'i2', layout: 'center',
      asset: { _type: 'reference', _ref: 'image-db34fe0813c2f0c824fe050db8800761f0e438c5-800x600-jpg' }
    },

    // 6. Image on Left
    { _type: 'block', _key: 'b14', style: 'h2', children: [{ _type: 'span', _key: 's14', text: '6. Image Left' }] },
    { _type: 'block', _key: 'b15', style: 'normal', children: [{ _type: 'span', _key: 's15', text: 'This section has an image explicitly set to the left side.' }] },
    {
      _type: 'image', _key: 'i3', layout: 'left',
      asset: { _type: 'reference', _ref: 'image-db34fe0813c2f0c824fe050db8800761f0e438c5-800x600-jpg' }
    },

    // 7. Image on Right
    { _type: 'block', _key: 'b16', style: 'h2', children: [{ _type: 'span', _key: 's16', text: '7. Image Right' }] },
    { _type: 'block', _key: 'b17', style: 'normal', children: [{ _type: 'span', _key: 's17', text: 'And this section has an image explicitly set to the right side.' }] },
    {
      _type: 'image', _key: 'i4', layout: 'right',
      asset: { _type: 'reference', _ref: 'image-db34fe0813c2f0c824fe050db8800761f0e438c5-800x600-jpg' }
    }
  ];

  try {
    const res = await client
      .patch(docId)
      .set({ 
        overview: "This is the overview field. It appears right below the hero and before the main body. It is perfect for setting the stage.",
        conclusion: "This is the conclusion field. It appears after all the dynamic body content and summarizes the entire case study perfectly before showing the quote.",
        body,
        galleryImages: Array.from({ length: 12 }).map(() => ({
          _type: 'image',
          asset: { _type: 'reference', _ref: 'image-db34fe0813c2f0c824fe050db8800761f0e438c5-800x600-jpg' }
        }))
      })
      .commit();
    console.log("✅ Custom complex layout successfully applied:", res._id);
  } catch (error) {
    console.error("Failed:", error);
  }
}
patch();
