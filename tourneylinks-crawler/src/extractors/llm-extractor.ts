import { GoogleGenAI } from '@google/genai';
import pino from 'pino';
import type { Tournament, ExtractionResult } from '../types/index.js';
import { TournamentSchema } from '../types/index.js';
import { createHash } from 'crypto';

const logger = pino({ name: 'extractor' });

// ===========================================
// LLM TOURNAMENT EXTRACTOR
// Uses Claude to extract structured tournament data
// from raw page content
// ===========================================

let client: GoogleGenAI | null = null;

function getClient(): GoogleGenAI {
  if (!client) {
    client = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });
  }
  return client;
}

// ─── The extraction prompt ───

const EXTRACTION_PROMPT = `You are a data extraction specialist for golf tournament information. Given the text content of a web page, extract ALL golf tournaments mentioned on the page.

For EACH tournament found, extract these fields as JSON:

{
  "name": "Tournament name",
  "dateStart": "YYYY-MM-DD",
  "dateEnd": "YYYY-MM-DD or null if single day",
  "registrationDeadline": "YYYY-MM-DD or null",
  "courseName": "Name of the golf course",
  "courseCity": "City",
  "courseState": "2-letter state code (e.g. NY, CA, IL)",
  "courseZip": "Exact 5-digit ZIP code if stated or clearly inferable from the address/footer, else null",
  "format": "One of: stroke, scramble, best-ball, match, stableford, alternate-shot, chapman, shamble, other",
  "formatDetail": "Specific format description e.g. '4-Man Scramble', '2-Person Best Ball'",
  "holes": 18,
  "entryFee": 150.00,
  "maxPlayers": 80,
  "spotsRemaining": null,
  "handicapMax": 28,
  "isCharity": false,
  "isPrivate": false,
  "organizerName": "Org name or null",
  "organizerEmail": "email or null",
  "organizerPhone": "phone or null",
  "registrationUrl": "Direct registration link or null",
  "description": "Brief tournament description",
  "includes": "What's included e.g. 'Cart, lunch, prizes'"
}

RULES:
- Only extract GOLF tournaments/events. Skip non-golf content.
- If a field isn't mentioned, use null.
- For dates, infer the year from context (default to current/next year for upcoming events).
- For format, pick the closest match. "Scramble" includes charity scrambles. "Best-ball" includes 2-man/4-man best ball.
- entryFee should be a number (just the dollar amount, no $ sign).
- isCharity = true if it's a fundraiser, charity event, or benefit tournament.
- Be highly aggressive in capturing the 'registrationUrl'! If there is a 'More Info', 'Event Details', 'Register Here', or link to a child-page for the specific tournament, capture it as the registrationUrl. This is critical for our deep-crawling system.
- Be highly aggressive in finding the exact course location. Look for full addresses in footers or headers to derive the courseZip.
- Allow for the fact that you might be reading a "Tournament Directory Page" (multiple events) OR a specific "Tournament Detail Page" (one event). If it's a single event, extract all possible nested details (entryFee, maxPlayers, spotsRemaining, includes) perfectly.
- Be conservative on other fields: only extract what's clearly stated on the page.
- If the page has NO golf tournaments, return an empty array.

Return ONLY valid JSON: { "tournaments": [...], "confidence": 0.95 }
The confidence score (0-1) should reflect how certain you are the extraction is accurate.`;

// ─── Extract tournaments from page text ───

