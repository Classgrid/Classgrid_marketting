async function patch() {
  const { getCliClient } = require('sanity/cli');
  const client = getCliClient();

  try {
    const publishedId = "635a3f02-750f-4d4c-971c-a6fd7e1e13ce";
    
    // Fetch published document
    const publishedDoc = await client.getDocument(publishedId);
    
    if (publishedDoc) {
      let footerColumns = publishedDoc.footerColumns || [];
      
      // Filter out Security
      let updatedColumns = footerColumns.map((col: any) => {
        if (!col.links) return col;
        return {
          ...col,
          links: col.links.filter((link: any) => link.label?.toLowerCase() !== 'security')
        };
      });

      // Add Compare
      if (updatedColumns.length > 0) {
        const hasCompare = updatedColumns[0].links.some((l: any) => l.label?.toLowerCase().includes('compare'));
        if (!hasCompare) {
          updatedColumns[0].links.push({
            _key: 'compare_link_' + Date.now(),
            label: 'Compare',
            href: '/compare'
          });
        }
      }

      await client.patch(publishedId).set({ footerColumns: updatedColumns }).commit();
      console.log("✅ Patched PUBLISHED document");
    }

    // Try draft
    const draftId = "drafts.635a3f02-750f-4d4c-971c-a6fd7e1e13ce";
    const draftDoc = await client.getDocument(draftId);
    
    if (draftDoc) {
      let footerColumns = draftDoc.footerColumns || [];
      let updatedColumns = footerColumns.map((col: any) => {
        if (!col.links) return col;
        return {
          ...col,
          links: col.links.filter((link: any) => link.label?.toLowerCase() !== 'security')
        };
      });

      if (updatedColumns.length > 0) {
        const hasCompare = updatedColumns[0].links.some((l: any) => l.label?.toLowerCase().includes('compare'));
        if (!hasCompare) {
          updatedColumns[0].links.push({
            _key: 'compare_link_' + Date.now(),
            label: 'Compare',
            href: '/compare'
          });
        }
      }

      await client.patch(draftId).set({ footerColumns: updatedColumns }).commit();
      console.log("✅ Patched DRAFT document");
    }
  } catch (error) {
    console.error("Failed:", error);
  }
}
patch();
