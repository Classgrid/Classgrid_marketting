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

export async function embedText(text: string): Promise<number[]> {
  const embedder = await getEmbeddingModel();
  const output = await embedder(text, { pooling: "mean", normalize: true });
  return toNumberArray(output.data);
}

export async function embedManyTexts(texts: string[]): Promise<number[][]> {
  const embeddings: number[][] = [];
  for (const text of texts) {
    embeddings.push(await embedText(text));
  }
  return embeddings;
}
