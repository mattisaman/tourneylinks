import React from 'react';
import { getTournamentById } from '@/lib/db';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import ContactHostWidget from '@/components/tournaments/ContactHostWidget';
import MissingLinkWidget from '@/components/tournaments/MissingLinkWidget';

export default async function TournamentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const tournamentId = parseInt(resolvedParams.id, 10);
  if (isNaN(tournamentId)) {
    notFound();
  }

  const tournament = await getTournamentById(tournamentId);

  if (!tournament) {
    notFound();
  }

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "TBD";
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' });
  };

  const isRegistrationOpen = !tournament.registrationDeadline || new Date(tournament.registrationDeadline) >= new Date();

  return (
    <>
      {/* Root-Level Floating Action Nav (Immune to parent relative overflow) */}
      <div style={{ position: 'fixed', top: '100px', left: 'max(1rem, calc((100vw - 1200px) / 2))', zIndex: 9999 }}>
        <Link href="/tournaments" className="btn-hero-outline" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', padding: '0.6rem 1.25rem', background: 'rgba(10,31,13,0.95)', border: '1px solid rgba(212,175,55,0.6)', color: 'var(--cream)', textDecoration: 'none', borderRadius: '40px', boxShadow: '0 8px 30px rgba(0,0,0,0.3)' }}>
           ← Back to Tournaments
        </Link>
      </div>

      <div className="hero" style={{ minHeight: '60vh', padding: '6rem 0 0 0', display: 'block' }}>
        <div className="hero-bg"></div>
        <div className="hero-grid"></div>
        <div className="hero-dots"></div>
        
        <div className="hero-content" style={{ display: 'block', paddingTop: '4rem', paddingBottom: '2rem' }}>
          <div className="hero-eyebrow" style={{ marginTop: '0' }}>{tournament.format}</div>
          <h1 className="hero-headline" style={{ fontSize: 'clamp(2.5rem, 4vw, 4.5rem)', marginBottom: '1rem' }}>
            {tournament.name}
          </h1>
          <div className="hero-sub" style={{ maxWidth: '800px', display: 'flex', gap: '2rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ color: 'var(--gold)' }}>📅</span> {formatDate(tournament.dateStart)}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ color: 'var(--gold)' }}>📍</span> {tournament.courseName} &bull; {tournament.courseCity}, {tournament.courseState}
            </span>
            {isRegistrationOpen && (
              <span className="badge badge-open" style={{ padding: '0.4rem 1rem', fontSize: '0.75rem' }}>Registration Open</span>
            )}
          </div>
        </div>
      </div>

      <div style={{ background: 'var(--white)', position: 'relative', zIndex: 10 }}>
        <div className="section-wrapper" style={{ paddingTop: '2.5rem' }}>
          
          {/* CLAIM EVENT BRAND BANNER */}
          <div style={{ background: 'linear-gradient(135deg, rgba(10,31,13,0.95), rgba(26,46,26,0.85))', border: '1px solid rgba(212,175,55,0.6)', borderRadius: 'var(--radius-lg)', padding: '2.5rem 3.5rem', marginBottom: '3rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '2rem', flexWrap: 'wrap', boxShadow: '0 15px 40px rgba(0,0,0,0.1), inset 0 0 40px rgba(212,175,55,0.05)' }}>
            <div>
              <h3 style={{ color: 'var(--gold)', fontSize: '1.6rem', marginBottom: '0.5rem', fontWeight: 600, textShadow: '0 2px 10px rgba(212,175,55,0.3)' }}>Are you the Tournament Director?</h3>
              <p style={{ color: '#e0e5df', fontSize: '1rem', lineHeight: '1.6', maxWidth: '600px' }}>
                Take ownership of your event. Claim this tournament to securely manage player registrations, execute automated blind-draw flighting, and collect gateway payments instantly.
              </p>
            </div>
            <Link href="/host" className="btn-primary" style={{ padding: '1.2rem 2.5rem', fontSize: '1.1rem', whiteSpace: 'nowrap', boxShadow: '0 8px 30px rgba(212,175,55,0.4)', background: 'linear-gradient(135deg, #d4af37, #aa8529)', color: '#000', fontWeight: 700, border: 'none' }}>
              Claim Your Event 🚀
            </Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '3rem' }}>
            {/* Top Details Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
               <div className="feature-card" style={{ background: 'var(--white)', border: '1px solid rgba(26,46,26,0.06)' }}>
                  <div className="t-detail-label">Entry Fee</div>
                  <div className="hero-stat-num" style={{ color: 'var(--forest)' }}>{tournament.entryFee ? `$${tournament.entryFee}` : 'TBD'}</div>
               </div>
               <div className="feature-card" style={{ background: 'var(--white)', border: '1px solid rgba(26,46,26,0.06)' }}>
                  <div className="t-detail-label">Format</div>
                  <div className="hero-stat-num" style={{ color: 'var(--forest)' }}>{tournament.format || 'Standard'}</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--mist)', marginTop: '0.2rem' }}>{tournament.holes || 18} Holes {tournament.formatDetail ? `• ${tournament.formatDetail}` : ''}</div>
               </div>
               <div className="feature-card" style={{ background: 'var(--white)', border: '1px solid rgba(26,46,26,0.06)' }}>
                  <div className="t-detail-label">Field Size</div>
                  <div className="hero-stat-num" style={{ color: 'var(--forest)' }}>{tournament.maxPlayers || 'Open'} <span style={{fontSize: '1rem', color: 'var(--mist)'}}>players</span></div>
               </div>
               <div className="feature-card" style={{ background: 'var(--white)', border: '1px solid rgba(26,46,26,0.06)' }}>
                  <div className="t-detail-label">Spots Left</div>
                  <div className="hero-stat-num" style={{ color: 'var(--grass)' }}>{tournament.spotsRemaining !== null ? tournament.spotsRemaining : 'Open'}</div>
               </div>
               {tournament.handicapMax !== null && (
                 <div className="feature-card" style={{ background: 'var(--white)', border: '1px solid rgba(26,46,26,0.06)' }}>
                    <div className="t-detail-label">Max Handicap</div>
                    <div className="hero-stat-num" style={{ color: 'var(--forest)' }}>{tournament.handicapMax}</div>
                 </div>
               )}
               <div className="feature-card" style={{ background: 'var(--white)', border: '1px solid rgba(26,46,26,0.06)' }}>
                  <div className="t-detail-label">Access</div>
                  <div className="hero-stat-num" style={{ color: 'var(--forest)' }}>{tournament.isPrivate ? 'Private' : 'Public'}</div>
               </div>
               {tournament.isCharity && (
                 <div className="feature-card" style={{ background: 'var(--white)', border: '1px solid rgba(26,46,26,0.06)' }}>
                    <div className="t-detail-label">Event Type</div>
                    <div className="hero-stat-num" style={{ color: 'var(--gold)' }}>Charity</div>
                 </div>
               )}
               <div className="feature-card" style={{ background: 'var(--white)', border: '1px solid rgba(26,46,26,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {tournament.registrationUrl ? (
                    <a href={tournament.registrationUrl} target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ width: '100%', textAlign: 'center', padding: '1rem' }}>
                      Register Now
                    </a>
                  ) : (
                    <div style={{ color: 'var(--mist)', fontSize: '0.9rem', fontStyle: 'italic', textAlign: 'center' }}>Registration Link Unavailable</div>
                  )}
               </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '3rem' }}>
              
              {/* Main Content Area */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
                <div>
                  <h2 className="section-title" style={{ fontSize: '2rem', marginBottom: '1.5rem' }}>Event Overview</h2>
                  <div style={{ fontSize: '1.05rem', lineHeight: '1.8', color: 'var(--ink)' }}>
                    {tournament.description ? (
                      <p style={{ whiteSpace: 'pre-line' }}>{tournament.description}</p>
                    ) : (
                      <p style={{ fontStyle: 'italic', color: 'var(--mist)' }}>No description provided for this event.</p>
                    )}
                  </div>
                </div>

                {tournament.includes && (
                  <div>
                    <h2 className="section-title" style={{ fontSize: '2rem', marginBottom: '1.5rem' }}>What&apos;s Included</h2>
                    <ul style={{ listStylePosition: 'inside', fontSize: '1.05rem', lineHeight: '1.8', color: 'var(--ink)', whiteSpace: 'pre-line' }}>
                      {tournament.includes}
                    </ul>
                  </div>
                )}
              </div>

              {/* Sidebar Area */}
              <div>
                <ContactHostWidget tournament={tournament as any} />

                {/* Sidebar Claim Tool Removed - Promoted to Header Banner */}

                {tournament.sourceUrl && (
                  <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                     <a href={tournament.sourceUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--mist)', fontSize: '0.85rem', textDecoration: 'underline', fontWeight: 500, transition: 'var(--transition)' }}>
                       View Original Event Listing ↗
                     </a>
                  </div>
                )}
              </div>
              
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
