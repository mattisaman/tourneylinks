import React from 'react';
import { getTournamentById, db, sponsorship_tiers } from '@/lib/db';
import { eq } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import SponsorSelectionClient from './SponsorSelectionClient';

export default async function SponsorPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const tournamentId = parseInt(resolvedParams.id, 10);
  if (isNaN(tournamentId)) {
    notFound();
  }

  const tournament = await getTournamentById(tournamentId);

  if (!tournament) {
    notFound();
  }

  // Fetch available Sponsorship Tiers
  const tiers = await db.select().from(sponsorship_tiers).where(eq(sponsorship_tiers.tournamentId, tournamentId));

  return (
    <>
      <div className="hero" style={{ minHeight: '40vh', padding: '6rem 0 2rem 0', display: 'block', background: 'linear-gradient(135deg, rgba(212,175,55,0.1), rgba(10,31,13,0.95))' }}>
        <div className="hero-content" style={{ display: 'block', paddingTop: '2rem', paddingBottom: '2rem', textAlign: 'center' }}>
          <div className="hero-eyebrow" style={{ marginTop: '0', color: 'var(--gold)' }}>Partner With Us</div>
          <h1 className="hero-headline" style={{ fontSize: 'clamp(2rem, 3vw, 3.5rem)', marginBottom: '1rem' }}>
            Sponsor the {tournament.name}
          </h1>
          <p style={{ color: 'var(--mist)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto', marginBottom: tournament.isCharity ? '1.5rem' : '0' }}>
            Elevate your brand visibility among our premium demographic of golfers while supporting a fantastic event!
          </p>
          {tournament.isCharity && (
             <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(212,175,55,0.15)', border: '1px solid var(--gold)', padding: '0.4rem 1rem', borderRadius: '4px' }}>
                <span style={{ color: 'var(--gold)' }}>★</span>
                <span style={{ color: 'var(--gold)', fontWeight: 800, letterSpacing: '0.05em', fontSize: '0.8rem', textTransform: 'uppercase' }}>501(c)(3) Tax-Deductible Sponsorship</span>
             </div>
          )}
        </div>
      </div>

      <div style={{ background: 'var(--white)', padding: '4rem 0', minHeight: '60vh' }}>
        <div className="section-wrapper" style={{ maxWidth: '900px', margin: '0 auto' }}>
          
          <Link href={`/tournaments/${tournament.id}`} className="btn-hero-outline" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', padding: '0.6rem 1.25rem', marginBottom: '2rem', background: 'rgba(10,31,13,0.05)', color: 'var(--ink)' }}>
            ← Back to Event
          </Link>

          {tiers.length === 0 ? (
            <div style={{ padding: '3rem', textAlign: 'center', background: '#f8f9f8', borderRadius: '8px', border: '1px dashed #ccc' }}>
              <h3 style={{ color: 'var(--forest)' }}>Sponsorship Packages Upcoming</h3>
              <p style={{ color: 'var(--mist)' }}>The Tournament Director is currently finalizing the official sponsorship tiers for this event. Check back soon!</p>
            </div>
          ) : (
            <SponsorSelectionClient tournamentId={tournament.id} tiers={tiers as any} />
          )}

        </div>
      </div>
    </>
  );
}
