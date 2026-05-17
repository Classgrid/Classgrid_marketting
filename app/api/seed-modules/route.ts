import { NextResponse } from "next/server";
import { createClient } from "next-sanity";
import { moduleCatalog } from "@/content/modules";

// Connect to Sanity with the write token
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: "2024-01-01",
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
});

export async function GET() {
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json({ error: "Only allowed in development" }, { status: 403 });
  }

  try {
    const results = [];
    
    for (const mod of moduleCatalog) {
      // Determine tiers based on basic logic (can be adjusted in CMS later)
      // Usually, core academics and communication are basic. Advanced stuff is premium.
      const isBasic = ["academics", "communication", "operations"].includes(mod.category);
      
      const sanityDoc = {
        _type: "module",
        title: mod.title,
        category: mod.category,
        summary: mod.summary,
        details: mod.details,
        basicTier: isBasic,
        premiumTier: true, // Everything is in premium
        institutionTypes: ["school", "college", "coaching"], // Default to all, adjust in CMS
      };

      // Create or replace the document. We use a deterministic ID based on the module ID
      // so running this multiple times doesn't create duplicates.
      const result = await client.createIfNotExists({
        _id: `module-${mod.id}`,
        ...sanityDoc
      });
      
      results.push(result);
    }

    return NextResponse.json({ 
      success: true, 
      message: `Migrated ${results.length} modules to Sanity successfully.`,
      results 
    });
    
  } catch (error: any) {
    console.error("Migration Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
