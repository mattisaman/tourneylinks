import { drizzle } from 'drizzle-orm/node-postgres';
import { pgTable, serial, text, real, integer, boolean, timestamp, index } from 'drizzle-orm/pg-core';
import { eq, and, gte, asc, notInArray, sql } from 'drizzle-orm';
import pg from 'pg';

export const courses = pgTable('courses', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  address: text('address'),
  city: text('city').notNull(),
  state: text('state').notNull(),
  zip: text('zip'),
  latitude: real('latitude'),
  longitude: real('longitude'),
  
  website: text('website'),
  phone: text('phone'),
  email: text('email'),
  type: text('type'), // Public, Private, Semi-Private, Resort, Municipal
  holes: integer('holes').default(18),
  par: integer('par').default(72),
  
  architect: text('architect'),
  yearBuilt: integer('year_built'),
  guestPolicy: text('guest_policy'),

  hasDrivingRange: boolean('has_driving_range').default(false),
  hasChippingArea: boolean('has_chipping_area').default(false),
  hasPuttingGreen: boolean('has_putting_green').default(false),
  hasProShop: boolean('has_pro_shop').default(false),
  
  rawMetadata: text('raw_metadata'),
  
  heroImageUrl: text('hero_image_url'),
  rating: real('rating'),
  
  claimedByUserId: text('claimed_by_user_id'), // Mapped to Clerk users.id once approved
  
  // Phase 2 Pro Hub Config
  logoUrl: text('logo_url'),
  basePricePerPlayer: real('base_price_per_player').default(100.00),
  cartFee: real('cart_fee').default(25.00),
  foodAndBeverageMinimum: real('food_and_beverage_minimum').default(35.00),
  
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
  isActive: boolean('is_active').default(true),
});

export const tournaments = pgTable('tournaments', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  sourceUrl: text('source_url').notNull(),
  sourceId: text('source_id').notNull(),
  source: text('source').notNull(),
  eventSources: text('event_sources'), // JSON array of merged sources (e.g., ['facebook', 'eventbrite'])

  dateStart: text('date_start').notNull(),
  dateEnd: text('date_end'),
  registrationDeadline: text('registration_deadline'),

  courseName: text('course_name').notNull(),
  courseId: integer('course_id').references(() => courses.id, { onDelete: 'set null' }),
  courseAddress: text('course_address'),
  courseCity: text('course_city').notNull(),
  courseState: text('course_state').notNull(),
  courseZip: text('course_zip'),
  latitude: real('latitude'),
  longitude: real('longitude'),

  format: text('format').notNull(),
  formatDetail: text('format_detail'),
  holes: integer('holes').default(18),

  entryFee: real('entry_fee'),
  originalPrice: real('original_price'),
  passFeesToRegistrant: boolean('pass_fees_to_registrant').default(false),
  allowOfflinePayment: boolean('allow_offline_payment').default(false),
  hostUserId: integer('host_user_id').references(() => users.id),
  maxPlayers: integer('max_players'),
  spotsRemaining: integer('spots_remaining'),

  handicapMax: integer('handicap_max'),
  isCharity: boolean('is_charity').default(false),
  acceptsDonations: boolean('accepts_donations').default(false),
  donationsConfig: text('donations_config'), // JSON storing the 3 donation options
  charityName: text('charity_name'),
  golfApplicationStatus: text('golf_application_status').default('none'), // 'none' | 'pending' | 'approved' | 'rejected'
  golfApplicationData: text('golf_application_data'), // JSON object capturing their cause/payout descriptions
  isPrivate: boolean('is_private').default(false),

  organizerName: text('organizer_name'),
  organizerEmail: text('organizer_email'),
  organizerPhone: text('organizer_phone'),
  registrationUrl: text('registration_url'),
  description: text('description'),
  includes: text('includes'),
  schedule: text('schedule'), // Stored structurally as JSON string array [{time: string, event: string}]
  prizes: text('prizes'), // Stored structurally as JSON string array ["1st Place: $500", "Long Drive: Scotty Cameron Putter"]
  sponsors: text('sponsors'), // Stored structurally as JSON string array ["Title Sponsor: Ford", "Beverage Sponsor: Torchy's Tacos"]

  extractionConfidence: real('extraction_confidence').default(0),
  extractedAt: text('extracted_at'),

  heroImages: text('hero_images'), // JSON array of urls
  galleryImages: text('gallery_images'), // JSON array of urls
  heroPositionData: text('hero_position_data'), // JSON object { x, y, zoom }
  tileImage: text('tile_image'), // url string
  tilePositionData: text('tile_position_data'), // JSON object { x, y, zoom }
  coHostEmails: text('co_host_emails'), // JSON array of strings
  themeColor: text('theme_color'), // hex code primary
  secondaryThemeColor: text('secondary_theme_color'), // hex code secondary

  // Extended JSON Metadata
  pricingDetails: text('pricing_details'), // JSON: { perTeam, earlyBird, latePrice, etc }
  formatDetails: text('format_details'), // JSON: { teamSize, handicapRules, flighting, mulligans, skillLevelTarget }
  socialSignals: text('social_signals'), // JSON: { facebookEventId, interestedCount, shares }
  rawExtractionData: text('raw_extraction_data'), // JSON: { fullTextDump, ocrText }

  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
  lastVerifiedAt: timestamp('last_verified_at'),
  isActive: boolean('is_active').default(true),
  status: text('status').default('active'), // 'active', 'archived', 'cancelled'
}, (table) => ({
  hostUserIdIdx: index('idx_tournaments_host_user_id').on(table.hostUserId),
  courseIdIdx: index('idx_tournaments_course_id').on(table.courseId),
}));

