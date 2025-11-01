CREATE TABLE "embeddings" (
	"id" serial PRIMARY KEY NOT NULL,
	"source_id" text NOT NULL,
	"ref_id" text,
	"title" text,
	"campus" text,
	"course_code" text,
	"content" text,
	"metadata" jsonb,
	"content_hash" text,
	"embedding" vector(1536),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sources" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"url" text,
	"type" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "embeddings" ADD CONSTRAINT "embeddings_source_id_sources_id_fk" FOREIGN KEY ("source_id") REFERENCES "public"."sources"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "embedding_vector_idx" ON "embeddings" USING ivfflat ("embedding" vector_cosine_ops);