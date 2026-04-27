import { z } from 'zod';

// ===========================================
// TOURNAMENT SCHEMA
// ===========================================

export const TournamentSchema = z.object({
  // Identity
  name: z.string().min(3),
  sourceUrl: z.string().url(),
  sourceId: z.string(), // hash of sourceUrl for dedup
  source: z.string(), // e.g. "golf-genius", "bluegolf", "facebook"

  // When
  dateStart: z.string(), // ISO date
  dateEnd: z.string().nullable(),
  registrationDeadline: z.string().nullable(),

  // Where
  courseName: z.string(),
  courseCity: z.string(),
  courseState: z.string(),
  courseZip: z.string().nullable(),
  latitude: z.number().nullable(),
  longitude: z.number().nullable(),

  // What
  format: z.enum([
    'stroke', 'scramble', 'best-ball', 'match', 'stableford',
    'alternate-shot', 'chapman', 'shamble', 'other'
  ]),
  formatDetail: z.string().nullable(), // e.g. "4-Man Scramble", "2-Person Best Ball"
  holes: z.number().default(18),

  // Cost & capacity
  entryFee: z.number().nullable(),
  maxPlayers: z.number().nullable(),
  spotsRemaining: z.number().nullable(),

  // Eligibility
  handicapMax: z.number().nullable(),
  isCharity: z.boolean().default(false),
  isPrivate: z.boolean().default(false),

  // Meta
  organizerName: z.string().nullable(),
  organizerEmail: z.string().nullable(),
  organizerPhone: z.string().nullable(),
  registrationUrl: z.string().nullable(),
  description: z.string().nullable(),
  includes: z.string().nullable(), // "Cart, lunch, prizes"

  // Social / Assets
  schedule: z.any().nullable().optional(),
  prizes: z.any().nullable().optional(),
  sponsors: z.any().nullable().optional(),

  // Extended JSON Metadata
  pricingDetails: z.any().nullable().optional(),
  formatDetails: z.any().nullable().optional(),
  socialSignals: z.any().nullable().optional(),
  rawExtractionData: z.any().nullable().optional(),

  // Extraction metadata
  extractionConfidence: z.number().min(0).max(1),
  rawPageText: z.string().optional(),
  extractedAt: z.string(), // ISO timestamp
});

export type Tournament = z.infer<typeof TournamentSchema>;

// ===========================================
// CRAWL SOURCE CONFIG
// ===========================================

export interface CrawlSource {
  id: string;
  name: string;
  type: 'platform' | 'federation' | 'club' | 'social' | 'marketplace' | 'discovery';
  enabled: boolean;

  // How to discover URLs
  seedUrls?: string[];
  searchPatterns?: string[];     // Google search queries to run
  sitemapUrl?: string;

  // Crawl behavior
  requiresJavascript: boolean;   // needs Playwright vs simple fetch
  rateLimit: number;             // requests per second
  respectRobotsTxt: boolean;
  maxPagesPerCycle: number;

  // Extraction
  extractionStrategy: 'llm' | 'structured' | 'hybrid';
  customParser?: string;         // name of a custom parser function
}

// ===========================================
// CRAWL JOB
// ===========================================

export interface CrawlJob {
  id: string;
  sourceId: string;
  url: string;
  priority: number;             // 1 = highest
  status: 'pending' | 'crawling' | 'extracting' | 'done' | 'failed';
  retries: number;
  maxRetries: number;
  createdAt: string;
  startedAt?: string;
  completedAt?: string;
  error?: string;
  pageContent?: string;
  extractedTournaments?: Tournament[];
}

// ===========================================
// CRAWL CYCLE STATS
// ===========================================

export interface CycleStats {
  cycleId: string;
  startedAt: string;
  completedAt?: string;
  pagesCrawled: number;
  tournamentsFound: number;
  newTournaments: number;
  updatedTournaments: number;
  duplicatesSkipped: number;
  failedPages: number;
  sourceBreakdown: Record<string, {
    pages: number;
    found: number;
    new: number;
    failed: number;
  }>;
}

// ===========================================
// EXTRACTION RESULT
// ===========================================

export interface ExtractionResult {
  tournaments: Tournament[];
  confidence: number;
  tokensUsed: number;
  rawResponse: string;
  errors?: string[];
}

// ===========================================
// GEOCODE RESULT
// ===========================================

export interface GeocodeResult {
  latitude: number;
  longitude: number;
  formattedAddress: string;
  city: string;
  state: string;
  zip: string;
}
