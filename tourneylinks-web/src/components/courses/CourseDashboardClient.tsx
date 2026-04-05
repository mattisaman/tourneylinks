'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import AIScorecardUploader from './AIScorecardUploader';
import CourseInbox from './CourseInbox';
import CourseContracts from './CourseContracts';

export default function CourseDashboardClient({ courseData, isDemo }: { courseData: any[], isDemo: boolean }) {
  const [activeTab, setActiveTab] = useState<'outings'|'gps'|'analytics'|'inbox'|'contracts'>('outings');

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
      <div className="dashboard-wrap" style={{ minHeight: '100%', display: 'flex', width: '100%' }}>
        
        <div style={{ background: '#05120c', color: '#fff', padding: '2rem 1rem', width: '280px', flexShrink: 0 }}>
          <div style={{ fontWeight: 900, fontSize: '1.25rem', marginBottom: '3rem', letterSpacing: '0.02em', color: '#f5f2ed', padding: '0 0.5rem' }}>
            Tourney<span style={{ color: 'var(--gold)' }}>Links</span> 
            <span style={{ fontSize: '0.7rem', background: 'rgba(212,175,55,0.2)', color: 'var(--gold)', padding: '0.15rem 0.4rem', borderRadius: '2px', marginLeft: '0.5rem' }}>
              Course Pro
            </span>
          </div>

          <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'rgba(255,255,255,0.4)', marginBottom: '1rem', padding: '0 0.5rem' }}>My Claimed Courses</div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(212,175,55,0.1)', borderLeft: '3px solid var(--gold)', padding: '0.6rem 1rem', borderRadius: '0 4px 4px 0', color: 'var(--gold)', fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.5rem', marginLeft: '-1rem' }}>
            <span style={{ cursor: 'pointer' }}>{course.name}</span>
            <Link href={`/courses/${course.id}`} target="_blank" style={{ fontSize: '0.65rem', padding: '0.3rem 0.6rem', background: 'var(--gold)', color: '#000', borderRadius: '4px', textDecoration: 'none', fontWeight: 800, whiteSpace: 'nowrap' }}>View Site ↗</Link>
          </div>
          <div style={{ padding: '0.5rem 1rem', color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', cursor: 'pointer', transition: '0.2s', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{color: 'var(--mist)'}}>+</span> Claim Another Course
          </div>

          <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'rgba(255,255,255,0.4)', marginTop: '2.5rem', marginBottom: '1rem', padding: '0 0.5rem' }}>Course Tools</div>
          <div 
             onClick={() => setActiveTab('outings')}
             style={{ background: activeTab === 'outings' ? 'rgba(212,175,55,0.1)' : 'transparent', borderLeft: activeTab === 'outings' ? '3px solid var(--gold)' : '3px solid transparent', padding: '0.75rem 1.5rem', color: activeTab === 'outings' ? 'var(--gold)' : 'rgba(255,255,255,0.7)', fontSize: '0.9rem', cursor: 'pointer', display: 'flex', gap: '0.5rem', transition: '0.2s', marginLeft: '-1rem', borderRadius: '0 4px 4px 0' }}>
            <span>📅</span> Upcoming Outings
          </div>
          <div 
             onClick={() => setActiveTab('gps')}
             style={{ background: activeTab === 'gps' ? 'rgba(212,175,55,0.1)' : 'transparent', borderLeft: activeTab === 'gps' ? '3px solid var(--gold)' : '3px solid transparent', padding: '0.75rem 1.5rem', color: activeTab === 'gps' ? 'var(--gold)' : 'rgba(255,255,255,0.7)', fontSize: '0.9rem', cursor: 'pointer', display: 'flex', gap: '0.5rem', transition: '0.2s', marginLeft: '-1rem', borderRadius: '0 4px 4px 0' }}>
            <span>🌐</span> Extended Website
          </div>
          <div 
             onClick={() => setActiveTab('inbox')}
             style={{ background: activeTab === 'inbox' ? 'rgba(212,175,55,0.1)' : 'transparent', borderLeft: activeTab === 'inbox' ? '3px solid var(--gold)' : '3px solid transparent', padding: '0.75rem 1.5rem', color: activeTab === 'inbox' ? 'var(--gold)' : 'rgba(255,255,255,0.7)', fontSize: '0.9rem', cursor: 'pointer', display: 'flex', gap: '0.5rem', transition: '0.2s', marginLeft: '-1rem', borderRadius: '0 4px 4px 0' }}>
            <span>💬</span> Communications
          </div>
          <div 
             onClick={() => setActiveTab('contracts')}
             style={{ background: activeTab === 'contracts' ? 'rgba(212,175,55,0.1)' : 'transparent', borderLeft: activeTab === 'contracts' ? '3px solid var(--gold)' : '3px solid transparent', padding: '0.75rem 1.5rem', color: activeTab === 'contracts' ? 'var(--gold)' : 'rgba(255,255,255,0.7)', fontSize: '0.9rem', cursor: 'pointer', display: 'flex', gap: '0.5rem', transition: '0.2s', marginLeft: '-1rem', borderRadius: '0 4px 4px 0' }}>
            <span>📑</span> Agreements
          </div>
          <div 
             onClick={() => setActiveTab('analytics')}
             style={{ background: activeTab === 'analytics' ? 'rgba(212,175,55,0.1)' : 'transparent', borderLeft: activeTab === 'analytics' ? '3px solid var(--gold)' : '3px solid transparent', padding: '0.75rem 1.5rem', color: activeTab === 'analytics' ? 'var(--gold)' : 'rgba(255,255,255,0.7)', fontSize: '0.9rem', cursor: 'pointer', display: 'flex', gap: '0.5rem', transition: '0.2s', marginLeft: '-1rem', borderRadius: '0 4px 4px 0' }}>
            <span>📊</span> Revenue Analytics
          </div>

          <Link href={`/courses/${course.id}`} target="_blank" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f2ed', color: '#05120c', padding: '0.75rem', borderRadius: '6px', textDecoration: 'none', fontWeight: 700, fontSize: '0.85rem', margin: '3rem 0.5rem 0 0.5rem', transition: '0.2s' }}>
             Open Public Profile ↗
          </Link>
        </div>

        {/* Main Content */}
        <div style={{ flex: 1, padding: '2.5rem 3rem', maxWidth: '1400px', margin: '0 auto' }}>
            
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
                        
                        {/* Logo Uploader Block */}
                        <div style={{ padding: '1.5rem', background: '#fafaf5', borderRadius: '4px', border: '1px solid rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: '2rem' }}>
                            <div style={{ width: '80px', height: '80px', borderRadius: '12px', backgroundColor: '#fff', border: '2px dashed rgba(201,168,76,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                                {course.logoUrl ? <img src={course.logoUrl} style={{objectFit:'contain', width:'100%', height:'100%', padding:'8px'}}/> : <span style={{margin:'auto', color:'var(--mist)', fontSize:'0.75rem'}}>No Logo</span>}
                            </div>
                            <div style={{ flex: 1 }}>
                                <h4 style={{ fontWeight: 800, fontSize: '1.1rem', marginBottom: '0.2rem', color: '#05120c' }}>Venue Branding Asset</h4>
                                <p style={{ color: 'var(--mist)', fontSize: '0.85rem', marginBottom: '1rem', lineHeight: 1.5 }}>
                                  Upload your primary transparent SVG or high-resolution PNG to feature on your official Directory card.
                                </p>
                                <label className="btn-hero-outline" style={{ display: 'inline-block', fontSize: '0.8rem', padding: '0.5rem 1rem', borderColor: 'var(--mist)', color: '#333', cursor: 'pointer' }}>
                                  <input type="file" style={{ display: 'none' }} accept="image/*" onChange={(e) => alert("In production, this uploads directly to S3 and attaches the logoUrl to your Venue database record!")} />
                                  Upload Logo File
                                </label>
                            </div>
                        </div>
                        
                        <div style={{ padding: '1.5rem', background: '#fafaf5', borderRadius: '4px', border: '1px solid rgba(0,0,0,0.05)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                               <div>
                                  <h4 style={{ fontWeight: 800, fontSize: '1.1rem', marginBottom: '0.2rem', color: '#05120c' }}>Embed Active Events Calendar</h4>
                                  <p style={{ color: 'var(--mist)', fontSize: '0.85rem', lineHeight: 1.5 }}>
                                    Toggle this on to render an interactive calendar on your public Directory page. You can sync standard ICS booking feeds directly.
                                  </p>
                               </div>
                               <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                   <div style={{ fontWeight: 600, fontSize: '0.8rem', color: '#2e7d32' }}>Enabled</div>
                                   <div style={{ width: '40px', height: '24px', background: 'var(--gold)', borderRadius: '12px', position: 'relative', cursor: 'pointer' }}>
                                      <div style={{ position: 'absolute', right: '2px', top: '2px', width: '20px', height: '20px', background: '#fff', borderRadius: '50%', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }} />
                                   </div>
                               </div>
                            </div>
                        </div>

                        <AIScorecardUploader courseId={course.id} initialScorecards={course.scorecards} />
                        
                    </div>
                </div>
              </div>
            )}

            {activeTab === 'inbox' && (
              <div style={{ animation: 'fadeIn 0.3s ease-in' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '0.4rem', color: '#05120c' }}>Organizer Inbox</h1>
                <p style={{ color: 'var(--mist)', fontSize: '1rem', marginBottom: '2.5rem' }}>Directly communicate with Tournament Directors interested in your venue.</p>
                <CourseInbox courseId={course.id} />
              </div>
            )}

            {activeTab === 'contracts' && (
              <div style={{ animation: 'fadeIn 0.3s ease-in' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '0.4rem', color: '#05120c' }}>E-Signature Agreements</h1>
                <p style={{ color: 'var(--mist)', fontSize: '1rem', marginBottom: '2.5rem' }}>Send and track digital execution of all Tournament Contracts directly in TourneyLinks.</p>
                <CourseContracts courseId={course.id} />
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

                 {/* PRICING VARIABLES CONTROL */}
                 <div style={{ marginTop: '2.5rem', padding: '1.5rem', background: '#fff', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.05)', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                       <div style={{ fontWeight: 900, fontSize: '1.1rem' }}>Global Pricing Parameters</div>
                    </div>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
                       <div>
                          <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--mist)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Core Player Fee</label>
                          <div style={{ position: 'relative' }}>
                             <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', fontWeight: 700, color: '#111' }}>$</span>
                             <input type="number" defaultValue={course.basePricePerPlayer || 100} style={{ padding: '0.75rem 1rem 0.75rem 2rem', border: '1px solid #ccc', borderRadius: '4px', width: '100%', fontWeight: 700, fontSize: '1rem' }} />
                          </div>
                          <p style={{ fontSize: '0.7rem', color: 'var(--mist)', marginTop: '0.4rem', lineHeight: 1.4 }}>Base 18-hole greens fee per player</p>
                       </div>
                       
                       <div>
                          <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--mist)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Cart Fee</label>
                          <div style={{ position: 'relative' }}>
                             <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', fontWeight: 700, color: '#111' }}>$</span>
                             <input type="number" defaultValue={course.cartFee || 25} style={{ padding: '0.75rem 1rem 0.75rem 2rem', border: '1px solid #ccc', borderRadius: '4px', width: '100%', fontWeight: 700, fontSize: '1rem' }} />
                          </div>
                          <p style={{ fontSize: '0.7rem', color: 'var(--mist)', marginTop: '0.4rem', lineHeight: 1.4 }}>Required rider cart fee</p>
                       </div>

                       <div>
                          <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--mist)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Catering Minimum</label>
                          <div style={{ position: 'relative' }}>
                             <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', fontWeight: 700, color: '#111' }}>$</span>
                             <input type="number" defaultValue={course.foodAndBeverageMinimum || 35} style={{ padding: '0.75rem 1rem 0.75rem 2rem', border: '1px solid #ccc', borderRadius: '4px', width: '100%', fontWeight: 700, fontSize: '1rem' }} />
                          </div>
                          <p style={{ fontSize: '0.7rem', color: 'var(--mist)', marginTop: '0.4rem', lineHeight: 1.4 }}>Base F&B spend requirement</p>
                       </div>
                    </div>

                    <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid rgba(0,0,0,0.05)', paddingTop: '1.5rem' }}>
                       <button className="btn-primary" style={{ padding: '0.75rem 1.5rem', background: 'var(--gold)', color: '#000', borderRadius: '4px', border: 'none', fontWeight: 800, cursor: 'pointer' }}>Save Parameters</button>   
                    </div>
                 </div>

              </div>
            )}

        </div>
      </div>
    </div>
  );
}
