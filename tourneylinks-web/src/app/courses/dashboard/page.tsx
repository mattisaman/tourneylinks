import React from 'react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function CourseDashboard() {
  return (
    <div style={{ minHeight: 'calc(100vh - 80px)', background: '#fafaf5', color: '#1a2e1a', fontFamily: "'DM Sans', sans-serif" }}>
      <div className="dashboard-wrap" style={{ minHeight: '100%', maxWidth: '1400px', margin: '0 auto', display: 'grid', gridTemplateColumns: '260px 1fr' }}>
        
        {/* Sidebar */}
        <div style={{ background: '#05120c', color: '#fff', padding: '2rem 1.5rem' }}>
          <div style={{ fontWeight: 900, fontSize: '1.25rem', marginBottom: '3rem', letterSpacing: '0.02em', color: '#f5f2ed' }}>
            Tourney<span style={{ color: 'var(--gold)' }}>Links</span> 
            <span style={{ fontSize: '0.7rem', background: 'rgba(212,175,55,0.2)', color: 'var(--gold)', padding: '0.15rem 0.4rem', borderRadius: '2px', marginLeft: '0.5rem' }}>
              Course Pro
            </span>
          </div>

          <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'rgba(255,255,255,0.4)', marginBottom: '1rem' }}>My Claimed Courses</div>
          <div style={{ background: 'rgba(212,175,55,0.1)', borderLeft: '3px solid var(--gold)', padding: '0.75rem 1rem', borderRadius: '0 4px 4px 0', color: 'var(--gold)', fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.5rem', cursor: 'pointer' }}>
            Eagle Vale Golf Course
          </div>
          <div style={{ padding: '0.75rem 1rem', color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', cursor: 'pointer', transition: '0.2s', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{color: 'var(--mist)'}}>+</span> Claim Another Course
          </div>

          <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'rgba(255,255,255,0.4)', marginTop: '2.5rem', marginBottom: '1rem' }}>Course Tools</div>
          <div style={{ padding: '0.75rem 1rem', color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', cursor: 'pointer', display: 'flex', gap: '0.5rem' }}><span>📅</span> Upcoming Outings</div>
          <div style={{ padding: '0.75rem 1rem', color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', cursor: 'pointer', display: 'flex', gap: '0.5rem' }}><span>🛰️</span> GPS Pin Mapper</div>
          <div style={{ padding: '0.75rem 1rem', color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', cursor: 'pointer', display: 'flex', gap: '0.5rem' }}><span>📊</span> Revenue Analytics</div>
        </div>

        {/* Main Content */}
        <div style={{ padding: '2.5rem 3rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2.5rem' }}>
                <div>
                   <h1 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '0.4rem', color: '#05120c' }}>Eagle Vale Golf Course Control Center</h1>
                   <p style={{ color: 'var(--mist)', fontSize: '1rem' }}>Overseeing inbound tournament traffic, pace of play, and digital asset mapping.</p>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                   <div style={{ background: '#e8f5e9', color: '#2e7d32', padding: '0.5rem 1rem', borderRadius: '4px', fontWeight: 700, fontSize: '0.85rem', display: 'flex', alignItems: 'center' }}>
                       ✓ Verified Owner
                   </div>
                </div>
            </div>

            {/* DEMO CALLOUT */}
            <div style={{ background: 'rgba(212, 175, 55, 0.05)', borderLeft: '4px solid var(--gold)', padding: '1.5rem', borderRadius: '4px', marginBottom: '2.5rem' }}>
                <h3 style={{ color: 'var(--gold)', fontWeight: 800, marginBottom: '0.5rem', fontSize: '1.1rem' }}>Demo Architecture: Course Pro Adoption Link</h3>
                <p style={{ color: 'var(--mist)', fontSize: '0.85rem', lineHeight: 1.6 }}>
                  Direct Access Bypassing: We do not force Course Pros to pay or go through massive onboarding hoops if you already met them. For example, if you meet the Head Pro at Eagle Vale, you securely inject his email into your Master Admin database. We fire an encrypted link to his inbox. Once he clicks it, he bypasses all verifications and is physically dropped into this exact screen automatically. Unified architecture handling B2B routing gracefully!
                </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '2.5rem' }}>
                <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.05)', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
                   <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--mist)', fontWeight: 600, letterSpacing: '0.05em' }}>Upcoming Outings</div>
                   <div style={{ fontSize: '2.5rem', fontWeight: 900, marginTop: '0.5rem', color: '#05120c' }}>12</div>
                   <div style={{ fontSize: '0.85rem', color: 'var(--mist)', marginTop: '0.2rem' }}>Booked via TourneyLinks</div>
                </div>
                <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.05)', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
                   <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--mist)', fontWeight: 600, letterSpacing: '0.05em' }}>Inbound Registrants</div>
                   <div style={{ fontSize: '2.5rem', fontWeight: 900, marginTop: '0.5rem', color: '#05120c' }}>842</div>
                   <div style={{ fontSize: '0.85rem', color: 'var(--mist)', marginTop: '0.2rem' }}>Players scheduled</div>
                </div>
                <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.05)', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
                   <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--mist)', fontWeight: 600, letterSpacing: '0.05em' }}>Course Traffic Telemetry</div>
                   <div style={{ fontSize: '2.5rem', fontWeight: 900, marginTop: '0.5rem', color: '#2e7d32' }}>Clear</div>
                   <div style={{ fontSize: '0.85rem', color: 'var(--mist)', marginTop: '0.2rem' }}>0 events actively playing</div>
                </div>
            </div>

            <div style={{ background: '#fff', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.05)', overflow: 'hidden', marginBottom: '2.5rem' }}>
                <div style={{ padding: '1.5rem', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>Digital Course Authority</h3>
                </div>
                <div style={{ padding: '1.5rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                    <div>
                        <p style={{ color: 'var(--mist)', fontSize: '0.9rem', marginBottom: '1.5rem', lineHeight: 1.6 }}>
                            You maintain absolute supremacy over your digital mapping footprint. Update GPS routing vectors, pin placements, and digital scorecard interfaces that thousands of TourneyLinks players rely on. 
                        </p>
                        <button className="btn-primary" style={{ padding: '0.75rem 1.5rem' }}>Open GPS Topography Mapper →</button>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div style={{ background: '#fafaf5', padding: '1rem', borderRadius: '4px', border: '1px solid rgba(0,0,0,0.05)' }}>
                            <div style={{ fontWeight: 800, fontSize: '1.2rem', marginBottom: '0.2rem' }}>18</div>
                            <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--mist)', fontWeight: 600 }}>Mapped Holes</div>
                        </div>
                        <div style={{ background: '#fafaf5', padding: '1rem', borderRadius: '4px', border: '1px solid rgba(0,0,0,0.05)' }}>
                            <div style={{ fontWeight: 800, fontSize: '1.2rem', marginBottom: '0.2rem' }}>Active</div>
                            <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--mist)', fontWeight: 600 }}>OCR Scorecard Sync</div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
      </div>
    </div>
  );
}
