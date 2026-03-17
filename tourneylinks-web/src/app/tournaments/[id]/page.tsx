import React from 'react';
import { getTournamentById } from '@/lib/db';
import { notFound } from 'next/navigation';
import Link from 'next/link';

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
      <div className="hero" style={{ minHeight: '60vh', padding: '6rem 0 0 0', display: 'block' }}>
        <div className="hero-bg"></div>
        <div className="hero-grid"></div>
        <div className="hero-dots"></div>
        
        <div className="hero-content" style={{ display: 'block', paddingTop: '4rem', paddingBottom: '2rem' }}>
          <Link href="/" style={{ color: 'var(--mist)', textDecoration: 'none', display: 'inline-block', marginBottom: '2rem', fontSize: '0.9rem', fontWeight: 600 }}>
             ← Back to Events
          </Link>
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
        <div className="section-wrapper" style={{ paddingTop: '4rem' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '3rem' }}>
            {/* Top Details Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
               <div className="feature-card" style={{ background: 'var(--white)', border: '1px solid rgba(26,46,26,0.06)' }}>
                  <div className="t-detail-label">Entry Fee</div>
                  <div className="hero-stat-num" style={{ color: 'var(--forest)' }}>{tournament.entryFee ? `$${tournament.entryFee}` : 'TBD'}</div>
               </div>
               <div className="feature-card" style={{ background: 'var(--white)', border: '1px solid rgba(26,46,26,0.06)' }}>
                  <div className="t-detail-label">Field Size</div>
                  <div className="hero-stat-num" style={{ color: 'var(--forest)' }}>{tournament.maxPlayers || 'Open'} <span style={{fontSize: '1rem', color: 'var(--mist)'}}>players</span></div>
               </div>
               <div className="feature-card" style={{ background: 'var(--white)', border: '1px solid rgba(26,46,26,0.06)' }}>
                  <div className="t-detail-label">Spots Left</div>
                  <div className="hero-stat-num" style={{ color: 'var(--grass)' }}>{tournament.spotsRemaining !== null ? tournament.spotsRemaining : 'Open'}</div>
               </div>
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
                <div style={{ background: 'rgba(26,46,26,0.02)', border: '1px solid rgba(26,46,26,0.06)', borderRadius: 'var(--radius-lg)', padding: '2rem' }}>
                  <h3 className="section-eyebrow">Organizer</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1.5rem' }}>
                    {tournament.organizerName && (
                      <div>
                        <div className="t-detail-label">Name</div>
                        <div className="t-detail-val">{tournament.organizerName}</div>
                      </div>
                    )}
                    {tournament.organizerEmail && (
                      <div>
                        <div className="t-detail-label">Email</div>
                        <a href={`mailto:${tournament.organizerEmail}`} style={{ color: 'var(--grass)', textDecoration: 'none', fontWeight: 500 }}>{tournament.organizerEmail}</a>
                      </div>
                    )}
                    {tournament.organizerPhone && (
                      <div>
                        <div className="t-detail-label">Phone</div>
                        <a href={`tel:${tournament.organizerPhone}`} style={{ color: 'var(--grass)', textDecoration: 'none', fontWeight: 500 }}>{tournament.organizerPhone}</a>
                      </div>
                    )}
                    {!tournament.organizerName && !tournament.organizerEmail && !tournament.organizerPhone && (
                       <span style={{ fontStyle: 'italic', color: 'var(--mist)' }}>No organizer info.</span>
                    )}
                  </div>
                </div>
              </div>
              
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <footer style={{ background: 'var(--forest)', padding: '4rem 0', marginTop: 'auto' }}>
        <div className="section-wrapper" style={{ padding: '0 3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
                <div className="nav-logo-text" style={{ marginBottom: '0.5rem' }}>Tourney<span>Links</span> Agent</div>
                <p style={{ fontSize: '0.85rem', color: 'var(--mist)' }}>Discovering the best competitive golf near you.</p>
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--mist)' }}>
                &copy; {new Date().getFullYear()} TourneyLinks Network. All attributes extracted autonomously.
            </div>
        </div>
      </footer>
    </>
  );
}
