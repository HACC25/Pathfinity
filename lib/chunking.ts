// Simple text chunking helper used by the ingestion pipeline.
// Splits long course/descriptive content into smaller passages to produce stable chunks for embedding.
// Kept intentionally small and generic so it can be reused across sources.
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';

export const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 500,
    chunkOverlap: 50,
    separators: ["\n\n", "\n", ". ", " ", ""],
});

export async function chunkContent(content: string) {
    return textSplitter.splitText(content.trim());
}