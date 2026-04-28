import pino from 'pino';
import * as cheerio from 'cheerio';
import type { CrawlSource } from '../types/index.js';
import { METRO_AREAS } from '../config/sources.js';
import { fetchPage, fetchPageWithBrowser } from './page-crawler.js';

const logger = pino({ name: 'discovery' });

// ===========================================
// URL DISCOVERY
// Finds tournament page URLs to crawl from each source
// ===========================================

export interface DiscoveredUrl {
  url: string;
  sourceId: string;
  discoveredAt: string;
  priority: number; // 1=highest
  context?: string; // snippet about why we think this is a tournament page
}

// ─── Discover URLs from seed pages (follow links) ───

export async function discoverFromSeeds(source: CrawlSource): Promise<DiscoveredUrl[]> {
  if (!source.seedUrls?.length) return [];
  const discovered: DiscoveredUrl[] = [];
  const userAgent = process.env.CRAWL_USER_AGENT || 'TourneyLinksBot/1.0';

  for (const seedUrl of source.seedUrls) {
    try {
      const result = source.requiresJavascript
        ? await fetchPageWithBrowser(seedUrl, userAgent)
        : await fetchPage(seedUrl, userAgent);

      const $ = cheerio.load(result.html);

      // Find links that look like tournament/event pages
      const tournamentPatterns = [
        /tournament/i, /event/i, /registration/i, /outing/i,
        /scramble/i, /championship/i, /invitational/i, /classic/i,
        /open/i, /qualifier/i, /amateur/i, /charity/i, /benefit/i,
      ];

      $('a[href]').each((_, el) => {
        const href = $(el).attr('href');
        const text = $(el).text().trim();
        if (!href) return;

        // Resolve relative URLs
        let fullUrl: string;
        try {
          fullUrl = new URL(href, seedUrl).toString();
        } catch {
          return;
        }

        // Skip non-http, anchors, and common non-tournament paths
        if (!fullUrl.startsWith('http')) return;
        if (fullUrl.includes('#') && fullUrl.split('#')[0] === seedUrl) return;
        if (/\.(pdf|jpg|png|gif|css|js)$/i.test(fullUrl)) return;
        if (/(login|signup|contact|about|privacy|terms|faq)/i.test(fullUrl)) return;

        // Check if link text or URL matches tournament patterns
        const isMatch = tournamentPatterns.some(p =>
          p.test(text) || p.test(fullUrl)
        );

        if (isMatch) {
          discovered.push({
            url: fullUrl,
            sourceId: source.id,
            discoveredAt: new Date().toISOString(),
            priority: 2,
            context: text.slice(0, 200),
          });
        }
      });

      logger.info({ seedUrl, found: discovered.length, source: source.id },
        'Discovered URLs from seed');

    } catch (error) {
      logger.error({ seedUrl, source: source.id, error: String(error) },
        'Failed to crawl seed URL');
    }
  }

  return deduplicateUrls(discovered);
}

// ─── Discover URLs via Google search ───

export async function discoverFromSearch(source: CrawlSource, targetRegion?: string): Promise<DiscoveredUrl[]> {
  if (!source.searchPatterns?.length) return [];
  const discovered: DiscoveredUrl[] = [];

  let metros = [];
  if (targetRegion) {
    metros = [{ city: targetRegion, state: '' }]; // Let Google/Search handle the state resolution if city includes state (e.g. "Orlando, FL")
  } else {
    // Pick a random subset of metros for this cycle
    const shuffled = [...METRO_AREAS].sort(() => Math.random() - 0.5);
    metros = shuffled.slice(0, 1); // 1 metro per cycle to save Google Search budget
  }

  for (const pattern of source.searchPatterns) {
    for (const metro of metros) {
      let query = pattern
        .replace('{city}', metro.city)
        .replace('{state}', metro.state);

      // If the pattern doesn't have {city} or {state} placeholders, append the region manually
      // so we don't accidentally search the entire globe when a targeted region is requested.
      if (query === pattern && metro.city) {
        query += ` ${metro.city} ${metro.state}`.trim();
      }

      try {
        // Use Google's custom search JSON API (requires API key)
        // Alternatively, scrape Google results with Playwright (riskier)
        const googleApiKey = process.env.GOOGLE_SEARCH_API_KEY;
        const googleCx = process.env.GOOGLE_SEARCH_CX;

        if (googleApiKey && googleCx) {
          const searchUrl = `https://www.googleapis.com/customsearch/v1?key=${googleApiKey}&cx=${googleCx}&q=${encodeURIComponent(query)}&num=10`;

          const response = await fetch(searchUrl);
          const data = await response.json() as any;

          if (data.items) {
            for (const item of data.items) {
              discovered.push({
                url: item.link,
                sourceId: source.id,
                discoveredAt: new Date().toISOString(),
                priority: 3,
                context: `${item.title}: ${item.snippet}`.slice(0, 200),
              });
            }
          }
        } else {
          // Fallback: construct URLs we know are likely to have tournaments
          // This is less comprehensive but doesn't require a search API
          logger.warn('No Google Search API configured — using fallback discovery');
        }

        // Respect rate limits
        await sleep(1000 / (source.rateLimit || 0.5));

      } catch (error) {
        logger.error({ query, error: String(error) }, 'Search discovery failed');
      }
    }
  }

  return deduplicateUrls(discovered);
}

// ─── Main discovery orchestrator ───

export async function discoverUrls(source: CrawlSource, targetRegion?: string): Promise<DiscoveredUrl[]> {
  logger.info({ source: source.id, type: source.type }, 'Starting URL discovery');

  const allDiscovered: DiscoveredUrl[] = [];

  // Run both discovery methods in parallel
  const [seedResults, searchResults] = await Promise.allSettled([
    targetRegion ? Promise.resolve([]) : discoverFromSeeds(source),
    discoverFromSearch(source, targetRegion),
  ]);

  if (seedResults.status === 'fulfilled') allDiscovered.push(...seedResults.value);
  if (searchResults.status === 'fulfilled') allDiscovered.push(...searchResults.value);

  const unique = deduplicateUrls(allDiscovered);
  logger.info({ source: source.id, total: unique.length }, 'Discovery complete');

  return unique;
}

// ─── Helpers ───

function deduplicateUrls(urls: DiscoveredUrl[]): DiscoveredUrl[] {
  const seen = new Set<string>();
  return urls.filter(u => {
    // Normalize URL for dedup (remove trailing slash, query params order)
    const normalized = normalizeUrl(u.url);
    if (seen.has(normalized)) return false;
    seen.add(normalized);
    return true;
  });
}

function normalizeUrl(url: string): string {
  try {
    const u = new URL(url);
    // Remove tracking params
    ['utm_source', 'utm_medium', 'utm_campaign', 'fbclid', 'ref'].forEach(p => u.searchParams.delete(p));
    // Remove trailing slash
    let path = u.pathname.replace(/\/+$/, '') || '/';
    return `${u.protocol}//${u.host}${path}${u.search}`.toLowerCase();
  } catch {
    return url.toLowerCase();
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
