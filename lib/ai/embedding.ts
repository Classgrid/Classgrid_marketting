export const RAG_EMBEDDING_MODEL = "Xenova/all-MiniLM-L6-v2";
export const RAG_EMBEDDING_DIMENSIONS = 384;

type FeatureExtractionOutput = {
  data: Iterable<number> | ArrayLike<number>;
};

type FeatureExtractor = (
  text: string,
  options: { pooling: "mean"; normalize: boolean }
) => Promise<FeatureExtractionOutput>;

type EmbeddingCache = {
  promise: Promise<FeatureExtractor> | null;
};

declare global {
  var classgridRagEmbeddingCache: EmbeddingCache | undefined;
}

const cache = global.classgridRagEmbeddingCache ?? { promise: null };
global.classgridRagEmbeddingCache = cache;

function toNumberArray(data: FeatureExtractionOutput["data"]): number[] {
  return Array.from(data as Iterable<number>).map((value) => Number(value));
}

export async function getEmbeddingModel(): Promise<FeatureExtractor> {
  if (!cache.promise) {
    cache.promise = import("@xenova/transformers").then(async ({ pipeline }) => {
      return (await pipeline("feature-extraction", RAG_EMBEDDING_MODEL)) as FeatureExtractor;
    });
  }

  return cache.promise;
}

function getVoyageKey() {
  return process.env.VOYAGE_API_KEY?.trim() || "pa-gk_XkG3GvxIpFo3WKyh9DH1VTSk7xp3X87y4oR8AgRs";
}

export async function embedWithVoyage(texts: string[]): Promise<number[][]> {
  const apiKey = getVoyageKey();
  if (!apiKey) {
    console.error(`❌ [VOYAGE AI] FATAL: No VOYAGE_API_KEY found! Cannot generate embeddings!`);
    throw new Error("Missing VOYAGE_API_KEY");
  }

  const startTime = Date.now();
  console.log(`\n╔══════════════════════════════════════════════════════════╗`);
  console.log(`║  🚀 VOYAGE AI — Embedding Request Started                ║`);
  console.log(`╠══════════════════════════════════════════════════════════╣`);
  console.log(`║  Model: voyage-3-large (1024 dimensions)               ║`);
  console.log(`║  Texts to embed: ${texts.length}                                    ║`);
  console.log(`║  Input preview: "${texts[0]?.slice(0, 60)}..."`);
  console.log(`╚══════════════════════════════════════════════════════════╝`);

  // Using MongoDB's unified Atlas AI API to bypass the legacy Voyage 3 RPM rate limit 
  // and utilize the $500 Startup Credits directly!
  const response = await fetch("https://ai.mongodb.com/v1/embeddings", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      input: texts,
      model: "voyage-3-large",
    }),
  });

  const elapsed = Date.now() - startTime;

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`\n╔══════════════════════════════════════════════════════════╗`);
    console.error(`║  ❌ VOYAGE AI — EMBEDDING FAILED!                        ║`);
    console.error(`╠══════════════════════════════════════════════════════════╣`);
    console.error(`║  HTTP Status: ${response.status}                                    ║`);
    console.error(`║  Error: ${errorText.slice(0, 200)}`);
    console.error(`║  Time: ${elapsed}ms                                         ║`);
    console.error(`╚══════════════════════════════════════════════════════════╝`);
    throw new Error(`Voyage AI Error: ${response.status} ${errorText}`);
  }

  const data = await response.json();
  const embeddings = data.data.map((item: any) => item.embedding);
  const dims = embeddings[0]?.length || 0;

  console.log(`\n╔══════════════════════════════════════════════════════════╗`);
  console.log(`║  ✅ VOYAGE AI — Embedding SUCCESS!                       ║`);
  console.log(`╠══════════════════════════════════════════════════════════╣`);
  console.log(`║  Dimensions: ${dims}                                       ║`);
  console.log(`║  Vectors returned: ${embeddings.length}                                  ║`);
  console.log(`║  Time: ${elapsed}ms                                         ║`);
  console.log(`║  Usage: ${JSON.stringify(data.usage || {})}`);
  console.log(`╚══════════════════════════════════════════════════════════╝`);

  return embeddings;
}

export async function embedText(text: string): Promise<number[]> {
  if (getVoyageKey()) {
    console.log(`[VOYAGE AI] embedText() → Using Voyage AI (NOT Xenova)`);
    const embeddings = await embedWithVoyage([text]);
    return embeddings[0];
  }

  console.warn(`⚠️ [VOYAGE AI] embedText() → FALLBACK to Xenova (384d)! Voyage key missing!`);
  const embedder = await getEmbeddingModel();
  const output = await embedder(text, { pooling: "mean", normalize: true });
  return toNumberArray(output.data);
}

export async function embedManyTexts(texts: string[]): Promise<number[][]> {
  if (getVoyageKey()) {
    // Voyage supports batching natively
    return await embedWithVoyage(texts);
  }

  const embeddings: number[][] = [];
  for (const text of texts) {
    embeddings.push(await embedText(text));
  }
  return embeddings;
}
