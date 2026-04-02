import { NextResponse } from 'next/server';
import { db, registrations, registration_transfers, users } from '@/lib/db';
import { eq, and } from 'drizzle-orm';
import { getUserId } from '@/lib/auth-util';
import crypto from 'crypto';

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getUserId();
    const clerkId = session?.userId;
    if (!clerkId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const resolvedParams = await params;
    const registrationId = parseInt(resolvedParams.id, 10);
    const body = await req.json();
    const { recipientEmail } = body;

    if (!recipientEmail) return NextResponse.json({ error: 'Missing recipient email' }, { status: 400 });

    // Validate ownership
    const userRecords = await db.select().from(users).where(eq(users.clerkId, clerkId));
    if (!userRecords.length) return NextResponse.json({ error: 'User profile not found' }, { status: 404 });
    const userPlatformId = userRecords[0].id;

    const regRecords = await db.select().from(registrations).where(eq(registrations.id, registrationId));
    if (!regRecords.length || regRecords[0].userId !== userPlatformId) {
      return NextResponse.json({ error: 'Not authorized to transfer this registration' }, { status: 403 });
    }

    if (regRecords[0].status === 'TRANSFERRED' || regRecords[0].status === 'CANCELLED') {
      return NextResponse.json({ error: 'Registration is already transferred or cancelled' }, { status: 400 });
    }

    // Generate Magic Link Token
    const transferToken = crypto.randomUUID();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 3); // 72 hour expiration

    const [transferRecord] = await db.insert(registration_transfers).values({
      registrationId,
      originalPlayerId: userPlatformId,
      recipientEmail,
      transferToken,
      expiresAt,
    }).returning();
    
    // In production, trigger Resend/SendGrid hook here:
    // Email payload: "You've been gifted a spot! Click here: /transfer/claim?token=${transferToken}"

    return NextResponse.json({ success: true, transferToken }); // Returning token for easy local UI testing
  } catch (err) {
    console.error('Transfer Init API Error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
