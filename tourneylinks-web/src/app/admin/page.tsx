import React from 'react';
import Link from 'next/link';

export default function AdminDashboard() {
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
              <div className="dash-greeting">Lakewood Classic Invitational</div>
              <div className="dash-date">June 14–15, 2025 · Lakewood CC, Westchester IL</div>
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
              <div className="kpi-val">68</div>
              <div className="kpi-label">Registrants</div>
              <div className="kpi-change">↑ 8 this week</div>
            </div>
            <div className="kpi-card">
              <div className="kpi-icon">✅</div>
              <div className="kpi-val">61</div>
              <div className="kpi-label">Paid</div>
              <div className="kpi-change">7 pending payment</div>
            </div>
            <div className="kpi-card">
              <div className="kpi-icon">💰</div>
              <div className="kpi-val">$7,625</div>
              <div className="kpi-label">Revenue Collected</div>
              <div className="kpi-change">↑ $875 pending</div>
            </div>
            <div className="kpi-card">
              <div className="kpi-icon">🏌️</div>
              <div className="kpi-val">14.2</div>
              <div className="kpi-label">Avg Handicap</div>
              <div className="kpi-change">Range: 2.1 – 26.8</div>
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
                    <tr>
                      <td><div className="player-name">Mike Reynolds</div><div style={{ fontSize: '0.75rem', color: 'var(--mist)' }}>mike@example.com</div></td>
                      <td><span className="player-hcp">14.2</span></td>
                      <td style={{ fontSize: '0.8rem', color: 'var(--mist)' }}>May 28</td>
                      <td><span className="status-pill status-paid">Paid $128.93</span></td>
                      <td style={{ fontSize: '0.8rem' }}>Team Alpha</td>
                      <td><button style={{ background: 'none', border: 'none', color: 'var(--mist)', cursor: 'pointer', fontSize: '1rem' }}>⋯</button></td>
                    </tr>
                    <tr>
                      <td><div className="player-name">Sarah Chen</div><div style={{ fontSize: '0.75rem', color: 'var(--mist)' }}>sarah@example.com</div></td>
                      <td><span className="player-hcp">8.7</span></td>
                      <td style={{ fontSize: '0.8rem', color: 'var(--mist)' }}>May 29</td>
                      <td><span className="status-pill status-paid">Paid $128.93</span></td>
                      <td style={{ fontSize: '0.8rem' }}>Team Alpha</td>
                      <td><button style={{ background: 'none', border: 'none', color: 'var(--mist)', cursor: 'pointer', fontSize: '1rem' }}>⋯</button></td>
                    </tr>
                    <tr>
                      <td><div className="player-name">Tom Harrington</div><div style={{ fontSize: '0.75rem', color: 'var(--mist)' }}>tom@example.com</div></td>
                      <td><span className="player-hcp">22.1</span></td>
                      <td style={{ fontSize: '0.8rem', color: 'var(--mist)' }}>Jun 1</td>
                      <td><span className="status-pill status-pending">Pending</span></td>
                      <td style={{ fontSize: '0.8rem' }}>—</td>
                      <td><button style={{ background: 'none', border: 'none', color: 'var(--mist)', cursor: 'pointer', fontSize: '1rem' }}>⋯</button></td>
                    </tr>
                    <tr>
                      <td><div className="player-name">James Park</div><div style={{ fontSize: '0.75rem', color: 'var(--mist)' }}>james@example.com</div></td>
                      <td><span className="player-hcp">3.4</span></td>
                      <td style={{ fontSize: '0.8rem', color: 'var(--mist)' }}>Jun 2</td>
                      <td><span className="status-pill status-paid">Paid $128.93</span></td>
                      <td style={{ fontSize: '0.8rem' }}>Team Birdie</td>
                      <td><button style={{ background: 'none', border: 'none', color: 'var(--mist)', cursor: 'pointer', fontSize: '1rem' }}>⋯</button></td>
                    </tr>
                    <tr>
                      <td><div className="player-name">Karen Williams</div><div style={{ fontSize: '0.75rem', color: 'var(--mist)' }}>karen@example.com</div></td>
                      <td><span className="player-hcp">18.0</span></td>
                      <td style={{ fontSize: '0.8rem', color: 'var(--mist)' }}>Jun 3</td>
                      <td><span className="status-pill status-waitlist">Waitlist</span></td>
                      <td style={{ fontSize: '0.8rem' }}>—</td>
                      <td><button style={{ background: 'none', border: 'none', color: 'var(--mist)', cursor: 'pointer', fontSize: '1rem' }}>⋯</button></td>
                    </tr>
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

              {/* Flight Builder */}
              <div className="dash-card">
                <div className="dash-card-header">
                  <div className="dash-card-title">🏌️ Auto Flight Builder</div>
                  <button className="btn-primary" style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem' }}>Build Flights</button>
                </div>
                <div style={{ padding: '1.25rem' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <div style={{ background: 'rgba(90,140,58,0.08)', border: '1px solid rgba(90,140,58,0.2)', padding: '0.85rem', borderRadius: '2px' }}>
                      <div style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--forest)', marginBottom: '0.25rem' }}>Flight A — Championship</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--mist)' }}>HCP 0–8 · 16 players · 4 teams</div>
                    </div>
                    <div style={{ background: 'rgba(201,168,76,0.08)', border: '1px solid rgba(201,168,76,0.2)', padding: '0.85rem', borderRadius: '2px' }}>
                      <div style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--forest)', marginBottom: '0.25rem' }}>Flight B — Main</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--mist)' }}>HCP 9–16 · 28 players · 7 teams</div>
                    </div>
                    <div style={{ background: 'rgba(45,74,45,0.08)', border: '1px solid rgba(45,74,45,0.2)', padding: '0.85rem', borderRadius: '2px' }}>
                      <div style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--forest)', marginBottom: '0.25rem' }}>Flight C — Senior/Social</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--mist)' }}>HCP 17–28 · 24 players · 6 teams</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
