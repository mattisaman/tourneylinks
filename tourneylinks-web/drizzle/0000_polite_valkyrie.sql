CREATE TABLE "beverage_orders" (
	"id" serial PRIMARY KEY NOT NULL,
	"tournament_id" integer NOT NULL,
	"registration_id" integer NOT NULL,
	"latitude" real NOT NULL,
	"longitude" real NOT NULL,
	"status" text DEFAULT 'PENDING' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "communication_threads" (
	"id" serial PRIMARY KEY NOT NULL,
	"context_type" text NOT NULL,
	"tournament_id" integer,
	"course_id" integer,
	"initiator_user_id" text NOT NULL,
	"recipient_user_id" text,
	"subject" text NOT NULL,
	"status" text DEFAULT 'OPEN' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "course_claims" (
	"id" serial PRIMARY KEY NOT NULL,
	"course_id" integer NOT NULL,
	"user_id" text NOT NULL,
	"role_title" text NOT NULL,
	"direct_phone" text,
	"pga_card_image_url" text NOT NULL,
	"extracted_ocr_text" text,
	"status" text DEFAULT 'PENDING' NOT NULL,
	"co_admin_emails" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"reviewed_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "course_contracts" (
	"id" serial PRIMARY KEY NOT NULL,
	"course_id" integer NOT NULL,
	"tournament_id" integer,
	"document_url" text NOT NULL,
	"title" text NOT NULL,
	"status" text DEFAULT 'DRAFT' NOT NULL,
	"uploaded_by_user_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "course_galleries" (
	"id" serial PRIMARY KEY NOT NULL,
	"course_id" integer NOT NULL,
	"image_url" text NOT NULL,
	"caption" text,
	"uploaded_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "course_holes" (
	"id" serial PRIMARY KEY NOT NULL,
	"course_id" integer NOT NULL,
	"hole_number" integer NOT NULL,
	"par" integer NOT NULL,
	"yardage" integer NOT NULL,
	"handicap_data" integer,
	"pin_lat" real,
	"pin_lng" real,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "course_messages" (
	"id" serial PRIMARY KEY NOT NULL,
	"course_id" integer NOT NULL,
	"sender_user_id" text NOT NULL,
	"sender_role" text NOT NULL,
	"receiver_user_id" text NOT NULL,
	"message" text NOT NULL,
	"is_read" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "course_scorecards" (
	"id" serial PRIMARY KEY NOT NULL,
	"course_id" integer NOT NULL,
	"tee_box_name" text NOT NULL,
	"tee_box_color_hex" text,
	"slope" real,
	"rating" real,
	"gender" text DEFAULT 'MALE',
	"holes_data" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "course_staff" (
	"id" serial PRIMARY KEY NOT NULL,
	"course_id" integer NOT NULL,
	"clerk_user_id" text NOT NULL,
	"role" text NOT NULL,
	"assigned_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
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
	"email" text,
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
	"hero_image_url" text,
	"rating" real,
	"claimed_by_user_id" text,
	"logo_url" text,
	"base_price_per_player" real DEFAULT 100,
	"cart_fee" real DEFAULT 25,
	"food_and_beverage_minimum" real DEFAULT 35,
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
	"search_vector" text,
	"status" text NOT NULL,
	"tournaments_found" integer DEFAULT 0,
	"duration_ms" integer DEFAULT 0,
	"firecrawl_credits_used" integer DEFAULT 0,
	"total_costs" real DEFAULT 0,
	"error" text,
	"crawled_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "friendships" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id_1" integer NOT NULL,
	"user_id_2" integer NOT NULL,
	"status" text DEFAULT 'PENDING' NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "ghin_history" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"handicap_index" real NOT NULL,
	"proof_image_url" text,
	"verified_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "live_banter" (
	"id" serial PRIMARY KEY NOT NULL,
	"tournament_id" integer NOT NULL,
	"author_name" text NOT NULL,
	"message" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "live_telemetry" (
	"id" serial PRIMARY KEY NOT NULL,
	"tournament_id" integer NOT NULL,
	"registration_id" integer NOT NULL,
	"latitude" real NOT NULL,
	"longitude" real NOT NULL,
	"accuracy" real,
	"timestamp" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "messages" (
	"id" serial PRIMARY KEY NOT NULL,
	"thread_id" integer NOT NULL,
	"sender_user_id" text NOT NULL,
	"payload" text NOT NULL,
	"is_read" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "missing_links" (
	"id" serial PRIMARY KEY NOT NULL,
	"tournament_id" integer,
	"course_id" integer,
	"submitted_url" text NOT NULL,
	"status" text DEFAULT 'PENDING' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "operating_expenses" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"amount" real NOT NULL,
	"frequency" text DEFAULT 'monthly' NOT NULL,
	"category" text DEFAULT 'Software',
	"is_variable" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "payments" (
	"id" serial PRIMARY KEY NOT NULL,
	"registration_id" integer NOT NULL,
	"stripe_session_id" text NOT NULL,
	"stripe_payment_intent_id" text,
	"amount" integer NOT NULL,
	"platform_fee" integer NOT NULL,
	"status" text DEFAULT 'PENDING' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "payments_stripe_session_id_unique" UNIQUE("stripe_session_id")
);
--> statement-breakpoint
CREATE TABLE "player_scores" (
	"id" serial PRIMARY KEY NOT NULL,
	"registration_id" integer NOT NULL,
	"tournament_round_id" integer NOT NULL,
	"hole_number" integer NOT NULL,
	"gross_score" integer NOT NULL,
	"net_score" integer,
	"putts" integer,
	"gir" boolean DEFAULT false,
	"fir" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "referrals" (
	"id" serial PRIMARY KEY NOT NULL,
	"referrer_id" integer NOT NULL,
	"referee_id" integer NOT NULL,
	"tournament_id" integer,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "registration_transfers" (
	"id" serial PRIMARY KEY NOT NULL,
	"registration_id" integer NOT NULL,
	"original_player_id" integer NOT NULL,
	"recipient_email" text NOT NULL,
	"recipient_player_id" integer,
	"transfer_token" text NOT NULL,
	"status" text DEFAULT 'PENDING' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"expires_at" timestamp NOT NULL,
	CONSTRAINT "registration_transfers_transfer_token_unique" UNIQUE("transfer_token")
);
--> statement-breakpoint
CREATE TABLE "registrations" (
	"id" serial PRIMARY KEY NOT NULL,
	"tournament_id" integer NOT NULL,
	"user_id" integer,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"handicap" real,
	"payment_status" text DEFAULT 'COMPLETED',
	"status" text DEFAULT 'CONFIRMED' NOT NULL,
	"transaction_id" text,
	"pairing_request" text,
	"assigned_team" integer,
	"team_group_id" integer,
	"starting_hole" integer,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "saved_courses" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"course_id" integer NOT NULL,
	"notify_on_new_tournament" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "saved_searches" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"criteria" text NOT NULL,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "split_invites" (
	"id" serial PRIMARY KEY NOT NULL,
	"team_group_id" integer NOT NULL,
	"token" text NOT NULL,
	"recipient_email" text,
	"status" text DEFAULT 'PENDING' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "split_invites_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "sponsor_leads" (
	"id" serial PRIMARY KEY NOT NULL,
	"tournament_id" integer NOT NULL,
	"sponsor_profile_id" integer,
	"company_name" text NOT NULL,
	"company_logo_url" text,
	"contact_name" text,
	"contact_email" text,
	"contact_phone" text,
	"status" text DEFAULT 'TO_CONTACT' NOT NULL,
	"notes" text,
	"expected_value" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sponsor_profiles" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"company_name" text NOT NULL,
	"company_logo_url" text NOT NULL,
	"company_url" text,
	"contact_email" text,
	"is_franchise" boolean DEFAULT false,
	"location_name" text,
	"industry_segment" text,
	"pro_network_id" integer,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sponsorship_packages" (
	"id" serial PRIMARY KEY NOT NULL,
	"tournament_id" integer NOT NULL,
	"name" text NOT NULL,
	"amount" real NOT NULL,
	"description" text,
	"spots_available" integer DEFAULT 1 NOT NULL,
	"spots_sold" integer DEFAULT 0 NOT NULL,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sponsorship_purchases" (
	"id" serial PRIMARY KEY NOT NULL,
	"package_id" integer NOT NULL,
	"sponsor_profile_id" integer,
	"tournament_id" integer NOT NULL,
	"business_name" text NOT NULL,
	"business_logo_url" text NOT NULL,
	"amount_paid" real NOT NULL,
	"payment_status" text DEFAULT 'COMPLETED' NOT NULL,
	"transaction_id" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sponsorship_tiers" (
	"id" serial PRIMARY KEY NOT NULL,
	"tournament_id" integer NOT NULL,
	"name" text NOT NULL,
	"price" integer NOT NULL,
	"description" text,
	"spots_available" integer,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "store_inventory" (
	"id" serial PRIMARY KEY NOT NULL,
	"tournament_id" integer NOT NULL,
	"title" text NOT NULL,
	"price" integer NOT NULL,
	"max_per_player" integer,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "stripe_accounts" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"stripe_account_id" text NOT NULL,
	"payouts_enabled" boolean DEFAULT false NOT NULL,
	"charges_enabled" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "stripe_accounts_stripe_account_id_unique" UNIQUE("stripe_account_id")
);
--> statement-breakpoint
CREATE TABLE "support_tickets" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"email" text NOT NULL,
	"type" text NOT NULL,
	"message" text NOT NULL,
	"status" text DEFAULT 'OPEN' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "team_groups" (
	"id" serial PRIMARY KEY NOT NULL,
	"tournament_id" integer NOT NULL,
	"captain_registration_id" integer NOT NULL,
	"group_name" text,
	"total_spots" integer NOT NULL,
	"spots_filled" integer DEFAULT 1 NOT NULL,
	"status" text DEFAULT 'PENDING' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tournament_inquiries" (
	"id" serial PRIMARY KEY NOT NULL,
	"tournament_id" integer NOT NULL,
	"user_id" text,
	"sender_email" text NOT NULL,
	"message" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tournament_rounds" (
	"id" serial PRIMARY KEY NOT NULL,
	"tournament_id" integer NOT NULL,
	"course_id" integer,
	"round_number" integer NOT NULL,
	"date_string" text NOT NULL,
	"scoring_format" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tournament_sponsors" (
	"id" serial PRIMARY KEY NOT NULL,
	"tournament_id" integer NOT NULL,
	"clerk_user_id" text,
	"name" text NOT NULL,
	"logo_url" text NOT NULL,
	"website_url" text,
	"hole_assignment" integer,
	"popup_ad_copy" text,
	"show_on_tv_board" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now() NOT NULL
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
	"course_id" integer,
	"course_address" text,
	"course_city" text NOT NULL,
	"course_state" text NOT NULL,
	"course_zip" text,
	"latitude" real,
	"longitude" real,
	"format" text NOT NULL,
	"format_detail" text,
	"holes" integer DEFAULT 18,
	"entry_fee" real,
	"original_price" real,
	"pass_fees_to_registrant" boolean DEFAULT false,
	"allow_offline_payment" boolean DEFAULT false,
	"host_user_id" integer,
	"max_players" integer,
	"spots_remaining" integer,
	"handicap_max" integer,
	"is_charity" boolean DEFAULT false,
	"accepts_donations" boolean DEFAULT false,
	"donations_config" text,
	"charity_name" text,
	"golf_application_status" text DEFAULT 'none',
	"golf_application_data" text,
	"is_private" boolean DEFAULT false,
	"organizer_name" text,
	"organizer_email" text,
	"organizer_phone" text,
	"registration_url" text,
	"description" text,
	"includes" text,
	"schedule" text,
	"prizes" text,
	"sponsors" text,
	"extraction_confidence" real DEFAULT 0,
	"extracted_at" text,
	"hero_images" text,
	"gallery_images" text,
	"hero_position_data" text,
	"tile_image" text,
	"tile_position_data" text,
	"co_host_emails" text,
	"theme_color" text,
	"secondary_theme_color" text,
	"pricing_details" text,
	"format_details" text,
	"social_signals" text,
	"raw_extraction_data" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"last_verified_at" timestamp,
	"is_active" boolean DEFAULT true,
	"status" text DEFAULT 'active'
);
--> statement-breakpoint
CREATE TABLE "user_notification_settings" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"topic" text NOT NULL,
	"email_enabled" boolean DEFAULT true NOT NULL,
	"sms_enabled" boolean DEFAULT false NOT NULL,
	"push_enabled" boolean DEFAULT false NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"clerk_id" text NOT NULL,
	"email" text NOT NULL,
	"full_name" text NOT NULL,
	"avatar_url" text,
	"role" text DEFAULT 'PLAYER' NOT NULL,
	"verified_ghin" text,
	"handicap_index" real,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "users_clerk_id_unique" UNIQUE("clerk_id")
);
--> statement-breakpoint
ALTER TABLE "beverage_orders" ADD CONSTRAINT "beverage_orders_tournament_id_tournaments_id_fk" FOREIGN KEY ("tournament_id") REFERENCES "public"."tournaments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "beverage_orders" ADD CONSTRAINT "beverage_orders_registration_id_registrations_id_fk" FOREIGN KEY ("registration_id") REFERENCES "public"."registrations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "communication_threads" ADD CONSTRAINT "communication_threads_tournament_id_tournaments_id_fk" FOREIGN KEY ("tournament_id") REFERENCES "public"."tournaments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "communication_threads" ADD CONSTRAINT "communication_threads_course_id_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "course_claims" ADD CONSTRAINT "course_claims_course_id_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "course_contracts" ADD CONSTRAINT "course_contracts_course_id_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "course_contracts" ADD CONSTRAINT "course_contracts_tournament_id_tournaments_id_fk" FOREIGN KEY ("tournament_id") REFERENCES "public"."tournaments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "course_galleries" ADD CONSTRAINT "course_galleries_course_id_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "course_holes" ADD CONSTRAINT "course_holes_course_id_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "course_messages" ADD CONSTRAINT "course_messages_course_id_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "course_scorecards" ADD CONSTRAINT "course_scorecards_course_id_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "course_staff" ADD CONSTRAINT "course_staff_course_id_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ghin_history" ADD CONSTRAINT "ghin_history_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "live_banter" ADD CONSTRAINT "live_banter_tournament_id_tournaments_id_fk" FOREIGN KEY ("tournament_id") REFERENCES "public"."tournaments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "live_telemetry" ADD CONSTRAINT "live_telemetry_tournament_id_tournaments_id_fk" FOREIGN KEY ("tournament_id") REFERENCES "public"."tournaments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "live_telemetry" ADD CONSTRAINT "live_telemetry_registration_id_registrations_id_fk" FOREIGN KEY ("registration_id") REFERENCES "public"."registrations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_thread_id_communication_threads_id_fk" FOREIGN KEY ("thread_id") REFERENCES "public"."communication_threads"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "missing_links" ADD CONSTRAINT "missing_links_tournament_id_tournaments_id_fk" FOREIGN KEY ("tournament_id") REFERENCES "public"."tournaments"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "missing_links" ADD CONSTRAINT "missing_links_course_id_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_registration_id_registrations_id_fk" FOREIGN KEY ("registration_id") REFERENCES "public"."registrations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "player_scores" ADD CONSTRAINT "player_scores_registration_id_registrations_id_fk" FOREIGN KEY ("registration_id") REFERENCES "public"."registrations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "player_scores" ADD CONSTRAINT "player_scores_tournament_round_id_tournament_rounds_id_fk" FOREIGN KEY ("tournament_round_id") REFERENCES "public"."tournament_rounds"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "registration_transfers" ADD CONSTRAINT "registration_transfers_registration_id_registrations_id_fk" FOREIGN KEY ("registration_id") REFERENCES "public"."registrations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "registration_transfers" ADD CONSTRAINT "registration_transfers_original_player_id_users_id_fk" FOREIGN KEY ("original_player_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "registration_transfers" ADD CONSTRAINT "registration_transfers_recipient_player_id_users_id_fk" FOREIGN KEY ("recipient_player_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "registrations" ADD CONSTRAINT "registrations_tournament_id_tournaments_id_fk" FOREIGN KEY ("tournament_id") REFERENCES "public"."tournaments"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "saved_courses" ADD CONSTRAINT "saved_courses_course_id_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "split_invites" ADD CONSTRAINT "split_invites_team_group_id_team_groups_id_fk" FOREIGN KEY ("team_group_id") REFERENCES "public"."team_groups"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sponsor_leads" ADD CONSTRAINT "sponsor_leads_tournament_id_tournaments_id_fk" FOREIGN KEY ("tournament_id") REFERENCES "public"."tournaments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sponsor_leads" ADD CONSTRAINT "sponsor_leads_sponsor_profile_id_sponsor_profiles_id_fk" FOREIGN KEY ("sponsor_profile_id") REFERENCES "public"."sponsor_profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sponsor_profiles" ADD CONSTRAINT "sponsor_profiles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sponsorship_packages" ADD CONSTRAINT "sponsorship_packages_tournament_id_tournaments_id_fk" FOREIGN KEY ("tournament_id") REFERENCES "public"."tournaments"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sponsorship_purchases" ADD CONSTRAINT "sponsorship_purchases_package_id_sponsorship_packages_id_fk" FOREIGN KEY ("package_id") REFERENCES "public"."sponsorship_packages"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sponsorship_purchases" ADD CONSTRAINT "sponsorship_purchases_sponsor_profile_id_sponsor_profiles_id_fk" FOREIGN KEY ("sponsor_profile_id") REFERENCES "public"."sponsor_profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sponsorship_purchases" ADD CONSTRAINT "sponsorship_purchases_tournament_id_tournaments_id_fk" FOREIGN KEY ("tournament_id") REFERENCES "public"."tournaments"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sponsorship_tiers" ADD CONSTRAINT "sponsorship_tiers_tournament_id_tournaments_id_fk" FOREIGN KEY ("tournament_id") REFERENCES "public"."tournaments"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "store_inventory" ADD CONSTRAINT "store_inventory_tournament_id_tournaments_id_fk" FOREIGN KEY ("tournament_id") REFERENCES "public"."tournaments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stripe_accounts" ADD CONSTRAINT "stripe_accounts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "team_groups" ADD CONSTRAINT "team_groups_tournament_id_tournaments_id_fk" FOREIGN KEY ("tournament_id") REFERENCES "public"."tournaments"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "team_groups" ADD CONSTRAINT "team_groups_captain_registration_id_registrations_id_fk" FOREIGN KEY ("captain_registration_id") REFERENCES "public"."registrations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tournament_inquiries" ADD CONSTRAINT "tournament_inquiries_tournament_id_tournaments_id_fk" FOREIGN KEY ("tournament_id") REFERENCES "public"."tournaments"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tournament_rounds" ADD CONSTRAINT "tournament_rounds_tournament_id_tournaments_id_fk" FOREIGN KEY ("tournament_id") REFERENCES "public"."tournaments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tournament_rounds" ADD CONSTRAINT "tournament_rounds_course_id_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tournament_sponsors" ADD CONSTRAINT "tournament_sponsors_tournament_id_tournaments_id_fk" FOREIGN KEY ("tournament_id") REFERENCES "public"."tournaments"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tournaments" ADD CONSTRAINT "tournaments_course_id_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tournaments" ADD CONSTRAINT "tournaments_host_user_id_users_id_fk" FOREIGN KEY ("host_user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_notification_settings" ADD CONSTRAINT "user_notification_settings_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_registrations_tournament_id" ON "registrations" USING btree ("tournament_id");--> statement-breakpoint
CREATE INDEX "idx_registrations_user_id" ON "registrations" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_sponsor_leads_tournament_id" ON "sponsor_leads" USING btree ("tournament_id");--> statement-breakpoint
CREATE INDEX "idx_tournaments_host_user_id" ON "tournaments" USING btree ("host_user_id");--> statement-breakpoint
CREATE INDEX "idx_tournaments_course_id" ON "tournaments" USING btree ("course_id");