'use client';
import React, { useState } from 'react';
import Link from 'next/link';

export default function SponsorDashboardClient({ sponsorData, isDemo }: { sponsorData: any[], isDemo: boolean }) {
  const [activeTab, setActiveTab] = useState<'campaigns'|'assets'|'tax'>('campaigns');

  if (!sponsorData || sponsorData.length === 0) {
    return (
      <div style={{ minHeight: 'calc(100vh - 80px)', background: '#fafaf5', color: '#1a2e1a', fontFamily: "'DM Sans', sans-serif", padding: '4rem', textAlign: 'center' }}>
         <h1 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '1rem', color: '#05120c' }}>Investment Portal</h1>
         <p style={{ color: 'var(--mist)', fontSize: '1rem', marginBottom: '2rem' }}>You have not deployed capital into any active golf tournaments on the TourneyLinks ecosystem.</p>
         <Link href="/tournaments" className="btn-primary" style={{ padding: '0.75rem 1.5rem', textDecoration: 'none' }}>Discover Inventory</Link>
      </div>
    );
  }

  // Use the first sponsor record for the dashboard scope
  const sponsorship = sponsorData[0];

  return (
    <div style={{ minHeight: 'calc(100vh - 80px)', background: '#fafaf5', color: '#1a2e1a', fontFamily: "'DM Sans', sans-serif" }}>
      <div className="dashboard-wrap" style={{ minHeight: '100%', maxWidth: '1400px', margin: '0 auto', display: 'grid', gridTemplateColumns: '260px 1fr' }}>
        
        {/* Sidebar */}
        <div style={{ background: '#05120c', color: '#fff', padding: '2rem 1.5rem' }}>
          <div style={{ fontWeight: 900, fontSize: '1.25rem', marginBottom: '3rem', letterSpacing: '0.02em', color: '#f5f2ed' }}>
            Tourney<span style={{ color: 'var(--gold)' }}>Links</span> 
            <span style={{ fontSize: '0.7rem', background: 'rgba(212,175,55,0.2)', color: 'var(--gold)', padding: '0.15rem 0.4rem', borderRadius: '2px', marginLeft: '0.5rem' }}>B2B</span>
          </div>

          <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'rgba(255,255,255,0.4)', marginBottom: '1rem' }}>Active Accounts</div>
          <div style={{ background: 'rgba(212,175,55,0.1)', borderLeft: '3px solid var(--gold)', padding: '0.75rem 1rem', borderRadius: '0 4px 4px 0', color: 'var(--gold)', fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.5rem', cursor: 'pointer' }}>
            {sponsorship.name}
          </div>
          <div style={{ padding: '0.75rem 1rem', color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', cursor: 'pointer', transition: '0.2s', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{color: 'var(--mist)'}}>+</span> Register New Entity
          </div>

          <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'rgba(255,255,255,0.4)', marginTop: '2.5rem', marginBottom: '1rem' }}>B2B Hub</div>
          <div 
             onClick={() => setActiveTab('campaigns')}
             style={{ background: activeTab === 'campaigns' ? 'rgba(212,175,55,0.1)' : 'transparent', borderLeft: activeTab === 'campaigns' ? '3px solid var(--gold)' : '3px solid transparent', padding: '0.75rem 1rem', color: activeTab === 'campaigns' ? 'var(--gold)' : 'rgba(255,255,255,0.7)', fontSize: '0.9rem', cursor: 'pointer', display: 'flex', gap: '0.5rem', transition: '0.2s' }}>
            <span>📈</span> Campaign Analytics
          </div>
          <div 
             onClick={() => setActiveTab('assets')}
             style={{ background: activeTab === 'assets' ? 'rgba(212,175,55,0.1)' : 'transparent', borderLeft: activeTab === 'assets' ? '3px solid var(--gold)' : '3px solid transparent', padding: '0.75rem 1rem', color: activeTab === 'assets' ? 'var(--gold)' : 'rgba(255,255,255,0.7)', fontSize: '0.9rem', cursor: 'pointer', display: 'flex', gap: '0.5rem', transition: '0.2s' }}>
            <span>🎨</span> Brand Kit & Assets
          </div>
          <div 
             onClick={() => setActiveTab('tax')}
             style={{ background: activeTab === 'tax' ? 'rgba(212,175,55,0.1)' : 'transparent', borderLeft: activeTab === 'tax' ? '3px solid var(--gold)' : '3px solid transparent', padding: '0.75rem 1rem', color: activeTab === 'tax' ? 'var(--gold)' : 'rgba(255,255,255,0.7)', fontSize: '0.9rem', cursor: 'pointer', display: 'flex', gap: '0.5rem', transition: '0.2s' }}>
            <span>🧾</span> Tax & Invoicing
          </div>
        </div>

        {/* Main Content */}
        <div style={{ padding: '2.5rem 3rem' }}>
            
            {activeTab === 'campaigns' && (
              <div style={{ animation: 'fadeIn 0.3s ease-in' }}>
                 <h1 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '0.4rem', color: '#05120c' }}>Campaign Analytics Dashboard</h1>
                 <p style={{ color: 'var(--mist)', fontSize: '1rem', marginBottom: '2.5rem' }}>Track real-time digital impressions and physical activations across your sponsored events.</p>

                 <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '2.5rem' }}>
                    <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.05)', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
                       <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--mist)', fontWeight: 600, letterSpacing: '0.05em' }}>Total Capital Deployed</div>
                       <div style={{ fontSize: '2.5rem', fontWeight: 900, marginTop: '0.5rem', color: '#05120c' }}>
                         ${sponsorship.amountPaid ? (sponsorship.amountPaid / 100).toLocaleString() : '10,000'}
                       </div>
                       <div style={{ fontSize: '0.85rem', color: 'var(--mist)', marginTop: '0.2rem' }}>Across {sponsorData.length} events</div>
                    </div>
                    <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.05)', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
                       <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--mist)', fontWeight: 600, letterSpacing: '0.05em' }}>App Impressions</div>
                       <div style={{ fontSize: '2.5rem', fontWeight: 900, marginTop: '0.5rem', color: '#05120c' }}>4,289</div>
                       <div style={{ fontSize: '0.85rem', color: 'var(--mist)', marginTop: '0.2rem' }}><span style={{ color: '#2e7d32', fontWeight: 700 }}>+12%</span> vs last week</div>
                    </div>
                    <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.05)', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
                       <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--mist)', fontWeight: 600, letterSpacing: '0.05em' }}>Ctr / Engagement</div>
                       <div style={{ fontSize: '2.5rem', fontWeight: 900, marginTop: '0.5rem', color: '#2e7d32' }}>5.4%</div>
                       <div style={{ fontSize: '0.85rem', color: 'var(--mist)', marginTop: '0.2rem' }}>Direct clicks to target URL</div>
                    </div>
                </div>

                <div style={{ background: '#fff', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.05)', overflow: 'hidden' }}>
                    <div style={{ padding: '1.5rem', borderBottom: '1px solid rgba(0,0,0,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                       <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>Active Deployments</h3>
                    </div>
                    <div style={{ padding: '0 1.5rem' }}>
                       {sponsorData.map((s: any, idx: number) => (
                         <div key={idx} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 150px', padding: '1.25rem 0', borderBottom: idx !== sponsorData.length - 1 ? '1px solid rgba(0,0,0,0.05)' : 'none', alignItems: 'center' }}>
                            <div>
                               <div style={{ fontWeight: 700, color: '#05120c', fontSize: '0.95rem' }}>{s.tournamentName || 'Tournament Name'}</div>
                               <div style={{ fontSize: '0.8rem', color: 'var(--mist)' }}>{s.sponsorType || 'Targeted Demographic'}</div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                               <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#2e7d32' }}></div>
                               <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Active Mapping</span>
                            </div>
                            <div style={{ fontSize: '0.85rem', color: 'var(--mist)' }}>
                               ${s.amountPaid ? (s.amountPaid / 100).toLocaleString() : '5,000'} Invested
                            </div>
                            <div style={{ textAlign: 'right' }}>
                               <button style={{ background: 'transparent', border: '1px solid rgba(0,0,0,0.1)', padding: '0.4rem 0.8rem', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}>View Telemetry</button>
                            </div>
                         </div>
                       ))}
                    </div>
                </div>
              </div>
            )}

            {activeTab === 'assets' && (
              <div style={{ animation: 'fadeIn 0.3s ease-in' }}>
                 <h1 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '0.4rem', color: '#05120c' }}>Brand Kit Studio</h1>
                 <p style={{ color: 'var(--mist)', fontSize: '1rem', marginBottom: '2.5rem' }}>Upload your high-fidelity brand vectors. These instantly deploy into all connected Tournament Native Apps.</p>

                 <div style={{ background: '#fff', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.05)', padding: '2rem' }}>
                    <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>
                       <div style={{ width: '200px', height: '200px', background: '#fafaf5', border: '2px dashed rgba(212,175,55,0.3)', borderRadius: '8px', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', cursor: 'pointer' }}>
                          <span style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>+</span>
                          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--gold)' }}>Upload .SVG / .PNG</span>
                       </div>
                       <div style={{ flex: 1 }}>
                          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '0.5rem' }}>Primary Corporate Logo</h3>
                          <p style={{ color: 'var(--mist)', fontSize: '0.9rem', marginBottom: '1.5rem', lineHeight: 1.6 }}>Must be a transparent vector format. This is the logo that will physically map over the digital course GPS pins, the interactive leaderboard, and the player profiles.</p>
                          <div style={{ display: 'flex', gap: '1rem' }}>
                             <button className="btn-primary" style={{ padding: '0.5rem 1.5rem', fontSize: '0.9rem' }}>Save Asset</button>
                          </div>
                       </div>
                    </div>
                 </div>
              </div>
            )}

            {activeTab === 'tax' && (
              <div style={{ animation: 'fadeIn 0.3s ease-in' }}>
                 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2.5rem' }}>
                    <div>
                       <h1 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '0.4rem', color: '#05120c' }}>Tax &amp; 501(c)(3) Documentation</h1>
                       <p style={{ color: 'var(--mist)', fontSize: '1rem' }}>Automatically generated receipts for your corporate accounting.</p>
                    </div>
                 </div>

                 <div style={{ background: '#fff', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.05)', overflow: 'hidden' }}>
                    <div style={{ padding: '1.5rem', borderBottom: '1px solid rgba(0,0,0,0.05)', display: 'grid', gridTemplateColumns: 'minmax(200px, 1fr) 150px 150px 100px', fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--mist)', letterSpacing: '0.05em' }}>
                       <div>Transaction / Entity</div>
                       <div>Filing Class</div>
                       <div>Amount</div>
                       <div style={{textAlign: 'right'}}>Action</div>
                    </div>
                    <div style={{ padding: '0 1.5rem' }}>
                       {sponsorData.map((s: any, idx: number) => (
                         <div key={idx} style={{ display: 'grid', gridTemplateColumns: 'minmax(200px, 1fr) 150px 150px 100px', padding: '1.25rem 0', borderBottom: idx !== sponsorData.length - 1 ? '1px solid rgba(0,0,0,0.05)' : 'none', alignItems: 'center' }}>
                            <div>
                               <div style={{ fontWeight: 700, color: '#05120c', fontSize: '0.95rem' }}>{s.tournamentName || 'Tournament Payment'}</div>
                               <div style={{ fontSize: '0.8rem', color: 'var(--mist)' }}>{s.purchasedAt ? new Date(s.purchasedAt).toLocaleDateString() : 'May 14, 2026'}</div>
                            </div>
                            <div>
                               <span style={{ background: 'rgba(212, 175, 55, 0.1)', color: 'var(--gold)', padding: '0.2rem 0.6rem', borderRadius: '2px', fontSize: '0.75rem', fontWeight: 800 }}>501(C)(3) Valid</span>
                            </div>
                            <div style={{ fontWeight: 800, fontSize: '0.95rem' }}>
                               ${s.amountPaid ? (s.amountPaid / 100).toLocaleString() : '5,000.00'}
                            </div>
                            <div style={{ textAlign: 'right' }}>
                               <button style={{ color: 'var(--gold)', fontSize: '0.85rem', fontWeight: 700, background: 'transparent', border: 'none', cursor: 'pointer' }}>PDF &darr;</button>
                            </div>
                         </div>
                       ))}
                    </div>
                 </div>
              </div>
            )}
        </div>
      </div>
    </div>
  );
}
