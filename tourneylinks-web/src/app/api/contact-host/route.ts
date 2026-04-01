import { NextResponse } from 'next/server';
import { db, tournament_inquiries, tournaments, users } from '@/lib/db';
import { eq } from 'drizzle-orm';
import { resend, DEFAULT_FROM_ADDRESS } from '@/lib/mail';
import HostInquiryEmail from '@/emails/HostInquiryEmail';
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

    const hostQuery = await db.select({
       email: users.email,
       tournamentName: tournaments.name 
    })
    .from(tournaments)
    .innerJoin(users, eq(tournaments.hostUserId, users.id))
    .where(eq(tournaments.id, tournamentId))
    .limit(1);

    if (hostQuery.length > 0) {
       const host = hostQuery[0];
       // Dispatch Resend payload asynchronously
       resend.emails.send({
          from: DEFAULT_FROM_ADDRESS,
          to: host.email,
          subject: `New Inquiry: ${host.tournamentName}`,
          react: HostInquiryEmail({ 
             senderEmail: email, 
             tournamentName: host.tournamentName, 
             message: message 
          })
       }).catch(console.error); // Safe-fail so player still sees success if mail fails
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to submit host inquiry:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
