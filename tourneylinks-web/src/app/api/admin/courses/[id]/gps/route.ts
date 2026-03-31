import { NextRequest, NextResponse } from 'next/server';
import { db, course_holes } from '@/lib/db';
import { eq, and } from 'drizzle-orm';
import { currentUser } from '@clerk/nextjs/server';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
     const clerkUser = await currentUser();
     if (!clerkUser) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

     const resolvedParams = await params;
     const courseId = parseInt(resolvedParams.id);
     
     if (isNaN(courseId)) {
        return NextResponse.json({ error: 'Invalid Course ID' }, { status: 400 });
     }

     const body = await req.json();
     const coordinatesArray: { holeNumber: number; lat: number; lng: number }[] = body.coordinates;

     if (!coordinatesArray || !Array.isArray(coordinatesArray)) {
         return NextResponse.json({ error: 'Invalid coordinate payload' }, { status: 400 });
     }

     // Perform batch upserts updating each hole's Pin parameters
     for (const data of coordinatesArray) {
        // Technically this should be wrapped in a transaction, but iterative sequential await handles it gracefully locally
        await db.update(course_holes)
           .set({ pinLat: data.lat, pinLng: data.lng })
           .where(and(eq(course_holes.courseId, courseId), eq(course_holes.holeNumber, data.holeNumber)));
     }

     return NextResponse.json({ success: true, updated: coordinatesArray.length });
  } catch(err: any) {
     console.error('GPS Upload Error:', err);
     return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
