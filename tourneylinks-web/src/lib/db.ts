import { drizzle } from 'drizzle-orm/node-postgres';
import { pgTable, serial, text, real, integer, boolean, timestamp } from 'drizzle-orm/pg-core';
import { eq, and, gte, asc } from 'drizzle-orm';
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

  dateStart: text('date_start').notNull(),
  dateEnd: text('date_end'),
  registrationDeadline: text('registration_deadline'),

  courseName: text('course_name').notNull(),
  courseCity: text('course_city').notNull(),
  courseState: text('course_state').notNull(),
  courseZip: text('course_zip'),
  latitude: real('latitude'),
  longitude: real('longitude'),

  format: text('format').notNull(),
  formatDetail: text('format_detail'),
  holes: integer('holes').default(18),

  entryFee: real('entry_fee'),
  hostUserId: integer('host_user_id').references(() => users.id),
  maxPlayers: integer('max_players'),
  spotsRemaining: integer('spots_remaining'),

  handicapMax: integer('handicap_max'),
  isCharity: boolean('is_charity').default(false),
  isPrivate: boolean('is_private').default(false),

  organizerName: text('organizer_name'),
  organizerEmail: text('organizer_email'),
  organizerPhone: text('organizer_phone'),
  registrationUrl: text('registration_url'),
  description: text('description'),
  includes: text('includes'),

  extractionConfidence: real('extraction_confidence').default(0),
  extractedAt: text('extracted_at'),

  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
  lastVerifiedAt: timestamp('last_verified_at'),
  isActive: boolean('is_active').default(true),
});

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
  createdAt: timestamp('created_at').defaultNow(),
});

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
  status: text('status').notNull(),
  tournamentsFound: integer('tournaments_found').default(0),
  error: text('error'),
  crawledAt: timestamp('crawled_at').defaultNow(),
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
      gte(tournaments.dateStart, new Date().toISOString().split('T')[0])
    ))
    .orderBy(asc(tournaments.dateStart));
  return rows;
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
