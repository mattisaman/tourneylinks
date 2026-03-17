import Fuse from 'fuse.js';
import pino from 'pino';
import type { Tournament, GeocodeResult } from '../types/index.js';

const logger = pino({ name: 'dedup' });

// ===========================================
// DEDUPLICATION & NORMALIZATION
// Fuzzy-matches extracted tournaments against existing data
// and normalizes fields
// ===========================================

// ─── Fuzzy deduplication ───

export interface DeduplicationResult {
  newTournaments: Tournament[];
  updatedTournaments: { existing: Tournament; incoming: Tournament }[];
  duplicatesSkipped: number;
}

export function deduplicateTournaments(
  incoming: Tournament[],
  existing: Tournament[],
): DeduplicationResult {
  const result: DeduplicationResult = {
    newTournaments: [],
    updatedTournaments: [],
    duplicatesSkipped: 0,
  };

  if (!existing.length) {
    result.newTournaments = incoming;
    return result;
  }

  // Build fuzzy search index on existing tournaments
  const fuse = new Fuse(existing, {
    keys: [
      { name: 'name', weight: 0.4 },
      { name: 'courseName', weight: 0.25 },
      { name: 'dateStart', weight: 0.25 },
      { name: 'courseCity', weight: 0.1 },
    ],
    threshold: 0.35,    // 0 = perfect match, 1 = match anything
    includeScore: true,
    ignoreLocation: true,
  });

  for (const tournament of incoming) {
    // Search for potential duplicates
    const matches = fuse.search({
      name: tournament.name,
      courseName: tournament.courseName,
      dateStart: tournament.dateStart,
      courseCity: tournament.courseCity,
    } as any);

    if (matches.length > 0 && matches[0].score !== undefined && matches[0].score < 0.3) {
      // High-confidence match — this is likely a duplicate
      const existingMatch = matches[0].item;

      // Check if the incoming data has more info (merge opportunity)
      if (hasMoreData(tournament, existingMatch)) {
        result.updatedTournaments.push({
          existing: existingMatch,
          incoming: tournament,
        });
        logger.debug({ name: tournament.name, score: matches[0].score }, 'Duplicate found — will merge');
      } else {
        result.duplicatesSkipped++;
        logger.debug({ name: tournament.name, score: matches[0].score }, 'Duplicate skipped');
      }
    } else {
      // No match — this is a new tournament
      result.newTournaments.push(tournament);
    }
  }

  logger.info({
    incoming: incoming.length,
    new: result.newTournaments.length,
    updated: result.updatedTournaments.length,
    skipped: result.duplicatesSkipped,
  }, 'Deduplication complete');

  return result;
}

// Check if incoming has data that existing is missing
function hasMoreData(incoming: Tournament, existing: Tournament): boolean {
  const fields: (keyof Tournament)[] = [
    'entryFee', 'maxPlayers', 'description', 'organizerEmail',
    'registrationUrl', 'includes', 'handicapMax', 'organizerPhone',
    'spotsRemaining', 'registrationDeadline',
  ];

  return fields.some(field =>
    incoming[field] != null && existing[field] == null
  );
}

// ─── Merge two tournament records ───

export function mergeTournaments(existing: Tournament, incoming: Tournament): Tournament {
  const merged = { ...existing };

  // For each field, prefer non-null incoming data over existing nulls
  // but don't overwrite existing non-null data unless confidence is higher
  const fields: (keyof Tournament)[] = [
    'entryFee', 'maxPlayers', 'spotsRemaining', 'handicapMax',
    'description', 'includes', 'organizerName', 'organizerEmail',
    'organizerPhone', 'registrationUrl', 'registrationDeadline',
    'formatDetail', 'courseZip', 'latitude', 'longitude',
  ];

  for (const field of fields) {
    if (incoming[field] != null && existing[field] == null) {
      (merged as any)[field] = incoming[field];
    }
  }

  // Update confidence to the higher of the two
  merged.extractionConfidence = Math.max(
    existing.extractionConfidence,
    incoming.extractionConfidence
  );

  // Update extraction timestamp
  merged.extractedAt = new Date().toISOString();

  return merged;
}

// ─── Normalization ───

