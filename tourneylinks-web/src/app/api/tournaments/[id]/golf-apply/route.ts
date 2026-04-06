import { NextResponse } from 'next/server';
import { db, tournaments, users } from '@/lib/db';
import { eq, and } from 'drizzle-orm';
import { getCurrentUser } from '@/lib/auth-util';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY || 're_mock');

export async function POST(req: Request, context: { params: Promise<{ id: string }> }) {
   try {
      const { id } = await context.params;
      const tournamentId = parseInt(id, 10);
      if (isNaN(tournamentId)) return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });

      const clerkUser = await getCurrentUser();
      if (!clerkUser) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

      // Verify the user owns the tournament
      const dbUsers = await db.select().from(users).where(eq(users.clerkId, clerkUser.id));
      if (!dbUsers.length) return NextResponse.json({ error: 'User not found in DB' }, { status: 404 });
      const hostDbUserId = dbUsers[0].id;

      const [tournament] = await db.select().from(tournaments).where(
         and(eq(tournaments.id, tournamentId), eq(tournaments.hostUserId, hostDbUserId))
      );

      if (!tournament) return NextResponse.json({ error: 'Tournament not found or unowned' }, { status: 404 });

      // Parse payload
      const body = await req.json();
      const { cause, payoutInfo } = body;

      if (!cause || !payoutInfo) return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });

      // Update tournament to pending status
      await db.update(tournaments)
         .set({ 
            golfApplicationStatus: 'pending',
            golfApplicationData: JSON.stringify({ cause, payoutInfo: payoutInfo }),
         })
         .where(eq(tournaments.id, tournamentId));

      // Attempt to dispatch email securely to info@tourneylinks.com
      if (process.env.RESEND_API_KEY) {
         await resend.emails.send({
            to: 'info@tourneylinks.com',
            from: 'noreply@tourneylinks.com',
            subject: `New 501(c)(3) Application for "${tournament.name}"`,
            html: `
               <h3>New Application from ${clerkUser.firstName} ${clerkUser.lastName}</h3>
               <p><strong>Tournament ID:</strong> ${tournament.id}</p>
               <p><strong>Tournament Name:</strong> ${tournament.name}</p>
               <hr/>
               <h4>Cause:</h4>
               <p>${cause}</p>
               <h4>Disbursement Information:</h4>
               <p>${payoutInfo}</p>
               <br/>
               <a href="https://tourneylinks.com/system/dashboard">Review in Super Admin Console</a>
            `
         }).catch(console.error);
      } else {
         console.warn("RESEND_API_KEY not found. Email not dispatched to info@tourneylinks.com.");
      }

      return NextResponse.json({ success: true });
   } catch (error: any) {
      console.error('Apply GOLF API Error:', error);
      return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
   }
}
