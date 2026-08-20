import { retrieveClassgridContext } from "./lib/ai/rag-retrieve";
import { connectMongo } from "./lib/mongodb";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

async function run() {
  await connectMongo();
  const email = `My name is Swapnil, and I am the Head of Department (HOD) at Ram Charan College. We are currently evaluating Classgrid for our institution and would like to understand the complete integration ecosystem available with Classgrid. Could you please provide us with a comprehensive list of all third-party integrations, platforms, services, APIs, and external tools that Classgrid currently supports or can integrate with?`;
  
  console.log("Testing RAG retrieval...");
  const result = await retrieveClassgridContext(email);
  console.log("Result:");
  console.log(JSON.stringify(result, null, 2));
  process.exit(0);
}

run().catch(console.error);
