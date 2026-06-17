import { connectMongo } from "../lib/mongodb";
import mongoose from "mongoose";
import { createClient } from "@sanity/client";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

async function clearData() {
  console.log("Starting data clearance...");

  // 1. Clear Sanity aiEscalation documents
  try {
    console.log("Connecting to Sanity...");
    const sanityClient = createClient({
      projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
      dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
      apiVersion: "2024-01-01",
      token: process.env.SANITY_API_WRITE_TOKEN,
      useCdn: false,
    });
    
    console.log("Deleting aiEscalation documents...");
    const escalations = await sanityClient.fetch(`*[_type == "aiEscalation"][0...1000]._id`);
    if (escalations.length > 0) {
      const transaction = sanityClient.transaction();
      escalations.forEach((id: string) => transaction.delete(id));
      await transaction.commit();
      console.log(`✅ Deleted ${escalations.length} aiEscalation documents from Sanity.`);
    } else {
      console.log("✅ No aiEscalation documents found in Sanity.");
    }
  } catch (error) {
    console.error("❌ Failed to clear Sanity:", error);
  }

  // 2. Clear MongoDB Chat Sessions
  try {
    console.log("Connecting to MongoDB...");
    await connectMongo();
    
    const db = mongoose.connection.db;
    if (db) {
      console.log("Deleting MongoDB ChatSession documents...");
      const result = await db.collection("chatsessions").deleteMany({});
      console.log(`✅ Deleted ${result.deletedCount} ChatSession documents from MongoDB.`);
      
      // Also clear rate limits just in case
      const rateLimits = await db.collection("airatelimits").deleteMany({});
      console.log(`✅ Deleted ${rateLimits.deletedCount} AiRateLimit documents.`);
      
      // Look for ticket collections since the DB is shared
      const collections = await db.listCollections().toArray();
      const ticketCollection = collections.find(c => c.name.toLowerCase().includes("ticket"));
      
      if (ticketCollection) {
        console.log(`Found shared ticket collection: ${ticketCollection.name}. Deleting tickets...`);
        const ticketResult = await db.collection(ticketCollection.name).deleteMany({});
        console.log(`✅ Deleted ${ticketResult.deletedCount} tickets from shared MongoDB collection '${ticketCollection.name}'.`);
      } else {
        console.log("No ticket collection found in this MongoDB database.");
      }
    }
  } catch (error) {
    console.error("❌ Failed to clear MongoDB:", error);
  }

  // 3. Clear Supabase Storage (Support Attachments)
  try {
    console.log("Connecting to Supabase Storage...");
    const supabaseUrl = process.env.BLOG_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.BLOG_SUPABASE_SERVICE_ROLE_KEY;
    
    if (supabaseUrl && supabaseKey) {
      const supabase = createSupabaseClient(supabaseUrl, supabaseKey);
      
      console.log("Listing files in support-attachments bucket...");
      const { data: files, error: listError } = await supabase.storage.from("support-attachments").list();
      
      if (listError) {
        console.error("❌ Failed to list Supabase files:", listError.message);
      } else if (files && files.length > 0) {
        const fileNames = files.map(f => f.name).filter(name => name !== ".emptyFolderPlaceholder");
        if (fileNames.length > 0) {
          const { error: deleteError } = await supabase.storage.from("support-attachments").remove(fileNames);
          if (deleteError) {
            console.error("❌ Failed to delete Supabase files:", deleteError.message);
          } else {
            console.log(`✅ Deleted ${fileNames.length} files from Supabase support-attachments bucket.`);
          }
        } else {
          console.log("✅ No real files found in Supabase support-attachments bucket.");
        }
      } else {
        console.log("✅ No files found in Supabase support-attachments bucket.");
      }
    } else {
      console.log("⚠️ Supabase credentials not found, skipping storage clearance.");
    }
  } catch (error) {
    console.error("❌ Failed to clear Supabase:", error);
  }

  console.log("Data clearance complete!");
  process.exit(0);
}

clearData();
