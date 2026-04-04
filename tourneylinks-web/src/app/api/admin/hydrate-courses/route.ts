import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { courses } from '@/lib/db';
import { isNull, eq, and, ilike } from 'drizzle-orm';

export const maxDuration = 300; // Allow 5 minutes if on Vercel Pro, otherwise standard limits apply

export async function POST(req: Request) {
  try {
    const API_KEY = process.env.GOOGLE_PLACES_API_KEY;
    if (!API_KEY) {
      return NextResponse.json({ error: "Missing GOOGLE_PLACES_API_KEY" }, { status: 500 });
    }

    // Parse specific limits if requested, otherwise default to 15
    const body = await req.json().catch(() => ({}));
    const limit = body.limit || 15;

    // Fetch courses that do NOT have a heroImageUrl yet. Locked to NY.
    const unhydratedCourses = await db
      .select()
      .from(courses)
      .where(and(
         isNull(courses.heroImageUrl),
         eq(courses.state, 'NY')
      ))
      .limit(limit);

    if (unhydratedCourses.length === 0) {
      return NextResponse.json({ message: "All courses up to date!" });
    }

    const results = [];

    for (const course of unhydratedCourses) {
      const searchQuery = `${course.name}, ${course.city}, ${course.state}`;

      // 1. Hit Google Places (New) API for the Place Details & Photos Array
      const googleRes = await fetch('https://places.googleapis.com/v1/places:searchText', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Goog-Api-Key': API_KEY,
          'X-Goog-FieldMask': 'places.id,places.displayName,places.rating,places.photos'
        },
        body: JSON.stringify({ textQuery: searchQuery }),
      });

      if (!googleRes.ok) {
        console.error(`Google API Error for ${searchQuery}`, await googleRes.text());
        continue;
      }

      const rawGoogleData = await googleRes.json();
      
      // Check if we got a valid place back
      if (rawGoogleData.places && rawGoogleData.places.length > 0) {
        const place = rawGoogleData.places[0]; // Take the highest confidence match
        
        let constructedImageUrl = null;
        if (place.photos && place.photos.length > 0) {
          const photoName = place.photos[0].name; // Looks like "places/ChIJxxxx/photos/AUjqxxxx"
          // Construct the actual media retrieval URL pointing directly to the image
          constructedImageUrl = `https://places.googleapis.com/v1/${photoName}/media?maxHeightPx=1080&maxWidthPx=1920&key=${API_KEY}`;
        }

        // 2. Update our Postgres DB with the newly discovered metadata Let's default to generic string "Not Found" to prevent infinite loops if no photo exists
        await db.update(courses)
          .set({ 
             heroImageUrl: constructedImageUrl || "DEFAULT_GRADIENT",
             rating: place.rating || null
          })
          .where(eq(courses.id, course.id));

        results.push({
           course: course.name,
           hydratedRating: place.rating,
           foundImageUrl: constructedImageUrl ? true : false,
        });

      } else {
        // No match found on Google Maps at all, mark as DEFAULT_GRADIENT so we don't infinitely retry it
        await db.update(courses)
          .set({ heroImageUrl: "DEFAULT_GRADIENT" })
          .where(eq(courses.id, course.id));
      }
      
      // Delay to respect API limits
      await new Promise(r => setTimeout(r, 200));
    }

    return NextResponse.json({
      processed: results.length,
      success: true,
      log: results
    });

  } catch (err: any) {
    console.error("Hydration Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
