import PQueue from 'p-queue';
import pino from 'pino';
import { randomUUID } from 'crypto';
import type { CrawlSource, Tournament, CycleStats } from '../types/index.js';
import { SOURCES } from '../config/sources.js';
import { discoverUrls } from '../crawlers/url-discovery.js';
import { crawlPage, closeBrowser } from '../crawlers/page-crawler.js';
import { extractTournaments, isLikelyTournamentPage } from '../extractors/llm-extractor.js';
import { deduplicateTournaments, mergeTournaments, normalizeTournament, geocodeTournament } from './dedup.js';
import { insertTournament, updateTournament, getExistingTournaments, logCrawl } from './database.js';

const logger = pino({ name: 'pipeline' });

// ===========================================
// MAIN CRAWL PIPELINE
// Orchestrates the full crawl cycle:
// Discover → Crawl → Extract → Deduplicate → Geocode → Store
// ===========================================

export async function runCrawlCycle(sourceFilter?: string): Promise<CycleStats> {
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
      await processSource(source, existingTournaments, stats, cycleId);
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
): Promise<void> {
  const sourceStats = stats.sourceBreakdown[source.id];

  // Step 1: Discover URLs to crawl
  logger.info({ source: source.id }, 'Phase 1: URL Discovery');
  const discoveredUrls = await discoverUrls(source);
  logger.info({ source: source.id, urls: discoveredUrls.length }, 'URLs discovered');

  if (!discoveredUrls.length) {
    logger.warn({ source: source.id }, 'No URLs discovered — skipping source');
    return;
  }

  // Limit pages per cycle
  const urlsToProcess = discoveredUrls.slice(0, source.maxPagesPerCycle);

  // Step 2: Crawl pages with concurrency control
  logger.info({ source: source.id, urls: urlsToProcess.length }, 'Phase 2: Page Crawling');

  const concurrency = parseInt(process.env.CRAWL_CONCURRENCY || '3');
  const delayMs = parseInt(process.env.CRAWL_DELAY_MS || '2000');
  const queue = new PQueue({ concurrency, interval: delayMs, intervalCap: 1 });

  const allExtracted: Tournament[] = [];

  const tasks = urlsToProcess.map(discovered => queue.add(async () => {
    try {
      // Crawl the page
      const page = await crawlPage(discovered.url, source);
      stats.pagesCrawled++;
      sourceStats.pages++;

      // Pre-filter: skip pages that don't look like tournament pages
      if (!isLikelyTournamentPage(page.text, page.title)) {
        logger.debug({ url: discovered.url }, 'Page does not appear to contain tournament info — skipping extraction');
        await logCrawl(cycleId, source.id, discovered.url, 'skipped', 0);
        return;
      }

      // Step 3: Extract tournament data via LLM
      const extraction = await extractTournaments(page.text, discovered.url, source.id);

      if (extraction.tournaments.length > 0) {
        logger.info({ url: discovered.url, found: extraction.tournaments.length }, 'Tournaments extracted');

        // Normalize each tournament
        const normalized = extraction.tournaments.map(normalizeTournament);

        // --- DEEP CRAWL LOGIC ---
        for (let i = 0; i < normalized.length; i++) {
            const t = normalized[i];
            
            // Resolve Potential Relative URLs
            let deepCrawlUrl = t.registrationUrl || t.sourceUrl;
            if (deepCrawlUrl && deepCrawlUrl.startsWith('/')) {
                try { deepCrawlUrl = new URL(deepCrawlUrl, discovered.url).href; } catch(e) {}
            }

            const needsDeepCrawl = deepCrawlUrl && (!t.entryFee || !t.description || !t.includes || !t.formatDetail);
            
            if (needsDeepCrawl && deepCrawlUrl.startsWith('http') && deepCrawlUrl !== discovered.url) {
                logger.info({ url: deepCrawlUrl }, `Deep crawling secondary Details layer for ${t.name}...`);
                try {
                    const detailPage = await crawlPage(deepCrawlUrl, source);
                    const detailExt = await extractTournaments(detailPage.text, deepCrawlUrl, source.id);
                    if (detailExt.tournaments.length > 0) {
                        const dt = detailExt.tournaments[0];
                        // Overwrite base attributes with Deep Gold Data
                        if (!t.entryFee && dt.entryFee) t.entryFee = dt.entryFee;
                        if (!t.maxPlayers && dt.maxPlayers) t.maxPlayers = dt.maxPlayers;
                        if (t.spotsRemaining === null && dt.spotsRemaining !== null) t.spotsRemaining = dt.spotsRemaining;
                        if (dt.description && dt.description.length > (t.description?.length || 0)) t.description = dt.description;
                        if (!t.includes && dt.includes) t.includes = dt.includes;
                        if (!t.formatDetail && dt.formatDetail) t.formatDetail = dt.formatDetail;
                        if (!t.organizerName && dt.organizerName) t.organizerName = dt.organizerName;
                    }
                } catch (err) {
                    logger.warn({ url: deepCrawlUrl, error: String(err) }, 'Deep crawl sequence failed, falling back to surface layer');
                }
            }
        }
        // --- END DEEP CRAWL ---

        allExtracted.push(...normalized);

        stats.tournamentsFound += normalized.length;
        sourceStats.found += normalized.length;

        await logCrawl(cycleId, source.id, discovered.url, 'success', normalized.length);
      } else {
        await logCrawl(cycleId, source.id, discovered.url, 'success', 0);
      }
    } catch (error) {
      stats.failedPages++;
      sourceStats.failed++;
      logger.error({ url: discovered.url, error: String(error) }, 'Page processing failed');
      await logCrawl(cycleId, source.id, discovered.url, 'failed', 0, String(error));
    }
  }));

  await Promise.allSettled(tasks);

  if (!allExtracted.length) {
    logger.info({ source: source.id }, 'No tournaments extracted from this source');
    return;
  }

  // Step 4: Deduplicate
  logger.info({ source: source.id, extracted: allExtracted.length }, 'Phase 3: Deduplication');
  const dedupResult = deduplicateTournaments(allExtracted, existingTournaments);

  stats.duplicatesSkipped += dedupResult.duplicatesSkipped;

  // Step 5: Geocode new tournaments
  logger.info({ source: source.id, toGeocode: dedupResult.newTournaments.length }, 'Phase 4: Geocoding');
  const geocoded = await Promise.all(
    dedupResult.newTournaments.map(t => geocodeTournament(t))
  );

  // Step 6: Store results
  logger.info({ source: source.id, new: geocoded.length, updates: dedupResult.updatedTournaments.length }, 'Phase 5: Storing');

  for (const tournament of geocoded) {
    try {
      await insertTournament(tournament);
      stats.newTournaments++;
      sourceStats.new++;
      existingTournaments.push(tournament); // add to existing for future dedup in this cycle
    } catch (error) {
      logger.error({ name: tournament.name, error: String(error) }, 'Failed to insert tournament');
    }
  }

  for (const { existing, incoming } of dedupResult.updatedTournaments) {
    try {
      const merged = mergeTournaments(existing, incoming);
      await updateTournament(existing.sourceId, merged);
      stats.updatedTournaments++;
    } catch (error) {
      logger.error({ name: existing.name, error: String(error) }, 'Failed to update tournament');
    }
  }
}