export async function extractTournaments(
  pageText: string,
  pageUrl: string,
  sourceId: string,
): Promise<ExtractionResult> {
  const ai = getClient();

  // Truncate page text to fit context window efficiently
  const truncatedText = pageText.slice(0, 12000);

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Extract golf tournament information from this web page.

PAGE URL: ${pageUrl}
PAGE CONTENT:
---
${truncatedText}
---

${EXTRACTION_PROMPT}`,
      config: {
        responseMimeType: "application/json",
      }
    });

    // Parse the response
    const responseText = response.text || '';

    // Extract JSON from response (handle markdown fences)
    const jsonStr = responseText
      .replace(/```json\s*/g, '')
      .replace(/```\s*/g, '')
      .trim();

    let parsed: any;
    try {
      parsed = JSON.parse(jsonStr);
    } catch (parseErr) {
      console.log('--- MALFORMED JSON DETECTED ---');
      console.log(jsonStr);
      console.log('-------------------------------');
      throw parseErr;
    }

    // Validate and enrich each tournament
    const tournaments: Tournament[] = [];

    for (const raw of parsed.tournaments || []) {
      try {
        const tournament: Tournament = TournamentSchema.parse({
          ...raw,
          sourceUrl: pageUrl,
          sourceId: createHash('sha256').update(pageUrl).digest('hex').slice(0, 16),
          source: sourceId,
          extractionConfidence: parsed.confidence || 0.5,
          extractedAt: new Date().toISOString(),
          // Defaults for missing fields
          latitude: null,
          longitude: null,
          holes: raw.holes || 18,
          isCharity: raw.isCharity || false,
          isPrivate: raw.isPrivate || false,
        });
        tournaments.push(tournament);
      } catch (validationError) {
        logger.warn({ raw, error: String(validationError) },
          'Tournament failed validation — skipping');
      }
    }

    const tokensUsed = (response.usageMetadata?.promptTokenCount || 0) + (response.usageMetadata?.candidatesTokenCount || 0);

    logger.info({
      url: pageUrl, source: sourceId,
      found: tournaments.length, confidence: parsed.confidence,
      tokens: tokensUsed,
    }, 'Extraction complete');

    return {
      tournaments,
      confidence: parsed.confidence || 0.5,
      tokensUsed,
      rawResponse: responseText,
    };

  } catch (error) {
    logger.error({ url: pageUrl, error: String(error) }, 'Extraction failed');
    return {
      tournaments: [],
      confidence: 0,
      tokensUsed: 0,
      rawResponse: '',
      errors: [String(error)],
    };
  }
}

// ─── Check if page likely contains tournament info (pre-filter) ───

export function isLikelyTournamentPage(pageText: string, title: string): boolean {
  const text = `${title} ${pageText}`.toLowerCase();

  // Must mention golf
  const hasGolf = /golf|golfer|fairway|tee time|handicap|scramble|birdie|bogey/i.test(text);
  if (!hasGolf) return false;

  // Must mention tournament-like concepts
  const hasTournament = /tournament|event|registration|sign.?up|entry fee|scramble|championship|invitational|classic|outing|benefit|charity/i.test(text);
  if (!hasTournament) return false;

  // Must mention a date
  const hasDate = /\b(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)\w*\s+\d{1,2}/i.test(text)
    || /\d{1,2}\/\d{1,2}\/\d{2,4}/.test(text)
    || /202[4-9]/.test(text);

  // NY TARGET LOCATION FILTER
  const nyKeywords = [
    'new york', '\\bny\\b', 'n\\.y\\.', 'upstate', 'long island',
    'albany', 'allegany', 'bronx', 'broome', 'cattaraugus', 'cayuga', 'chautauqua', 'chemung', 'chenango', 'clinton', 'columbia', 'cortland', 'delaware', 'dutchess', 'erie', 'essex', 'franklin', 'fulton', 'genesee', 'greene', 'hamilton', 'herkimer', 'jefferson', 'kings', 'lewis', 'livingston', 'madison', 'monroe', 'montgomery', 'nassau', 'niagara', 'oneida', 'onondaga', 'ontario', 'orange', 'orleans', 'oswego', 'otsego', 'putnam', 'queens', 'rensselaer', 'richmond', 'rockland', 'st. lawrence', 'saratoga', 'schenectady', 'schoharie', 'schuyler', 'seneca', 'steuben', 'suffolk', 'sullivan', 'tioga', 'tompkins', 'ulster', 'warren', 'washington', 'wayne', 'westchester', 'wyoming', 'yates'
  ];
  const hasTargetLocation = new RegExp(nyKeywords.join('|'), 'i').test(text);
  
  return hasTargetLocation;
}
