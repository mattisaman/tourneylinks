import { NextResponse } from 'next/server';
import { db, tournament_inquiries } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const { tournamentId, email, message } = await req.json();

    if (!tournamentId || !email || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    await db.insert(tournament_inquiries).values({
      tournamentId,
      senderEmail: email,
      message,
    });

    // You could also trigger a Resend email to the hostUser.email here in the future

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to submit host inquiry:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
