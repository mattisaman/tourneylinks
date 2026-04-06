import React from 'react';
import { getTournamentById } from '@/lib/db';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import DonateFormClient from './DonateFormClient';

export default async function DonatePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const tournamentId = parseInt(resolvedParams.id, 10);
  if (isNaN(tournamentId)) {
    notFound();
  }

  const tournament = await getTournamentById(tournamentId);

  if (!tournament || !tournament.acceptsDonations) {
    notFound();
  }

  return (
    <>
      <div className="hero" style={{ minHeight: '40vh', padding: '6rem 0 2rem 0', display: 'block', background: 'linear-gradient(135deg, rgba(10,31,13,0.95), rgba(26,46,26,0.95))' }}>
        <div className="hero-content" style={{ display: 'block', paddingTop: '2rem', paddingBottom: '2rem', textAlign: 'center' }}>
          <div className="hero-eyebrow" style={{ marginTop: '0', color: 'var(--gold)' }}>Charity Support Portal</div>
          <h1 className="hero-headline" style={{ fontSize: 'clamp(2rem, 3vw, 3.5rem)', marginBottom: '1rem' }}>
            Support {tournament.charityName || 'This Cause'}
          </h1>
          <p style={{ color: 'var(--mist)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto', marginBottom: tournament.isCharity ? '1.5rem' : '0' }}>
            Every contribution directly supports the charitable efforts of the <strong>{tournament.name}</strong>. Thank you for your generosity!
          </p>
          {tournament.isCharity && (
             <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(212,175,55,0.15)', border: '1px solid var(--gold)', padding: '0.4rem 1rem', borderRadius: '4px' }}>
                <span style={{ color: 'var(--gold)' }}>★</span>
                <span style={{ color: 'var(--gold)', fontWeight: 800, letterSpacing: '0.05em', fontSize: '0.8rem', textTransform: 'uppercase' }}>501(c)(3) Tax-Deductible Donation</span>
             </div>
          )}
        </div>
      </div>

      <div style={{ background: 'var(--white)', padding: '4rem 0', minHeight: '60vh' }}>
        <div className="section-wrapper" style={{ maxWidth: '600px', margin: '0 auto' }}>
          
          <Link href={`/tournaments/${tournament.id}`} className="btn-hero-outline" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', padding: '0.6rem 1.25rem', marginBottom: '2rem', background: 'rgba(10,31,13,0.05)', color: 'var(--ink)' }}>
            ← Back to Event
          </Link>

          <div style={{ background: '#fff', border: '1px solid rgba(26,46,26,0.08)', borderRadius: 'var(--radius-lg)', padding: '2.5rem', boxShadow: '0 8px 30px rgba(0,0,0,0.04)' }}>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: 'var(--forest)' }}>Make a Donation</h3>
            <p style={{ color: 'var(--mist)', marginBottom: '2rem', lineHeight: '1.5' }}>
              Select a donation amount below. Your payment will be processed securely via Stripe.
            </p>
            
            <DonateFormClient tournamentId={tournament.id} charityName={tournament.charityName || 'Charity'} />
          </div>

        </div>
      </div>
    </>
  );
}
