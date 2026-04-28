import { db } from '../src/lib/db';
import { courses, tournaments } from '../src/lib/db';
import { eq, isNull, and, isNotNull } from 'drizzle-orm';
import stringSimilarity from 'string-similarity';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

async function main() {
  console.log('Starting Course Matcher Engine...');

  // 1. Fetch all known courses
  const allCourses = await db.select().from(courses);
  console.log(`Loaded ${allCourses.length} official courses from the database.`);

  if (allCourses.length === 0) {
    console.log('No courses found in database. Exiting.');
    return;
  }

  // 2. Fetch tournaments that have a course_name but no course_id
  const unlinkedTournaments = await db
    .select()
    .from(tournaments)
    .where(
      and(
        isNull(tournaments.courseId),
        isNotNull(tournaments.courseName)
      )
    );

  console.log(`Found ${unlinkedTournaments.length} tournaments pending course resolution.`);

  let matchCount = 0;

  for (const t of unlinkedTournaments) {
    if (!t.courseName) continue;

    // We filter candidates by state if the tournament has a state
    let candidates = allCourses;
    if (t.courseState && t.courseState.trim() !== '') {
       candidates = allCourses.filter(c => c.state?.toLowerCase() === t.courseState?.toLowerCase());
    }

    if (candidates.length === 0) candidates = allCourses;

    // Use string-similarity to find the best match based on courseName
    const candidateNames = candidates.map(c => c.name);
    
    // In edge cases where there are no names, skip
    if (candidateNames.length === 0) continue;

    const matches = stringSimilarity.findBestMatch(t.courseName, candidateNames);
    const bestMatch = matches.bestMatch;

    // Threshold for a confident match
    const CONFIDENCE_THRESHOLD = 0.65;

    if (bestMatch.rating >= CONFIDENCE_THRESHOLD) {
      const matchedCourse = candidates[matches.bestMatchIndex];
      
      console.log(`[MATCH] ${t.name}`);
      console.log(`   - Raw Venue: "${t.courseName}"`);
      console.log(`   - Matched Course: "${matchedCourse.name}" (ID: ${matchedCourse.id})`);
      console.log(`   - Confidence: ${(bestMatch.rating * 100).toFixed(1)}%`);
      
      // Update the tournament record
      await db
        .update(tournaments)
        .set({ courseId: matchedCourse.id })
        .where(eq(tournaments.id, t.id));
        
      matchCount++;
    } else {
      console.log(`[NO MATCH] ${t.name}`);
      console.log(`   - Raw Venue: "${t.courseName}"`);
      console.log(`   - Best Guess: "${bestMatch.target}" (${(bestMatch.rating * 100).toFixed(1)}%) -> Failed threshold`);
    }
  }

  console.log(`\nFinished Course Matcher. Successfully linked ${matchCount} tournaments to official courses.`);
  process.exit(0);
}

main().catch(err => {
  console.error("Course Matcher Error:", err);
  process.exit(1);
});
