import React from 'react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function SponsorDashboard() {
  return (
    <div style={{ minHeight: 'calc(100vh - 80px)', background: '#fafaf5', color: '#1a2e1a', fontFamily: "'DM Sans', sans-serif" }}>
      <div className="dashboard-wrap" style={{ minHeight: '100%', maxWidth: '1400px', margin: '0 auto', display: 'grid', gridTemplateColumns: '260px 1fr' }}>
        
        {/* Sidebar */}
        <div style={{ background: '#05120c', color: '#fff', padding: '2rem 1.5rem' }}>
          <div style={{ fontWeight: 900, fontSize: '1.25rem', marginBottom: '3rem', letterSpacing: '0.02em', color: '#f5f2ed' }}>
            Tourney<span style={{ color: 'var(--gold)' }}>Links</span> 
            <span style={{ fontSize: '0.7rem', background: 'rgba(212,175,55,0.2)', color: 'var(--gold)', padding: '0.15rem 0.4rem', borderRadius: '2px', marginLeft: '0.5rem' }}>
              Sponsor
            </span>
          </div>

          <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'rgba(255,255,255,0.4)', marginBottom: '1rem' }}>Active Campaigns</div>
          <div style={{ background: 'rgba(212,175,55,0.1)', borderLeft: '3px solid var(--gold)', padding: '0.75rem 1rem', borderRadius: '0 4px 4px 0', color: 'var(--gold)', fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.5rem', cursor: 'pointer' }}>
            Lighthouse Charity Scramble
          </div>
          <div style={{ padding: '0.75rem 1rem', color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', cursor: 'pointer', transition: '0.2s' }}>
            City of Denver Amatuer (Past)
          </div>

          <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'rgba(255,255,255,0.4)', marginTop: '2.5rem', marginBottom: '1rem' }}>Asset Management</div>
          <div style={{ padding: '0.75rem 1rem', color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', cursor: 'pointer', display: 'flex', gap: '0.5rem' }}><span>🖼️</span> Brand Kit</div>
          <div style={{ padding: '0.75rem 1rem', color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', cursor: 'pointer', display: 'flex', gap: '0.5rem' }}><span>📄</span> Tax Receipts</div>
        </div>

        {/* Main Content */}
        <div style={{ padding: '2.5rem 3rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2.5rem' }}>
                <div>
                   <h1 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '0.4rem', color: '#05120c' }}>Local Ford Dealership Dashboard</h1>
                   <p style={{ color: 'var(--mist)', fontSize: '1rem' }}>Managing your $10,000 Title Sponsorship for The Lighthouse Charity Scramble</p>
                </div>
                <div style={{ background: '#e8f5e9', color: '#2e7d32', padding: '0.5rem 1rem', borderRadius: '20px', fontWeight: 700, fontSize: '0.85rem' }}>
                    ● Campaign Active
                </div>
            </div>

            {/* DEMO CALLOUT */}
            <div style={{ background: 'rgba(212, 175, 55, 0.05)', borderLeft: '4px solid var(--gold)', padding: '1.5rem', borderRadius: '4px', marginBottom: '2.5rem' }}>
                <h3 style={{ color: 'var(--gold)', fontWeight: 800, marginBottom: '0.5rem', fontSize: '1.1rem' }}>Demo Architecture: Sponsor Acquisition Loop</h3>
                <p style={{ color: 'var(--mist)', fontSize: '0.85rem', lineHeight: 1.6 }}>
                  Sponsors traditionally write physical checks and email low-res logos to organizers. We digitized this B2B relationship. When a business pays for a sponsorship tier on the frontend, they are instantly granted access to this dashboard where they can upload vector logos, configure geo-fenced push notifications, and measure their absolute ROI via real-time impressions. 
                </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '2.5rem' }}>
                <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.05)', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
                   <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--mist)', fontWeight: 600, letterSpacing: '0.05em' }}>App Impressions</div>
                   <div style={{ fontSize: '2.5rem', fontWeight: 900, marginTop: '0.5rem', color: '#05120c' }}>4,208</div>
                   <div style={{ fontSize: '0.85rem', color: '#2e7d32', marginTop: '0.2rem', fontWeight: 500 }}>↑ Top 5% of sponsors</div>
                </div>
                <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.05)', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
                   <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--mist)', fontWeight: 600, letterSpacing: '0.05em' }}>Hole 2 Geo-Fence Triggers</div>
                   <div style={{ fontSize: '2.5rem', fontWeight: 900, marginTop: '0.5rem', color: '#05120c' }}>142</div>
                   <div style={{ fontSize: '0.85rem', color: 'var(--mist)', marginTop: '0.2rem' }}>Unique devices buzzed</div>
                </div>
                <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.05)', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
                   <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--mist)', fontWeight: 600, letterSpacing: '0.05em' }}>Click-Throughs</div>
                   <div style={{ fontSize: '2.5rem', fontWeight: 900, marginTop: '0.5rem', color: '#05120c' }}>18</div>
                   <div style={{ fontSize: '0.85rem', color: 'var(--mist)', marginTop: '0.2rem' }}>Routed to Offer Page</div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
                <div style={{ background: '#fff', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.05)', overflow: 'hidden' }}>
                    <div style={{ padding: '1.5rem', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                       <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>Digital Ad Delivery Configuration</h3>
                    </div>
                    <div style={{ padding: '1.5rem' }}>
                       <div style={{ marginBottom: '1.5rem' }}>
                           <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--mist)', marginBottom: '0.5rem' }}>Pop-Up Modal Ad Copy (Triggered at Hole 2)</label>
                           <textarea 
                              readOnly 
                              value="FORD DEALERSHIP: WIN A NEW F-150 WITH A HOLE-IN-ONE TODAY! Show this screen at the clubhouse to test drive the 2026 fleet."
                              style={{ width: '100%', padding: '0.85rem', borderRadius: '4px', border: '1px solid rgba(0,0,0,0.1)', fontFamily: "'DM Sans', sans-serif", resize: 'vertical', minHeight: '80px', color: '#05120c' }} 
                           />
                       </div>
                       <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                           <div>
                              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--mist)', marginBottom: '0.5rem' }}>CTA Button Text</label>
                              <input type="text" readOnly value="Claim Test Drive" style={{ width: '100%', padding: '0.85rem', borderRadius: '4px', border: '1px solid rgba(0,0,0,0.1)', fontFamily: "'DM Sans', sans-serif" }} />
                           </div>
                           <div>
                              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--mist)', marginBottom: '0.5rem' }}>Destination URL</label>
                              <input type="text" readOnly value="https://ford.com/test-drive" style={{ width: '100%', padding: '0.85rem', borderRadius: '4px', border: '1px solid rgba(0,0,0,0.1)', fontFamily: "'DM Sans', sans-serif" }} />
                           </div>
                       </div>
                       <button className="btn-primary" style={{ marginTop: '1.5rem', padding: '0.75rem 1.5rem' }}>Save Ad Configuration</button>
                    </div>
                </div>

                <div style={{ background: '#fff', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.05)', overflow: 'hidden' }}>
                    <div style={{ padding: '1.5rem', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                       <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>Vector Logo Drop</h3>
                    </div>
                    <div style={{ padding: '2rem', textAlign: 'center', background: '#fafaf5', margin: '1.5rem', borderRadius: '8px', border: '2px dashed rgba(212,175,55,0.4)', cursor: 'pointer' }}>
                       <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>📥</div>
                       <div style={{ fontWeight: 700, color: '#05120c' }}>Upload High-Res Logo</div>
                       <div style={{ fontSize: '0.8rem', color: 'var(--mist)', marginTop: '0.5rem' }}>SVG, PNG, or EPS format</div>
                       <div style={{ fontSize: '0.75rem', color: 'var(--gold)', marginTop: '1rem', fontWeight: 600 }}>Active: ford_logo_white.svg</div>
                    </div>
                </div>
            </div>
            
        </div>
      </div>
    </div>
  );
}
