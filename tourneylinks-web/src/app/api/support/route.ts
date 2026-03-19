import { NextResponse } from 'next/server';
import { db, support_tickets, users } from '@/lib/db';
import { eq } from 'drizzle-orm';
import { auth } from '@clerk/nextjs/server';

export async function POST(req: Request) {
  try {
    const session = await auth();
    const clerkId = session.userId;
    const body = await req.json();
    const { email, type, message } = body;

    if (!email || !type || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    let resolvedUserId = null;

    // If user is authenticated via Clerk, fetch their internal DB ID
    if (clerkId) {
      const dbUsers = await db.select().from(users).where(eq(users.clerkId, clerkId));
      if (dbUsers.length > 0) {
        resolvedUserId = dbUsers[0].id;
      }
    }

    // Insert the ticket into the database
    await db.insert(support_tickets).values({
      userId: resolvedUserId,
      email: email,
      type: type,
      message: message,
      status: 'OPEN',
    });

    // FUTURE: Send automated confirmation email using Resend or SendGrid
    // await sendEmail({ to: email, subject: 'We received your ticket!' ... })

    return NextResponse.json({ success: true, message: 'Ticket securely logged in database.' });

  } catch (error: any) {
    console.error('Support API Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
