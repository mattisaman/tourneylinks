import type { CrawlSource } from '../types/index.js';

// ===========================================
// ALL CRAWL SOURCE CONFIGURATIONS
// ===========================================

export const SOURCES: CrawlSource[] = [

  // ─── PLATFORMS (structured, high-value) ───
  {
    id: 'golf-genius',
    name: 'Golf Genius',
    type: 'platform',
    enabled: true,
    seedUrls: [
      'https://www.golfgenius.com/pages/tournaments',
      // Golf Genius powers thousands of club tournament pages
      // Each club has a subdomain: clubname.golfgenius.com
    ],
    searchPatterns: [
      'site:golfgenius.com tournament registration 2025',
      'site:golfgenius.com golf outing upcoming',
    ],
    requiresJavascript: true,
    rateLimit: 1, // conservative — respect their servers
    respectRobotsTxt: true,
    maxPagesPerCycle: 200,
    extractionStrategy: 'hybrid', // some pages are structured, some need LLM
  },

  {
    id: 'bluegolf',
    name: 'BlueGolf',
    type: 'platform',
    enabled: true,
    seedUrls: [
      'https://www.bluegolf.com/events',
    ],
    searchPatterns: [
      'site:bluegolf.com tournament 2025',
      'site:bluegolf.com golf event registration',
    ],
    requiresJavascript: true,
    rateLimit: 1,
    respectRobotsTxt: true,
    maxPagesPerCycle: 150,
    extractionStrategy: 'hybrid',
  },

  // ─── FEDERATIONS (authoritative, well-structured) ───
  {
    id: 'usga-events',
    name: 'USGA Events',
    type: 'federation',
    enabled: false, // Disabled per user request (focus on non-sanctioned)
    seedUrls: [
      'https://www.usga.org/championships.html',
      'https://www.usga.org/amateur.html',
    ],
    requiresJavascript: true,
    rateLimit: 0.5,
    respectRobotsTxt: true,
    maxPagesPerCycle: 50,
    extractionStrategy: 'llm',
  },

  {
    id: 'state-associations',
    name: 'State Golf Associations',
    type: 'federation',
    enabled: false, // Disabled per user request (focus on non-sanctioned)
    // All 60+ Allied Golf Associations
    seedUrls: [
      // Northeast
      'https://www.nysga.org/events/',
      'https://www.mga.org/tournaments/',
      'https://www.cga.org/tournaments/',
      'https://www.riga.org/tournaments/',
      'https://www.csga.org/events/',
      'https://www.njsga.org/tournaments/',
      'https://www.pgalinks.com/events/', // PA
      // Southeast
      'https://www.carolinasgolf.org/events/',
      'https://www.fsga.org/events/',
      'https://www.gsga.org/events/',
      'https://www.vsga.org/events/',
      // Midwest
      'https://www.cdga.org/events/',
      'https://www.ohiogolf.org/events/',
      'https://www.iga.org/events/',
      'https://www.wga.org/tournaments/',
      'https://www.minnesotaga.org/events/',
      'https://www.moga.org/events/',
      // South
      'https://www.txga.org/events/',
      'https://www.okga.org/events/',
      // West
      'https://www.scga.org/events/',
      'https://www.ncga.org/events/',
      'https://www.oga.org/events/',
      'https://www.washingtongolf.org/events/',
      'https://www.cybergolf.com/golf_events/',
      'https://www.coloradogolf.org/events/',
      'https://www.azgolf.org/events/',
    ],
    searchPatterns: [
      '{state} golf association tournament calendar 2025',
      '{state} allied golf association events schedule 2025',
    ],
    requiresJavascript: true,
    rateLimit: 0.5,
    respectRobotsTxt: true,
    maxPagesPerCycle: 300,
    extractionStrategy: 'llm',
  },

  // ─── SOCIAL (high volume, lower structure) ───
  {
    id: 'facebook-events',
    name: 'Facebook Events',
    type: 'social',
    enabled: true,
    searchPatterns: [
      'site:facebook.com/events charity golf scramble 2025',
      'site:facebook.com charity golf tournament registration 2025',
      'site:facebook.com memorial golf outing 2025',
    ],
    requiresJavascript: true,
    rateLimit: 0.3, // very conservative
    respectRobotsTxt: true,
    maxPagesPerCycle: 100,
    extractionStrategy: 'llm',
  },

  // ─── MARKETPLACES ───
  {
    id: 'eventbrite',
    name: 'Eventbrite Golf',
    type: 'marketplace',
    enabled: true,
    seedUrls: [
      'https://www.eventbrite.com/d/ny--rochester/golf-tournament/',
      'https://www.eventbrite.com/d/ny--monroe-county/golf/',
      'https://www.eventbrite.com/d/ny--ontario-county/golf/',
    ],
    requiresJavascript: true,
    rateLimit: 1,
    respectRobotsTxt: true,
    maxPagesPerCycle: 100,
    extractionStrategy: 'hybrid',
  },

  // ─── DISCOVERY (Google search for unknown sources) ───
  {
    id: 'google-discovery',
    name: 'Google Discovery',
    type: 'discovery',
    enabled: true,
    searchPatterns: [
      // Rotate through metro areas + date combos
      'charity golf scramble {city} {state}',
      '4 man scramble golf tournament {city} {state}',
      'golf outing fundraiser {city} {state}',
      'charity golf classic {city} {state}',
      'local golf scramble {city} {state}',
      'memorial golf tournament {city} {state}',
      'golf tournament {city} {state}'
    ],
    requiresJavascript: false, // we follow links from search results
    rateLimit: 0.2, // very conservative with Google
    respectRobotsTxt: true,
    maxPagesPerCycle: 150,
    extractionStrategy: 'llm',
  },
];

// ===========================================
// METRO AREAS FOR GEOGRAPHIC ROTATION
// ===========================================

export const METRO_AREAS = [
  // Top 50 Nationwide Golf Metros for fallback scheduled crawling
  { city: 'Orlando', state: 'FL' }, { city: 'Scottsdale', state: 'AZ' },
  { city: 'Myrtle Beach', state: 'SC' }, { city: 'Dallas', state: 'TX' },
  { city: 'Atlanta', state: 'GA' }, { city: 'Austin', state: 'TX' },
  { city: 'Charlotte', state: 'NC' }, { city: 'Houston', state: 'TX' },
  { city: 'Phoenix', state: 'AZ' }, { city: 'San Diego', state: 'CA' },
  { city: 'Denver', state: 'CO' }, { city: 'Chicago', state: 'IL' },
  { city: 'Tampa', state: 'FL' }, { city: 'Miami', state: 'FL' },
  { city: 'Las Vegas', state: 'NV' }, { city: 'Palm Springs', state: 'CA' },
  { city: 'Charleston', state: 'SC' }, { city: 'Nashville', state: 'TN' },
  { city: 'Columbus', state: 'OH' }, { city: 'Indianapolis', state: 'IN' },
  { city: 'Minneapolis', state: 'MN' }, { city: 'Raleigh', state: 'NC' },
  { city: 'Rochester', state: 'NY' }, { city: 'Philadelphia', state: 'PA' },
  { city: 'Boston', state: 'MA' }, { city: 'San Antonio', state: 'TX' },
];
