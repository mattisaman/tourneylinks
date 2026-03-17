import React from 'react';
import Link from 'next/link';
import { getExistingTournaments } from '@/lib/db';

export default async function Tournaments() {
  const tournaments = await getExistingTournaments();

  // If we don't have exactly the right data or if it failed, provide a fallback.
  // In a real app we'd have a nicer empty state.
  const displayTournaments = tournaments.length > 0 ? tournaments : [];

  const getGradient = (index: number) => {
    const gradients = [
      "linear-gradient(to top, rgba(26,46,26,0.9) 0%, transparent 60%), linear-gradient(135deg, #1a4a1a 0%, #2d6b2d 50%, #3d8b3d 100%)",
      "linear-gradient(to top, rgba(26,46,26,0.9) 0%, transparent 60%), linear-gradient(0deg, #2d4a2d 0%, #5a8c3a 50%, #8fbc5a 100%)",
      "linear-gradient(to top, rgba(26,46,26,0.9) 0%, transparent 60%), linear-gradient(45deg, #1a2e1a 0%, #2c3e50 50%, #3498db 100%)"
    ];
    return gradients[index % gradients.length];
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "TBD";
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' }).toUpperCase();
  };

  const getStatus = (t: any) => {
    if (!t.registrationDeadline) return "OPEN";
    const deadline = new Date(t.registrationDeadline);
    if (deadline < new Date()) return "CLOSED";
    return "OPEN";
  };

  return (
    <section className="section-wrapper" id="explore">
      <div className="section-eyebrow">Upcoming Events</div>
      
      <div className="section-header">
        <div>
          <h2 className="section-title">Featured Tournaments</h2>
          <p className="section-sub">
            Discover premier amateur championships, local competitive leagues, and high-end charity scrambles in your area.
          </p>
        </div>
        <div className="hidden md:block">
          <Link href="/tournaments" style={{ textDecoration: 'none', color: 'var(--forest)', fontWeight: 600, fontSize: '0.9rem' }}>
            View All Events <span>→</span>
          </Link>
        </div>
      </div>

      <div className="tournaments-grid">
        {displayTournaments.slice(0, 6).map((t, i) => (
          <Link href={`/tournaments/${t.id}`} key={t.id} className="t-card" style={{ textDecoration: 'none' }}>
            <div className="t-card-cover">
              <div 
                className="cover-bg"
                style={{ background: getGradient(i) }}
              ></div>
              <div className="cover-overlay"></div>
              <div className="cover-badges">
                <span className="badge badge-format">{t.format}</span>
                {getStatus(t) === 'OPEN' ? (
                  <span className="badge badge-open">Registration Open</span>
                ) : (
                  <span className="badge badge-soon">Opening Soon</span>
                )}
              </div>
            </div>
            
            <div className="t-card-body">
              <div className="t-card-date">{formatDate(t.dateStart)}</div>
              <h3 className="t-card-title">{t.name}</h3>
              <div className="t-card-location">
                <span role="img" aria-label="location">📍</span> {t.courseName} · {t.courseCity}, {t.courseState}
              </div>
              
              <div className="t-card-details">
                <div>
                  <div className="t-detail-label">Entry Fee</div>
                  <div className="t-detail-val">{t.entryFee ? `$${t.entryFee}` : 'TBD'}</div>
                </div>
                <div>
                  <div className="t-detail-label">Division</div>
                  <div className="t-detail-val">Amateur</div>
                </div>
              </div>
            </div>
            
            <div className="t-card-footer">
              <div className="t-spots">
                {t.spotsRemaining !== null && t.maxPlayers !== null ? (
                    <><strong>{t.maxPlayers - t.spotsRemaining}</strong> / {t.maxPlayers} Filled</>
                ) : (
                    <>Spots Available</>
                )}
              </div>
              <span className="btn-card">View Details</span>
            </div>
          </Link>
        ))}
        {displayTournaments.length === 0 && (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--mist)', gridColumn: '1 / -1' }}>
            No tournaments found in the database.
          </div>
        )}
      </div>
    </section>
  );
}
