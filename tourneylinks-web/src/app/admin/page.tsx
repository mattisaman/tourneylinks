import React from 'react';
import Link from 'next/link';
import { db, registrations, tournaments, users, stripe_accounts } from '@/lib/db';
import { eq, desc } from 'drizzle-orm';
import { getCurrentUser } from '@/lib/auth-util';
import { redirect } from 'next/navigation';
import FlightBuilder from '@/components/admin/FlightBuilder';
import TournamentQRCode from '@/components/admin/TournamentQRCode';
import SponsorManager from '@/components/admin/SponsorManager';
import RoundManager from '@/components/admin/RoundManager';
import ShotgunAssigner from '@/components/admin/ShotgunAssigner';
import LiveTelemetry from '@/components/admin/LiveTelemetry';
import ScorecardVisionScanner from '@/components/admin/ScorecardVisionScanner';
import CourseGPSMapper from '@/components/admin/CourseGPSMapper';
import StripeConnectWidget from '@/components/admin/StripeConnectWidget';
import ScrambleStoreManager from '@/components/admin/ScrambleStoreManager';
import AdminSidebar from '@/components/admin/AdminSidebar';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  const clerkUser = await getCurrentUser();
  if (!clerkUser) redirect('/sign-in');

  const dbUserRow = await db.select().from(users).where(eq(users.clerkId, clerkUser.id)).limit(1);
  const dbUser = dbUserRow[0];
  if (!dbUser) redirect('/sign-in');

  // ENFORCE REQUIRED STRIPE ONBOARDING (Phase 9)
  const accountRow = await db.select().from(stripe_accounts).where(eq(stripe_accounts.userId, dbUser.id)).limit(1);
  const existingAccount = accountRow[0];
  // TEMPORARIALLY DISABLED FOR STAGING QA
  // if (!existingAccount || !existingAccount.chargesEnabled || !existingAccount.payoutsEnabled) {
  //   redirect('/host/onboarding');
  // }

  // Enforce IDOR protection on the root admin dashboard too, unless in Sandbox demo
  let tourneys = [];
  if (process.env.NODE_ENV === 'production') {
     tourneys = await db.select().from(tournaments).where(eq(tournaments.hostUserId, dbUser.id)).limit(1);
  } else {
     tourneys = await db.select().from(tournaments).limit(1);
  }
     
  const tournamentId = tourneys.length > 0 ? tourneys[0].id : -1;
  const tourney = tourneys.length > 0 ? tourneys[0] : null;

  const allRegs = await db.select()
    .from(registrations)
    .where(eq(registrations.tournamentId, tournamentId))
    .orderBy(desc(registrations.createdAt));

  // PARTITION TEAMS FOR FLIGHT BUILDER
  let finalTeamsMap: Record<number, any[]> = {};
  allRegs.forEach(r => {
    if (r.assignedTeam) {
       if (!finalTeamsMap[r.assignedTeam]) finalTeamsMap[r.assignedTeam] = [];
       finalTeamsMap[r.assignedTeam].push(r);
    }
  });

  let finalTourney = tourney;
  let finalRegs = allRegs;
  let displayAvgHcp = finalRegs.length > 0 
    ? (finalRegs.reduce((a, b) => a + (b.handicap || 0), 0) / finalRegs.length).toFixed(1) 
    : '0.0';
  let displayRevenue = finalRegs.length * 150;
  let mockTournaments = [{ id: tournamentId, name: tourney?.name || 'Tournament' }];

  if (process.env.NEXT_PUBLIC_IS_DEMO === 'true') {
     // Mock robust data
     finalTourney = { ...tourney, name: 'The Lighthouse Charity Scramble', dateStart: new Date(Date.now() + 864000000).toISOString(), courseName: 'Pebble Beach Golf Links' } as any;
     mockTournaments = [
        { id: 991, name: 'Lakewood Classic' },
        { id: tournamentId, name: 'The Lighthouse Scramble' },
     ];

     const demoRegs = [
        { id: 101, name: 'Michael Jordan', email: 'mj23@jumpman.com', handicap: 2.1, paymentStatus: 'Completed', assignedTeam: 1, startingHole: 1 },
        { id: 102, name: 'Tiger Woods', email: 'tiger@woods.com', handicap: 0.0, paymentStatus: 'Completed', assignedTeam: 1, startingHole: 1 },
        { id: 103, name: 'Stacy Lewis', email: 'stacy@lpga.com', handicap: 1.4, paymentStatus: 'Pending', assignedTeam: null, pairingRequest: 'Jordan' },
        { id: 104, name: 'Phil Mickelson', email: 'phil@lefty.com', handicap: 0.4, paymentStatus: 'Completed', assignedTeam: 2, startingHole: 2 },
        { id: 105, name: 'Rory McIlroy', email: 'rory@pga.com', handicap: -1.2, paymentStatus: 'Completed', assignedTeam: 2, startingHole: 2 },
        { id: 106, name: 'Lexi Thompson', email: 'lexi@lpga.com', handicap: 0.8, paymentStatus: 'Completed', assignedTeam: null },
        { id: 107, name: 'Jordan Spieth', email: 'jordan@pga.com', handicap: 1.1, paymentStatus: 'Completed', assignedTeam: 3, startingHole: 4 },
        { id: 108, name: 'Rickie Fowler', email: 'rickie@pga.com', handicap: 0.5, paymentStatus: 'Completed', assignedTeam: 3, startingHole: 4 },
     ];
     // Add 136 blank registrants to make the KPI "144" without lagging the UI
     const fillerRegs = Array.from({length: 136}, (_, i) => ({ id: 500+i, name: `Player ${i+9}`, email: `p${i}@demo.com`, handicap: 5, paymentStatus: 'Completed' }));
     finalRegs = [...demoRegs, ...fillerRegs] as any[];
     displayAvgHcp = '4.2';
     displayRevenue = 21600;

     finalTeamsMap = {
        1: [demoRegs[0], demoRegs[1]],
        2: [demoRegs[3], demoRegs[4]],
        3: [demoRegs[6], demoRegs[7]]
     };
  }

  return (
    <div style={{ minHeight: 'calc(100vh - 80px)', paddingTop: '90px' }}>
      <div className="dashboard-wrap" style={{ minHeight: '100%' }}>
        {/* ScrollSpy Sidebar Engine */}
        <AdminSidebar tournamentId={tournamentId} mockTournaments={mockTournaments} />

        {/* Main Content */}
        <div className="dash-main">
          <div className="dash-header">
            <div>
              <div className="dash-greeting">{finalTourney ? finalTourney.name : 'Unknown Tournament'}</div>
              <div className="dash-date">{finalTourney ? `${new Date(finalTourney.dateStart).toLocaleDateString()} · ${finalTourney.courseName}` : 'Date TBD'}</div>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <Link href={`/host/crm?tournamentId=${tournamentId}`} className="btn-primary" style={{ background: 'rgba(212,175,55,0.1)', color: 'var(--gold)', border: '1px solid currentColor' }}>💼 Sponsor CRM Tracker</Link>
              <Link href={`/admin/tournaments/${tournamentId}/print`} className="btn-primary" style={{ background: '#000', color: '#fff', border: 'none' }}>🖨️ Print & Post Hub</Link>
              <Link href={`/host?tournamentId=${tournamentId}`} className="btn-ghost" style={{ color: 'var(--forest)', borderColor: 'rgba(26,46,26,0.2)' }}>✏️ Edit Campaign</Link>
              <button className="btn-primary">📢 Send Notification</button>
            </div>
          </div>

          {/* KPIs */}
          <div className="kpi-grid">
            <div className="kpi-card" style={{ padding: '1rem' }}>
              <div className="kpi-icon" style={{ width: '32px', height: '32px', fontSize: '1rem', marginBottom: '0.5rem' }}>👥</div>
              <div className="kpi-val" style={{ fontSize: '1.5rem' }}>{finalRegs.length}</div>
              <div className="kpi-label" style={{ fontSize: '0.7rem' }}>Registrants</div>
              <div className="kpi-change" style={{ fontSize: '0.65rem' }}>↑ {Math.max(finalRegs.length - 12, 0)} total players</div>
            </div>
            <div className="kpi-card" style={{ padding: '1rem' }}>
              <div className="kpi-icon" style={{ width: '32px', height: '32px', fontSize: '1rem', marginBottom: '0.5rem' }}>✅</div>
              <div className="kpi-val" style={{ fontSize: '1.5rem' }}>{finalRegs.length - 1}</div>
              <div className="kpi-label" style={{ fontSize: '0.7rem' }}>Paid</div>
              <div className="kpi-change" style={{ fontSize: '0.65rem' }}>1 pending payment</div>
            </div>
            <div className="kpi-card" style={{ padding: '1rem' }}>
              <div className="kpi-icon" style={{ width: '32px', height: '32px', fontSize: '1rem', marginBottom: '0.5rem' }}>💰</div>
              <div className="kpi-val" style={{ fontSize: '1.5rem' }}>${displayRevenue.toLocaleString()}</div>
              <div className="kpi-label" style={{ fontSize: '0.7rem' }}>Revenue Collected</div>
              <div className="kpi-change" style={{ fontSize: '0.65rem' }}>Based on $150 avg fee</div>
            </div>
            <div className="kpi-card" style={{ padding: '1rem' }}>
              <div className="kpi-icon" style={{ width: '32px', height: '32px', fontSize: '1rem', marginBottom: '0.5rem' }}>🏌️</div>
              <div className="kpi-val" style={{ fontSize: '1.5rem' }}>{displayAvgHcp}</div>
              <div className="kpi-label" style={{ fontSize: '0.7rem' }}>Avg Handicap</div>
              <div className="kpi-change" style={{ fontSize: '0.65rem' }}>Field Index Balance</div>
            </div>
          </div>

          <div className="dash-grid">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              
              {/* LIVE TOURNAMENT ACTION CENTER */}
              <LiveTelemetry tournamentId={tournamentId} showProLink={true} />

              {/* === DEMO ENVIRONMENT EXPLANATORY INJECTION === */}
              {process.env.NEXT_PUBLIC_IS_DEMO === 'true' && (
                  <div style={{ background: 'rgba(212, 175, 55, 0.05)', borderLeft: '4px solid var(--gold)', padding: '1.5rem', borderRadius: '4px' }}>
                      <h3 style={{ color: 'var(--gold)', fontWeight: 800, marginBottom: '0.5rem', fontSize: '1.1rem' }}>Demo Architecture: Unified Context Switching</h3>
                      <p style={{ color: 'var(--mist)', fontSize: '0.85rem', lineHeight: 1.6 }}>
                        Notice how you didn't have to create a separate "Host Account" to see this screen? In Production, TourneyLinks operates on a seamless Single-Identity Architecture. If a user plays golf on Saturday (Golfer), sponsors a hole on Sunday (Sponsor View), and runs a charity scramble on Monday (Host View), their singular profile instantly routes them to the correct dashboard based strictly on their underlying database relationships. No friction. No secondary accounts.
                      </p>
                  </div>
              )}

              {/* Registrants Table */}
              <div id="registrants" className="dash-card">
                <div className="dash-card-header">
                  <div className="dash-card-title">Registrants</div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <input 
                      placeholder="Search players..." 
                      style={{ padding: '0.4rem 0.75rem', border: '1px solid rgba(26,46,26,0.1)', borderRadius: '2px', fontSize: '0.8rem', outline: 'none', fontFamily: "'DM Sans', sans-serif" }} 
                    />
                    <button className="btn-primary" style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem' }}>Export CSV</button>
                  </div>
                </div>
                <div style={{ overflowX: 'auto', width: '100%', WebkitOverflowScrolling: 'touch' }}>
                <table className="registrant-table">
                  <thead>
                    <tr>
                      <th>Player</th>
                      <th>Handicap</th>
                      <th>Registered</th>
                      <th>Payment</th>
                      <th>Team</th>
                      <th>Start Hole</th>
                      <th></th>
                    </tr>
                  </thead>
                   <tbody>
                    {finalRegs.length === 0 ? (
                      <tr><td colSpan={6} style={{ textAlign: 'center', padding: '2rem', color: 'var(--mist)' }}>No registrants yet.</td></tr>
                    ) : (
                      finalRegs.slice(0, 8).map(reg => (
                        <tr key={reg.id}>
                          <td>
                            <div className="player-name">{reg.name}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--mist)' }}>{reg.email}</div>
                          </td>
                          <td><span className="player-hcp">{reg.handicap?.toFixed(1) || 'N/A'}</span></td>
                          <td style={{ fontSize: '0.8rem', color: 'var(--mist)' }}>Recent</td>
                          <td><span className={`status-pill status-${reg.paymentStatus?.toLowerCase() === 'completed' ? 'paid' : 'pending'}`}>{reg.paymentStatus}</span></td>
                          <td style={{ fontSize: '0.8rem' }}>
                            {reg.assignedTeam ? `Team ${reg.assignedTeam}` : (
                              <span style={{ color: 'var(--mist)', fontStyle: 'italic', fontSize: '0.75rem' }}>
                                {reg.pairingRequest ? `Requested: ${reg.pairingRequest}` : '—'}
                              </span>
                            )}
                          </td>
                          <td>
                            <ShotgunAssigner 
                               tournamentId={tournamentId} 
                               registrationId={reg.id} 
                               initialHole={reg.startingHole} 
                            />
                          </td>
                          <td><button style={{ background: 'none', border: 'none', color: 'var(--mist)', cursor: 'pointer', fontSize: '1rem' }}>⋯</button></td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
                </div>
              </div>

              {/* (Stripe Payment logic removed - Moved to /payments ledger) */}

              {/* Private Link Panel */}
              <div id="private-link" className="dash-card">
                <div className="dash-card-header">
                  <div className="dash-card-title">🔒 Private Pre-Launch Link</div>
                  <span className="status-pill status-pending" style={{ fontSize: '0.75rem' }}>Active</span>
                </div>
                <div style={{ padding: '1.5rem' }}>
                  <p style={{ fontSize: '0.875rem', color: 'var(--mist)', marginBottom: '1rem' }}>Share this private link with loyal players before going public.</p>
                  <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                    <input 
                      type="text" 
                      value="tourneylinks.com/t/lakewood-classic?private=abc123xyz" 
                      readOnly 
                      style={{ flex: 1, padding: '0.6rem 0.85rem', border: '1px solid rgba(26,46,26,0.12)', borderRadius: '2px', fontSize: '0.8rem', fontFamily: "'DM Mono', monospace", color: 'var(--mist)', background: '#fafaf5', outline: 'none' }} 
                    />
                    <button className="btn-primary" style={{ padding: '0.6rem 1rem', fontSize: '0.8rem' }}>Copy</button>
                  </div>
                </div>
              </div>

              {/* Phase 3: The Algorithmic Engine & Multi-Round UI */}
              <RoundManager tournamentId={tournamentId} />

              {/* Phase 2: Sponsor & Hole Integration */}
              <div id="sponsor">
                 <SponsorManager tournamentId={tournamentId} />
              </div>

              {/* Note: Geospatial tools extracted to Advanced Settings page */}
            </div>

            {/* Right Column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              
              {/* Print Station */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>
                 
                 <div className="dash-card">
                   <div className="dash-card-header">
                     <div className="dash-card-title">🖨️ The Print Station</div>
                   </div>
                   <div style={{ padding: '1.5rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                     <p style={{ fontSize: '0.85rem', color: 'var(--mist)', marginBottom: '1.25rem' }}>
                       Generate formatted, high-contrast Cart Signs, Team Pairings, Blank Scorecards, and Live Event QR Codes instantly.
                     </p>
                     
                     <div style={{ background: '#fafaf5', border: '1px dashed rgba(0,0,0,0.1)', padding: '1rem', borderRadius: '8px', marginBottom: '1.25rem', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
                        <div style={{ textAlign: 'left' }}>
                          <div style={{ fontWeight: 600, fontSize: '0.8rem' }}>Live Event QR Code</div>
                          <div style={{ fontSize: '0.7rem', color: 'var(--mist)' }}>Automatically included on Cart Signs.</div>
                        </div>
                        <img src={`https://api.qrserver.com/v1/create-qr-code/?size=60x60&data=https://tourneylinks.com/tournaments/${tournamentId}`} alt="QR" style={{ width: 60, height: 60, borderRadius: '4px' }} />
                     </div>

                     <Link href={`/admin/tournaments/${tournamentId}/print`} className="btn-primary" style={{ display: 'block', width: '100%', padding: '0.75rem', textDecoration: 'none' }}>
                       Open Print Station →
                     </Link>
                   </div>
                 </div>

                 {/* (Store config removed - moved to /store) */}
              </div>

              {/* Send Notification */}
              <div id="notifications" className="dash-card">
                <div className="dash-card-header">
                  <div className="dash-card-title">📢 Send Notification</div>
                </div>
                <div style={{ padding: '1.25rem' }}>
                  <div className="reg-field" style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--mist)', marginBottom: '0.4rem' }}>Send To</label>
                    <select style={{ width: '100%', padding: '0.6rem', border: '1px solid rgba(26,46,26,0.12)', borderRadius: '2px', fontFamily: "'DM Sans', sans-serif", fontSize: '0.85rem', outline: 'none' }}>
                      <option>All Registrants (68)</option>
                      <option>Paid Only (61)</option>
                      <option>Pending Payment (7)</option>
                      <option>Waitlist</option>
                    </select>
                  </div>
                  <div className="reg-field" style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--mist)', marginBottom: '0.4rem' }}>Channel</label>
                    <select style={{ width: '100%', padding: '0.6rem', border: '1px solid rgba(26,46,26,0.12)', borderRadius: '2px', fontFamily: "'DM Sans', sans-serif", fontSize: '0.85rem', outline: 'none' }}>
                      <option>Email + SMS</option>
                      <option>Email Only</option>
                      <option>SMS Only</option>
                      <option>WhatsApp</option>
                      <option>All Channels</option>
                    </select>
                  </div>
                  <div className="reg-field" style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--mist)', marginBottom: '0.4rem' }}>Message</label>
                    <textarea 
                      rows={4} 
                      style={{ width: '100%', padding: '0.6rem', border: '1px solid rgba(26,46,26,0.12)', borderRadius: '2px', fontFamily: "'DM Sans', sans-serif", fontSize: '0.85rem', outline: 'none', resize: 'vertical' }} 
                      placeholder="Reminder: Your tee time is 8:00 AM on June 14. Please arrive by 7:30 AM. Rules sheet attached..."
                    ></textarea>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button className="btn-primary" style={{ flex: 1, padding: '0.6rem' }}>Send Now</button>
                    <button className="btn-ghost" style={{ color: 'var(--forest)', borderColor: 'rgba(26,46,26,0.15)', padding: '0.6rem 0.75rem', fontSize: '0.8rem' }}>Schedule</button>
                  </div>
                </div>
              </div>

              {/* Flight Builder (AI React Client Component) */}
              <div id="flights">
                 <FlightBuilder tournamentId={tournamentId} teamsMap={finalTeamsMap} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
