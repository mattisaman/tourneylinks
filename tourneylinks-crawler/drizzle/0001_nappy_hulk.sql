CREATE TABLE "visited_urls" (
	"id" serial PRIMARY KEY NOT NULL,
	"url_hash" text NOT NULL,
	"url" text NOT NULL,
	"source_domain" text,
	"discovered_at" timestamp DEFAULT now(),
	"last_crawled_at" timestamp,
	"status" text DEFAULT 'pending',
	"tournaments_found" integer DEFAULT 0,
	"depth" integer DEFAULT 0,
	CONSTRAINT "visited_urls_url_hash_unique" UNIQUE("url_hash")
);
--> statement-breakpoint
ALTER TABLE "courses" ADD COLUMN "email" text;--> statement-breakpoint
ALTER TABLE "tournaments" ADD COLUMN "event_sources" text;--> statement-breakpoint
ALTER TABLE "tournaments" ADD COLUMN "schedule" text;--> statement-breakpoint
ALTER TABLE "tournaments" ADD COLUMN "prizes" text;--> statement-breakpoint
ALTER TABLE "tournaments" ADD COLUMN "sponsors" text;--> statement-breakpoint
ALTER TABLE "tournaments" ADD COLUMN "pricing_details" text;--> statement-breakpoint
ALTER TABLE "tournaments" ADD COLUMN "format_details" text;--> statement-breakpoint
ALTER TABLE "tournaments" ADD COLUMN "social_signals" text;--> statement-breakpoint
ALTER TABLE "tournaments" ADD COLUMN "raw_extraction_data" text;--> statement-breakpoint
ALTER TABLE "tournaments" ADD COLUMN "status" text DEFAULT 'active';--> statement-breakpoint
CREATE INDEX "idx_visited_urls_hash" ON "visited_urls" USING btree ("url_hash");--> statement-breakpoint
CREATE INDEX "idx_visited_urls_status" ON "visited_urls" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_visited_urls_domain" ON "visited_urls" USING btree ("source_domain");