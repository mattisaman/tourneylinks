'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import AIScorecardUploader from './AIScorecardUploader';

export default function CourseDashboardClient({ courseData, isDemo }: { courseData: any[], isDemo: boolean }) {
  const [activeTab, setActiveTab] = useState<'outings'|'gps'|'analytics'>('outings');

  // If no courses and Not Demo
  if (!courseData || courseData.length === 0) {
    return (
      <div style={{ minHeight: 'calc(100vh - 80px)', background: '#fafaf5', color: '#1a2e1a', fontFamily: "'DM Sans', sans-serif", padding: '4rem', textAlign: 'center' }}>
         <h1 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '1rem', color: '#05120c' }}>Access Restricted</h1>
         <p style={{ color: 'var(--mist)', fontSize: '1rem', marginBottom: '2rem' }}>You do not currently have verifiable Course Administrator privileges linked to your profile.</p>
         <Link href="/profile" className="btn-primary" style={{ padding: '0.75rem 1.5rem', textDecoration: 'none' }}>Return to Golfer Profile</Link>
      </div>
    );
  }

  // Use the first course for the dashboard view
  const course = courseData[0];

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
            {course.name}
          </div>
          <div style={{ padding: '0.75rem 1rem', color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', cursor: 'pointer', transition: '0.2s', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{color: 'var(--mist)'}}>+</span> Claim Another Course
          </div>

          <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'rgba(255,255,255,0.4)', marginTop: '2.5rem', marginBottom: '1rem' }}>Course Tools</div>
          <div 
             onClick={() => setActiveTab('outings')}
             style={{ background: activeTab === 'outings' ? 'rgba(212,175,55,0.1)' : 'transparent', borderLeft: activeTab === 'outings' ? '3px solid var(--gold)' : '3px solid transparent', padding: '0.75rem 1rem', color: activeTab === 'outings' ? 'var(--gold)' : 'rgba(255,255,255,0.7)', fontSize: '0.9rem', cursor: 'pointer', display: 'flex', gap: '0.5rem', transition: '0.2s' }}>
            <span>📅</span> Upcoming Outings
          </div>
          <div 
             onClick={() => setActiveTab('gps')}
             style={{ background: activeTab === 'gps' ? 'rgba(212,175,55,0.1)' : 'transparent', borderLeft: activeTab === 'gps' ? '3px solid var(--gold)' : '3px solid transparent', padding: '0.75rem 1rem', color: activeTab === 'gps' ? 'var(--gold)' : 'rgba(255,255,255,0.7)', fontSize: '0.9rem', cursor: 'pointer', display: 'flex', gap: '0.5rem', transition: '0.2s' }}>
            <span>🌐</span> Extended Website
          </div>
          <div 
             onClick={() => setActiveTab('analytics')}
             style={{ background: activeTab === 'analytics' ? 'rgba(212,175,55,0.1)' : 'transparent', borderLeft: activeTab === 'analytics' ? '3px solid var(--gold)' : '3px solid transparent', padding: '0.75rem 1rem', color: activeTab === 'analytics' ? 'var(--gold)' : 'rgba(255,255,255,0.7)', fontSize: '0.9rem', cursor: 'pointer', display: 'flex', gap: '0.5rem', transition: '0.2s' }}>
            <span>📊</span> Revenue Analytics
          </div>
        </div>

        {/* Main Content */}
        <div style={{ padding: '2.5rem 3rem' }}>
            
            {activeTab === 'outings' && (
              <div style={{ animation: 'fadeIn 0.3s ease-in' }}>
                 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2.5rem' }}>
                    <div>
                       <h1 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '0.4rem', color: '#05120c' }}>{course.name} Control Center</h1>
                       <p style={{ color: 'var(--mist)', fontSize: '1rem' }}>Overseeing inbound tournament traffic, pace of play, and digital asset mapping.</p>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                       <div style={{ background: '#e8f5e9', color: '#2e7d32', padding: '0.5rem 1rem', borderRadius: '4px', fontWeight: 700, fontSize: '0.85rem', display: 'flex', alignItems: 'center' }}>
                           ✓ Verified Owner
                       </div>
                    </div>
                </div>

                {isDemo && (
                  <div style={{ background: 'rgba(212, 175, 55, 0.05)', borderLeft: '4px solid var(--gold)', padding: '1.5rem', borderRadius: '4px', marginBottom: '2.5rem' }}>
                      <h3 style={{ color: 'var(--gold)', fontWeight: 800, marginBottom: '0.5rem', fontSize: '1.1rem' }}>Demo Architecture: F&B Manager Telemetry</h3>
                      <p style={{ color: 'var(--mist)', fontSize: '0.85rem', lineHeight: 1.6 }}>
                        In traditional workflows, golf courses constantly call tournament organizers to ask "How many players are signed up so we can order food?!" We solve this natively. By allowing a Course Owner to grant Restricted RBAC Access to their Food & Beverage Manager, the F&B Director can log in at any time and monitor exact, real-time registration quotas (Committed vs Paid) for upcoming outings to manage supply logistics autonomously.
                      </p>
                  </div>
                )}

                <div style={{ background: '#fff', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.05)', overflow: 'hidden', marginBottom: '2.5rem' }}>
                    <div style={{ padding: '1.5rem', borderBottom: '1px solid rgba(0,0,0,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                       <div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--mist)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Tracking: Friday, May 14th</div>
                          <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>The Lighthouse Charity Scramble</h3>
                       </div>
                       <span style={{ padding: '0.3rem 0.8rem', background: 'rgba(0,0,0,0.05)', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 600 }}>11 Days Out</span>
                    </div>
                    <div style={{ padding: '2rem' }}>
                        
                        {/* Progress Bar telemetry */}
                        <div style={{ marginBottom: '2rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 600 }}>
                               <span>Registration Capacity</span>
                               <span>90 / 144 Enrolled</span>
                            </div>
                            <div style={{ width: '100%', height: '12px', background: 'rgba(0,0,0,0.05)', borderRadius: '6px', overflow: 'hidden', display: 'flex' }}>
                               <div style={{ width: '50%', background: '#2e7d32' }} title="72 Paid (50%)"></div>
                               <div style={{ width: '12.5%', background: 'var(--gold)' }} title="18 Committed/Unpaid (12.5%)"></div>
                            </div>
                            <div style={{ display: 'flex', gap: '1.5rem', marginTop: '0.75rem', fontSize: '0.8rem' }}>
                               <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#2e7d32' }}></div> 72 Paid Deposits</span>
                               <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--gold)' }}></div> 18 Committed (Unpaid)</span>
                               <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--mist)' }}><div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'rgba(0,0,0,0.1)' }}></div> 54 Remaining Spots (Max 144)</span>
                            </div>
                        </div>

                        {/* F&B Insights */}
                        <div style={{ background: '#fafaf5', border: '1px solid rgba(212,175,55,0.3)', padding: '1.25rem', borderRadius: '6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                               <div style={{ fontWeight: 800, color: '#05120c' }}>Catering Minimum Threshold: 80 Players</div>
                               <div style={{ fontSize: '0.85rem', color: 'var(--mist)' }}>Event has successfully cleared the minimum F&B order limit.</div>
                            </div>
                            <div style={{ background: 'rgba(46,125,50,0.1)', color: '#2e7d32', padding: '0.5rem 1rem', borderRadius: '4px', fontWeight: 700 }}>
                               Minimum Cleared
                            </div>
                        </div>
                    </div>
                </div>
              </div>
            )}

            {activeTab === 'gps' && (
              <div style={{ animation: 'fadeIn 0.3s ease-in' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '0.4rem', color: '#05120c' }}>Extended Course Website</h1>
                <p style={{ color: 'var(--mist)', fontSize: '1rem', marginBottom: '2.5rem' }}>Enhance your public profile on TourneyLinks to drive maximum player engagement and tournament booking conversion.</p>

                <div style={{ background: '#fff', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.05)', overflow: 'hidden', marginBottom: '2.5rem' }}>
                    <div style={{ padding: '1.5rem', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>Digital Component Upgrades</h3>
                    </div>
                    <div style={{ padding: '1.5rem', display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}>
                        
                        <div style={{ marginBottom: '1rem' }}>
                            <p style={{ color: 'var(--mist)', fontSize: '0.9rem', marginBottom: '0.5rem', lineHeight: 1.6 }}>
                                You maintain absolute supremacy over your digital footprint. TourneyLinks relies on your real-time adjustments for accurate yardage, GPS, and imagery.
                            </p>
                        </div>
                        
                        <AIScorecardUploader courseId={course.id} />
                        
                    </div>
                </div>
              </div>
            )}

            {activeTab === 'analytics' && (
              <div style={{ animation: 'fadeIn 0.3s ease-in' }}>
                 <h1 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '0.4rem', color: '#05120c' }}>Revenue Generation Analytics</h1>
                 <p style={{ color: 'var(--mist)', fontSize: '1rem', marginBottom: '2.5rem' }}>Measure total GMV driven through the TourneyLinks platform to your facility.</p>

                 <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '2.5rem' }}>
                    <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.05)', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
                       <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--mist)', fontWeight: 600, letterSpacing: '0.05em' }}>YTD Tournaments</div>
                       <div style={{ fontSize: '2.5rem', fontWeight: 900, marginTop: '0.5rem', color: '#05120c' }}>34</div>
                       <div style={{ fontSize: '0.85rem', color: 'var(--mist)', marginTop: '0.2rem' }}>Successfully hosted</div>
                    </div>
                    <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.05)', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
                       <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--mist)', fontWeight: 600, letterSpacing: '0.05em' }}>Total Inbound Players</div>
                       <div style={{ fontSize: '2.5rem', fontWeight: 900, marginTop: '0.5rem', color: '#05120c' }}>3,248</div>
                       <div style={{ fontSize: '0.85rem', color: 'var(--mist)', marginTop: '0.2rem' }}>Registered via app</div>
                    </div>
                    <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.05)', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
                       <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--mist)', fontWeight: 600, letterSpacing: '0.05em' }}>Est. F&B GMV</div>
                       <div style={{ fontSize: '2.5rem', fontWeight: 900, marginTop: '0.5rem', color: '#2e7d32' }}>$142,500</div>
                       <div style={{ fontSize: '0.85rem', color: 'var(--mist)', marginTop: '0.2rem' }}>Gross transactional volume</div>
                    </div>
                </div>
              </div>
            )}

        </div>
      </div>
    </div>
  );
}
