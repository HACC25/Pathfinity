#!/usr/bin/env node
import path from "path";
import fs from "fs";
import { db } from "../../app/db/index";
import { source as SourceTable, document as DocumentTable, chunk as ChunkTable } from "../../app/db/schema";
import { listJsonFiles, loadJsonFile, makeId, chunkText, estimateTokens, contentHash } from "./utils";
import { eq } from "drizzle-orm";

async function upsertSource(name: string, type = "json-file", url?: string) {
  // try to find existing source by name to avoid duplicates
  const existing = await db.select().from(SourceTable).where(eq(SourceTable.name, name)).limit(1);
  if (existing.length) return existing[0].id;

  const id = makeId();
  await db.insert(SourceTable).values({ id, name, type, url: url ?? null, createdAt: new Date(), updatedAt: new Date() });
  return id;
}

function renderDocumentContent(item: any): { title: string; content: string } {
  // Try common fields first (courses, programs, jobs, skills)
  const parts: string[] = [];
  let title = item.title || item.course_title || item.program_name || item.name || item.job_title || item.title || "Document";

  if (item.course_prefix && item.course_number && item.course_title) {
    title = `${item.course_prefix} ${item.course_number} — ${item.course_title}`;
  }

  // collect textual fields
  const textFields = ["description", "course_desc", "program_desc", "metadata", "content", "summary", "job_description", "notes"];
  for (const field of textFields) {
    if (item[field]) parts.push(String(item[field]));
  }

  // fall back to stringify the object (useful when fields are unknown)
  if (parts.length === 0) parts.push(JSON.stringify(item, null, 2));

  const content = parts.join("\n\n");
  return { title, content };
}

async function ingestFile(filePath: string) {
  console.log(`Ingesting ${filePath}`);
  const baseName = path.basename(filePath);
  const data = loadJsonFile(filePath);
  const srcId = await upsertSource(baseName, "json-file");

  const items = Array.isArray(data) ? data : [data];
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const docId = makeId();
    const { title, content } = renderDocumentContent(item);

    // idempotency: skip if document with same content hash already exists
    const hash = contentHash(content);
  const existingDoc = await db.select().from(DocumentTable).where(eq(DocumentTable.contentHash, hash)).limit(1);
    if (existingDoc.length) {
      console.log(`  -> document already exists (skipping) id=${existingDoc[0].id}`);
      continue;
    }

    await db.insert(DocumentTable).values({
      id: docId,
      title,
      content,
      metadata: JSON.stringify(item),
      contentHash: hash,
      sourceId: srcId,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // chunk and insert
    const chunks = chunkText(content, 1200, 200);
    for (const txt of chunks) {
      await db.insert(ChunkTable).values({
        documentId: docId,
        text: txt,
        embedding: null,
        status: "pending",
        tokenCount: estimateTokens(txt),
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    console.log(`  -> inserted document ${docId} with ${chunks.length} chunks`);
  }
}

async function main() {
  const dataDir = path.resolve(process.cwd(), "scripts/ingest/data");
  if (!fs.existsSync(dataDir)) {
    console.error("Data directory not found:", dataDir);
    process.exit(1);
  }

  const files = listJsonFiles(dataDir);
  if (files.length === 0) {
    console.log("No JSON files found in data directory.");
    return;
  }

  for (const f of files) {
    try {
      await ingestFile(f);
    } catch (e) {
      console.error(`Failed to ingest ${f}:`, e);
    }
  }

  console.log("Ingestion complete.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
