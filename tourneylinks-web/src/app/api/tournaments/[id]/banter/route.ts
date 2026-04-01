import { NextRequest, NextResponse } from 'next/server';
import { db, live_banter } from '@/lib/db';
import { eq, desc } from 'drizzle-orm';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const tournamentId = parseInt(id);
        const { authorName, message } = await req.json();

        if (!authorName || !message) {
             return NextResponse.json({ error: 'Missing banter fields' }, { status: 400 });
        }

        await db.insert(live_banter).values({
            tournamentId, 
            authorName, 
            message
        });

        return NextResponse.json({ success: true });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const tournamentId = parseInt(id);

        const banters = await db.select()
          .from(live_banter)
          .where(eq(live_banter.tournamentId, tournamentId))
          .orderBy(desc(live_banter.createdAt))
          .limit(20);

        return NextResponse.json(banters);
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
