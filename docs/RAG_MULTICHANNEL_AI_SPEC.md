# ClassGrid RAG + Groq + WhatsApp + Page-Aware Chat

This repo now uses one shared RAG backend for:

- Website Ask AI / page-aware chat
- WhatsApp support AI fallback
- Sanity CMS content indexing
- Static/codebase page, route, docs, and navigation indexing
- MongoDB Atlas Vector Search retrieval
- Groq chat completion

## Implemented Flow

```text
Sanity publish/update/delete
  -> POST /api/sync-embeddings
  -> fetch full published Sanity document
  -> extract title, slug, meta, sections, rich text, FAQs, modules, forms, legal/support text
  -> semantic chunks with metadata
  -> Xenova/all-MiniLM-L6-v2 embeddings
  -> MongoDB collection: rag_chunks
  -> Atlas $vectorSearch retrieval
  -> Groq answer
  -> Website chat or WhatsApp reply
```

Static platform knowledge is indexed into the same `rag_chunks` collection:

```text
App Router pages + page metadata + content/*.ts + docs/*.md + navigation + resource directory
  -> POST /api/sync-embeddings {"mode":"reindexPlatform"}
  -> delete old platform:: chunks and legacy manual static:: seed chunks
  -> semantic chunks with public links where available
  -> embeddings
  -> MongoDB collection: rag_chunks
  -> same retrieval and Groq answer path
```

## Key Files

- `lib/models/RagChunk.ts` stores `rag_chunks`.
- `lib/ai/rag-content.ts` extracts Sanity content and chunks it.
- `lib/ai/embedding.ts` embeds chunks and questions.
- `lib/ai/rag-sync.ts` fetches Sanity docs and reindexes MongoDB chunks.
- `lib/ai/platform-knowledge.ts` indexes App Router pages, page metadata, docs, content files, navigation, and route maps.
- `lib/ai/platform-resources.ts` defines clickable Classgrid resource links for AI answers.
- `lib/ai/rag-retrieve.ts` performs Atlas Vector Search with page-context boost.
- `lib/ai/groq-chat.ts` wraps Groq's OpenAI-compatible chat API.
- `lib/ai/rag-answer.ts` applies shared grounding and link-aware prompts for web and WhatsApp.
- `lib/classgrid-ai-guardrails.ts` keeps behavior-only rules; it must not contain platform facts.
- `lib/ai/rag-intents.ts` keeps query intent terms and forbidden/preferred wording only.
- `app/api/sync-embeddings/route.ts` handles Sanity sync and delete webhooks.
- `app/api/ask-ai/route.ts` powers website AI chat with `pageContext`.
- `lib/whatsapp/ai-support-reply.ts` uses the same RAG answer path.
- `lib/whatsapp/conversation-memory.ts` stores WhatsApp session history.
- `components/layout/AppChrome.tsx` and `AskAiPanel.tsx` send page context and show the prompt bubble.

## MongoDB Atlas Vector Index

Create this Atlas Vector Search index on collection `rag_chunks`:

```json
{
  "fields": [
    {
      "type": "vector",
      "path": "embedding",
      "numDimensions": 384,
      "similarity": "cosine"
    },
    { "type": "filter", "path": "pageSlug" },
    { "type": "filter", "path": "contentType" },
    { "type": "filter", "path": "documentType" }
  ]
}
```

Default index name: `vector_index`.
Override with `RAG_VECTOR_INDEX`.

## Sanity Webhook

Create a Sanity webhook for create, update, and delete events:

- URL: `https://classgrid.in/api/sync-embeddings`
- Method: `POST`
- Secret: same value as `SANITY_WEBHOOK_SECRET` or `RAG_SYNC_SECRET`
- Include drafts: disabled
- Trigger on: create, update, delete

The route accepts compact webhook payloads. On create/update it fetches the full published document from Sanity before indexing, so future fields/pages are covered without a custom payload projection.

## Manual Backfill

Use the same endpoint for a full reindex:

```bash
curl -X POST https://classgrid.in/api/sync-embeddings \
  -H "Content-Type: application/json" \
  -H "x-classgrid-rag-secret: $RAG_SYNC_SECRET" \
  -d "{\"mode\":\"reindexAll\"}"
```

`reindexAll` rebuilds both Sanity CMS content and static platform knowledge. To rebuild only codebase/static platform knowledge:

```bash
curl -X POST https://classgrid.in/api/sync-embeddings \
  -H "Content-Type: application/json" \
  -H "x-classgrid-rag-secret: $RAG_SYNC_SECRET" \
  -d "{\"mode\":\"reindexPlatform\"}"
```

## Runtime Env

Required:

- `MONGODB_URI` or `MONGO_URI`
- `GROQ_API_KEY`
- `NEXT_PUBLIC_SANITY_PROJECT_ID`
- `NEXT_PUBLIC_SANITY_DATASET`
- `SANITY_WEBHOOK_SECRET` or `RAG_SYNC_SECRET`

Optional:

- `SANITY_API_READ_TOKEN` or `SANITY_API_WRITE_TOKEN`
- `GROQ_MODEL`
- `WHATSAPP_GROQ_MODEL`
- `RAG_VECTOR_INDEX`
- `RAG_CHUNK_WORDS`
- `RAG_CHUNK_OVERLAP_WORDS`

## Grounding Behavior

The assistant prioritizes retrieved MongoDB chunks. If relevant chunks exist, Groq is instructed not to answer from generic model knowledge. Hardcoded prompt context is limited to behavior guardrails, safety rules, link style, and Book a Demo wording constraints; live platform facts must come from Sanity CMS or indexed website/codebase content.

## Link-Aware Behavior

When the assistant mentions a Classgrid page or support resource, it should include a direct link when available.

- Website chat uses native markdown links, such as `[Help Center](/help-center)`.
- WhatsApp uses full plain-text URLs.
- Fallback answers recommend the closest known resources, such as Help Center, Community Forum, Pricing, Support Chat, Support Ticket, or Contact Support.
- The existing header `Ask AI` button is the only launcher. The page-aware prompt is a small temporary ping beside that header button, and it does not open chat automatically.
