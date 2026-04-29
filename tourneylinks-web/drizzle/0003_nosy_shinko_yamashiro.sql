ALTER TABLE "courses" ADD COLUMN "normalized_rules" text;--> statement-breakpoint
ALTER TABLE "courses" ADD COLUMN "normalized_faq" text;--> statement-breakpoint
ALTER TABLE "courses" ADD COLUMN "original_document_urls" text;--> statement-breakpoint
ALTER TABLE "courses" ADD COLUMN "last_crawled_at" timestamp;--> statement-breakpoint
ALTER TABLE "crawl_logs" ADD COLUMN "details" text;