import mongoose, { Schema, Document } from "mongoose";

export interface IArticleEmbedding extends Document {
  articleId: string;
  articleType: string;
  chunkIndex: number;
  chunkText: string;
  embedding: number[];
  updatedAt: Date;
}

const ArticleEmbeddingSchema = new Schema<IArticleEmbedding>(
  {
    articleId: { type: String, required: true, index: true },
    articleType: { type: String, required: true },
    chunkIndex: { type: Number, required: true },
    chunkText: { type: String, required: true },
    embedding: { type: [Number], required: true },
  },
  { timestamps: true }
);

export const ArticleEmbedding =
  mongoose.models.ArticleEmbedding ||
  mongoose.model<IArticleEmbedding>("ArticleEmbedding", ArticleEmbeddingSchema);
