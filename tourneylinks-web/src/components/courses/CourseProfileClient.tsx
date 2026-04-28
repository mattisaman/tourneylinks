"use client";

import React, { useState } from 'react';
import DigitalScorecards from './DigitalScorecards';
import EagleValePricing from './EagleValePricing';
import { ChevronRight, ArrowRight, Flag, Calendar as CalendarIcon, Map, Info, Star, BookOpen, Zap } from 'lucide-react';
import Link from 'next/link';

export default function CourseProfileClient({ course, scorecards, hostedTournaments }: { course: any, scorecards: any[], hostedTournaments: any[] }) {
  const [activeTab, setActiveTab] = useState<'overview'|'scorecard'|'calculator'|'documentation'|'media'>('overview');

  const navItems = [
     { id: 'overview', label: 'Venue Overview', icon: Info },
     { id: 'scorecard', label: 'Digital Scorecard', icon: Flag },
     { id: 'calculator', label: 'Tournament Calculator', icon: CalendarIcon },
     { id: 'documentation', label: 'Venue Documentation', icon: BookOpen },
     { id: 'media', label: 'Media Gallery', icon: Map }
  ];

  return (
     <div className="w-full relative z-20 bg-[#050B08]" style={{ minHeight: '800px' }}>
       <div className="w-full flex flex-col md:flex-row gap-8 lg:gap-16 pb-32" style={{ maxWidth: '1800px', margin: '0 auto', paddingLeft: 'clamp(2rem, 5vw, 4rem)', paddingRight: 'clamp(2rem, 5vw, 4rem)', paddingTop: '6rem' }}>
          
          {/* Sidebar - Floats inside container aligned with Hero text */}
          <div className="w-full md:w-[320px] flex-shrink-0">
             <div className="sticky top-[100px] flex flex-col gap-6">
                
                <div className="hero-pillar-card" style={{ padding: '1.5rem' }}>
                   <div style={{ color: 'var(--gold)', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '1.5rem', paddingLeft: '0.5rem' }}>
                     Venue Modules
                   </div>

                {navItems.map(item => {
                   const Icon = item.icon;
                   const isActive = activeTab === item.id;
                   return (
                      <button 
                         key={item.id}
                         onClick={() => setActiveTab(item.id as any)}
                         style={{ 
                            background: isActive ? 'rgba(212,175,55,0.1)' : 'transparent', 
                            borderLeft: isActive ? '3px solid var(--gold)' : '3px solid transparent', 
                            padding: '0.85rem 1rem', 
                            color: isActive ? 'var(--gold)' : 'rgba(255,255,255,0.6)', 
                            fontSize: '0.9rem', 
                            cursor: 'pointer', 
                            display: 'flex', 
                            alignItems: 'center',
                            justifyContent: 'flex-start',
                            transition: '0.2s', 
                            marginLeft: '-1.5rem',
                            paddingLeft: '1.5rem',
                            borderTopRightRadius: '6px',
                            borderBottomRightRadius: '6px',
                            width: 'calc(100% + 1.5rem)'
                         }}
                         className="hover:bg-white/5 hover:text-white/90"
                      >
                         <Icon size={18} className={isActive ? 'text-[var(--gold)] mr-3' : 'opacity-70 mr-3'} />
                         <span className="font-medium tracking-wide">{item.label}</span>
                      </button>
                   );
                })}
                </div>

                <div className="hero-pillar-card" style={{ padding: '2rem 1.5rem', display: 'flex', flexDirection: 'column' }}>
                   <h3 style={{ color: 'var(--gold)', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', margin: '0 0 0.5rem' }}>Host Here</h3>
                   <h2 style={{ color: 'var(--cream)', fontSize: '1.75rem', fontFamily: 'var(--font-serif), serif', margin: '0 0 1rem', lineHeight: 1.1 }}>Inquire <br/>Now</h2>
                   <p style={{ color: 'rgba(245,240,232,0.65)', fontSize: '0.9rem', lineHeight: 1.6, margin: '0 0 1.5rem', flexGrow: 1 }}>
                     Directly engage venue management to schedule your next corporate outing or fundraiser.
                   </p>
                   <button className="btn-hero" style={{ width: '100%', justifyContent: 'center', padding: '1rem', border: 'none', cursor: 'pointer' }}>
                      Message Pro →
                   </button>
                </div>

             </div>
          </div>

          {/* Main Content Pane */}
          <div className="flex-1 min-w-0" style={{ background: 'transparent' }}>
             {/* OVERVIEW */}
             {activeTab === 'overview' && (
                <div className="animate-fadeIn">
                   
                   <div className="animated-gold-border" style={{ background: 'rgba(20,35,20,0.4)', backdropFilter: 'blur(16px)', borderRadius: '20px', padding: '3rem 2.5rem', marginBottom: '4rem', position: 'relative', overflow: 'hidden' }}>
                      {/* Decorative Element */}
                      <span style={{ position: 'absolute', top: '-10%', left: '2%', fontSize: '15rem', color: 'rgba(212,175,55,0.03)', fontFamily: 'serif', lineHeight: 1, pointerEvents: 'none', userSelect: 'none' }}>"</span>
                      
                      <div style={{ position: 'relative', zIndex: 10 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                          <span style={{ display: 'block', width: '30px', height: '2px', background: 'var(--gold)' }}></span>
                          <span style={{ color: 'var(--gold)', letterSpacing: '0.15em', textTransform: 'uppercase', fontSize: '0.75rem', fontWeight: 700 }}>Venue Overview</span>
                        </div>
                        
                        <h2 style={{ fontFamily: 'var(--font-serif), var(--font-cinzel), serif', fontSize: '2.5rem', color: 'var(--cream)', marginBottom: '1.5rem', lineHeight: 1.2 }}>
                          Welcome to {course.name}
                        </h2>
                        
                        <div style={{ color: 'rgba(255,255,255,0.85)', fontSize: '1.1rem', lineHeight: 1.8, fontWeight: 300, maxWidth: '90%' }}>
                          <p style={{ marginBottom: '1.5rem' }}>
                            {course.description || `A premier golf destination that seamlessly blends championship-caliber design with immaculate conditioning. Ideal for corporate outings, charity fundraisers, and competitive tournaments, our facility offers comprehensive event hosting capabilities including full-service digital live-scoring, customized catering packages, and professional bag drop services.`}
                          </p>
                          <p style={{ fontStyle: 'italic', color: 'var(--gold)', opacity: 0.9 }}>
                            Discover why thousands of players and tournament directors elect to partner with our professional staff year over year to deliver an unforgettable premium golfing experience.
                          </p>
                        </div>
                      </div>
                   </div>

                   <h3 className="text-xl font-bold text-white mb-6 tracking-wide">Course Amenities</h3>
                   <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-12">
                      {[
                         { active: course.hasDrivingRange, label: 'Driving Range' },
                         { active: course.hasPuttingGreen, label: 'Putting Green' },
                         { active: course.hasChippingArea, label: 'Chipping Area' },
                         { active: course.hasProShop, label: 'Pro Shop' },
                         { active: true, label: 'Restaurant / Grill' },
                         { active: true, label: 'Event Banquet Hall' },
                      ].map((amt, idx) => amt.active && (
                         <div key={idx} className="feature-card min-h-[0px]" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <div className="feature-icon" style={{ marginBottom: 0, fontSize: '1.25rem' }}>✨</div>
                            <div className="feature-title" style={{ fontSize: '0.95rem', marginBottom: 0 }}>{amt.label}</div>
                         </div>
                      ))}
                   </div>
                   
                   {hostedTournaments && hostedTournaments.length > 0 && (
                      <>
                         <h3 className="text-xl font-bold text-white mb-6 tracking-wide">Upcoming Tournaments</h3>
                         <div className="grid gap-3">
                             {hostedTournaments.map((t) => (
                                <Link href={`/t/${t.slug}`} key={t.id} className="feature-card group min-h-[0px]" style={{ padding: '1.25rem' }}>
                                  <div className="flex items-center justify-between">
                                     <div>
                                        <div className="text-white font-bold text-lg mb-1 group-hover:text-[var(--gold)] transition-colors">{t.name}</div>
                                        <div className="text-[var(--gold)] text-xs tracking-widest uppercase font-bold">{t.format || 'Scramble'}</div>
                                     </div>
                                     <div className="text-right">
                                        <div className="text-white/80 text-sm mb-1">{new Date(t.dateStart).toLocaleDateString()}</div>
                                        <div className="text-[var(--gold)] opacity-70 text-xs font-bold">{(t.playerCapacity || 144) - (t.ticketsSold || 0)} Spots Left</div>
                                     </div>
                                  </div>
                                </Link>
                             ))}
                         </div>
                      </>
                   )}
                </div>
             )}

             {/* CALENDAR / CALCULATOR */}
             {activeTab === 'calculator' && (
                <div className="animate-fadeIn w-full relative z-30">
                   <EagleValePricing courseName={course.name} courseEmail={course.email || 'info@tourneylinks.com'} />
                </div>
             )}

             {/* DIGITAL SCORECARD */}
             {activeTab === 'scorecard' && (
                <div className="animate-fadeIn -mx-4 md:-mx-12">
                   <DigitalScorecards scorecards={scorecards} />
                </div>
             )}

             {/* VENUE DOCUMENTATION */}
             {activeTab === 'documentation' && (
                <div className="animate-fadeIn">
                   <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                     <span style={{ display: 'block', width: '30px', height: '2px', background: 'var(--gold)' }}></span>
                     <span style={{ color: 'var(--gold)', letterSpacing: '0.15em', textTransform: 'uppercase', fontSize: '0.75rem', fontWeight: 700 }}>Official Documents</span>
                   </div>
                   
                   <h2 style={{ fontFamily: 'var(--font-serif), var(--font-cinzel), serif', fontSize: '2.5rem', color: 'var(--cream)', marginBottom: '1.5rem', lineHeight: 1.2 }}>
                     Rules, Policies & Information
                   </h2>

                    {course.normalizedRules || course.originalDocumentUrls || course.normalizedFaq ? (
                      <div className="grid gap-6">
                         {course.originalDocumentUrls && JSON.parse(course.originalDocumentUrls).length > 0 && (
                           <div className="hero-pillar-card p-6 border border-white/10">
                             <h3 className="text-[var(--gold)] uppercase tracking-widest text-xs font-bold mb-4">Original Attachments</h3>
                             <div className="flex flex-col gap-3">
                               {JSON.parse(course.originalDocumentUrls).map((url: string, i: number) => (
                                 <a key={i} href={url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-white hover:text-[var(--gold)] bg-white/5 p-3 rounded-md transition-colors">
                                   <BookOpen size={16} className="text-[var(--gold)]" />
                                   <span className="text-sm font-medium">Download Document {i + 1}</span>
                                 </a>
                               ))}
                             </div>
                           </div>
                         )}
                         
                         {course.normalizedRules && (
                           <div className="hero-pillar-card p-6 border border-white/10">
                             <h3 className="text-[var(--gold)] uppercase tracking-widest text-xs font-bold mb-4">Venue Rules</h3>
                             <div className="text-white/80 text-sm leading-relaxed whitespace-pre-wrap">
                               {course.normalizedRules}
                             </div>
                           </div>
                         )}

                         {course.normalizedFaq && (
                           <div className="hero-pillar-card p-6 border border-white/10">
                             <h3 className="text-[var(--gold)] uppercase tracking-widest text-xs font-bold mb-4">Venue FAQ</h3>
                             <div className="text-white/80 text-sm leading-relaxed whitespace-pre-wrap">
                               {course.normalizedFaq}
                             </div>
                           </div>
                         )}
                      </div>
                    ) : (
                      <div className="text-center py-24 border border-dashed border-white/10 rounded-md bg-white/5">
                         <BookOpen className="mx-auto text-white/20 mb-4" size={48} />
                         <h3 className="text-white font-bold text-lg mb-2">No Documentation Available</h3>
                         <p className="text-white/50 text-sm max-w-md mx-auto">
                           Tournament conditions, dress codes, and outing policies for this venue have not been digitized yet.
                         </p>
                      </div>
                    )}

                    {/* Admin Extraction Tool */}
                    <div className="mt-8 p-6 border border-white/10 bg-black/40 rounded-xl">
                      <h3 className="text-[var(--gold)] uppercase tracking-widest text-xs font-bold mb-4 flex items-center gap-2">
                        <Zap size={14} /> Admin Tools: Ingest Documentation URL
                      </h3>
                      <div className="flex gap-4">
                        <input 
                          type="text" 
                          id="docUrlInput"
                          placeholder="Paste URL to PDF or Golf Outing webpage..." 
                          className="flex-1 bg-white/5 border border-white/10 rounded-md px-4 py-2 text-white outline-none focus:border-[var(--gold)] transition-colors"
                        />
                        <button 
                          onClick={async (e) => {
                            const btn = e.currentTarget;
                            const input = document.getElementById('docUrlInput') as HTMLInputElement;
                            if (!input || !input.value) return;
                            
                            btn.disabled = true;
                            btn.innerText = 'Extracting...';
                            
                            try {
                              const res = await fetch('/api/courses/extract-docs', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ courseId: course.id, url: input.value })
                              });
                              if (res.ok) {
                                window.location.reload();
                              } else {
                                btn.innerText = 'Failed';
                                setTimeout(() => { btn.innerText = 'Run AI Extraction'; btn.disabled = false; }, 3000);
                              }
                            } catch (err) {
                              console.error(err);
                              btn.innerText = 'Error';
                            }
                          }}
                          className="bg-[var(--gold-dark)] text-white font-bold px-6 py-2 rounded-md transition-colors hover:bg-[var(--gold)] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Run AI Extraction
                        </button>
                      </div>
                      <p className="text-white/40 text-xs mt-3">This will fetch the URL via FireCrawl and use Gemini to format the rules and FAQ.</p>
                    </div>
                 </div>
              )}

             {/* MEDIA */}
             {activeTab === 'media' && (
                <div className="animate-fadeIn text-center py-24 border border-dashed border-white/10 rounded-md">
                   <Map className="mx-auto text-white/20 mb-4" size={48} />
                   <h3 className="text-white font-bold text-lg mb-2">Media Gallery</h3>
                   <p className="text-white/50 text-sm">Venue interactive map and aerial topography coming soon.</p>
                </div>
             )}
           </div>
       </div>
     </div>
  );
}
