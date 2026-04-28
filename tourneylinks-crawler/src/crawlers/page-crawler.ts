import * as cheerio from 'cheerio';
import pino from 'pino';
import type { CrawlSource } from '../types/index.js';

const logger = pino({ name: 'crawler' });

// ===========================================
// PAGE CRAWLER
// Fetches page content via simple HTTP or Playwright
// ===========================================

export interface CrawlResult {
  url: string;
  html: string;
  text: string;              // cleaned text content
  title: string;
  statusCode: number;
  redirectedUrl?: string;
  crawledAt: string;
  method: 'fetch' | 'playwright';
}

// ─── Simple HTTP fetch (for static pages) ───

export async function fetchPage(url: string, userAgent: string): Promise<CrawlResult> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': userAgent,
        'Accept': 'text/html,application/xhtml+xml',
        'Accept-Language': 'en-US,en;q=0.9',
      },
      signal: controller.signal,
      redirect: 'follow',
    });

    const html = await response.text();
    const $ = cheerio.load(html);

    // Extract JSON-LD which contains the full un-truncated description!
    let ldJsonData = '';
    $('script[type="application/ld+json"]').each((_, el) => {
      const content = $(el).html();
      if (content) {
        ldJsonData += content + '\n\n';
      }
    });

    // Remove noise: scripts, styles, nav, footer, ads
    $('script, style, nav, footer, header, .ad, .sidebar, .cookie-banner, noscript').remove();

    // Expose URLs for the LLM
    $('a').each((_, el) => {
      const href = $(el).attr('href');
      if (href && !href.startsWith('javascript:')) {
         $(el).text(`[ ${$(el).text().trim()} -> REG_LINK: ${href} ]`);
      }
    });

    let text = $('body').text()
      .replace(/\s+/g, ' ')
      .replace(/\n\s*\n/g, '\n')
      .trim();

    if (ldJsonData) {
      text = `[STRUCTURED DATA (FULL DETAILS)]:\n${ldJsonData}\n\n[PAGE CONTENT]:\n${text}`;
    }

    const title = $('title').text().trim() || $('h1').first().text().trim();

    return {
      url,
      html,
      text: text.slice(0, 15000), // cap text length for LLM context
      title,
      statusCode: response.status,
      redirectedUrl: response.url !== url ? response.url : undefined,
      crawledAt: new Date().toISOString(),
      method: 'fetch',
    };
  } finally {
    clearTimeout(timeout);
  }
}

// ─── Playwright browser fetch (for JS-rendered pages) ───

let browserInstance: any = null;

async function getBrowser() {
  if (!browserInstance) {
    // Dynamic import so Playwright is only loaded when needed
    const { chromium } = await import('playwright');
    browserInstance = await chromium.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-dev-shm-usage'],
    });
    logger.info('Playwright browser launched');
  }
  return browserInstance;
}

export async function fetchPageWithBrowser(url: string, userAgent: string): Promise<CrawlResult> {
  const browser = await getBrowser();
  const context = await browser.newContext({
    userAgent,
    viewport: { width: 1280, height: 800 },
    locale: 'en-US',
  });

  const page = await context.newPage();

  try {
    // Block unnecessary resources to speed up crawling
    await page.route('**/*', (route: any) => {
      const type = route.request().resourceType();
      if (['image', 'media', 'font', 'stylesheet'].includes(type)) {
        route.abort();
      } else {
        route.continue();
      }
    });

    const response = await page.goto(url, {
      waitUntil: 'domcontentloaded',
      timeout: 20000,
    });

    // Wait a bit for JS to render content
    await page.waitForTimeout(2000);

    // Try to wait for common tournament content selectors
    await Promise.race([
      page.waitForSelector('[class*="tournament"], [class*="event"], [class*="registration"]', { timeout: 3000 }).catch(() => {}),
      page.waitForTimeout(3000),
    ]);

    const html = await page.content();
    const $ = cheerio.load(html);
    // Extract JSON-LD which contains the full un-truncated description on Eventbrite!
    let ldJsonData = '';
    $('script[type="application/ld+json"]').each((_, el) => {
      const content = $(el).html();
      if (content) {
        ldJsonData += content + '\n\n';
      }
    });

    $('script, style, nav, footer, header, .ad, .sidebar, noscript').remove();

    // Expose URLs for the LLM
    $('a').each((_, el) => {
      const href = $(el).attr('href');
      if (href && !href.startsWith('javascript:')) {
         $(el).text(`[ ${$(el).text().trim()} -> REG_LINK: ${href} ]`);
      }
    });

    let text = $('body').text()
      .replace(/\s+/g, ' ')
      .replace(/\n\s*\n/g, '\n')
      .trim();
      
    if (ldJsonData) {
      text = `[STRUCTURED DATA (FULL DETAILS)]:\n${ldJsonData}\n\n[PAGE CONTENT]:\n${text}`;
    }

    const title = await page.title();
    const finalUrl = page.url();

    return {
      url,
      html,
      text: text.slice(0, 15000),
      title,
      statusCode: response?.status() ?? 200,
      redirectedUrl: finalUrl !== url ? finalUrl : undefined,
      crawledAt: new Date().toISOString(),
      method: 'playwright',
    };
  } finally {
    await context.close();
  }
}

// ─── Main crawl function (picks method based on source config) ───

export async function crawlPage(url: string, source: CrawlSource): Promise<CrawlResult> {
  const userAgent = process.env.CRAWL_USER_AGENT || 'TourneyLinksBot/1.0';

  logger.info({ url, source: source.id, js: source.requiresJavascript }, 'Crawling page');

  if (source.requiresJavascript) {
    return fetchPageWithBrowser(url, userAgent);
  }
  return fetchPage(url, userAgent);
}

// ─── Cleanup ───

export async function closeBrowser() {
  if (browserInstance) {
    await browserInstance.close();
    browserInstance = null;
    logger.info('Playwright browser closed');
  }
}
