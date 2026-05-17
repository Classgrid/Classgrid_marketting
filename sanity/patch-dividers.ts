async function patch() {
  const { getCliClient } = require('sanity/cli');
  const client = getCliClient();

  const docId = "F7UTJs143qSd27cb9VDPdZ"; 
  
  try {
    // Fetch the existing document body first
    const existingDoc = await client.getDocument(docId);
    const body = existingDoc.body || [];

    // Add a divider at the end of the body as an example
    body.push({
      _type: 'divider',
      _key: 'div1',
      style: 'Solid'
    });
    
    // Add another divider
    body.push({
      _type: 'block', _key: 'b99', style: 'h2', children: [{ _type: 'span', _key: 's99', text: 'This section was separated by a line!' }] 
    });
    body.push({
      _type: 'divider',
      _key: 'div2',
      style: 'Faded'
    });

    const res = await client
      .patch(docId)
      .set({ 
        overviewDivider: true,
        body
      })
      .commit();
    console.log("✅ Divider successfully applied:", res._id);
  } catch (error) {
    console.error("Failed:", error);
  }
}
patch();
