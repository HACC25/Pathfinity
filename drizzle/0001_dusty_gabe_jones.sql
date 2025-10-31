ALTER TABLE "sessions" DROP CONSTRAINT IF EXISTS "sessions_identifier_unique";--> statement-breakpoint
ALTER TABLE "verifications" ALTER COLUMN "updated_at" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "sessions" ADD COLUMN IF NOT EXISTS "token" text NOT NULL;--> statement-breakpoint
ALTER TABLE "sessions" ADD COLUMN IF NOT EXISTS "ip_address" text;--> statement-breakpoint
ALTER TABLE "sessions" ADD COLUMN IF NOT EXISTS "user_agent" text;--> statement-breakpoint
ALTER TABLE "sessions" ADD COLUMN IF NOT EXISTS "user_id" text NOT NULL;--> statement-breakpoint
DO $$
BEGIN
	IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'sessions_user_id_users_id_fk') THEN
		ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
	END IF;
END
$$;--> statement-breakpoint
ALTER TABLE "sessions" DROP COLUMN IF EXISTS "identifier";--> statement-breakpoint
ALTER TABLE "sessions" DROP COLUMN IF EXISTS "value";--> statement-breakpoint
DO $$
BEGIN
	IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'sessions_token_unique') THEN
		ALTER TABLE "sessions" ADD CONSTRAINT "sessions_token_unique" UNIQUE("token");
	END IF;
END
$$;