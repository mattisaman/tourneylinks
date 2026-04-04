"use client";

import React, { useState } from 'react';
import DigitalScorecards from './DigitalScorecards';
import EagleValePricing from './EagleValePricing';
import { ChevronRight, ArrowRight, Flag, Calendar as CalendarIcon, Map, Info, Star } from 'lucide-react';
import Link from 'next/link';

export default function CourseProfileClient({ course, scorecards, hostedTournaments }: { course: any, scorecards: any[], hostedTournaments: any[] }) {
  const [activeTab, setActiveTab] = useState<'overview'|'scorecard'|'calculator'|'media'>('overview');

  const navItems = [
     { id: 'overview', label: 'Venue Overview', icon: Info },
     { id: 'scorecard', label: 'Digital Scorecard', icon: Flag },
     { id: 'calculator', label: 'Tournament Calculator', icon: CalendarIcon },
     { id: 'media', label: 'Media Gallery', icon: Map }
  ];

  return (
     <div className="w-full relative z-20" style={{ display: 'flex', minHeight: '800px', background: '#050B08', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
       
       {/* Hub-Style Solid Sidebar */}
       <div style={{ width: '280px', flexShrink: 0, background: '#0a100d', borderRight: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', paddingTop: '3rem', paddingBottom: '3rem' }}>
          <div className="sticky top-[100px] flex flex-col">
             
             <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'rgba(255,255,255,0.4)', marginBottom: '1rem', padding: '0 1.5rem' }}>
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
                         padding: '0.85rem 1.5rem', 
                         color: isActive ? 'var(--gold)' : 'rgba(255,255,255,0.6)', 
                         fontSize: '0.9rem', 
                         cursor: 'pointer', 
                         display: 'flex', 
                         alignItems: 'center',
                         justifyContent: 'flex-start',
                         transition: '0.2s', 
                      }}
                      className="hover:bg-white/5 hover:text-white/90"
                   >
                      <Icon size={18} className={isActive ? 'text-[var(--gold)] mr-3' : 'opacity-70 mr-3'} />
                      <span className="font-medium tracking-wide">{item.label}</span>
                   </button>
                );
             })}

             <div className="mt-12 px-6">
               <div className="p-5 rounded-md border border-[var(--gold)]/20 bg-[var(--gold)]/5 relative overflow-hidden group cursor-pointer transition-all hover:bg-[var(--gold)]/10">
                  <div className="absolute inset-0 bg-gradient-to-br from-[var(--gold)]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <h4 className="text-white font-bold mb-1 font-serif text-lg">Inquire Now</h4>
                  <p className="text-white/50 text-xs mb-4 leading-relaxed">Directly engage venue management for your next corporate outing.</p>
                  <div className="flex items-center gap-2 text-[var(--gold)] text-xs font-bold uppercase tracking-widest">
                     Message Pro <ArrowRight size={14} />
                  </div>
               </div>
             </div>

          </div>
       </div>

       {/* Main Content Pane */}
       <div className="flex-1 min-w-0 py-12 px-8 lg:px-16" style={{ background: '#050B08' }}>
             {/* OVERVIEW */}
             {activeTab === 'overview' && (
                <div className="animate-fadeIn">
                   <h2 className="text-3xl font-serif text-white mb-6">Welcome to {course.name}</h2>
                   <div className="prose prose-invert max-w-none text-white/70 text-sm leading-relaxed mb-12">
                      <p>
                        {course.description || `Welcome to ${course.name}, a premier golf destination that seamlessly blends championship-caliber design with immaculate conditioning. Ideal for corporate outings, charity fundraisers, and competitive tournaments, our facility offers comprehensive event hosting capabilities including full-service digital live-scoring, customized catering packages, and professional bag drop services.`}
                      </p>
                      <p className="mt-4">
                        Discover why thousands of players and tournament directors elect to partner with our professional staff year over year to deliver an unforgettable premium golfing experience.
                      </p>
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
                         <div key={idx} className="bg-[#0A120E] border border-white/5 rounded-md p-4 flex items-center gap-3">
                            <Star size={14} className="text-[var(--gold)]" />
                            <span className="text-white/80 text-sm">{amt.label}</span>
                         </div>
                      ))}
                   </div>
                   
                   {hostedTournaments && hostedTournaments.length > 0 && (
                      <>
                         <h3 className="text-xl font-bold text-white mb-6 tracking-wide">Upcoming Tournaments</h3>
                         <div className="grid gap-3">
                            {hostedTournaments.map((t) => (
                               <Link href={`/t/${t.slug}`} key={t.id} className="block w-full border border-white/10 bg-white/5 rounded-md p-4 hover:bg-white/10 transition-colors">
                                 <div className="flex items-center justify-between">
                                    <div>
                                       <div className="text-white font-bold text-lg mb-1">{t.name}</div>
                                       <div className="text-[var(--gold)] text-xs tracking-widest uppercase">{t.format || 'Scramble'}</div>
                                    </div>
                                    <div className="text-right">
                                       <div className="text-white/80 text-sm mb-1">{new Date(t.dateStart).toLocaleDateString()}</div>
                                       <div className="text-white/40 text-xs">{(t.playerCapacity || 144) - (t.ticketsSold || 0)} Spots Left</div>
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
  );
}
