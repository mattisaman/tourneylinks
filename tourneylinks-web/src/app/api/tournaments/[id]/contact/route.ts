import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { tournament_inquiries } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    const clerkId = session?.userId || null;
    const resolvedParams = await params;
    const tournamentId = parseInt(resolvedParams.id, 10);
    
    if (isNaN(tournamentId)) {
      return NextResponse.json({ error: 'Invalid tournament ID' }, { status: 400 });
    }

    const body = await req.json();
    const { email, message } = body;

    if (!email || !message) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    // Insert into DB
    await db.insert(tournament_inquiries).values({
      tournamentId,
      userId: clerkId,
      senderEmail: email,
      message,
    });

    // TODO: Connect Resend/SendGrid here to dispatch real email to the Host

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Contact Host API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