export const registrations = pgTable('registrations', {
  id: serial('id').primaryKey(),
  tournamentId: integer('tournament_id').references(() => tournaments.id).notNull(),
  userId: integer('user_id'), // Links to the persistent user profile
  name: text('name').notNull(),
  email: text('email').notNull(),
  handicap: real('handicap'),
  paymentStatus: text('payment_status').default('COMPLETED'),
  status: text('status').default('CONFIRMED').notNull(), // 'CONFIRMED', 'TRANSFERRED', 'CANCELLED'
  transactionId: text('transaction_id'), // Future Stripe reference mapped mapping
  pairingRequest: text('pairing_request'),
  assignedTeam: integer('assigned_team'),
  teamGroupId: integer('team_group_id'), // Links to team_groups.id
  startingHole: integer('starting_hole'), // Phase 5: Routing Shotgun assignments
  createdAt: timestamp('created_at').defaultNow(),
}, (table) => ({
  tournamentIdIdx: index('idx_registrations_tournament_id').on(table.tournamentId),
  userIdIdx: index('idx_registrations_user_id').on(table.userId),
}));

export const registration_transfers = pgTable('registration_transfers', {
  id: serial('id').primaryKey(),
  registrationId: integer('registration_id').references(() => registrations.id).notNull(),
  originalPlayerId: integer('original_player_id').references(() => users.id).notNull(),
  recipientEmail: text('recipient_email').notNull(),
  recipientPlayerId: integer('recipient_player_id').references(() => users.id), // Nullable until they claim
  transferToken: text('transfer_token').notNull().unique(), // The magic link hash
  status: text('status').default('PENDING').notNull(), // 'PENDING', 'COMPLETED', 'CANCELLED'
  createdAt: timestamp('created_at').defaultNow().notNull(),
  expiresAt: timestamp('expires_at').notNull(),
});

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  clerkId: text('clerk_id').notNull().unique(),
  email: text('email').notNull(),
  fullName: text('full_name').notNull(),
  avatarUrl: text('avatar_url'),
  role: text('role').default('PLAYER').notNull(), // 'PLAYER' or 'HOST'
  verifiedGhin: text('verified_ghin'),
  handicapIndex: real('handicap_index'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const friendships = pgTable('friendships', {
  id: serial('id').primaryKey(),
  userId1: integer('user_id_1').notNull(), // The person who sent the request
  userId2: integer('user_id_2').notNull(), // The person receiving the request
  status: text('status').default('PENDING').notNull(), // 'PENDING' or 'ACCEPTED'
  createdAt: timestamp('created_at').defaultNow(),
});

export const saved_searches = pgTable('saved_searches', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull(),
  criteria: text('criteria').notNull(), // Stored as massive JSON string arrays
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
});

