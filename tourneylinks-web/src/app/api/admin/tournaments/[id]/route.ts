import { NextRequest, NextResponse } from 'next/server';
import { db, tournaments } from '@/lib/db';
import { eq, and } from 'drizzle-orm';
import { getCurrentUser } from '@/lib/auth-util';
import { users } from '@/lib/db';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;
    const tournamentId = parseInt(id);
    if (isNaN(tournamentId)) return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });

    const tourneys = await db.select().from(tournaments).where(eq(tournaments.id, tournamentId)).limit(1);
    const tourney = tourneys[0];
    if (!tourney) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    return NextResponse.json(tourney);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const clerkUser = await getCurrentUser();
    if (!clerkUser) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const dbUserRow = await db.select().from(users).where(eq(users.clerkId, clerkUser.id)).limit(1);
    const dbUser = dbUserRow[0];
    if (!dbUser) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;
    const tournamentId = parseInt(id);
    if (isNaN(tournamentId)) return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });

    const tourneys = await db.select().from(tournaments).where(eq(tournaments.id, tournamentId)).limit(1);
    const tourney = tourneys[0];
    if (!tourney) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    // IDOR protection
    if (process.env.NODE_ENV === 'production' && tourney.hostUserId !== dbUser.id) {
       return NextResponse.json({ error: 'Unauthorized Access' }, { status: 403 });
    }

    const payload = await req.json();
    const updateData: any = {};

    if (payload.name !== undefined) updateData.name = payload.name;
    if (payload.dateStart !== undefined) updateData.dateStart = payload.dateStart;
    if (payload.courseName !== undefined) updateData.courseName = payload.courseName;
    if (payload.city !== undefined) updateData.courseCity = payload.city;
    if (payload.description !== undefined) updateData.description = payload.description;
    if (payload.format !== undefined) updateData.format = payload.format;
    
    // Store JSON structured sponsors, hero image, and theme color
    if (payload.heroImages !== undefined) updateData.heroImages = payload.heroImages;
    if (payload.galleryImages !== undefined) updateData.galleryImages = payload.galleryImages;
    if (payload.heroPositionData !== undefined) updateData.heroPositionData = payload.heroPositionData;
    if (payload.coHostEmails !== undefined) updateData.coHostEmails = payload.coHostEmails;
    if (payload.sponsors !== undefined) updateData.sponsors = payload.sponsors;
    if (payload.themeColor !== undefined) updateData.themeColor = payload.themeColor;
    if (payload.secondaryThemeColor !== undefined) updateData.secondaryThemeColor = payload.secondaryThemeColor;

    updateData.updatedAt = new Date();

    const [updatedRow] = await db.update(tournaments)
      .set(updateData)
      .where(eq(tournaments.id, tournamentId))
      .returning();

    return NextResponse.json(updatedRow);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const clerkUser = await getCurrentUser();
    if (!clerkUser) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const dbUserRow = await db.select().from(users).where(eq(users.clerkId, clerkUser.id)).limit(1);
    const dbUser = dbUserRow[0];
    if (!dbUser) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;
    const tournamentId = parseInt(id);
    if (isNaN(tournamentId)) return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });

    const tourneys = await db.select().from(tournaments).where(eq(tournaments.id, tournamentId)).limit(1);
    const tourney = tourneys[0];
    if (!tourney) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    // IDOR protection
    if (tourney.hostUserId !== dbUser.id) {
       return NextResponse.json({ error: 'Unauthorized Access' }, { status: 403 });
    }

    await db.delete(tournaments).where(eq(tournaments.id, tournamentId));
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
