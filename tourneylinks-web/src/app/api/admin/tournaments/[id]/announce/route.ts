import { NextResponse } from 'next/server';
import { db, tournaments, registrations } from '@/lib/db';
import { eq } from 'drizzle-orm';
import { resend, DEFAULT_FROM_ADDRESS } from '@/lib/mail';
import MassAnnouncementEmail from '@/emails/MassAnnouncementEmail';
import { getCurrentUser } from '@/lib/auth-util';

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const user = await getCurrentUser();
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { message } = await req.json();
        const { id } = await params;
        const tournamentId = parseInt(id);

        if (!message) return NextResponse.json({ error: 'Message cannot be empty' }, { status: 400 });

        const tQuery = await db.select().from(tournaments).where(eq(tournaments.id, tournamentId)).limit(1);
        if (tQuery.length === 0) return NextResponse.json({ error: 'Not Found' }, { status: 404 });
        
        const tournamentName = tQuery[0].name;

        // Fetch all active registration emails
        const registeredPlayers = await db.select({ email: registrations.email }).from(registrations).where(eq(registrations.tournamentId, tournamentId));

        const uniqueEmails = Array.from(new Set(registeredPlayers.map(p => p.email).filter(Boolean)));

        if (uniqueEmails.length === 0) {
            return NextResponse.json({ error: 'No players registered yet.' }, { status: 400 });
        }

        // Map individual send promises to ensure delivery and avoid BCC SPAM traps.
        await Promise.all(
            uniqueEmails.map(email => 
                resend.emails.send({
                    from: DEFAULT_FROM_ADDRESS,
                    to: email,
                    subject: `URGENT UPDATE: ${tournamentName}`,
                    react: MassAnnouncementEmail({ tournamentName, message })
                })
            )
        );

        return NextResponse.json({ success: true, count: uniqueEmails.length });
    } catch(err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
