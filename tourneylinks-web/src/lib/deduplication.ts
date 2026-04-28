import { db, tournaments } from './db';
import { and, eq, or, sql } from 'drizzle-orm';

// Normalizes strings for comparison (removes punctuation, lowercase)
function normalizeText(text: string): string {
  if (!text) return '';
  return text.toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, ' ').trim();
}

/**
 * The Golden Record Engine
 * Checks if a tournament already exists based on location, date, and name similarity.
 * If it exists, merges the new source into it.
 * If not, returns null (meaning the caller should insert it).
 */
export async function mergeIfDuplicate(newEvent: {
  title: string;
  courseCity: string;
  courseState: string;
  dateStart: string;
  source: string;
  sourceUrl: string;
  description?: string;
  socialSignals?: string;
}): Promise<boolean> {
  const normalizedNewTitle = normalizeText(newEvent.title);
  const newDate = new Date(newEvent.dateStart);
  if (isNaN(newDate.getTime())) return false; // Can't reliably dedupe without a valid date

  // 1. Fetch potential matches in the same State and roughly the same month
  // We do a broader fetch and filter in JS for precise 3-day window to avoid complex SQL date math
  const candidates = await db.select().from(tournaments).where(
    eq(tournaments.courseState, newEvent.courseState)
  );

  let matchFound = null;

  for (const candidate of candidates) {
    if (!candidate.dateStart) continue;
    const candidateDate = new Date(candidate.dateStart);
    if (isNaN(candidateDate.getTime())) continue;

    // Check if within 3 days
    const diffTime = Math.abs(newDate.getTime() - candidateDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      // Strict 100% match logic requested by user
      const sameDate = diffDays === 0;
      const sameCity = normalizeText(candidate.courseCity) === normalizeText(newEvent.courseCity);
      const sameTitle = normalizeText(candidate.name) === normalizeText(newEvent.title);
      
      if (sameDate && sameCity && sameTitle) {
        matchFound = candidate;
        break;
      }
  }

  if (matchFound) {
    // 2. Perform the "Golden Record" Merge
    
    // Parse existing sources or default to just the primary source
    let sources: string[] = [];
    try {
      if (matchFound.eventSources) {
        sources = JSON.parse(matchFound.eventSources);
      } else {
        sources = [matchFound.source];
      }
    } catch(e) {
      sources = [matchFound.source];
    }

    if (!sources.includes(newEvent.source)) {
      sources.push(newEvent.source);
    }

    // Prepare merged fields
    // If the new description is significantly longer/better, we might update it, 
    // but for now, we just merge sources to prevent duplicates.
    const mergedData: any = {
      eventSources: JSON.stringify(sources),
      // If we found it on multiple platforms, we could increase extraction_confidence
      extractionConfidence: Math.min((matchFound.extractionConfidence || 0) + 0.1, 1.0)
    };

    // If existing had no description, take the new one
    if (!matchFound.description && newEvent.description) {
      mergedData.description = newEvent.description;
    }

    // Merge social signals if the new event has them
    if (newEvent.socialSignals) {
       // We can overwrite or combine. Let's overwrite if new event is Facebook (richer social signals)
       if (newEvent.source === 'facebook-apify') {
         mergedData.socialSignals = newEvent.socialSignals;
       }
    }

    await db.update(tournaments)
      .set(mergedData)
      .where(eq(tournaments.id, matchFound.id));

    console.log(`[Golden Record Engine] Merged duplicate event: ${newEvent.title} into existing ID ${matchFound.id}`);
    return true; // We successfully deduplicated
  }

  return false; // No match found, safe to insert
}
