import React from 'react';
import Link from 'next/link';
import { db, registrations, tournaments, users, stripe_accounts } from '@/lib/db';
import { eq, desc } from 'drizzle-orm';
import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import FlightBuilder from '@/components/admin/FlightBuilder';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  const clerkUser = await currentUser();
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

  // Hardcoded for the prototype to point to the first tournament matching our mock seed
  const tourneys = await db.select().from(tournaments).limit(1);
  const tournamentId = tourneys.length > 0 ? tourneys[0].id : 1;
  const tourney = tourneys.length > 0 ? tourneys[0] : null;

  const allRegs = await db.select()
    .from(registrations)
    .where(eq(registrations.tournamentId, tournamentId))
    .orderBy(desc(registrations.createdAt));

  // Partition teams
  const teamsMap: Record<number, typeof allRegs> = {};
  allRegs.forEach(r => {
    if (r.assignedTeam) {
       if (!teamsMap[r.assignedTeam]) teamsMap[r.assignedTeam] = [];
       teamsMap[r.assignedTeam].push(r);
    }
  });

  const avgHcp = allRegs.length > 0 
    ? (allRegs.reduce((a, b) => a + (b.handicap || 0), 0) / allRegs.length).toFixed(1) 
    : '0.0';

  const revenue = allRegs.length * 150; // Mock $150 entry fee

  return (
    <div style={{ minHeight: 'calc(100vh - 80px)' }}>
      <div className="dashboard-wrap" style={{ minHeight: '100%' }}>
        {/* Sidebar */}
        <div className="dash-sidebar">
          <div className="dash-logo">
            Tourney<span>Links</span> 
            <span style={{ fontSize: '0.7rem', background: 'rgba(201,168,76,0.2)', color: 'var(--gold)', padding: '0.15rem 0.4rem', borderRadius: '2px', fontFamily: "'DM Sans', sans-serif", marginLeft: '0.5rem' }}>
              Admin
            </span>
          </div>

          <div className="dash-section-label">My Tournaments</div>
          <div className="dash-nav-item active"><span className="dash-nav-icon">🏆</span> Lakewood Classic</div>
          <div className="dash-nav-item"><span className="dash-nav-icon">📋</span> All Tournaments</div>
          <Link href="/host" className="dash-nav-item" style={{ textDecoration: 'none' }}>
            <span className="dash-nav-icon">➕</span> Create New
          </Link>

          <div className="dash-section-label">Management</div>
          <div className="dash-nav-item"><span className="dash-nav-icon">👥</span> Registrants</div>
          <div className="dash-nav-item"><span className="dash-nav-icon">💳</span> Payments</div>
          <div className="dash-nav-item"><span className="dash-nav-icon">🏌️</span> Flight Builder</div>
          <div className="dash-nav-item"><span className="dash-nav-icon">📢</span> Send Notification</div>
          <div className="dash-nav-item"><span className="dash-nav-icon">⛳</span> Course Contact</div>

          <div className="dash-section-label">Settings</div>
          <div className="dash-nav-item"><span className="dash-nav-icon">🖼️</span> Branding & Logo</div>
          <div className="dash-nav-item"><span className="dash-nav-icon">🔒</span> Private Link</div>
          <div className="dash-nav-item"><span className="dash-nav-icon">💰</span> Stripe Payouts</div>
          <div className="dash-nav-item"><span className="dash-nav-icon">⚙️</span> Settings</div>
        </div>

        {/* Main Content */}
        <div className="dash-main">
          <div className="dash-header">
            <div>
              <div className="dash-greeting">{tourney ? tourney.name : 'Unknown Tournament'}</div>
              <div className="dash-date">{tourney ? `${new Date(tourney.dateStart).toLocaleDateString()} · ${tourney.courseName}` : 'Date TBD'}</div>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button className="btn-ghost" style={{ color: 'var(--forest)', borderColor: 'rgba(26,46,26,0.2)' }}>🔒 Private Link</button>
              <button className="btn-primary">📢 Send Notification</button>
            </div>
          </div>

          {/* KPIs */}
          <div className="kpi-grid">
            <div className="kpi-card">
              <div className="kpi-icon">👥</div>
              <div className="kpi-val">{allRegs.length}</div>
              <div className="kpi-label">Registrants</div>
              <div className="kpi-change">↑ {allRegs.length} total players</div>
            </div>
            <div className="kpi-card">
              <div className="kpi-icon">✅</div>
              <div className="kpi-val">{allRegs.length}</div>
              <div className="kpi-label">Paid</div>
              <div className="kpi-change">0 pending payment</div>
            </div>
            <div className="kpi-card">
              <div className="kpi-icon">💰</div>
              <div className="kpi-val">${revenue.toLocaleString()}</div>
              <div className="kpi-label">Revenue Collected</div>
              <div className="kpi-change">Based on $150 avg fee</div>
            </div>
            <div className="kpi-card">
              <div className="kpi-icon">🏌️</div>
              <div className="kpi-val">{avgHcp}</div>
              <div className="kpi-label">Avg Handicap</div>
              <div className="kpi-change">Field Index Balance</div>
            </div>
          </div>

          <div className="dash-grid">
            <div>
              {/* Registrants Table */}
              <div className="dash-card">
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
                <table className="registrant-table">
                  <thead>
                    <tr>
                      <th>Player</th>
                      <th>Handicap</th>
                      <th>Registered</th>
                      <th>Payment</th>
                      <th>Team</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {allRegs.length === 0 ? (
                      <tr><td colSpan={6} style={{ textAlign: 'center', padding: '2rem', color: 'var(--mist)' }}>No registrants yet.</td></tr>
                    ) : (
                      allRegs.map(reg => (
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
                          <td><button style={{ background: 'none', border: 'none', color: 'var(--mist)', cursor: 'pointer', fontSize: '1rem' }}>⋯</button></td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Private Link Panel */}
              <div className="dash-card">
                <div className="dash-card-header">
                  <div className="dash-card-title">🔒 Private Pre-Launch Link</div>
                  <span className="status-pill status-pending" style={{ fontSize: '0.75rem' }}>Active</span>
                </div>
                <div style={{ padding: '1.5rem' }}>
                  <p style={{ fontSize: '0.875rem', color: 'var(--mist)', marginBottom: '1rem' }}>Share this private link with loyal players before going public. They can register immediately — others will see the tournament once you switch to Public.</p>
                  <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                    <input 
                      type="text" 
                      value="tourneylinks.com/t/lakewood-classic?private=abc123xyz" 
                      readOnly 
                      style={{ flex: 1, padding: '0.6rem 0.85rem', border: '1px solid rgba(26,46,26,0.12)', borderRadius: '2px', fontSize: '0.8rem', fontFamily: "'DM Mono', monospace", color: 'var(--mist)', background: '#fafaf5', outline: 'none' }} 
                    />
                    <button className="btn-primary" style={{ padding: '0.6rem 1rem', fontSize: '0.8rem' }}>Copy</button>
                  </div>
                  <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <button className="btn-ghost" style={{ color: 'var(--forest)', borderColor: 'rgba(26,46,26,0.15)', fontSize: '0.8rem', padding: '0.5rem 1rem' }}>🌐 Go Public Now</button>
                    <button className="btn-ghost" style={{ color: 'var(--forest)', borderColor: 'rgba(26,46,26,0.15)', fontSize: '0.8rem', padding: '0.5rem 1rem' }}>Schedule Public Date</button>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div>
              {/* Send Notification */}
              <div className="dash-card" style={{ marginBottom: '1.5rem' }}>
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
              <FlightBuilder tournamentId={tournamentId} teamsMap={teamsMap} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
