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
  if (!apiKey) throw new Error("Missing VOYAGE_API_KEY");

  const response = await fetch("https://api.voyageai.com/v1/embeddings", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      input: texts,
      model: "voyage-large-2-instruct",
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Voyage AI Error: ${response.status} ${errorText}`);
  }

  const data = await response.json();
  return data.data.map((item: any) => item.embedding);
}

export async function embedText(text: string): Promise<number[]> {
  if (getVoyageKey()) {
    const embeddings = await embedWithVoyage([text]);
    return embeddings[0];
  }

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
