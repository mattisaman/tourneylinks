# TourneyLinks Tournament Discovery Agent

A production-ready crawler that discovers, extracts, normalizes, and stores golf tournament data from across the web. Built to power TourneyLinks's nationwide tournament marketplace.

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                      CRAWL PIPELINE                             │
│                                                                 │
│  ┌──────────┐   ┌──────────┐   ┌───────────┐   ┌───────────┐  │
│  │ DISCOVER  │──▶│  CRAWL   │──▶│  EXTRACT  │──▶│  DEDUP &  │  │
│  │   URLs    │   │  Pages   │   │  via LLM  │   │ NORMALIZE │  │
│  └──────────┘   └──────────┘   └───────────┘   └───────────┘  │
│       │              │              │                 │         │
│  Seed URLs      Fetch/Playwright  Claude API    Fuzzy Match    │
│  Google Search  Rate Limited      Structured    Merge Data     │
│  Sitemaps       JS Rendering      JSON Output   Geocode        │
│                                                      │         │
│                                               ┌──────▼──────┐  │
│                                               │  PostgreSQL  │  │
│                                               │  Tournament  │  │
│                                               │   Database   │  │
│                                               └─────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

## Data Sources

| Source | Type | Strategy | Est. URLs |
|--------|------|----------|-----------|
| Golf Genius | Platform | Hybrid | ~3,000 |
| BlueGolf | Platform | Hybrid | ~1,500 |
| USGA Events | Federation | LLM | ~100 |
| State Golf Associations (60+) | Federation | LLM | ~3,000 |
| Club Websites | Web Crawl | LLM | ~12,000 |
| Facebook Events | Social | LLM | ~5,000 |
| Eventbrite | Marketplace | Hybrid | ~1,000 |
| Google Discovery | Search | LLM | Dynamic |

## Quick Start

### Prerequisites
- Node.js 20+
- PostgreSQL 15+
- Redis (optional, for job queue)
- Anthropic API key
- Google Maps API key (for geocoding)

### Setup

```bash
# Clone and install
git clone <repo>
cd teetime-crawler
npm install

# Install Playwright browsers
npx playwright install chromium

# Configure environment
cp .env.example .env
# Edit .env with your API keys and database URL

# Create database tables
npm run db:migrate
# Or run the SQL manually — see schema in src/pipeline/database.ts

# Run a single crawl cycle
npm run crawl

# Run for a specific source
npm run crawl:source -- golf-genius

# Start in scheduled mode (runs every 6 hours)
npm run dev
```

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `ANTHROPIC_API_KEY` | Yes | Claude API key for LLM extraction |
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `GOOGLE_MAPS_API_KEY` | Recommended | For geocoding tournament locations |
| `GOOGLE_SEARCH_API_KEY` | Optional | For Google Custom Search discovery |
| `GOOGLE_SEARCH_CX` | Optional | Custom Search engine ID |
| `REDIS_URL` | Optional | For BullMQ job queue (future) |
| `CRAWL_CONCURRENCY` | No | Parallel page fetches (default: 3) |
| `CRAWL_DELAY_MS` | No | Delay between requests (default: 2000) |
| `CRAWL_SCHEDULE` | No | Cron expression (default: every 6 hours) |

## Project Structure

```
src/
├── index.ts                    # Entry point, CLI, cron scheduling
├── types/
│   └── index.ts                # Zod schemas, TypeScript types
├── config/
│   └── sources.ts              # All crawl source configurations
├── crawlers/
│   ├── page-crawler.ts         # HTTP fetch + Playwright browser
│   └── url-discovery.ts        # URL discovery from seeds + search
├── extractors/
│   └── llm-extractor.ts        # Claude-powered tournament extraction
└── pipeline/
    ├── orchestrator.ts         # Main pipeline that ties it all together
    ├── dedup.ts                # Fuzzy dedup, normalization, geocoding
    └── database.ts             # PostgreSQL schema + CRUD operations
```

## How It Works

### 1. URL Discovery
Each source has seed URLs and/or Google search patterns. The discovery module crawls seed pages and follows links that match tournament-related patterns. Google Custom Search is used to find new sources across metro areas.

### 2. Page Crawling
Pages are fetched using either simple HTTP (for static sites) or Playwright headless browser (for JavaScript-rendered sites like Golf Genius). Resources like images, fonts, and stylesheets are blocked to speed up crawling. Rate limits are enforced per-source.

### 3. LLM Extraction
Raw page text is sent to Claude (claude-sonnet-4-20250514) with a structured extraction prompt. The model returns JSON with tournament name, dates, course, format, pricing, and more. A pre-filter checks if the page likely contains tournament info before sending to the LLM (saves API costs).

### 4. Deduplication
Extracted tournaments are fuzzy-matched against the existing database using Fuse.js. Matching considers tournament name (40% weight), course name (25%), date (25%), and city (10%). Duplicates with new data are merged; pure duplicates are skipped.

### 5. Geocoding
New tournaments are geocoded via Google Maps API to get lat/lng coordinates, enabling radius-based search in the TourneyLinks app.

### 6. Storage
Final tournaments are stored in PostgreSQL with full-text search indexes on name, course, city, and state. A crawl log tracks every page visited for debugging.

## Cost Estimates

| Component | Monthly Cost |
|-----------|-------------|
| VPS (4GB RAM, 2 vCPU) | $20-40 |
| PostgreSQL (managed) | $15-30 |
| Anthropic API (~100K extractions) | $150-300 |
| Google Maps Geocoding | $20-50 |
| Google Custom Search | $0-50 |
| **Total** | **~$200-500/month** |

## Scaling

To scale beyond 100K pages/month:
- Add Redis + BullMQ for distributed job queuing
- Run multiple crawler workers
- Add a Playwright browser pool (e.g., browserless.io)
- Consider caching extracted tournament data in Redis
- Add a re-verification cycle that re-crawls known tournaments every 48 hours

## Adding a New Source

1. Add a `CrawlSource` config to `src/config/sources.ts`
2. If the source has a structured API, add a custom parser in `src/extractors/`
3. Test with: `npm run crawl:source -- your-source-id`

## License

Proprietary — TourneyLinks, Inc.


## How to Start the TourneyLinks Crawler

**Step 1: Open your terminal and navigate to the crawler folder:**
```bash
cd "Desktop/Golf Tournament Site/tourneylinks-crawler"
```

**Step 2: Load the correct Node Version Manager (NVM) environment:**
```bash
export PATH="$HOME/.nvm/versions/node/v22.22.1/bin:$PATH"
```

**Step 3: Start the automated crawler script:**
```bash
npm run dev
```

*(Note: The crawler runs on a `cron` schedule, meaning it will boot up, search the internet, save tournaments to your database, and then quietly pause. Leave the terminal window open/minimized, and your Mac awake, and it will automatically wake up and search again exactly 6 hours later!)*