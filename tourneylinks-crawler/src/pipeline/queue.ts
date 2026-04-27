import { Queue, Worker, Job } from 'bullmq';
import IORedis from 'ioredis';
import pino from 'pino';
import { extractTournaments, isLikelyTournamentPage } from '../extractors/llm-extractor.js';
import { crawlPage } from '../crawlers/page-crawler.js';
import { deduplicateTournaments, normalizeTournament, geocodeTournament, mergeTournaments } from './dedup.js';
import { insertTournament, updateTournament, getExistingTournaments, logCrawl } from './database.js';
import { SOURCES } from '../config/sources.js';
import type { Tournament } from '../types/index.js';

const logger = pino({ name: 'queue' });

// ===========================================
// BULLMQ QUEUE SETUP
// ===========================================

const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
export const connection = new IORedis(redisUrl, { maxRetriesPerRequest: null });

export const EXTRACTION_QUEUE_NAME = 'tournament-extraction';
export const extractionQueue = new Queue(EXTRACTION_QUEUE_NAME, { connection });

// Define the payload structure for extraction jobs
export interface ExtractionJobPayload {
  cycleId: string;
  sourceId: string;
  url: string;
  depth: number;
  maxDepth: number;
}

// ===========================================
// EXTRACTION WORKER
// ===========================================

export const extractionWorker = new Worker<ExtractionJobPayload>(
  EXTRACTION_QUEUE_NAME,
  async (job: Job<ExtractionJobPayload>) => {
    const { cycleId, sourceId, url, depth, maxDepth } = job.data;
    
    logger.info({ url, depth, sourceId }, 'Worker picked up extraction job');
    
    const source = SOURCES.find(s => s.id === sourceId);
    if (!source) {
      throw new Error(`Source ${sourceId} not found`);
    }

    // 1. Crawl the page
    const page = await crawlPage(url, source);
    
    // Pre-filter to avoid burning LLM tokens on non-golf pages
    if (!isLikelyTournamentPage(page.text, page.title)) {
      logger.debug({ url }, 'Page does not appear to contain tournament info — skipping');
      await logCrawl(cycleId, source.id, url, 'skipped', 0);
      return { status: 'skipped', reason: 'not_likely_tournament' };
    }

    // 2. Extract Data via LLM
    const extraction = await extractTournaments(page.text, url, source.id);
    
    if (extraction.errors && extraction.errors.length > 0) {
      await logCrawl(cycleId, source.id, url, 'failed', 0, extraction.errors[0]);
      return { status: 'failed', reason: extraction.errors[0] };
    }

    if (extraction.tournaments.length === 0) {
      await logCrawl(cycleId, source.id, url, 'success', 0);
      return { status: 'success', extracted: 0 };
    }

    const normalized = extraction.tournaments.map(normalizeTournament);
    const existingTournaments = await getExistingTournaments();
    
    // 3. Deep Crawl Logic - Fan Out!
    if (depth < maxDepth) {
      for (const t of normalized) {
        let deepCrawlUrl = t.registrationUrl || t.sourceUrl;
        
        // Resolve relative URLs
        if (deepCrawlUrl && deepCrawlUrl.startsWith('/')) {
            try { deepCrawlUrl = new URL(deepCrawlUrl, url).href; } catch(e) {}
        }

        // If we have a URL that is not the one we just crawled, queue it!
        if (deepCrawlUrl && deepCrawlUrl.startsWith('http') && deepCrawlUrl !== url) {
            logger.info({ deepCrawlUrl, depth: depth + 1 }, 'Pushing deep link to queue');
            await extractionQueue.add('extract-deep-link', {
              cycleId,
              sourceId,
              url: deepCrawlUrl,
              depth: depth + 1,
              maxDepth
            });
        }
      }
    }

    // 4. Deduplicate
    const dedupResult = deduplicateTournaments(normalized, existingTournaments);

    // 5. Geocode & Store New
    const geocoded = await Promise.all(
      dedupResult.newTournaments.map(t => geocodeTournament(t))
    );

    for (const tournament of geocoded) {
      try {
        await insertTournament(tournament);
      } catch (error) {
        logger.error({ name: tournament.name, error: String(error) }, 'Failed to insert tournament');
      }
    }

    // 6. Update Existing
    for (const { existing, incoming } of dedupResult.updatedTournaments) {
      try {
        const merged = mergeTournaments(existing, incoming);
        await updateTournament(existing.sourceId, merged);
      } catch (error) {
        logger.error({ name: existing.name, error: String(error) }, 'Failed to update tournament');
      }
    }

    await logCrawl(cycleId, source.id, url, 'success', normalized.length);
    
    return { 
      status: 'success', 
      extracted: normalized.length, 
      new: dedupResult.newTournaments.length, 
      updated: dedupResult.updatedTournaments.length 
    };
  },
  { 
    connection,
    concurrency: parseInt(process.env.CRAWL_CONCURRENCY || '3')
  }
);

extractionWorker.on('failed', (job, err) => {
  logger.error({ jobId: job?.id, url: job?.data.url, error: err.message }, 'Job failed');
});

extractionWorker.on('completed', (job, result) => {
  logger.debug({ jobId: job.id, result }, 'Job completed successfully');
});
