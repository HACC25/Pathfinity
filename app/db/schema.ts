import {
  boolean,
  pgTable,
  text,
  timestamp,
  serial,
  vector,
  index,
  jsonb,
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
  type: text("type").notNull(), // e.g. 'json-file', 'api'
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Embeddings: store only the embeddings and minimal metadata, linked to a source.
export const embedding = pgTable("embeddings", {
  id: serial("id").primaryKey(),
  sourceId: text("source_id").notNull().references(() => source.id, { onDelete: "cascade" }),
  refId: text("ref_id"),              // record ID in source (e.g., courseCode)
  title: text("title"),               // human-readable title
  campus: text("campus"),             // optional display info
  courseCode: text("course_code"),    // optional for courses
  content: text("content"),           // the text used to create embedding
  metadata: jsonb("metadata"),        // store the full original object
  contentHash: text("content_hash"),  // optional deduplication
  embedding: vector("embedding", { dimensions: 1536 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    index("embedding_vector_idx").using("ivfflat", table.embedding.op("vector_cosine_ops")),
  ]
);