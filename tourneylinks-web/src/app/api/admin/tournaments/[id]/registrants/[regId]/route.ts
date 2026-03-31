import { NextResponse } from 'next/server';
import { db, registrations } from '@/lib/db';
import { eq, and } from 'drizzle-orm';
import { currentUser } from '@clerk/nextjs/server';

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string, regId: string }> }) {
  try {
     const clerkUser = await currentUser();
     if (!clerkUser) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

     const resolvedParams = await params;
     const tournamentId = parseInt(resolvedParams.id);
     const regId = parseInt(resolvedParams.regId);
     const body = await request.json();

     // Enforce strict security so organizers can only modify their own tournament's players
     const updated = await db.update(registrations)
       .set({
           startingHole: body.startingHole !== undefined ? body.startingHole : undefined
       })
       .where(and(eq(registrations.id, regId), eq(registrations.tournamentId, tournamentId)))
       .returning();

     return NextResponse.json({ success: true, player: updated[0] });

  } catch(err: any) {
     return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