export const referrals = pgTable('referrals', {
  id: serial('id').primaryKey(),
  referrerId: integer('referrer_id').notNull(), // The user whose link was clicked
  refereeId: integer('referee_id').notNull(), // The new user who signed up
  tournamentId: integer('tournament_id'), // The tournament they registered for (optional)
  createdAt: timestamp('created_at').defaultNow(),
});

export const crawlLogs = pgTable('crawl_logs', {
  id: serial('id').primaryKey(),
  cycleId: text('cycle_id').notNull(),
  sourceId: text('source_id').notNull(),
  url: text('url').notNull(),
  searchVector: text('search_vector'),
  status: text('status').notNull(),
  tournamentsFound: integer('tournaments_found').default(0),
  durationMs: integer('duration_ms').default(0),
  fireCrawlCreditsUsed: integer('firecrawl_credits_used').default(0),
  totalCosts: real('total_costs').default(0),
  error: text('error'),
  crawledAt: timestamp('crawled_at').defaultNow(),
});

export const operating_expenses = pgTable('operating_expenses', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  amount: real('amount').notNull(),
  frequency: text('frequency').default('monthly').notNull(), // 'monthly', 'annual', 'one-time'
  category: text('category').default('Software'), // 'Software', 'Infrastructure', 'Marketing', 'Legal'
  isVariable: boolean('is_variable').default(false), // e.g. "Stripe proxy" vs "Fixed Google Ultra Seat"
  createdAt: timestamp('created_at').defaultNow(),
});

