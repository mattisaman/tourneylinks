import { Queue, Worker, Job } from 'bullmq';
import IORedis from 'ioredis';
import pino from 'pino';
import crypto from 'crypto';
import { extractTournaments, isLikelyTournamentPage } from '../extractors/llm-extractor.js';
import { defaultMarkdownCrawler } from '../extractors/markdown-crawler.js';
import { deduplicateTournaments, normalizeTournament, geocodeTournament, mergeTournaments } from './dedup.js';
import { insertTournament, updateTournament, getExistingTournaments, logCrawl, isUrlVisited, markUrlVisited } from './database.js';
import { SOURCES } from '../config/sources.js';
import type { Tournament } from '../types/index.js';

const logger = pino({ name: 'queue' });

// ===========================================
// BULLMQ QUEUE SETUP
// ===========================================

const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
export const connection = new IORedis(redisUrl, { maxRetriesPerRequest: null });

export const EXTRACTION_QUEUE_NAME = 'tournament-extraction';
export const extractionQueue = new Queue(EXTRACTION_QUEUE_NAME, { connection: connection as any });

export interface ExtractionJobPayload {
  cycleId: string;
  sourceId: string;
  url: string;
  depth: number;
  maxDepth: number;
}

// Helpers for Deduplication
function normalizeUrlForDedup(rawUrl: string): string {
  try {
    const u = new URL(rawUrl);
    // remove hash, standard trailing slash
    let clean = u.origin + u.pathname;
    if (clean.endsWith('/')) clean = clean.slice(0, -1);
    return clean;
  } catch {
    return rawUrl;
  }
}

function getUrlHash(url: string): string {
  return crypto.createHash('sha256').update(normalizeUrlForDedup(url)).digest('hex');
}

function getDomain(url: string): string {
  try {
    return new URL(url).hostname;
  } catch {
    return '';
  }
}

function isValidDiscoveryLink(link: string, sourceDomain: string): boolean {
  if (!link || !link.startsWith('http')) return false;
  
  const junkExtensions = ['.pdf', '.jpg', '.png', '.css', '.js', '.mp4', '.zip'];
  if (junkExtensions.some(ext => link.toLowerCase().endsWith(ext))) return false;

  const ignorePaths = ['/login', '/register', '/cart', '/checkout', '/wp-admin'];
  if (ignorePaths.some(path => link.toLowerCase().includes(path))) return false;

  // For discovery, usually we stay on the same domain or known related domains
  // but if we are trying to find entirely new tournaments, we might want to go broad.
  // For now, let's keep it somewhat broad but ignore giant hubs unless explicitly seeded.
  try {
    const linkDomain = new URL(link).hostname;
    const ignoreDomains = ['facebook.com', 'twitter.com', 'instagram.com', 'linkedin.com', 'google.com', 'apple.com', 'yelp.com'];
    if (ignoreDomains.some(d => linkDomain.includes(d))) return false;
    
    return true;
  } catch {
    return false;
  }
}

// ===========================================
// EXTRACTION WORKER (Discovery & Extraction Engine)
// ===========================================

export const extractionWorker = new Worker<ExtractionJobPayload>(
  EXTRACTION_QUEUE_NAME,
  async (job: Job<ExtractionJobPayload>) => {
    const { cycleId, sourceId, url, depth, maxDepth } = job.data;
    
    logger.info({ url, depth, sourceId }, 'Worker picked up extraction job');
    
    const source = SOURCES.find(s => s.id === sourceId) || { id: 'generic', name: 'Generic Crawler', url: '' };

    // 1. Deduplication Gatekeeper
    const urlHash = getUrlHash(url);
    const domain = getDomain(url);
    const isVisited = await isUrlVisited(urlHash);
    
    if (isVisited) {
      logger.info({ url }, 'URL already visited. Skipping.');
      return { status: 'skipped', reason: 'already_visited' };
    }

    // Mark visited immediately to prevent race conditions
    await markUrlVisited(urlHash, url, domain, depth);

    // 2. Crawl the page with Local MarkdownCrawler
    const page = await defaultMarkdownCrawler.crawlAndExtract(url);
    
    if (!page) {
      await logCrawl(cycleId, source.id, url, 'failed', 0, 'Page crawl failed');
      return { status: 'failed', reason: 'crawl_failed' };
    }

    // 3. Queue Outbound Links for Broad Discovery
    if (depth < maxDepth) {
      let queuedLinks = 0;
      for (const link of page.links) {
        if (isValidDiscoveryLink(link, domain)) {
          const linkHash = getUrlHash(link);
          const linkVisited = await isUrlVisited(linkHash);
          
          if (!linkVisited) {
            await extractionQueue.add('extract-deep-link', {
              cycleId,
              sourceId: source.id,
              url: link,
              depth: depth + 1,
              maxDepth
            });
            queuedLinks++;
          }
        }
      }
      logger.info({ queuedLinks, depth }, 'Queued outbound links for deep discovery');
    }

    // 4. Pre-filter to avoid burning LLM tokens on non-golf pages
    if (!isLikelyTournamentPage(page.markdown, page.title)) {
      logger.debug({ url }, 'Page does not appear to contain tournament info — skipping LLM');
      await logCrawl(cycleId, source.id, url, 'skipped', 0);
      return { status: 'success', reason: 'not_likely_tournament', deepLinksQueued: true };
    }

    // 5. Extract Data via LLM using Markdown
    const extraction = await extractTournaments(page.markdown, url, source.id);
    
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
    
    // 6. Deduplicate against existing tournaments
    const dedupResult = deduplicateTournaments(normalized, existingTournaments);

    // 7. Geocode & Store New
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

    // 8. Update Existing
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
    connection: connection as any,
    concurrency: parseInt(process.env.CRAWL_CONCURRENCY || '3')
  }
);

extractionWorker.on('failed', (job, err) => {
  logger.error({ jobId: job?.id, url: job?.data.url, error: err.message }, 'Job failed');
});

extractionWorker.on('completed', (job, result) => {
  logger.debug({ jobId: job.id, result }, 'Job completed successfully');
});
