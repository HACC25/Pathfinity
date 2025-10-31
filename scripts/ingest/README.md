Place JSON files you want to ingest into the `data/` folder and run the ingestion script.

Overview
- `ingest-json.ts` — reads all JSON files in `data/` and imports them into the database as RAG `source` -> `document` -> `chunk` rows.
- `utils.ts` — helper functions: JSON loading, simple chunking, id generation.

How to run
1. Put your JSON files in `scripts/ingest/data/`.
2. From repo root run (use ts-node or compile to JS):

```bash
npx ts-node --esm scripts/ingest/ingest-json.ts
```

Alternatively compile and run the script with tsc/node after building.

Notes
- The script writes `source`, `document`, and `chunks` into the Drizzle-managed Postgres DB using `app/db/index.ts`.
- Chunks are created with `embedding = null` and `tokenCount` approximated; run an embedding worker later to populate embeddings.

Migration / vector setup
- If you want to store embeddings in a native pgvector column (recommended), run the SQL migration before embedding:

```bash
# apply the SQL migration (example using psql):
psql "$DATABASE_URL" -f scripts/ingest/migrations/001_add_pgvector.sql
```

This creates the `vector` extension and an `embedding_vector` column on `chunks`. The ingestion script will continue to insert chunks with `embedding = null` and `status = 'pending'`; the embedding worker should write vectors to `embedding_vector` and update `status` to `indexed`.
