import React from 'react';
import { db, registration_transfers, registrations, tournaments, users } from '@/lib/db';
import { eq, and } from 'drizzle-orm';
import { getCurrentUser } from '@/lib/auth-util';
import { getUserId } from '@/lib/auth-util';
import { SignInButton } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

export const dynamic = 'force-dynamic';

async function claimTransferAction(formData: FormData) {
  'use server';
  const token = formData.get('token') as string;
  if (!token) throw new Error('No token provided');

  const session = await getUserId();
  const activeClerkId = session?.userId;
  if (!activeClerkId) throw new Error('You must be signed in to claim this spot');

  // Validate the token again
  const activeUserRecords = await db.select().from(users).where(eq(users.clerkId, activeClerkId));
  if (!activeUserRecords.length) throw new Error('User profile missing');
  const recipientUserId = activeUserRecords[0].id;
  const recipientEmail = activeUserRecords[0].email;
  const recipientName = activeUserRecords[0].fullName;
  const recipientHandicap = activeUserRecords[0].handicapIndex;

  const transferQ = await db.select().from(registration_transfers).where(eq(registration_transfers.transferToken, token));
  if (!transferQ.length || transferQ[0].status !== 'PENDING') return;
  const transfer = transferQ[0];

  if (new Date() > new Date(transfer.expiresAt)) return;
  if (recipientEmail.toLowerCase() !== transfer.recipientEmail.toLowerCase()) {
    throw new Error('This transfer link was sent to a different email address.');
  }

  // Swap the registration profile mapping
  await db.update(registrations)
    .set({
      userId: recipientUserId,
      name: recipientName,
      email: recipientEmail,
      handicap: recipientHandicap || null,
      status: 'TRANSFERRED'
    })
    .where(eq(registrations.id, transfer.registrationId));

  // Mark the transfer as completed
  await db.update(registration_transfers)
    .set({
      recipientPlayerId: recipientUserId,
      status: 'COMPLETED'
    })
    .where(eq(registration_transfers.id, transfer.id));

  revalidatePath('/profile');
  redirect('/profile?transfer=success');
}

export default async function ClaimTransferPage({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const resolvedParams = await searchParams;
  const token = resolvedParams.token;
  
  if (!token) {
    return (
      <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--white)' }}>
        <h1 style={{ color: 'var(--forest)', fontSize: '2rem' }}>Invalid or missing Transfer Token.</h1>
      </div>
    );
  }

  const transferQ = await db.select().from(registration_transfers).where(eq(registration_transfers.transferToken, token));
  const transfer = transferQ[0];

  if (!transfer) {
    return (
      <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--white)' }}>
        <h1 style={{ color: 'var(--forest)', fontSize: '2rem' }}>This transfer link does not exist.</h1>
      </div>
    );
  }

  if (transfer.status === 'COMPLETED') {
    return (
      <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--white)' }}>
        <h1 style={{ color: 'var(--forest)', fontSize: '2rem' }}>This registration has already been claimed!</h1>
      </div>
    );
  }

  if (transfer.status === 'CANCELLED' || new Date() > new Date(transfer.expiresAt)) {
    return (
      <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--white)' }}>
        <h1 style={{ color: 'var(--mist)', fontSize: '2rem' }}>This transfer link has expired.</h1>
      </div>
    );
  }

  // Fetch related details
  const regQ = await db.select().from(registrations).where(eq(registrations.id, transfer.registrationId));
  const registration = regQ[0];
  const tournamentQ = await db.select().from(tournaments).where(eq(tournaments.id, registration.tournamentId));
  const tournament = tournamentQ[0];

  const session = await getUserId();
  const userId = session?.userId;
  const clerkUser = await getCurrentUser();

  const isEmailMatch = clerkUser?.emailAddresses[0]?.emailAddress.toLowerCase() === transfer.recipientEmail.toLowerCase();

  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, rgba(26,46,26,0.03), rgba(212,175,55,0.05))', padding: '2rem' }}>
      
      <div style={{ background: 'var(--white)', padding: '3rem', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-glow)', maxWidth: '600px', width: '100%', textAlign: 'center' }}>
        <div style={{ color: 'var(--gold)', fontSize: '3rem', marginBottom: '1rem' }}>🎟️</div>
        <h1 style={{ fontSize: '2rem', color: 'var(--forest)', fontWeight: 800, marginBottom: '0.5rem' }}>You've Been Gifted a Spot!</h1>
        <p style={{ color: 'var(--mist)', fontSize: '1.05rem', lineHeight: '1.5', marginBottom: '2rem' }}>
          <strong>{registration.name}</strong> has transferred their registration for <strong>{tournament.name}</strong> to you.
        </p>

        <div style={{ background: 'rgba(26,46,26,0.02)', padding: '1.5rem', borderRadius: '8px', border: '1px solid rgba(26,46,26,0.06)', textAlign: 'left', marginBottom: '2rem' }}>
          <div style={{ fontSize: '0.85rem', color: 'var(--mist)', marginBottom: '0.2rem', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 600 }}>Event Details</div>
          <div style={{ fontSize: '1.1rem', color: 'var(--forest)', fontWeight: 600 }}>{tournament.name}</div>
          <div style={{ fontSize: '0.9rem', color: 'var(--ink)', marginTop: '0.5rem' }}>📍 {tournament.courseName}</div>
          <div style={{ fontSize: '0.9rem', color: 'var(--ink)', marginTop: '0.25rem' }}>📅 {new Date(tournament.dateStart || '').toLocaleDateString()}</div>
        </div>

        {!userId ? (
          <div>
            <p style={{ color: 'var(--mist)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              To claim your spot, please log in with the email address exactly as entered by the original player ({transfer.recipientEmail}).
            </p>
            <SignInButton mode="modal">
              <button className="btn-primary" style={{ width: '100%', padding: '1rem', fontSize: '1.1rem' }}>
                Sign In to Claim Ticket
              </button>
            </SignInButton>
          </div>
        ) : (
          <div>
            {!isEmailMatch && (
              <div style={{ background: 'rgba(244,67,54,0.1)', color: '#F44336', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                You are signed in as <strong>{clerkUser?.emailAddresses[0]?.emailAddress}</strong>, but this transfer was linked to <strong>{transfer.recipientEmail}</strong>. Please sign in to the correct account to claim this ticket.
              </div>
            )}
            {isEmailMatch && (
              <form action={claimTransferAction}>
                <input type="hidden" name="token" value={token} />
                <button type="submit" className="btn-primary" style={{ width: '100%', padding: '1rem', fontSize: '1.1rem', background: 'linear-gradient(135deg, #d4af37, #aa8529)', border: 'none', color: '#000' }}>
                  Accept Transfer & Update Roster
                </button>
                <div style={{ fontSize: '0.8rem', color: 'var(--mist)', marginTop: '1rem' }}>
                  By accepting, your Player Profile and current handicap will be automatically submitted to the Tournament Director.
                </div>
              </form>
            )}
          </div>
        )}
      </div>

    </div>
  );
}
