import React from 'react';
import { getTournamentById, db, stripe_accounts, users, sponsorship_tiers } from '@/lib/db';
import { eq } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import ContactHostWidget from '@/components/tournaments/ContactHostWidget';
import StripeCheckoutButton from './StripeCheckoutButton';

const getHeroImage = () => {
  return 'https://images.unsplash.com/photo-1593111774240-d529f12cb416?q=80&w=2070&auto=format&fit=crop';
};

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

  let hostUser = null;
  let hostHasStripe = false;
  if (tournament.hostUserId) {
    const hData = await db.select().from(users).where(eq(users.id, tournament.hostUserId)).limit(1);
    hostUser = hData[0];

    const hostStripeRow = await db.select()
      .from(stripe_accounts)
      .where(eq(stripe_accounts.userId, tournament.hostUserId))
      .limit(1);
      
    if (hostStripeRow[0]?.chargesEnabled) {
      hostHasStripe = true;
    }
  }

  const tiers = await db.select().from(sponsorship_tiers).where(eq(sponsorship_tiers.tournamentId, tournamentId));

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "TBD";
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' });
  };

  const heroImage = getHeroImage();

  return (
    <>
      <div style={{ position: 'relative', minHeight: '60vh', padding: '8rem 0 0 0', display: 'flex', alignItems: 'flex-end', paddingBottom: '6rem', overflow: 'hidden' }}>
        {/* Base Image Layer */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundImage: `url('${heroImage}')`, backgroundSize: 'cover', backgroundPosition: 'center 30%', zIndex: -3 }}></div>
        
        {/* Dynamic Gradient Array mimicking the Homepage Premium feel */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundImage: 'linear-gradient(to right, rgba(7, 21, 16, 0.95) 0%, rgba(7, 21, 16, 0.75) 40%, rgba(7, 21, 16, 0.4) 100%), linear-gradient(to top, rgba(7, 21, 16, 1) 0%, transparent 40%)', zIndex: -2 }}></div>
        
        {/* Gold Light Flare */}
        <div style={{ position: 'absolute', top: '10%', right: '15%', width: '35vw', height: '35vw', background: 'radial-gradient(circle, rgba(201,168,76,0.18) 0%, transparent 70%)', borderRadius: '50%', filter: 'blur(30px)', zIndex: -1, pointerEvents: 'none' }}></div>
        
        {/* Subtle grid pattern for texture */}
        <div style={{ position: 'absolute', inset: 0, opacity: 0.03, backgroundImage: 'linear-gradient(rgba(78,201,160,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(78,201,160,0.4) 1px, transparent 1px)', backgroundSize: '60px 60px', zIndex: -1 }}></div>
        
        <div className="section-wrapper" style={{ width: '100%', position: 'relative', zIndex: 1 }}>
          <h1 className="hero-headline" style={{ fontSize: 'clamp(2.5rem, 4.5vw, 4.5rem)', marginBottom: '1rem', textShadow: '0 4px 30px rgba(0,0,0,0.8)', maxWidth: '1000px', lineHeight: '1.05' }}>
            {tournament.name}
          </h1>
          <div className="hero-sub" style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap', alignItems: 'center', textShadow: '0 2px 15px rgba(0,0,0,0.8)', color: '#f8faf9', marginTop: '1.5rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '1.05rem', fontWeight: 500, background: 'rgba(255,255,255,0.06)', padding: '0.6rem 1.25rem', borderRadius: '50px', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.12)' }}>
              <span style={{ color: 'var(--gold)', fontSize: '1.2rem' }}>📍</span> {tournament.courseName}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '1.05rem', fontWeight: 500, background: 'rgba(255,255,255,0.06)', padding: '0.6rem 1.25rem', borderRadius: '50px', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.12)' }}>
              <span style={{ color: 'var(--gold)', fontSize: '1.2rem' }}>🗓️</span> {formatDate(tournament.dateStart)}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '1.05rem', fontWeight: 500, background: 'rgba(255,255,255,0.06)', padding: '0.6rem 1.25rem', borderRadius: '50px', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.12)' }}>
              <span style={{ color: 'var(--gold)', fontSize: '1.2rem' }}>⛳</span> {tournament.format || '18 Hole Round'}
            </span>
          </div>
        </div>
      </div>

      <div style={{ background: 'linear-gradient(180deg, rgba(10,31,13,1) 0%, #f8faf9 15rem)', position: 'relative', zIndex: 10, paddingBottom: '6rem' }}>
        
        <div className="section-wrapper" style={{ paddingTop: '0' }}>
          
          {/* ---------------- 3 PREMIUM CTAS ROW ---------------- */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', transform: 'translateY(-3rem)' }}>
            
            {/* CTA 1: REGISTER NOW */}
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', background: 'linear-gradient(145deg, rgba(26,46,26,0.95), rgba(10,31,13,0.98))', backdropFilter: 'blur(10px)', border: '1px solid rgba(212,175,55,0.4)', borderRadius: '16px', padding: '2.5rem 2rem', boxShadow: '0 20px 40px rgba(0,0,0,0.2)', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: 'linear-gradient(to bottom, #d4af37, #aa8529)' }}></div>
              <div>
                <div style={{ color: 'var(--gold)', fontSize: '2.5rem', marginBottom: '1rem' }}>🎫</div>
                <h4 style={{ color: 'var(--gold)', fontSize: '1.1rem', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '0.5rem', fontWeight: 700 }}>Register Now</h4>
                <div style={{ color: '#fff', fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                  {tournament.entryFee ? (
                    <>
                      ${tournament.entryFee} 
                      {tournament.originalPrice && tournament.originalPrice > tournament.entryFee && (
                         <s style={{ color: '#a0aab2', fontSize: '0.5em', fontWeight: 400 }}>${tournament.originalPrice}</s>
                      )}
                    </>
                  ) : 'TBD'}
                </div>
                <p style={{ color: 'var(--mist)', fontSize: '0.9rem', marginBottom: '2rem', lineHeight: '1.5' }}>Secure your team's spot on the green before registration closes.</p>
              </div>
              
              <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                {hostHasStripe && tournament.entryFee ? (
                  <>
                    <StripeCheckoutButton tournamentId={tournament.id} entryFee={tournament.entryFee} />
                    {tournament.allowOfflinePayment && (
                      <Link href={`/tournaments/${tournament.id}/offline-register`} style={{ display: 'block', width: '100%', textAlign: 'center', padding: '0.8rem', fontSize: '0.9rem', borderRadius: '8px', border: '1px solid rgba(212,175,55,0.3)', color: 'var(--gold)', fontWeight: 600, transition: 'all 0.2s', textDecoration: 'none' }}>
                          Pay Cash On-Site
                      </Link>
                    )}
                  </>
                ) : tournament.registrationUrl ? (
                  <a href={tournament.registrationUrl} target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ width: '100%', textAlign: 'center', padding: '1rem', fontSize: '1rem', borderRadius: '8px' }}>
                    External Register ↗
                  </a>
                ) : (
                  <div style={{ color: 'var(--mist)', fontSize: '0.9rem', fontStyle: 'italic', textAlign: 'center', padding: '1rem', border: '1px dashed rgba(255,255,255,0.1)', borderRadius: '8px' }}>Pending Setup</div>
                )}
              </div>
            </div>

            {/* CTA 2: SUPPORT THE CAUSE */}
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', background: 'linear-gradient(145deg, rgba(26,46,26,0.95), rgba(10,31,13,0.98))', backdropFilter: 'blur(10px)', border: '1px solid rgba(212,175,55,0.4)', borderRadius: '16px', padding: '2.5rem 2rem', boxShadow: '0 20px 40px rgba(0,0,0,0.2)', position: 'relative', overflow: 'hidden', opacity: (!tournament.isCharity && !tournament.acceptsDonations) ? 0.6 : 1 }}>
              <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: 'linear-gradient(to bottom, #d4af37, #aa8529)' }}></div>
              <div>
                <div style={{ color: 'var(--gold)', fontSize: '2.5rem', marginBottom: '1rem' }}>🎗️</div>
                <h4 style={{ color: 'var(--gold)', fontSize: '1.1rem', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '0.5rem', fontWeight: 700 }}>Support The Cause</h4>
                <div style={{ color: '#fff', fontSize: '1.2rem', fontWeight: 600, marginBottom: '0.5rem', minHeight: '35px' }}>
                  {tournament.charityName || 'General Donation'}
                </div>
                <p style={{ color: 'var(--mist)', fontSize: '0.9rem', marginBottom: '2rem', lineHeight: '1.5' }}>
                  {tournament.isCharity ? "100% of proceeds directly impact our beneficiary foundation." : "Can't make the tournament? You can still show your support!"}
                </p>
              </div>
              
              <div style={{ width: '100%' }}>
                {tournament.acceptsDonations ? (
                  <Link href={`/tournaments/${tournament.id}/donate`} className="btn-hero-outline" style={{ display: 'block', width: '100%', textAlign: 'center', padding: '1rem', fontSize: '1rem', borderRadius: '8px', color: '#000', background: 'var(--gold)', border: 'none', fontWeight: 700 }}>
                    Donate Now ❤️
                  </Link>
                ) : (
                  <div style={{ color: 'var(--mist)', fontSize: '0.9rem', fontStyle: 'italic', textAlign: 'center', padding: '1rem', border: '1px dashed rgba(255,255,255,0.1)', borderRadius: '8px' }}>Not Accepted</div>
                )}
              </div>
            </div>

            {/* CTA 3: SPONSORSHIPS */}
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', background: 'linear-gradient(145deg, rgba(26,46,26,0.95), rgba(10,31,13,0.98))', backdropFilter: 'blur(10px)', border: '1px solid rgba(212,175,55,0.4)', borderRadius: '16px', padding: '2.5rem 2rem', boxShadow: '0 20px 40px rgba(0,0,0,0.2)', position: 'relative', overflow: 'hidden', opacity: (tiers.length === 0) ? 0.6 : 1 }}>
              <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: 'linear-gradient(to bottom, #d4af37, #aa8529)' }}></div>
              <div>
                <div style={{ color: 'var(--gold)', fontSize: '2.5rem', marginBottom: '1rem' }}>🤝</div>
                <h4 style={{ color: 'var(--gold)', fontSize: '1.1rem', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '0.5rem', fontWeight: 700 }}>Become a Sponsor</h4>
                <div style={{ color: '#fff', fontSize: '1.2rem', fontWeight: 600, marginBottom: '0.5rem', minHeight: '35px' }}>
                  Premium Branding
                </div>
                <p style={{ color: 'var(--mist)', fontSize: '0.9rem', marginBottom: '2rem', lineHeight: '1.5' }}>
                  Elevate your brand with digital corporate displays and on-course signage.
                </p>
              </div>

              <div style={{ width: '100%' }}>
                {tiers.length > 0 ? (
                  <Link href={`/tournaments/${tournament.id}/sponsor`} className="btn-hero-outline" style={{ display: 'block', width: '100%', textAlign: 'center', padding: '1rem', fontSize: '1rem', borderRadius: '8px', borderColor: 'var(--gold)', color: 'var(--gold)', fontWeight: 600 }}>
                    View Sponsor Tiers
                  </Link>
                ) : (
                  <div style={{ color: 'var(--mist)', fontSize: '0.9rem', fontStyle: 'italic', textAlign: 'center', padding: '1rem', border: '1px dashed rgba(255,255,255,0.1)', borderRadius: '8px' }}>Sponsorships Closed</div>
                )}
              </div>
            </div>

          </div>

          <style dangerouslySetInnerHTML={{__html: `
            .t-layout-grid {
              display: grid;
              grid-template-columns: 1fr 350px;
              gap: 4rem;
              align-items: start;
              margin-top: 2rem;
            }
            @media (max-width: 1000px) {
              .t-layout-grid {
                grid-template-columns: 1fr;
              }
            }
          `}} />

          <div className="t-layout-grid">
            
            {/* ---------------- Primary Content Left Column ---------------- */}
            <div style={{ minWidth: 0, display: 'flex', flexDirection: 'column', gap: '4rem' }}>
              
              {/* CLAIM EVENT BRAND BANNER (Only if Unowned) */}
              {!tournament.hostUserId && (
                <div style={{ background: 'linear-gradient(135deg, rgba(10,31,13,0.95), rgba(26,46,26,0.85))', border: '1px solid rgba(212,175,55,0.6)', borderRadius: 'var(--radius-lg)', padding: '2.5rem 3.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '2rem', flexWrap: 'wrap', boxShadow: '0 15px 40px rgba(0,0,0,0.1)' }}>
                  <div>
                    <h3 style={{ color: 'var(--gold)', fontSize: '1.6rem', marginBottom: '0.5rem', fontWeight: 600 }}>Are you the Tournament Director?</h3>
                    <p style={{ color: '#e0e5df', fontSize: '1rem', lineHeight: '1.6', maxWidth: '600px' }}>
                      Take ownership of your event. Claim this tournament to securely manage player registrations, execute automated blind-draw flighting, and collect gateway payments instantly.
                    </p>
                  </div>
                  <Link href="/host" className="btn-primary" style={{ padding: '1.2rem 2.5rem', fontSize: '1.1rem', whiteSpace: 'nowrap', boxShadow: '0 8px 30px rgba(212,175,55,0.4)', background: 'linear-gradient(135deg, #d4af37, #aa8529)', color: '#000', fontWeight: 700, border: 'none' }}>
                    Claim Your Event 🚀
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
                      <ContactHostWidget tournament={tournament as any} />
                    </div>
                  </div>
                </div>
              )}

              {/* OVERVIEW CONTENT */}
              <div>
                <h2 className="section-title" style={{ fontSize: '1.8rem', marginBottom: '1.5rem', color: 'var(--forest)' }}>Event Overview</h2>
                <div style={{ fontSize: '1.15rem', lineHeight: '1.9', color: 'var(--ink)' }}>
                  {tournament.description ? (
                    <p style={{ whiteSpace: 'pre-line' }}>{tournament.description}</p>
                  ) : (
                    <p style={{ fontStyle: 'italic', color: 'var(--mist)' }}>No description provided for this event.</p>
                  )}
                </div>
              </div>

              {/* INCLUDES BLOCK */}
              {tournament.includes && (
                <div>
                  <h2 className="section-title" style={{ fontSize: '1.8rem', marginBottom: '1.5rem', color: 'var(--forest)' }}>What&apos;s Included</h2>
                  <div style={{ background: '#fff', padding: '2.5rem', borderRadius: '24px', border: '1px solid rgba(26,46,26,0.05)', boxShadow: '0 10px 40px rgba(0,0,0,0.02)' }}>
                    <ul style={{ listStylePosition: 'inside', fontSize: '1.15rem', lineHeight: '1.9', color: 'var(--ink)', whiteSpace: 'pre-line', margin: 0 }}>
                      {tournament.includes}
                    </ul>
                  </div>
                </div>
              )}

            </div>


            {/* ---------------- Sidebar Properties Column ---------------- */}
            <div style={{ position: 'sticky', top: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              
              {/* Event Details Card */}
              <div style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.06)', borderRadius: '24px', padding: '2.5rem', boxShadow: '0 20px 40px rgba(0,0,0,0.03)' }}>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '2rem', color: 'var(--forest)', borderBottom: '2px solid rgba(0,0,0,0.05)', paddingBottom: '1rem' }}>Event Specs</h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
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
                    <div style={{ paddingTop: '1.5rem', borderTop: '1px solid rgba(0,0,0,0.05)' }}>
                      <a href={tournament.sourceUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--mist)', fontSize: '0.9rem', textDecoration: 'underline', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        Original Listing ↗
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </>
  );
}

