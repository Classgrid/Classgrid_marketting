import fs from "fs";
import path from "path";
import { connectMongo } from "../lib/mongodb";
import { RagChunk } from "../lib/models/RagChunk";
import { embedText, RAG_EMBEDDING_MODEL, RAG_EMBEDDING_DIMENSIONS } from "../lib/ai/embedding";
import dotenv from "dotenv";

dotenv.config({ path: ".env" });
dotenv.config({ path: ".env.local" });

const filesToIngest = [
  "documentation/custom-domains-doc.md",
  "documentation/introduction-doc.md",
  "documentation/quickstart-doc.md",
  "documentation/rbac-login-doc.md",
];

function chunkMarkdown(text: string, maxTokens = 400): string[] {
  // A simplistic chunker for markdown: split by double newlines (paragraphs/headers)
  const paragraphs = text.split(/\n\s*\n/);
  const chunks: string[] = [];
  let currentChunk = "";

  for (const para of paragraphs) {
    if (currentChunk.length + para.length > maxTokens * 4) {
      if (currentChunk.trim()) chunks.push(currentChunk.trim());
      currentChunk = para + "\n\n";
    } else {
      currentChunk += para + "\n\n";
    }
  }
  if (currentChunk.trim()) chunks.push(currentChunk.trim());
  return chunks;
}

async function run() {
  await connectMongo();
  console.log("Connected to MongoDB");

  for (const file of filesToIngest) {
    const filePath = path.join(process.cwd(), file);
    if (!fs.existsSync(filePath)) {
      console.warn(`File not found: ${filePath}`);
      continue;
    }

    const content = fs.readFileSync(filePath, "utf-8");
    const documentId = `local-md-${path.basename(file, ".md")}`;
    const pageTitle = path.basename(file, ".md").replace(/-/g, " ");

    console.log(`Processing ${file}...`);

    // Clean existing chunks for this doc
    await RagChunk.deleteMany({ documentId });

    const chunks = chunkMarkdown(content);
    console.log(`Split into ${chunks.length} chunks.`);

    const rows = [];
    for (let i = 0; i < chunks.length; i++) {
      const text = chunks[i];
      console.log(`Embedding chunk ${i + 1}/${chunks.length}...`);
      const embedding = await embedText(text);

      rows.push({
        documentId,
        documentType: "local_markdown",
        chunkIndex: i,
        chunkText: text,
        embedding,
        pageSlug: documentId,
        pageTitle,
        source: "static",
        metadata: {
          embeddingModel: RAG_EMBEDDING_MODEL,
          embeddingDimensions: RAG_EMBEDDING_DIMENSIONS,
          file,
        },
      });
    }

    if (rows.length > 0) {
      await RagChunk.insertMany(rows, { ordered: false });
      console.log(`Successfully ingested ${rows.length} chunks for ${file}!\n`);
    }
  }

  console.log("Ingestion complete!");
  process.exit(0);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
