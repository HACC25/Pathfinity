import {
  boolean,
  pgTable,
  text,
  timestamp,
  serial,
  integer,
  vector,
  index,
} from "drizzle-orm/pg-core";

/* User / Auth */
export const user = pgTable("users", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(), 
  emailVerified: boolean("email_verified"),
  image: text("image"),
  password: text("password"), // Add password field for email authentication
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const session = pgTable("sessions", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
});

export const account = pgTable("accounts", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  idToken: text("id_token"),
  password: text("password"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const verification = pgTable("verifications", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

/* RAG (Retrieval-Augmented Generation) tables */

// Sources represent the origin of documents (files, URLs, datasets)
export const source = pgTable("sources", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  url: text("url"),
  type: text("type"), // e.g. 'file', 'url', 'database'
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Documents store the original text/JSON blobs imported for indexing
export const document = pgTable("documents", {
  id: text("id").primaryKey(),
  title: text("title"),
  content: text("content").notNull(),
  metadata: text("metadata"),
  // hash of content for idempotency checks
  contentHash: text("content_hash"),
  sourceId: text("source_id").references(() => source.id, { onDelete: "set null" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Chunks are the smaller pieces extracted from documents and indexed
export const chunk = pgTable("chunks", {
    id: serial("id").primaryKey(),
    documentId: text("document_id").notNull().references(() => document.id, { onDelete: "cascade" }),
    text: text("text").notNull(),
    // embedding stored as JSON text (array) for portability
    embedding: text("embedding"),
    // native pgvector column for efficient ANN queries (preferred)
    embeddingVector: vector("embedding_vector", { dimensions: 1536 }),
    // chunk lifecycle/status to track embedding/indexing progress
    status: text("status"),
    tokenCount: integer("token_count"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    index("chunks_embedding_idx").using("ivfflat", table.embeddingVector.op("vector_cosine_ops")),
  ]
);

// Citations associate chunks with source references (for provenance)
export const citation = pgTable("citations", {
  id: serial("id").primaryKey(),
  // chunkId is an integer foreign key referencing chunk.id (serial)
  chunkId: integer("chunk_id").notNull().references(() => chunk.id, { onDelete: "cascade" }),
  sourceId: text("source_id").notNull().references(() => source.id, { onDelete: "cascade" }),
  note: text("note"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Optional: top-level RAG index metadata (one per index / vector store)
export const ragIndex = pgTable("rag_indexes", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  // store index configuration (e.g., provider, embedding model, dimension) as JSON string
  config: text("config"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
