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
  // User Focus: All 62 NY State Counties
  { city: 'Albany County', state: 'NY' }, { city: 'Allegany County', state: 'NY' },
  { city: 'Bronx County', state: 'NY' }, { city: 'Broome County', state: 'NY' },
  { city: 'Cattaraugus County', state: 'NY' }, { city: 'Cayuga County', state: 'NY' },
  { city: 'Chautauqua County', state: 'NY' }, { city: 'Chemung County', state: 'NY' },
  { city: 'Chenango County', state: 'NY' }, { city: 'Clinton County', state: 'NY' },
  { city: 'Columbia County', state: 'NY' }, { city: 'Cortland County', state: 'NY' },
  { city: 'Delaware County', state: 'NY' }, { city: 'Dutchess County', state: 'NY' },
  { city: 'Erie County', state: 'NY' }, { city: 'Essex County', state: 'NY' },
  { city: 'Franklin County', state: 'NY' }, { city: 'Fulton County', state: 'NY' },
  { city: 'Genesee County', state: 'NY' }, { city: 'Greene County', state: 'NY' },
  { city: 'Hamilton County', state: 'NY' }, { city: 'Herkimer County', state: 'NY' },
  { city: 'Jefferson County', state: 'NY' }, { city: 'Kings County', state: 'NY' },
  { city: 'Lewis County', state: 'NY' }, { city: 'Livingston County', state: 'NY' },
  { city: 'Madison County', state: 'NY' }, { city: 'Monroe County', state: 'NY' },
  { city: 'Montgomery County', state: 'NY' }, { city: 'Nassau County', state: 'NY' },
  { city: 'New York County', state: 'NY' }, { city: 'Niagara County', state: 'NY' },
  { city: 'Oneida County', state: 'NY' }, { city: 'Onondaga County', state: 'NY' },
  { city: 'Ontario County', state: 'NY' }, { city: 'Orange County', state: 'NY' },
  { city: 'Orleans County', state: 'NY' }, { city: 'Oswego County', state: 'NY' },
  { city: 'Otsego County', state: 'NY' }, { city: 'Putnam County', state: 'NY' },
  { city: 'Queens County', state: 'NY' }, { city: 'Rensselaer County', state: 'NY' },
  { city: 'Richmond County', state: 'NY' }, { city: 'Rockland County', state: 'NY' },
  { city: 'St. Lawrence County', state: 'NY' }, { city: 'Saratoga County', state: 'NY' },
  { city: 'Schenectady County', state: 'NY' }, { city: 'Schoharie County', state: 'NY' },
  { city: 'Schuyler County', state: 'NY' }, { city: 'Seneca County', state: 'NY' },
  { city: 'Steuben County', state: 'NY' }, { city: 'Suffolk County', state: 'NY' },
  { city: 'Sullivan County', state: 'NY' }, { city: 'Tioga County', state: 'NY' },
  { city: 'Tompkins County', state: 'NY' }, { city: 'Ulster County', state: 'NY' },
  { city: 'Warren County', state: 'NY' }, { city: 'Washington County', state: 'NY' },
  { city: 'Wayne County', state: 'NY' }, { city: 'Westchester County', state: 'NY' },
  { city: 'Wyoming County', state: 'NY' }, { city: 'Yates County', state: 'NY' },
];
