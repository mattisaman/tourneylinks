import { NextRequest, NextResponse } from 'next/server';
import { db, tournaments, users } from '@/lib/db';
import { eq } from 'drizzle-orm';
import { getCurrentUser } from '@/lib/auth-util';

export async function POST(req: NextRequest) {
  try {
    const clerkUser = await getCurrentUser();
    if (!clerkUser) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const dbUserRow = await db.select().from(users).where(eq(users.clerkId, clerkUser.id)).limit(1);
    const dbUser = dbUserRow[0];
    if (!dbUser) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const payload = await req.json().catch(() => ({}));
    
    // Fallback constants for required strict fields in 'draft' mode
    const name = payload.name || 'Untitled Tournament Draft';
    const sourceUrl = 'draft';
    const sourceId = `draft-${Date.now()}`;
    const source = 'manual_draft';
    const dateStart = payload.dateStart || new Date().toISOString().split('T')[0];
    const courseName = payload.courseName || 'Unspecified Course';
    const courseCity = payload.courseCity || 'Unknown';
    const courseState = payload.courseState || 'XX';
    const format = payload.format || 'SCRAMBLE';
    
    const [newTourney] = await db.insert(tournaments).values({
       name,
       sourceUrl,
       sourceId,
       source,
       dateStart,
       courseName,
       courseCity,
       courseState,
       format,
       hostUserId: dbUser.id,
       isActive: false, // Hidden from directory as Draft
       galleryImages: payload.galleryImages || null,
       heroImages: payload.heroImages || null,
       heroPositionData: payload.heroPositionData || null,
       tileImage: payload.tileImage || null,
       tilePositionData: payload.tilePositionData || null,
       coHostEmails: payload.coHostEmails || null,
       acceptsDonations: payload.acceptsDonations || false,
       donationsConfig: payload.donationsConfig || null,
       themeColor: payload.themeColor || '#1A2E1A',
       secondaryThemeColor: payload.secondaryThemeColor || '#C9A84C'
    }).returning();

    return NextResponse.json(newTourney);
  } catch (err: any) {
    console.error('Draft Creation Error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
