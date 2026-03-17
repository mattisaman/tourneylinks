import { drizzle } from 'drizzle-orm/node-postgres';
import { pgTable, serial, text, real, integer, boolean, timestamp } from 'drizzle-orm/pg-core';
import { eq, and, gte, asc } from 'drizzle-orm';
import pg from 'pg';

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

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

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
