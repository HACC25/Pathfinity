// Lightweight wrapper helpers for generating embeddings via OpenAI.
// - `generateEmbedding` creates a single embedding for a text string.
// - `generateEmbeddings` batches multiple inputs for faster ingestion.
// These helpers centralize model selection and minor input normalization.
import { embed, embedMany } from 'ai';
import { openai } from '@ai-sdk/openai'

export async function generateEmbedding(text: string) {
    const input = text.replace("\n", " ");

    const { embedding } = await embed({
        model: openai.textEmbeddingModel('text-embedding-3-small'),
        value: input,
    });

    return embedding;
}

export async function generateEmbeddings(texts: string[]) {
    const inputs = texts.map((text) => text.replace("\n", " "));

    const { embeddings } = await embedMany({
        model: openai.textEmbeddingModel('text-embedding-3-small'),
        values: inputs,
    });

    return embeddings;
}