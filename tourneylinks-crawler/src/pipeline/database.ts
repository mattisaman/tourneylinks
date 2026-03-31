import { drizzle } from 'drizzle-orm/node-postgres';
import { pgTable, serial, text, real, integer, boolean, timestamp, index } from 'drizzle-orm/pg-core';
import { eq, and, gte, sql } from 'drizzle-orm';
import pg from 'pg';
import pino from 'pino';
import type { Tournament } from '../types/index.js';

const logger = pino({ name: 'database' });

// ===========================================
// DATABASE SCHEMA & OPERATIONS
// ===========================================

// ─── Schema ───

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
  
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
  isActive: boolean('is_active').default(true),
}, (table) => [
  index('idx_courses_state').on(table.state),
  index('idx_courses_location').on(table.latitude, table.longitude),
]);

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

  // Internal tracking
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
  lastVerifiedAt: timestamp('last_verified_at'),
  isActive: boolean('is_active').default(true),
}, (table) => [
  index('idx_tournaments_date').on(table.dateStart),
  index('idx_tournaments_state').on(table.courseState),
  index('idx_tournaments_source').on(table.source),
  index('idx_tournaments_location').on(table.latitude, table.longitude),
  index('idx_tournaments_source_id').on(table.sourceId),
]);

export const crawlLogs = pgTable('crawl_logs', {
  id: serial('id').primaryKey(),
  cycleId: text('cycle_id').notNull(),
  sourceId: text('source_id').notNull(),
  url: text('url').notNull(),
  status: text('status').notNull(), // 'success' | 'failed' | 'skipped'
  tournamentsFound: integer('tournaments_found').default(0),
  error: text('error'),
  crawledAt: timestamp('crawled_at').defaultNow(),
});

// ─── Database connection ───

let db: ReturnType<typeof drizzle> | null = null;

export function getDb() {
  if (!db) {
    const pool = new pg.Pool({
      connectionString: process.env.DATABASE_URL,
      max: 5,
    });
    db = drizzle(pool);
    logger.info('Database connected');
  }
  return db;
}

// ─── Operations ───

export async function insertTournament(t: Tournament): Promise<number> {
  const database = getDb();
  const result = await database.insert(tournaments).values({
    name: t.name,
    sourceUrl: t.sourceUrl,
    sourceId: t.sourceId,
    source: t.source,
    dateStart: t.dateStart,
    dateEnd: t.dateEnd,
    registrationDeadline: t.registrationDeadline,
    courseName: t.courseName,
    courseCity: t.courseCity,
    courseState: t.courseState,
    courseZip: t.courseZip,
    latitude: t.latitude,
    longitude: t.longitude,
    format: t.format,
    formatDetail: t.formatDetail,
    holes: t.holes,
    entryFee: t.entryFee,
    maxPlayers: t.maxPlayers,
    spotsRemaining: t.spotsRemaining,
    handicapMax: t.handicapMax,
    isCharity: t.isCharity,
    isPrivate: t.isPrivate,
    organizerName: t.organizerName,
    organizerEmail: t.organizerEmail,
    organizerPhone: t.organizerPhone,
    registrationUrl: t.registrationUrl,
    description: t.description,
    includes: t.includes,
    extractionConfidence: t.extractionConfidence,
    extractedAt: t.extractedAt,
  }).returning({ id: tournaments.id });

  return result[0].id;
}

export async function updateTournament(sourceId: string, t: Partial<Tournament>): Promise<void> {
  const database = getDb();
  await database.update(tournaments)
    .set({ ...t, updatedAt: new Date() } as any)
    .where(eq(tournaments.sourceId, sourceId));
}

export async function getExistingTournaments(): Promise<Tournament[]> {
  const database = getDb();
  const rows = await database.select().from(tournaments)
    .where(and(
      eq(tournaments.isActive, true),
      gte(tournaments.dateStart, new Date().toISOString().split('T')[0])
    ));

  return rows as unknown as Tournament[];
}

export async function logCrawl(cycleId: string, sourceId: string, url: string, status: string, found: number, error?: string) {
  const database = getDb();
  await database.insert(crawlLogs).values({
    cycleId, sourceId, url, status,
    tournamentsFound: found,
    error: error || null,
  });
}

export async function getTournamentCount(): Promise<number> {
  const database = getDb();
  const result = await database.select({ count: sql`count(*)` }).from(tournaments)
    .where(eq(tournaments.isActive, true));
  return Number(result[0].count);
}