export const support_tickets = pgTable('support_tickets', {
  id: serial('id').primaryKey(),
  userId: integer('user_id'), // Optional, null if guest
  email: text('email').notNull(),
  type: text('type').notNull(), // 'BUG', 'FEATURE_REQUEST', 'GENERAL_SUPPORT'
  message: text('message').notNull(),
  status: text('status').default('OPEN').notNull(), // 'OPEN', 'RESOLVED'
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const tournament_inquiries = pgTable('tournament_inquiries', {
  id: serial('id').primaryKey(),
  tournamentId: integer('tournament_id').notNull().references(() => tournaments.id),
  userId: text('user_id'), // Optional: Clerk ID of sender if logged in
  senderEmail: text('sender_email').notNull(),
  message: text('message').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const missing_links = pgTable('missing_links', {
  id: serial('id').primaryKey(),
  tournamentId: integer('tournament_id').references(() => tournaments.id),
  courseId: integer('course_id').references(() => courses.id),
  submittedUrl: text('submitted_url').notNull(),
  status: text('status').default('PENDING').notNull(), // 'PENDING', 'APPROVED', 'REJECTED'
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const ghin_history = pgTable('ghin_history', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id),
  handicapIndex: real('handicap_index').notNull(),
  proofImageUrl: text('proof_image_url'), // S3/Cloud storage URL of the screenshot
  verifiedAt: timestamp('verified_at').defaultNow().notNull(),
});

export const sponsor_profiles = pgTable('sponsor_profiles', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id),
  companyName: text('company_name').notNull(),
  companyLogoUrl: text('company_logo_url').notNull(),
  companyUrl: text('company_url'),
  contactEmail: text('contact_email'),
  isFranchise: boolean('is_franchise').default(false),
  locationName: text('location_name'), // E.g. "Lexus of Austin" vs HQ
  industrySegment: text('industry_segment'), // E.g. "Automotive", "Fintech"
  proNetworkId: integer('pro_network_id'), // The ID of the Course Pro who vouched
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const sponsorship_packages = pgTable('sponsorship_packages', {
  id: serial('id').primaryKey(),
  tournamentId: integer('tournament_id').notNull().references(() => tournaments.id),
  name: text('name').notNull(), // e.g. "Title Sponsor", "Hole Sponsor"
  amount: real('amount').notNull(),
  description: text('description'),
  spotsAvailable: integer('spots_available').default(1).notNull(),
  spotsSold: integer('spots_sold').default(0).notNull(),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const sponsorship_purchases = pgTable('sponsorship_purchases', {
  id: serial('id').primaryKey(),
  packageId: integer('package_id').notNull().references(() => sponsorship_packages.id),
  sponsorProfileId: integer('sponsor_profile_id').references(() => sponsor_profiles.id), // Link to persistent profile
  tournamentId: integer('tournament_id').notNull().references(() => tournaments.id),
  businessName: text('business_name').notNull(), // Snapshot in case profile changes
  businessLogoUrl: text('business_logo_url').notNull(), // Snapshot
  amountPaid: real('amount_paid').notNull(),
  paymentStatus: text('payment_status').default('COMPLETED').notNull(), // 'PENDING', 'COMPLETED'
  transactionId: text('transaction_id'), // Stripe reference
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const sponsor_leads = pgTable('sponsor_leads', {
  id: serial('id').primaryKey(),
  tournamentId: integer('tournament_id').references(() => tournaments.id, { onDelete: 'cascade' }).notNull(),
  sponsorProfileId: integer('sponsor_profile_id').references(() => sponsor_profiles.id),
  companyName: text('company_name').notNull(),
  companyLogoUrl: text('company_logo_url'),
  contactName: text('contact_name'),
  contactEmail: text('contact_email'),
  contactPhone: text('contact_phone'),
  status: text('status').default('TO_CONTACT').notNull(), // 'TO_CONTACT', 'WAITING', 'IN_CONVERSATION', 'COMMITTED', 'DECLINED'
  notes: text('notes'),
  expectedValue: integer('expected_value'), // in cents
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  tournamentIdIdx: index('idx_sponsor_leads_tournament_id').on(table.tournamentId),
}));

const globalForDb = globalThis as unknown as {
  pool: pg.Pool | undefined;
};

const pool =
  globalForDb.pool ??
  new pg.Pool({
    connectionString: process.env.DATABASE_URL,
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
  });

if (process.env.NODE_ENV !== 'production') globalForDb.pool = pool;

export const db = drizzle(pool);

export async function getExistingTournaments() {
  const rows = await db.select().from(tournaments)
    .where(and(
      eq(tournaments.isActive, true),
      notInArray(tournaments.source, ['state-associations', 'usga-events']),
      sql`${tournaments.formatDetails} NOT LIKE '%Sanctioned/Pro%' OR ${tournaments.formatDetails} IS NULL`
    ))
    .orderBy(asc(tournaments.dateStart));
    
  const todayAtMidnight = new Date();
  todayAtMidnight.setHours(0, 0, 0, 0);

  return rows.filter((t) => {
    if (!t.dateStart) return false;
    
    // Attempt to parse the date string
    const parsedDate = new Date(t.dateStart);
    
    // Check if the date is invalid (unparseable fuzzy text like "TBD" or "Late Summer")
    if (isNaN(parsedDate.getTime())) {
      return false;
    }
    
    // Check if the date is in the past
    if (parsedDate < todayAtMidnight) {
      return false;
    }
    
    // Filter out state associations that slipped in via Google Discovery
    const lowerName = t.name.toLowerCase();
    const lowerUrl = (t.sourceUrl || '').toLowerCase();
    const lowerOrg = (t.organizerName || '').toLowerCase();
    
    // Common state association acronyms and keywords
    const isStateAssoc = [
      'usga', 'vsga', 'ncga', 'scga', 'nysga', 'cga', 'riga', 
      'csga', 'njsga', 'fsga', 'gsga', 'cdga', 'iga', 'wga', 
      'moga', 'txga', 'okga', 'oga', 'azgolf', 'state golf association',
      'amateur championship', 'open championship'
    ].some(keyword => 
      lowerName.includes(keyword) || 
      lowerUrl.includes(keyword) || 
      lowerOrg.includes(keyword)
    );
    
    if (isStateAssoc) {
      return false;
    }
    
    return true;
  });
}

export async function getTournamentById(id: number) {
  const rows = await db.select().from(tournaments).where(eq(tournaments.id, id));
  return rows[0] || null;
}

// PHASE 9: STRIPE CONNECT INFRASTRUCTURE

export const stripe_accounts = pgTable('stripe_accounts', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id).notNull(),
  stripeAccountId: text('stripe_account_id').notNull().unique(),
  payoutsEnabled: boolean('payouts_enabled').default(false).notNull(),
  chargesEnabled: boolean('charges_enabled').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const payments = pgTable('payments', {
  id: serial('id').primaryKey(),
  registrationId: integer('registration_id').references(() => registrations.id).notNull(),
  stripeSessionId: text('stripe_session_id').notNull().unique(),
  stripePaymentIntentId: text('stripe_payment_intent_id'),
  amount: integer('amount').notNull(), // captured strictly in cents
  platformFee: integer('platform_fee').notNull(),
  status: text('status').default('PENDING').notNull(), // 'PENDING', 'SUCCEEDED', 'FAILED', 'REFUNDED'
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Phase 8: E-Commerce Store Add-ons Data Architecture
export const store_inventory = pgTable('store_inventory', {
  id: serial('id').primaryKey(),
  tournamentId: integer('tournament_id').references(() => tournaments.id, { onDelete: 'cascade' }).notNull(),
  title: text('title').notNull(), // e.g. "Mulligan Package (2)"
  price: integer('price').notNull(), // Stored entirely in cents (e.g. 2000 = $20.00)
  maxPerPlayer: integer('max_per_player'), // Allows the organizer to enforce "no more than 2 mulligans"
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const sponsorship_tiers = pgTable('sponsorship_tiers', {
  id: serial('id').primaryKey(),
  tournamentId: integer('tournament_id').references(() => tournaments.id).notNull(),
  name: text('name').notNull(),
  price: integer('price').notNull(), // captured strictly in cents
  description: text('description'),
  spotsAvailable: integer('spots_available'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const tournament_sponsors = pgTable('tournament_sponsors', {
  id: serial('id').primaryKey(),
  tournamentId: integer('tournament_id').references(() => tournaments.id).notNull(), // The event they are sponsoring
  clerkUserId: text('clerk_user_id'), // The UserID of the B2B person representing Ford
  name: text('name').notNull(),
  logoUrl: text('logo_url').notNull(),
  websiteUrl: text('website_url'),
  holeAssignment: integer('hole_assignment'), // The hole number (1-18) this sponsor is natively attached to
  popupAdCopy: text('popup_ad_copy'), // e.g. "Hole 8 Sponsored by Ford! Win a F150!"
  showOnTvBoard: boolean('show_on_tv_board').default(false), // Determines if logo cycles on liveboard
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const team_groups = pgTable('team_groups', {
  id: serial('id').primaryKey(),
  tournamentId: integer('tournament_id').references(() => tournaments.id).notNull(),
  captainRegistrationId: integer('captain_registration_id').references(() => registrations.id).notNull(),
  groupName: text('group_name'), // e.g. "Team Smith"
  totalSpots: integer('total_spots').notNull(),
  spotsFilled: integer('spots_filled').default(1).notNull(),
  status: text('status').default('PENDING').notNull(), // 'PENDING', 'COMPLETED'
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const split_invites = pgTable('split_invites', {
  id: serial('id').primaryKey(),
  teamGroupId: integer('team_group_id').references(() => team_groups.id).notNull(),
  token: text('token').notNull().unique(), // The magic link hash
  recipientEmail: text('recipient_email'), // Optional
  status: text('status').default('PENDING').notNull(), // 'PENDING', 'CLAIMED'
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const saved_courses = pgTable('saved_courses', {
  id: serial('id').primaryKey(),
  userId: text('user_id').notNull(),
  courseId: integer('course_id').references(() => courses.id, { onDelete: 'cascade' }).notNull(),
  notifyOnNewTournament: boolean('notify_on_new_tournament').default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// ==========================================
// PHASE 3: MULTI-ROUND / FORMAT ALGORITHMS
// ==========================================

export const tournament_rounds = pgTable('tournament_rounds', {
  id: serial('id').primaryKey(),
  tournamentId: integer('tournament_id').references(() => tournaments.id, { onDelete: 'cascade' }).notNull(),
  courseId: integer('course_id').references(() => courses.id), // Allowing multi-course PGA rotations
  roundNumber: integer('round_number').notNull(),
  dateString: text('date_string').notNull(),
  scoringFormat: text('scoring_format').notNull(), // e.g. 'SCRAMBLE', 'BEST_BALL', 'ALT_SHOT', 'STROKE_NET'
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// PHASE 6: SCORECARD OCR VISION PIPELINE
export const course_holes = pgTable('course_holes', {
  id: serial('id').primaryKey(),
  courseId: integer('course_id').references(() => courses.id, { onDelete: 'cascade' }).notNull(),
  holeNumber: integer('hole_number').notNull(), // 1 through 18
  par: integer('par').notNull(),
  yardage: integer('yardage').notNull(),
  handicapData: integer('handicap_data'), // The hole's handicap rating
  
  // Phase 7: Haversine GPS Mathematical Pipeline Data Storage
  pinLat: real('pin_lat'),
  pinLng: real('pin_lng'),

  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const player_scores = pgTable('player_scores', {
  id: serial('id').primaryKey(),
  registrationId: integer('registration_id').references(() => registrations.id, { onDelete: 'cascade' }).notNull(),
  tournamentRoundId: integer('tournament_round_id').references(() => tournament_rounds.id, { onDelete: 'cascade' }).notNull(),
  holeNumber: integer('hole_number').notNull(), // 1 through 18
  grossScore: integer('gross_score').notNull(),
  netScore: integer('net_score'), // Calculated dynamically or stored after format applied

  // Phase 2: Detailed Analytics
  putts: integer('putts'),
  gir: boolean('gir').default(false), // Green in Regulation
  fir: boolean('fir').default(false), // Fairway in Regulation
  
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// PHASE 10: MARAUDERS MAP TELEMETRY ENGINE
export const live_telemetry = pgTable('live_telemetry', {
  id: serial('id').primaryKey(),
  tournamentId: integer('tournament_id').references(() => tournaments.id, { onDelete: 'cascade' }).notNull(),
  registrationId: integer('registration_id').references(() => registrations.id, { onDelete: 'cascade' }).notNull(),
  latitude: real('latitude').notNull(),
  longitude: real('longitude').notNull(),
  accuracy: real('accuracy'), // For resolving ping noise
  timestamp: timestamp('timestamp').defaultNow().notNull(),
});

// PHASE 13: B2B Multi-Role Architecture
export const course_staff = pgTable('course_staff', {
  id: serial('id').primaryKey(),
  courseId: integer('course_id').references(() => courses.id, { onDelete: 'cascade' }).notNull(),
  clerkUserId: text('clerk_user_id').notNull(),
  role: text('role').notNull(), // 'HEAD_PRO', 'FOOD_AND_BEVERAGE', 'ASSISTANT', 'OWNER'
  assignedAt: timestamp('assigned_at').defaultNow().notNull()
});

// PHASE 11: Beverage Cart & Banter Features
export const beverage_orders = pgTable('beverage_orders', {
  id: serial('id').primaryKey(),
  tournamentId: integer('tournament_id').references(() => tournaments.id, { onDelete: 'cascade' }).notNull(),
  registrationId: integer('registration_id').references(() => registrations.id, { onDelete: 'cascade' }).notNull(),
  latitude: real('latitude').notNull(),
  longitude: real('longitude').notNull(),
  status: text('status').default('PENDING').notNull(), // 'PENDING' | 'DELIVERED'
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const live_banter = pgTable('live_banter', {
  id: serial('id').primaryKey(),
  tournamentId: integer('tournament_id').references(() => tournaments.id, { onDelete: 'cascade' }).notNull(),
  authorName: text('author_name').notNull(),
  message: text('message').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// PHASE 14: PGA Pro Verification & Claiming
export const course_claims = pgTable('course_claims', {
  id: serial('id').primaryKey(),
  courseId: integer('course_id').references(() => courses.id, { onDelete: 'cascade' }).notNull(),
  userId: text('user_id').notNull(), // Clerk IDs are text
  roleTitle: text('role_title').notNull(),
  directPhone: text('direct_phone'),
  pgaCardImageUrl: text('pga_card_image_url').notNull(),
  extractedOcrText: text('extracted_ocr_text'), // AI payload validation mapping
  status: text('status').default('PENDING').notNull(), // 'PENDING', 'APPROVED', 'REJECTED'
  coAdminEmails: text('co_admin_emails'), // JSON array of strings
  createdAt: timestamp('created_at').defaultNow().notNull(),
  reviewedAt: timestamp('reviewed_at'),
});
// PHASE 15: Extended Course Website Architecture (AI Scorecards & Galleries)
export const course_scorecards = pgTable('course_scorecards', {
  id: serial('id').primaryKey(),
  courseId: integer('course_id').references(() => courses.id, { onDelete: 'cascade' }).notNull(),
  teeBoxName: text('tee_box_name').notNull(), // e.g. "Blue", "Championship"
  teeBoxColorHex: text('tee_box_color_hex'), // e.g. "#0000FF"
  slope: real('slope'),
  rating: real('rating'),
  gender: text('gender').default('MALE'), // 'MALE' or 'FEMALE'
  
  // JSONB Array storing 18 objects: [{ hole: 1, par: 4, yardage: 410, handicap: 5 }, ...]
  holesData: text('holes_data'), 
  
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const course_galleries = pgTable('course_galleries', {
  id: serial('id').primaryKey(),
  courseId: integer('course_id').references(() => courses.id, { onDelete: 'cascade' }).notNull(),
  imageUrl: text('image_url').notNull(),
  caption: text('caption'),
  uploadedAt: timestamp('uploaded_at').defaultNow().notNull(),
});

// PHASE 16: Pro Hub OS (Messaging & Contracts)
export const course_messages = pgTable('course_messages', {
  id: serial('id').primaryKey(),
  courseId: integer('course_id').references(() => courses.id, { onDelete: 'cascade' }).notNull(),
  senderUserId: text('sender_user_id').notNull(), // Clerk User ID (could be pro or organizer)
  senderRole: text('sender_role').notNull(), // 'PRO' or 'ORGANIZER'
  receiverUserId: text('receiver_user_id').notNull(),
  message: text('message').notNull(),
  isRead: boolean('is_read').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const course_contracts = pgTable('course_contracts', {
  id: serial('id').primaryKey(),
  courseId: integer('course_id').references(() => courses.id, { onDelete: 'cascade' }).notNull(),
  tournamentId: integer('tournament_id').references(() => tournaments.id, { onDelete: 'cascade' }), // Optional if pre-booking
  documentUrl: text('document_url').notNull(),
  title: text('title').notNull(),
  status: text('status').default('DRAFT').notNull(), // 'DRAFT', 'SENT', 'SIGNED'
  uploadedByUserId: text('uploaded_by_user_id').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// ==========================================
// PHASE 17: UNIFIED COMMUNICATION MATRIX & NOTIFICATIONS
// ==========================================

export const user_notification_settings = pgTable('user_notification_settings', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  
  // Topics
  topic: text('topic').notNull(), // 'TICKET_UPDATES', 'TOURNAMENT_BROADCASTS', 'REGISTRATION_ALERTS', 'SPONSOR_INQUIRIES'
  
  // Channels
  emailEnabled: boolean('email_enabled').default(true).notNull(),
  smsEnabled: boolean('sms_enabled').default(false).notNull(),
  pushEnabled: boolean('push_enabled').default(false).notNull(),
  
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const communication_threads = pgTable('communication_threads', {
  id: serial('id').primaryKey(),
  contextType: text('context_type').notNull(), // 'SUPPORT', 'GOLFER_TO_HOST', 'HOST_TO_PRO', 'HOST_TO_SPONSOR'
  
  // Polymorphic associations depending on context
  tournamentId: integer('tournament_id').references(() => tournaments.id, { onDelete: 'cascade' }),
  courseId: integer('course_id').references(() => courses.id, { onDelete: 'cascade' }),
  
  // For routing the specific chat
  initiatorUserId: text('initiator_user_id').notNull(), // Clerk User ID (Sender)
  recipientUserId: text('recipient_user_id'), // Optional: might be a generic inbox (e.g. all admins of a course)

  subject: text('subject').notNull(), // 'Issue with Registration', 'Question about Tee Boxes'
  status: text('status').default('OPEN').notNull(), // 'OPEN', 'RESOLVED', 'CLOSED'
  
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const messages = pgTable('messages', {
  id: serial('id').primaryKey(),
  threadId: integer('thread_id').references(() => communication_threads.id, { onDelete: 'cascade' }).notNull(),
  senderUserId: text('sender_user_id').notNull(), // Clerk User ID of whoever wrote this message
  
  payload: text('payload').notNull(), // The actual message body
  isRead: boolean('is_read').default(false).notNull(),
  
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
