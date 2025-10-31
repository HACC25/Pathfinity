import fs from "fs";
import path from "path";
import crypto from "crypto";

export function listJsonFiles(dir: string) {
  const files = fs.readdirSync(dir);
  return files.filter((f) => f.toLowerCase().endsWith(".json")).map((f) => path.join(dir, f));
}

export function loadJsonFile(filePath: string) {
  const raw = fs.readFileSync(filePath, "utf8");
  try {
    return JSON.parse(raw);
  } catch (e) {
    // attempt to recover if file contains comments or trailing commas
    const cleaned = raw.replace(/\/\*[\s\S]*?\*\//g, "").replace(/,\s*]/g, "]").replace(/,\s*}/g, "}");
    return JSON.parse(cleaned);
  }
}

export function makeId() {
  // Node 18+ has crypto.randomUUID()
  if ((crypto as any).randomUUID) return (crypto as any).randomUUID();
  return crypto.randomBytes(16).toString("hex");
}

export function contentHash(text: string) {
  return crypto.createHash("sha256").update(text || "").digest("hex");
}

export function chunkText(text: string, chunkSize = 1000, overlap = 200) {
  if (!text) return [];
  const cleaned = text.replace(/\s+/g, " ").trim();
  const chunks: string[] = [];
  let start = 0;
  while (start < cleaned.length) {
    const end = Math.min(start + chunkSize, cleaned.length);
    chunks.push(cleaned.slice(start, end).trim());
    if (end === cleaned.length) break;
    start = Math.max(end - overlap, end);
  }
  return chunks;
}

export function estimateTokens(text: string) {
  // rough estimate: 1 token ~ 4 characters
  return Math.max(1, Math.round(text.length / 4));
}
