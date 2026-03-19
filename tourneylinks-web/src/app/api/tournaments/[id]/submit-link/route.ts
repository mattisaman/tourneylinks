import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { missing_links } from '@/lib/db';

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    const tournamentId = parseInt(resolvedParams.id, 10);
    
    if (isNaN(tournamentId)) {
      return NextResponse.json({ error: 'Invalid tournament ID' }, { status: 400 });
    }

    const body = await req.json();
    const { url } = body;

    if (!url) {
      return NextResponse.json({ error: 'Missing URL' }, { status: 400 });
    }

    // Insert into DB
    await db.insert(missing_links).values({
      tournamentId,
      submittedUrl: url,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Submit Link API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
