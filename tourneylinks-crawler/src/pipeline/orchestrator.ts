import PQueue from 'p-queue';
import pino from 'pino';
import { randomUUID } from 'crypto';
import type { CrawlSource, Tournament, CycleStats } from '../types/index.js';
import { SOURCES } from '../config/sources.js';
import { discoverUrls } from '../crawlers/url-discovery.js';
import { closeBrowser } from '../crawlers/page-crawler.js';
import { extractionQueue } from './queue.js';
import { getExistingTournaments } from './database.js';

const logger = pino({ name: 'pipeline' });

// ===========================================
// MAIN CRAWL PIPELINE
// Orchestrates the full crawl cycle:
// Discover → Crawl → Extract → Deduplicate → Geocode → Store
// ===========================================

export async function runCrawlCycle(sourceFilter?: string, targetRegion?: string): Promise<CycleStats> {
  const cycleId = randomUUID().slice(0, 8);
  const stats: CycleStats = {
    cycleId,
    startedAt: new Date().toISOString(),
    pagesCrawled: 0,
    tournamentsFound: 0,
    newTournaments: 0,
    updatedTournaments: 0,
    duplicatesSkipped: 0,
    failedPages: 0,
    sourceBreakdown: {},
  };

  logger.info({ cycleId }, '═══ Starting crawl cycle ═══');

  // Get enabled sources (optionally filtered)
  const sources = SOURCES.filter(s => {
    if (!s.enabled) return false;
    if (sourceFilter) return s.id === sourceFilter;
    return true;
  });

  if (!sources.length) {
    logger.warn('No sources to crawl');
    return stats;
  }

  // Load existing tournaments for dedup
  let existingTournaments: Tournament[] = [];
  try {
    existingTournaments = await getExistingTournaments();
    logger.info({ existing: existingTournaments.length }, 'Loaded existing tournaments for dedup');
  } catch (error) {
    logger.warn({ error: String(error) }, 'Could not load existing tournaments — will treat all as new');
  }

  // Process each source
  for (const source of sources) {
    logger.info({ source: source.id, type: source.type }, `─── Processing source: ${source.name} ───`);

    stats.sourceBreakdown[source.id] = { pages: 0, found: 0, new: 0, failed: 0 };

    try {
      await processSource(source, existingTournaments, stats, cycleId, targetRegion);
    } catch (error) {
      logger.error({ source: source.id, error: String(error) }, 'Source processing failed');
    }
  }

  stats.completedAt = new Date().toISOString();

  // Cleanup
  await closeBrowser();

  // Summary
  logger.info({
    cycleId,
    duration: `${Math.round((Date.now() - new Date(stats.startedAt).getTime()) / 1000)}s`,
    pages: stats.pagesCrawled,
    found: stats.tournamentsFound,
    new: stats.newTournaments,
    updated: stats.updatedTournaments,
    skipped: stats.duplicatesSkipped,
    failed: stats.failedPages,
  }, '═══ Crawl cycle complete ═══');

  return stats;
}

// ─── Process a single source ───

async function processSource(
  source: CrawlSource,
  existingTournaments: Tournament[],
  stats: CycleStats,
  cycleId: string,
  targetRegion?: string
): Promise<void> {
  const sourceStats = stats.sourceBreakdown[source.id];

  // Step 1: Discover URLs to crawl
  logger.info({ source: source.id }, 'Phase 1: URL Discovery');
  const discoveredUrls = await discoverUrls(source, targetRegion);
  logger.info({ source: source.id, urls: discoveredUrls.length }, 'URLs discovered');

  if (!discoveredUrls.length) {
    logger.warn({ source: source.id }, 'No URLs discovered — skipping source');
    return;
  }

  // Limit pages per cycle
  const urlsToProcess = discoveredUrls.slice(0, source.maxPagesPerCycle);

  // Step 2: Fan-Out to BullMQ
  logger.info({ source: source.id, urls: urlsToProcess.length }, 'Phase 2: Enqueuing Extraction Jobs (Fan-Out)');

  for (const discovered of urlsToProcess) {
    await extractionQueue.add('extract-url', {
      cycleId,
      sourceId: source.id,
      url: discovered.url,
      depth: 0,
      maxDepth: 0 // Deep crawl disabled to prevent runaway Google/Gemini API costs
    });
    
    stats.pagesCrawled++;
    sourceStats.pages++;
  }
}
