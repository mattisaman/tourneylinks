import { chromium, Browser, Page } from 'playwright';
import { Readability } from '@mozilla/readability';
import { JSDOM } from 'jsdom';
import TurndownService from 'turndown';
import pino from 'pino';

const logger = pino({ name: 'markdown-crawler' });

export interface CrawlResult {
  url: string;
  title: string;
  markdown: string;
  links: string[];
}

export class MarkdownCrawler {
  private browser: Browser | null = null;
  private turndownService: TurndownService;

  constructor() {
    this.turndownService = new TurndownService({
      headingStyle: 'atx',
      codeBlockStyle: 'fenced',
    });
    // Remove unwanted elements like scripts and styles from markdown output
    this.turndownService.remove(['script', 'noscript', 'style', 'head', 'nav', 'footer', 'iframe']);
  }

  public async init() {
    if (!this.browser) {
      this.browser = await chromium.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
      });
      logger.info('Playwright browser initialized.');
    }
  }

  public async close() {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
      logger.info('Playwright browser closed.');
    }
  }

  public async crawlAndExtract(url: string, waitForSelector?: string): Promise<CrawlResult | null> {
    if (!this.browser) await this.init();
    
    const context = await this.browser!.newContext({
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    });
    
    const page = await context.newPage();
    try {
      logger.info({ url }, 'Crawling URL');
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
      
      if (waitForSelector) {
        await page.waitForSelector(waitForSelector, { timeout: 5000 }).catch(() => {
          logger.warn({ url, waitForSelector }, 'Wait selector timeout, continuing anyway');
        });
      } else {
        // Wait a short moment for dynamic content to render if no specific selector
        await page.waitForTimeout(2000);
      }

      // Extract all links for the discovery engine
      const links = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('a[href]'))
          .map(a => (a as HTMLAnchorElement).href)
          .filter(href => href.startsWith('http'));
      });

      // Get page content
      const html = await page.content();
      const title = await page.title();
      
      // Parse with Readability
      const dom = new JSDOM(html, { url });
      const reader = new Readability(dom.window.document);
      const article = reader.parse();
      
      if (!article) {
        logger.warn({ url }, 'Readability failed to parse the page, falling back to raw body text');
        const bodyText = await page.evaluate(() => document.body.innerText);
        return {
          url,
          title,
          markdown: bodyText,
          links: Array.from(new Set(links)),
        };
      }

      // Convert clean HTML to Markdown
      const markdown = article.content ? this.turndownService.turndown(article.content) : '';

      return {
        url,
        title: article.title || title,
        markdown,
        links: Array.from(new Set(links)),
      };
    } catch (err) {
      logger.error({ url, error: String(err) }, 'Failed to crawl and extract page');
      return null;
    } finally {
      await page.close();
      await context.close();
    }
  }
}

export const defaultMarkdownCrawler = new MarkdownCrawler();
