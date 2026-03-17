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
    enabled: true,
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
    enabled: true,
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
      '"state golf association" tournament calendar 2025',
      '"allied golf association" events schedule 2025',
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
      'site:facebook.com/events golf tournament 2025',
      'site:facebook.com golf scramble registration 2025',
      'site:facebook.com charity golf outing 2025',
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
      'https://www.eventbrite.com/d/united-states/golf-tournament/',
      'https://www.eventbrite.com/d/united-states/golf-outing/',
      'https://www.eventbrite.com/d/united-states/charity-golf/',
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
      'golf tournament registration {city} {state} 2025',
      'charity golf scramble {city} {state} 2025',
      'amateur golf championship {state} 2025',
      'golf outing sign up {city} 2025',
      'corporate golf tournament {state} 2025',
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
  // Top 50 US metros for golf search rotation
  { city: 'New York', state: 'NY' }, { city: 'Los Angeles', state: 'CA' },
  { city: 'Chicago', state: 'IL' }, { city: 'Houston', state: 'TX' },
  { city: 'Phoenix', state: 'AZ' }, { city: 'Philadelphia', state: 'PA' },
  { city: 'San Antonio', state: 'TX' }, { city: 'San Diego', state: 'CA' },
  { city: 'Dallas', state: 'TX' }, { city: 'Jacksonville', state: 'FL' },
  { city: 'Austin', state: 'TX' }, { city: 'Columbus', state: 'OH' },
  { city: 'Charlotte', state: 'NC' }, { city: 'Indianapolis', state: 'IN' },
  { city: 'Denver', state: 'CO' }, { city: 'Seattle', state: 'WA' },
  { city: 'Nashville', state: 'TN' }, { city: 'Portland', state: 'OR' },
  { city: 'Las Vegas', state: 'NV' }, { city: 'Atlanta', state: 'GA' },
  { city: 'Tampa', state: 'FL' }, { city: 'Orlando', state: 'FL' },
  { city: 'Minneapolis', state: 'MN' }, { city: 'Cleveland', state: 'OH' },
  { city: 'Pittsburgh', state: 'PA' }, { city: 'Cincinnati', state: 'OH' },
  { city: 'Rochester', state: 'NY' }, { city: 'Buffalo', state: 'NY' },
  { city: 'Syracuse', state: 'NY' }, { city: 'Albany', state: 'NY' },
  { city: 'Detroit', state: 'MI' }, { city: 'St. Louis', state: 'MO' },
  { city: 'Scottsdale', state: 'AZ' }, { city: 'Palm Beach', state: 'FL' },
  { city: 'Hilton Head', state: 'SC' }, { city: 'Myrtle Beach', state: 'SC' },
  { city: 'Pinehurst', state: 'NC' }, { city: 'Monterey', state: 'CA' },
  { city: 'Charleston', state: 'SC' }, { city: 'Savannah', state: 'GA' },
  { city: 'Boise', state: 'ID' }, { city: 'Salt Lake City', state: 'UT' },
  { city: 'Richmond', state: 'VA' }, { city: 'Raleigh', state: 'NC' },
  { city: 'Kansas City', state: 'MO' }, { city: 'Milwaukee', state: 'WI' },
  { city: 'Oklahoma City', state: 'OK' }, { city: 'Memphis', state: 'TN' },
  { city: 'Louisville', state: 'KY' }, { city: 'New Orleans', state: 'LA' },
  { city: 'Hartford', state: 'CT' },
];
