import React from 'react';
import { getTournamentById, db, split_invites, team_groups } from '@/lib/db';
import { eq } from 'drizzle-orm';
import { notFound, redirect } from 'next/navigation';
import ClaimClient from './ClaimClient';
import { getCurrentUser } from '@/lib/auth-util';

export default async function TeamClaimPage({ params, searchParams }: { params: Promise<{ id: string }>, searchParams: Promise<{ [key: string]: string | undefined }> }) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  const tournamentId = parseInt(resolvedParams.id, 10);
  const token = resolvedSearchParams.token;
  
  if (isNaN(tournamentId) || !token) {
    notFound();
  }

  // 1. Verify the token is valid
  const inviteRow = await db.select().from(split_invites).where(eq(split_invites.token, token)).limit(1);
  const invite = inviteRow[0];
  
  if (!invite) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', background: '#fff', padding: '3rem', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
          <h2 style={{ fontSize: '2rem', color: 'var(--ink)', marginBottom: '1rem' }}>Invalid Link</h2>
          <p style={{ color: 'var(--mist)' }}>This invitation link does not exist.</p>
        </div>
      </div>
    );
  }

  if (invite.status === 'CLAIMED') {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', background: '#fff', padding: '3rem', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
          <h2 style={{ fontSize: '2rem', color: 'var(--forest)', marginBottom: '1rem' }}>Already Claimed</h2>
          <p style={{ color: 'var(--mist)' }}>This secure entry spot has already been claimed by another player.</p>
        </div>
      </div>
    );
  }

  // 2. Hydrate Team and Tournament details
  const teamRow = await db.select().from(team_groups).where(eq(team_groups.id, invite.teamGroupId)).limit(1);
  const team = teamRow[0];

  const tournament = await getTournamentById(tournamentId);

  if (!team || !tournament) {
    notFound();
  }

  // Pre-serialize
  const eventDetails = {
    id: tournament.id,
    name: tournament.name,
    entryFee: tournament.entryFee,
  };

  const currentClerkUser = await getCurrentUser();

  return (
    <div style={{ minHeight: '100vh', background: '#f8faf9', paddingTop: '80px', paddingBottom: '6rem' }}>
      <div className="section-wrapper" style={{ maxWidth: '700px' }}>
        <div style={{ background: 'linear-gradient(135deg, var(--gold), #aa8529)', padding: '0.6rem 1.5rem', borderRadius: '40px', display: 'inline-block', color: '#000', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1.5px', fontSize: '0.85rem', marginBottom: '1.5rem', boxShadow: '0 5px 20px rgba(212,175,55,0.4)' }}>
          You've Been Invited! 🎟️
        </div>
        
        <h1 style={{ fontSize: '3rem', color: 'var(--forest)', marginBottom: '0.5rem', fontWeight: 800, lineHeight: '1.1' }}>
          Join {team.groupName}
        </h1>
        <p style={{ fontSize: '1.2rem', color: 'var(--mist)', marginBottom: '3rem' }}>
          in the <b>{tournament.name}</b>
        </p>

        <ClaimClient 
          tournament={eventDetails} 
          teamGroupId={team.id} 
          token={token} 
          isLoggedIn={!!currentClerkUser}
        />
      </div>
    </div>
  );
}