export function normalizeTournament(t: Tournament): Tournament {
  return {
    ...t,
    // Normalize name: trim, title case
    name: normalizeName(t.name),

    // Normalize state to 2-letter code
    courseState: normalizeState(t.courseState),

    // Normalize format
    format: normalizeFormat(t.format, t.formatDetail),

    // Clean up description
    description: t.description?.trim().slice(0, 2000) || null,

    // Normalize price (ensure it's a number)
    entryFee: t.entryFee != null ? Math.round(t.entryFee * 100) / 100 : null,
  };
}

function normalizeName(name: string): string {
  return name
    .trim()
    .replace(/\s+/g, ' ')
    // Remove common noise
    .replace(/^(the|a)\s+/i, '')
    // Title case
    .replace(/\w\S*/g, txt =>
      txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    )
    // Fix common abbreviations back to uppercase
    .replace(/\b(cc|gc|ii|iii|iv|pga|usga|lpga|ajga)\b/gi, m => m.toUpperCase());
}

const STATE_MAP: Record<string, string> = {
  'alabama': 'AL', 'alaska': 'AK', 'arizona': 'AZ', 'arkansas': 'AR',
  'california': 'CA', 'colorado': 'CO', 'connecticut': 'CT', 'delaware': 'DE',
  'florida': 'FL', 'georgia': 'GA', 'hawaii': 'HI', 'idaho': 'ID',
  'illinois': 'IL', 'indiana': 'IN', 'iowa': 'IA', 'kansas': 'KS',
  'kentucky': 'KY', 'louisiana': 'LA', 'maine': 'ME', 'maryland': 'MD',
  'massachusetts': 'MA', 'michigan': 'MI', 'minnesota': 'MN', 'mississippi': 'MS',
  'missouri': 'MO', 'montana': 'MT', 'nebraska': 'NE', 'nevada': 'NV',
  'new hampshire': 'NH', 'new jersey': 'NJ', 'new mexico': 'NM', 'new york': 'NY',
  'north carolina': 'NC', 'north dakota': 'ND', 'ohio': 'OH', 'oklahoma': 'OK',
  'oregon': 'OR', 'pennsylvania': 'PA', 'rhode island': 'RI', 'south carolina': 'SC',
  'south dakota': 'SD', 'tennessee': 'TN', 'texas': 'TX', 'utah': 'UT',
  'vermont': 'VT', 'virginia': 'VA', 'washington': 'WA', 'west virginia': 'WV',
  'wisconsin': 'WI', 'wyoming': 'WY',
};

function normalizeState(state: string): string {
  const s = state.trim();
  if (s.length === 2) return s.toUpperCase();
  return STATE_MAP[s.toLowerCase()] || s.toUpperCase().slice(0, 2);
}

function normalizeFormat(format: string, detail: string | null): Tournament['format'] {
  const f = (format + ' ' + (detail || '')).toLowerCase();
  if (/scramble|shamble/i.test(f)) return 'scramble';
  if (/best.?ball|four.?ball|better.?ball/i.test(f)) return 'best-ball';
  if (/stroke|medal/i.test(f)) return 'stroke';
  if (/match/i.test(f)) return 'match';
  if (/stableford/i.test(f)) return 'stableford';
  if (/alternate.?shot|foursomes/i.test(f)) return 'alternate-shot';
  if (/chapman/i.test(f)) return 'chapman';
  return format as Tournament['format'];
}

// ─── Geocoding ───

export async function geocodeTournament(tournament: Tournament): Promise<Tournament> {
  if (tournament.latitude && tournament.longitude) return tournament;

  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  if (!apiKey) {
    logger.warn('No Google Maps API key — skipping geocode');
    return tournament;
  }

  const query = `${tournament.courseName}, ${tournament.courseCity}, ${tournament.courseState}`;

  try {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(query)}&key=${apiKey}`;
    const response = await fetch(url);
    const data = await response.json() as any;

    if (data.status === 'OK' && data.results[0]) {
      const result = data.results[0];
      const location = result.geometry.location;

      // Extract ZIP from address components
      const zipComponent = result.address_components?.find(
        (c: any) => c.types.includes('postal_code')
      );

      return {
        ...tournament,
        latitude: location.lat,
        longitude: location.lng,
        courseZip: zipComponent?.long_name || tournament.courseZip,
      };
    }
  } catch (error) {
    logger.error({ query, error: String(error) }, 'Geocoding failed');
  }

  return tournament;
}
