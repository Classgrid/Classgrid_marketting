import mongoose, { Document, Model, Schema } from "mongoose";

export type RagChunkSource = "sanity" | "static";

export interface IRagChunk extends Document {
  documentId: string;
  documentType: string;
  chunkIndex: number;
  chunkText: string;
  embedding: number[];
  pageSlug?: string;
  pageTitle?: string;
  section?: string;
  contentType?: string;
  sourceUrl?: string;
  source: RagChunkSource;
  sourceUpdatedAt?: Date;
  metadata?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

const RagChunkSchema = new Schema<IRagChunk>(
  {
    documentId: { type: String, required: true, index: true },
    documentType: { type: String, required: true, index: true },
    chunkIndex: { type: Number, required: true },
    chunkText: { type: String, required: true },
    embedding: { type: [Number], required: true },
    pageSlug: { type: String, index: true },
    pageTitle: { type: String },
    section: { type: String },
    contentType: { type: String, index: true },
    sourceUrl: { type: String },
    source: { type: String, enum: ["sanity", "static"], default: "sanity", index: true },
    sourceUpdatedAt: { type: Date },
    metadata: { type: Schema.Types.Mixed },
  },
  { collection: "rag_chunks", timestamps: true }
);

RagChunkSchema.index({ documentId: 1, chunkIndex: 1 }, { unique: true });
RagChunkSchema.index({ pageSlug: 1, documentType: 1 });

export const RagChunk =
  (mongoose.models.RagChunk as Model<IRagChunk>) ||
  mongoose.model<IRagChunk>("RagChunk", RagChunkSchema);
