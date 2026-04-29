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
 * If it doesn't match perfectly but looks like a duplicate (same city, same date), returns a flag.
 * Otherwise, returns false (meaning the caller should insert it as active).
 */
export async function mergeIfDuplicate(newEvent: {
  title: string;
  courseName: string;
  courseCity: string;
  courseState: string;
  dateStart: string;
  source: string;
  sourceUrl: string;
  description?: string;
  socialSignals?: string;
}): Promise<{ isMerged: boolean, needsReview: boolean }> {
  const fullText = (newEvent.title + ' ' + (newEvent.description || '')).toLowerCase();
  
  // Hard filter for explicitly non-golf events
  const nonGolfKeywords = ['darts', 'bowling', 'tennis', 'softball', 'basketball', 'hockey', 'soccer', 'volleyball', 'pickleball', 'billiards', 'pool tournament', 'cornhole', 'pickle ball'];
  if (nonGolfKeywords.some(keyword => fullText.includes(keyword))) {
    console.log(`[Golden Record Engine] Rejected non-golf event: ${newEvent.title}`);
    return { isMerged: true, needsReview: false }; // True means "skip insertion"
  }

  const newDate = new Date(newEvent.dateStart);
  if (isNaN(newDate.getTime())) return { isMerged: false, needsReview: true }; // Require review for TBD dates

  // 1. Fetch potential matches in the same State
  const candidates = await db.select().from(tournaments).where(
    eq(tournaments.courseState, newEvent.courseState)
  );

  let matchFound = null;
  let needsReviewFlag = false;

  for (const candidate of candidates) {
    if (!candidate.dateStart) continue;
    const candidateDate = new Date(candidate.dateStart);
    if (isNaN(candidateDate.getTime())) continue;

    const diffDays = Math.abs(newDate.getTime() - candidateDate.getTime()) / (1000 * 60 * 60 * 24);
    if (diffDays !== 0) continue; // Must be same exact date

    const sameCourse = normalizeText(candidate.courseName) === normalizeText(newEvent.courseName);
    const sameCity = normalizeText(candidate.courseCity) === normalizeText(newEvent.courseCity);

    if (sameCourse) {
      matchFound = candidate;
      break;
    } else if (sameCity) {
      needsReviewFlag = true;
    }
  }

  if (matchFound) {
    // 2. Perform the "Golden Record" Merge
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

    const mergedData: any = {
      eventSources: JSON.stringify(sources),
      extractionConfidence: Math.min((matchFound.extractionConfidence || 0) + 0.1, 1.0)
    };

    if (!matchFound.description && newEvent.description) {
      mergedData.description = newEvent.description;
    }

    if (newEvent.socialSignals && newEvent.source === 'facebook-apify') {
       mergedData.socialSignals = newEvent.socialSignals;
    }

    await db.update(tournaments)
      .set(mergedData)
      .where(eq(tournaments.id, matchFound.id));

    console.log(`[Golden Record Engine] Merged duplicate event: ${newEvent.title} into existing ID ${matchFound.id}`);
    return { isMerged: true, needsReview: false };
  }

  return { isMerged: false, needsReview: needsReviewFlag };
}
