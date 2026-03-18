CREATE TABLE "courses" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"address" text,
	"city" text NOT NULL,
	"state" text NOT NULL,
	"zip" text,
	"latitude" real,
	"longitude" real,
	"website" text,
	"phone" text,
	"type" text,
	"holes" integer DEFAULT 18,
	"par" integer DEFAULT 72,
	"architect" text,
	"year_built" integer,
	"guest_policy" text,
	"has_driving_range" boolean DEFAULT false,
	"has_chipping_area" boolean DEFAULT false,
	"has_putting_green" boolean DEFAULT false,
	"has_pro_shop" boolean DEFAULT false,
	"raw_metadata" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"is_active" boolean DEFAULT true
);
--> statement-breakpoint
CREATE TABLE "crawl_logs" (
	"id" serial PRIMARY KEY NOT NULL,
	"cycle_id" text NOT NULL,
	"source_id" text NOT NULL,
	"url" text NOT NULL,
	"status" text NOT NULL,
	"tournaments_found" integer DEFAULT 0,
	"error" text,
	"crawled_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "tournaments" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"source_url" text NOT NULL,
	"source_id" text NOT NULL,
	"source" text NOT NULL,
	"date_start" text NOT NULL,
	"date_end" text,
	"registration_deadline" text,
	"course_name" text NOT NULL,
	"course_city" text NOT NULL,
	"course_state" text NOT NULL,
	"course_zip" text,
	"latitude" real,
	"longitude" real,
	"format" text NOT NULL,
	"format_detail" text,
	"holes" integer DEFAULT 18,
	"entry_fee" real,
	"max_players" integer,
	"spots_remaining" integer,
	"handicap_max" integer,
	"is_charity" boolean DEFAULT false,
	"is_private" boolean DEFAULT false,
	"organizer_name" text,
	"organizer_email" text,
	"organizer_phone" text,
	"registration_url" text,
	"description" text,
	"includes" text,
	"extraction_confidence" real DEFAULT 0,
	"extracted_at" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"last_verified_at" timestamp,
	"is_active" boolean DEFAULT true
);
--> statement-breakpoint
CREATE INDEX "idx_courses_state" ON "courses" USING btree ("state");--> statement-breakpoint
CREATE INDEX "idx_courses_location" ON "courses" USING btree ("latitude","longitude");--> statement-breakpoint
CREATE INDEX "idx_tournaments_date" ON "tournaments" USING btree ("date_start");--> statement-breakpoint
CREATE INDEX "idx_tournaments_state" ON "tournaments" USING btree ("course_state");--> statement-breakpoint
CREATE INDEX "idx_tournaments_source" ON "tournaments" USING btree ("source");--> statement-breakpoint
CREATE INDEX "idx_tournaments_location" ON "tournaments" USING btree ("latitude","longitude");--> statement-breakpoint
CREATE INDEX "idx_tournaments_source_id" ON "tournaments" USING btree ("source_id");