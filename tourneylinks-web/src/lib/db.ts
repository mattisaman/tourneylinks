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
  name: text('name').notNull(),
  email: text('email').notNull(),
  handicap: real('handicap'),
  paymentStatus: text('payment_status').default('COMPLETED'),
  pairingRequest: text('pairing_request'),
  assignedTeam: integer('assigned_team'),
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
