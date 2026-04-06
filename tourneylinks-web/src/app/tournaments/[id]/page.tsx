import React from 'react';
import { db } from '@/lib/db';
import { tournaments, sponsorship_tiers, users, stripe_accounts } from '@/lib/db';
import { eq } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import StripeCheckoutButton from './StripeCheckoutButton';
import Link from 'next/link';
import HeroCarousel from './HeroCarousel';
import ContactHostModal from './ContactHostModal';

export default async function TournamentGatewayPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const tournamentId = parseInt(resolvedParams.id, 10);
  
  if (isNaN(tournamentId)) {
    notFound();
  }

  const tournamentList = await db.select().from(tournaments).where(eq(tournaments.id, tournamentId));
  const tournament = tournamentList[0];

  if (!tournament) {
    notFound();
  }
  
  let hostUser = null;
  let hostHasStripe = false;
  
  if (tournament.hostUserId) {
    const userList = await db.select().from(users).where(eq(users.id, tournament.hostUserId));
    hostUser = userList[0] || null;
    
    if (hostUser) {
      const stripeAccs = await db.select().from(stripe_accounts).where(eq(stripe_accounts.userId, hostUser.id));
      hostHasStripe = stripeAccs.length > 0;
    }
  }

  const tiers = await db.select().from(sponsorship_tiers).where(eq(sponsorship_tiers.tournamentId, tournamentId));

  const getCleanUrl = (url: string | null) => {
    if (!url) return '';
    return url.startsWith('http') ? url : `https://${url}`;
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "TBD";
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' });
  };

  // Process heroImages JSON array (parse it safely)
  let heroImageArray: string[] = [];
  if (tournament.heroImages) {
    try {
      if (typeof tournament.heroImages === 'string') {
        heroImageArray = JSON.parse(tournament.heroImages);
      } else if (Array.isArray(tournament.heroImages)) {
        heroImageArray = tournament.heroImages;
      }
    } catch (e) {
      console.error("Failed to parse heroImages", e);
    }
  }

  let parsedSchedule: {time: string, event: string}[] | null = null;
  if (tournament.schedule) {
    try {
      parsedSchedule = typeof tournament.schedule === 'string' ? JSON.parse(tournament.schedule) : tournament.schedule;
    } catch (e) {
      console.error("Failed to parse schedule", e);
    }
  }

  let parsedPrizes: string[] | null = null;
  if (tournament.prizes) {
    try {
      parsedPrizes = typeof tournament.prizes === 'string' ? JSON.parse(tournament.prizes) : tournament.prizes;
    } catch (e) {
      console.error("Failed to parse prizes", e);
    }
  }

  let parsedSponsors: string[] | null = null;
  if (tournament.sponsors) {
    try {
      parsedSponsors = typeof tournament.sponsors === 'string' ? JSON.parse(tournament.sponsors) : tournament.sponsors;
    } catch (e) {
      console.error("Failed to parse sponsors", e);
    }
  }

  return (
    <>
      <HeroCarousel 
        tournament={tournament} 
        heroImages={heroImageArray} 
        themeColor={tournament.themeColor} 
        secondaryThemeColor={tournament.secondaryThemeColor}
      />

      <div style={{ background: 'var(--stone)', position: 'relative', zIndex: 10 }} className="mobile-padding-block">
        <div className="section-wrapper" style={{ paddingTop: '3rem' }}>
          
          <style dangerouslySetInnerHTML={{__html: `
            .t-layout-grid {
              display: grid;
              grid-template-columns: 350px 1fr;
              gap: 4rem;
              align-items: start;
            }
            @media (max-width: 1000px) {
              .t-layout-grid {
                grid-template-columns: 1fr;
              }
              .desktop-sticky {
                position: relative !important;
                top: 0 !important;
                display: grid !important;
                grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)) !important;
              }
            }
            @media (max-width: 600px) {
              .mobile-pad { padding: 1.25rem !important; }
              .mobile-gap { gap: 1.5rem !important; }
              .mobile-padding-block { padding: 2rem 0 !important; }
            }
          `}} />

          <div className="t-layout-grid">
            
            {/* ---------------- 3 PREMIUM CTAS (STICKY LEFT SIDEBAR) ---------------- */}
            <div className="desktop-sticky" style={{ position: 'sticky', top: '120px', display: 'flex', flexDirection: 'column', gap: '1.5rem', zIndex: 11 }}>

              <Link href="/tournaments" className="btn-hero-outline" style={{ width: 'fit-content', padding: '0.6rem 1.2rem', fontSize: '0.85rem', marginBottom: '0.5rem', marginLeft: '0.5rem' }}>
                <span style={{ fontSize: '1.1rem', lineHeight: 1 }}>←</span> Back to Tournaments
              </Link>
              
              {tournament.isCharity && (
                 <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(212,175,55,0.15)', border: '1px solid var(--gold)', padding: '0.6rem 1rem', borderRadius: '8px', marginBottom: '0.5rem' }}>
                    <span style={{ color: 'var(--gold)' }}>★</span>
                    <span style={{ color: 'var(--gold)', fontWeight: 800, letterSpacing: '0.05em', fontSize: '0.75rem', textTransform: 'uppercase' }}>501(c)(3) Tax-Deductible Event</span>
                 </div>
              )}
              
              {/* CTA 1: REGISTER NOW */}
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', background: 'linear-gradient(145deg, rgba(16,36,20,0.98), #051007)', backdropFilter: 'blur(10px)', border: '1px solid var(--gold)', borderRadius: '12px', padding: '1.5rem 1.5rem', boxShadow: '0 0 16px rgba(223, 177, 75, 0.35)', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: 'linear-gradient(to bottom, #d4af37, #aa8529)' }}></div>
                <div>
                  <div style={{ color: 'var(--gold)', fontSize: '1.8rem', marginBottom: '0.5rem' }}>🎫</div>
                  <h4 style={{ color: 'var(--gold)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem', fontWeight: 700 }}>Register Now</h4>
                  <div style={{ color: '#fff', fontSize: '1.6rem', fontWeight: 800, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                    {tournament.entryFee ? (
                      <>
                        ${tournament.entryFee} 
                        {tournament.originalPrice && tournament.originalPrice > tournament.entryFee && (
                           <s style={{ color: '#a0aab2', fontSize: '0.5em', fontWeight: 400 }}>${tournament.originalPrice}</s>
                        )}
                      </>
                    ) : 'TBD'}
                  </div>
                </div>
                
                <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '0.8rem', marginTop: '1.5rem' }}>
                  {hostHasStripe && tournament.entryFee ? (
                    <StripeCheckoutButton tournamentId={tournament.id} entryFee={tournament.entryFee} />
                  ) : (
                    <div style={{ color: 'var(--mist)', fontSize: '0.85rem', fontStyle: 'italic', textAlign: 'center', padding: '0.8rem', border: '1px dashed rgba(255,255,255,0.1)', borderRadius: '6px' }}>Host Setup Pending</div>
                  )}
                </div>
              </div>

              {/* CTA 2: SUPPORT THE CAUSE */}
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', background: 'linear-gradient(145deg, rgba(16,36,20,0.98), #051007)', backdropFilter: 'blur(10px)', border: '1px solid var(--gold)', borderRadius: '12px', padding: '1.5rem 1.5rem', boxShadow: '0 0 16px rgba(223, 177, 75, 0.35)', position: 'relative', overflow: 'hidden', opacity: (!tournament.isCharity && !tournament.acceptsDonations) ? 0.6 : 1 }}>
                <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: 'linear-gradient(to bottom, #d4af37, #aa8529)' }}></div>
                <div>
                  <div style={{ color: 'var(--gold)', fontSize: '1.8rem', marginBottom: '0.5rem' }}>🎗️</div>
                  <h4 style={{ color: 'var(--gold)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem', fontWeight: 700 }}>Support The Cause</h4>
                  <div style={{ color: '#fff', fontSize: '1rem', fontWeight: 600, marginBottom: '0.5rem', minHeight: '30px' }}>
                    {tournament.charityName || 'General Donation'}
                  </div>
                </div>
                
                <div style={{ width: '100%', marginTop: '1.5rem' }}>
                  {tournament.acceptsDonations && hostHasStripe ? (
                    <Link href={`/tournaments/${tournament.id}/donate`} style={{ display: 'block', width: '100%', textAlign: 'center', padding: '0.9rem 1.5rem', fontSize: '1rem', borderRadius: '8px', color: '#000', background: 'linear-gradient(135deg, #d4af37, #aa8529)', border: '1px solid rgba(255,255,255,0.4)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', boxShadow: '0 8px 25px rgba(212,175,55,0.3)', textDecoration: 'none' }}>
                      Donate Now ❤️
                    </Link>
                  ) : (
                    <div style={{ color: 'var(--mist)', fontSize: '0.85rem', fontStyle: 'italic', textAlign: 'center', padding: '1.2rem 1rem', border: '1px dashed rgba(255,255,255,0.1)', borderRadius: '6px' }}>Not Accepted</div>
                  )}
                </div>
              </div>

              {/* CTA 3: SPONSORSHIPS */}
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', background: 'linear-gradient(145deg, rgba(16,36,20,0.98), #051007)', backdropFilter: 'blur(10px)', border: '1px solid var(--gold)', borderRadius: '12px', padding: '1.5rem 1.5rem', boxShadow: '0 0 16px rgba(223, 177, 75, 0.35)', position: 'relative', overflow: 'hidden', opacity: (tiers.length === 0) ? 0.6 : 1 }}>
                <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: 'linear-gradient(to bottom, #d4af37, #aa8529)' }}></div>
                <div>
                  <div style={{ color: 'var(--gold)', fontSize: '1.8rem', marginBottom: '0.5rem' }}>🤝</div>
                  <h4 style={{ color: 'var(--gold)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem', fontWeight: 700 }}>Become a Sponsor</h4>
                  <div style={{ color: '#fff', fontSize: '1rem', fontWeight: 600, marginBottom: '0.5rem', minHeight: '30px' }}>
                    Premium Branding
                  </div>
                </div>

                <div style={{ width: '100%', marginTop: '1.5rem' }}>
                  {tiers.length > 0 && hostHasStripe ? (
                    <Link href={`/tournaments/${tournament.id}/sponsor`} style={{ display: 'block', width: '100%', textAlign: 'center', padding: '0.9rem 1.5rem', fontSize: '1rem', borderRadius: '8px', color: '#000', background: 'linear-gradient(135deg, #d4af37, #aa8529)', border: '1px solid rgba(255,255,255,0.4)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', boxShadow: '0 8px 25px rgba(212,175,55,0.3)', textDecoration: 'none' }}>
                      View Sponsor Tiers
                    </Link>
                  ) : (
                    <div style={{ color: 'var(--mist)', fontSize: '0.85rem', fontStyle: 'italic', textAlign: 'center', padding: '1.2rem 1rem', border: '1px dashed rgba(255,255,255,0.1)', borderRadius: '6px' }}>Sponsorships Closed</div>
                  )}
                </div>
              </div>

            </div>

            {/* ---------------- Primary Content Right Column ---------------- */}
            <div style={{ minWidth: 0, display: 'flex', flexDirection: 'column', gap: '4rem' }}>
              
              {/* CLAIM EVENT BRAND BANNER (Only if Unowned) */}
              {!tournament.hostUserId && (
                <div style={{ background: 'linear-gradient(135deg, rgba(10,31,13,0.95), rgba(26,46,26,0.85))', border: '1px solid var(--gold)', borderRadius: 'var(--radius-lg)', padding: '1.5rem 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '2rem', flexWrap: 'wrap', boxShadow: '0 0 16px rgba(223, 177, 75, 0.3)', position: 'relative', zIndex: 12 }}>
                  <div>
                    <h3 style={{ color: 'var(--gold)', fontSize: '1.2rem', marginBottom: '0.3rem', fontWeight: 600 }}>Are you the Tournament Director?</h3>
                    <p style={{ color: '#e0e5df', fontSize: '0.9rem', lineHeight: '1.4', maxWidth: '600px' }}>
                      Take ownership to securely manage registrations and collect payments instantly.
                    </p>
                  </div>
                  <Link href="/host" className="btn-primary" style={{ padding: '0.8rem 1.5rem', fontSize: '0.95rem', whiteSpace: 'nowrap', boxShadow: '0 8px 20px rgba(212,175,55,0.3)', background: 'linear-gradient(135deg, #d4af37, #aa8529)', color: '#000', fontWeight: 700, border: 'none' }}>
                    Claim Event 🚀
                  </Link>
                </div>
              )}

              {/* HOST PROFILE WELCOME */}
              {hostUser && (
                <div>
                  <h2 className="section-title" style={{ fontSize: '1.8rem', marginBottom: '1.5rem', color: 'var(--forest)' }}>Meet Your Host</h2>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', padding: '2.5rem', background: '#fff', borderRadius: '24px', border: '1px solid rgba(212,175,55,0.2)', boxShadow: '0 10px 40px rgba(0,0,0,0.03)' }}>
                    <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--gold), #aa8529)', color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 800, flexShrink: 0, boxShadow: '0 4px 15px rgba(212,175,55,0.3)' }}>
                      {hostUser.fullName.charAt(0)}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '0.9rem', color: 'var(--mist)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '0.4rem' }}>Tournament Director</div>
                      <h3 style={{ fontSize: '1.8rem', color: 'var(--ink)', fontWeight: 700, marginBottom: '0.5rem' }}>{hostUser.fullName}</h3>
                      <p style={{ color: 'var(--mist)', fontSize: '1rem', lineHeight: '1.5', maxWidth: '500px' }}>
                        Welcome to {tournament.name}! We're incredibly excited to host you. Please reach out if you have any questions.
                      </p>
                    </div>
                    <div>
                      {hostUser.email && (
                        <ContactHostModal tournamentId={tournament.id} />
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* EVENT SPECS */}
              <div className="mobile-pad mobile-gap" style={{ background: '#fff', border: '1px solid rgba(223, 177, 75, 0.4)', borderRadius: '24px', padding: '2.5rem', boxShadow: '0 0 16px rgba(223, 177, 75, 0.15)', display: 'flex', flexWrap: 'wrap', gap: '3rem' }}>
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--mist)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>Format</div>
                  <div style={{ fontSize: '1.1rem', color: 'var(--ink)', fontWeight: 600, marginTop: '0.2rem' }}>{tournament.format || 'Standard'}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--mist)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>Holes</div>
                  <div style={{ fontSize: '1.1rem', color: 'var(--ink)', fontWeight: 600, marginTop: '0.2rem' }}>{tournament.holes || 18} Hole Event</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--mist)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>Availability</div>
                  <div style={{ fontSize: '1.1rem', color: 'var(--grass)', fontWeight: 700, marginTop: '0.2rem' }}>{tournament.spotsRemaining !== null ? `${tournament.spotsRemaining} Spots Left` : 'Open Field'}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--mist)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>Access</div>
                  <div style={{ fontSize: '1.1rem', color: 'var(--ink)', fontWeight: 600, marginTop: '0.2rem' }}>{tournament.isPrivate ? 'Private' : 'Public'}</div>
                </div>
                {tournament.sourceUrl && (
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <a href={tournament.sourceUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--mist)', fontSize: '0.9rem', textDecoration: 'underline', fontWeight: 500 }}>
                      Original Listing ↗
                    </a>
                  </div>
                )}
              </div>

              {/* OVERVIEW & SCHEDULE CONTENT */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '3.5rem' }}>
                
                {/* 1. Main Overview */}
                <div className="mobile-pad" style={{ background: '#fff', padding: '3rem', borderRadius: '24px', border: '1px solid rgba(0,0,0,0.05)', boxShadow: '0 15px 40px rgba(0,0,0,0.02)' }}>
                  <h2 style={{ fontSize: '1.8rem', marginBottom: '1.5rem', color: 'var(--forest)', fontWeight: 800, fontFamily: "'Playfair Display', serif" }}>Event Overview</h2>
                  <div style={{ fontSize: '1.15rem', lineHeight: '1.9', color: 'var(--ink)' }}>
                    {tournament.description ? (
                      <p style={{ whiteSpace: 'pre-line' }}>{tournament.description}</p>
                    ) : (
                      <p style={{ fontStyle: 'italic', color: 'var(--mist)' }}>Join us for an incredible day of golf, networking, and competition. This premium event features a fully catered breakfast, 18 holes of championship golf, and an evening awards reception. Secure your foursome today before the field fills up!</p>
                    )}
                  </div>
                </div>

                {/* 2. Schedule of Events */}
                <div className="mobile-pad" style={{ background: '#fff', padding: '3rem', borderRadius: '24px', border: '1px solid rgba(0,0,0,0.05)', boxShadow: '0 15px 40px rgba(0,0,0,0.02)' }}>
                  <h2 style={{ fontSize: '1.8rem', marginBottom: '2rem', color: 'var(--forest)', fontWeight: 800, fontFamily: "'Playfair Display', serif" }}>Tournament Schedule</h2>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', position: 'relative' }}>
                    <div className="nav-accent-line" style={{ position: 'absolute', left: '2rem', top: '1rem', bottom: '1rem', width: '2px', height: 'auto', opacity: 0.6 }}></div>
                    
                    {(parsedSchedule || [
                      { time: '8:00 AM', event: 'Registration & Breakfast' },
                      { time: '10:00 AM', event: 'Shotgun Start' },
                      { time: '4:30 PM', event: 'Dinner & Awards Reception' },
                    ]).map((item: any, idx: number) => {
                      
                      // Auto-resolve icons based on keywords
                      let icon = '🕒';
                      const lowerEvent = (item.event || '').toLowerCase();
                      if (lowerEvent.includes('golf') || lowerEvent.includes('shotgun') || lowerEvent.includes('tee')) icon = '⛳';
                      else if (lowerEvent.includes('dinner') || lowerEvent.includes('lunch') || lowerEvent.includes('breakfast') || lowerEvent.includes('food')) icon = '🍽️';
                      else if (lowerEvent.includes('award') || lowerEvent.includes('prize') || lowerEvent.includes('ceremony')) icon = '🏆';
                      else if (lowerEvent.includes('drink') || lowerEvent.includes('cocktail') || lowerEvent.includes('bar')) icon = '🍸';
                      else if (lowerEvent.includes('registration') || lowerEvent.includes('check-in') || lowerEvent.includes('sign')) icon = '📋';

                      return (
                      <div key={idx} style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start', position: 'relative', zIndex: 1 }}>
                        <div style={{ width: '4rem', height: '4rem', background: '#fff', border: '2px solid var(--gold)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem', flexShrink: 0 }}>
                          {item.icon || icon}
                        </div>
                        <div style={{ paddingTop: '0.8rem' }}>
                          <div style={{ fontSize: '1rem', color: 'var(--mist)', fontWeight: 700, fontFamily: "'DM Mono', monospace", marginBottom: '0.2rem' }}>{item.time}</div>
                          <div style={{ fontSize: '1.25rem', color: 'var(--ink)', fontWeight: 700 }}>{item.event}</div>
                        </div>
                      </div>
                      );
                    })}
                  </div>
                </div>

                {/* 3. Included & Prizes */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                  
                  <div className="mobile-pad" style={{ background: '#f8faf9', padding: '2.5rem', borderRadius: '24px', border: '1px solid rgba(0,0,0,0.05)' }}>
                    <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🛍️</div>
                    <h3 style={{ fontSize: '1.4rem', color: 'var(--forest)', fontWeight: 800, marginBottom: '1rem' }}>What's Included</h3>
                    <ul style={{ listStylePosition: 'outside', marginLeft: '1rem', fontSize: '1.05rem', lineHeight: '1.8', color: 'var(--ink)' }}>
                      {tournament.includes ? (
                        tournament.includes.split('\n').filter(Boolean).map((inc: string, i: number) => <li key={i}>{inc.replace(/^- /, '')}</li>)
                      ) : (
                        <li style={{ color: 'var(--mist)', fontStyle: 'italic' }}>Standard tournament inclusions apply.</li>
                      )}
                    </ul>
                  </div>

                  <div className="mobile-pad" style={{ background: '#f8faf9', padding: '2.5rem', borderRadius: '24px', border: '1px solid rgba(0,0,0,0.05)' }}>
                    <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🥇</div>
                    <h3 style={{ fontSize: '1.4rem', color: 'var(--forest)', fontWeight: 800, marginBottom: '1rem' }}>Contests & Prizes</h3>
                    <ul style={{ listStylePosition: 'outside', marginLeft: '1rem', fontSize: '1.05rem', lineHeight: '1.8', color: 'var(--ink)' }}>
                      {parsedPrizes && parsedPrizes.length > 0 ? (
                        parsedPrizes.map((prize: string, i: number) => <li key={i}>{prize}</li>)
                      ) : (
                        <li style={{ fontStyle: 'italic', color: 'var(--mist)' }}>Prizes to be determined. Contact host for details.</li>
                      )}
                    </ul>
                  </div>

                  <div className="mobile-pad" style={{ background: '#f8faf9', padding: '2.5rem', borderRadius: '24px', border: '1px solid rgba(0,0,0,0.05)' }}>
                    <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🤝</div>
                    <h3 style={{ fontSize: '1.4rem', color: 'var(--forest)', fontWeight: 800, marginBottom: '1rem' }}>Event Sponsors</h3>
                    <ul style={{ listStylePosition: 'outside', marginLeft: '1rem', fontSize: '1.05rem', lineHeight: '1.8', color: 'var(--ink)' }}>
                      {parsedSponsors && parsedSponsors.length > 0 ? (
                        parsedSponsors.map((sponsor: string, i: number) => <li key={i}>{sponsor}</li>)
                      ) : (
                        <li style={{ fontStyle: 'italic', color: 'var(--mist)' }}>Partnerships pending. Contact host to sponsor.</li>
                      )}
                    </ul>
                  </div>
                </div>

              </div>

            </div>
            
          </div>
        </div>
      </div>
    </>
  );
}
