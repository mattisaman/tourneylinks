import React from 'react';
import { db, courses, tournaments, course_scorecards } from '@/lib/db';
import { eq, asc } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';
import Link from 'next/link';
import { MapPin, Phone, Globe, ChevronLeft, Map, Flag } from 'lucide-react';
import FavoriteButton from './FavoriteButton';
import { getIsFavorited } from '@/app/actions/favoriteCourse';
import { getUserId } from '@/lib/auth-util';
import EagleValePricing from '@/components/courses/EagleValePricing';
import DigitalScorecards from '@/components/courses/DigitalScorecards';

export const dynamic = 'force-dynamic';

export default async function CourseDetailPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const courseId = parseInt(params.id, 10);
  if (isNaN(courseId)) notFound();

  const courseRows = await db.select().from(courses).where(eq(courses.id, courseId)).limit(1);
  const course = courseRows[0];

  if (!course) {
    return <div>Course not found.</div>;
  }

  // Fetch AI Digitize Scorecards if available
  const scorecards = await db.select().from(course_scorecards).where(eq(course_scorecards.courseId, courseId));

  // Fetch upcoming tournaments at this course natively!
  const hostedTournaments = await db.select()
    .from(tournaments)
    .where(eq(tournaments.courseId, courseId))
    .orderBy(asc(tournaments.dateStart));

  // Player Radar Tracking
  const { userId } = await getUserId();
  const isFavorited = await getIsFavorited(courseId);

  return (
    <div className="min-h-screen flex flex-col bg-[#050B08] pt-[80px]">

      <main className="flex-1 w-full">
          {/* NEW CINEMATIC PRESTIGE HERO */}
          {/* NEW CINEMATIC PRESTIGE HERO */}
          <div className="w-full relative border-b border-white/10 overflow-hidden flex flex-col justify-end" style={{ backgroundColor: '#020503', minHeight: '450px' }}>
             {/* Base Image Layer - Vibrant Golf Course! */}
             <div className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: course.heroImageUrl && course.heroImageUrl !== 'DEFAULT_GRADIENT' ? `url('${course.heroImageUrl}')` : "url('/hero-bg-4.jpg')", opacity: 0.95 }} />
             
             {/* Deep Ambient Mesh (Less intrusive, highly transparent) */}
             <div className="absolute top-[-10%] right-[-10%] w-[50vw] h-[50vh] rounded-full pointer-events-none z-0" style={{ backgroundColor: 'var(--gold)', opacity: 0.15, filter: 'blur(120px)' }} />
             <div className="absolute bottom-[-10%] left-[-10%] w-[40vw] h-[40vh] rounded-full pointer-events-none z-0" style={{ backgroundColor: 'var(--gold)', opacity: 0.10, filter: 'blur(100px)' }} />
             
             {/* Dark Wash mostly at the bottom for text readability, clear at the top to see the sky/course */}
             <div className="absolute inset-0 z-0 pointer-events-none" style={{ background: 'linear-gradient(to top, #050B08 0%, rgba(5,11,8,0.85) 30%, rgba(5,11,8,0.4) 60%, rgba(5,11,8,0) 100%)', opacity: 1 }} />

             <div className="w-full relative z-10" style={{ maxWidth: '1300px', margin: '0 auto', paddingLeft: 'clamp(2rem, 5vw, 4rem)', paddingRight: 'clamp(2rem, 5vw, 4rem)', paddingTop: '6rem', paddingBottom: '3.5rem' }}>
                <Link href="/courses" className="inline-flex items-center gap-2 text-white/70 hover:text-[var(--gold)] text-sm tracking-widest uppercase mb-8 transition-colors bg-black/40 px-4 py-2 rounded-full backdrop-blur-md border border-white/10 w-fit">
                  <ChevronLeft size={16} /> Directory
                </Link>

                <div className="flex flex-col xl:flex-row gap-10 xl:gap-16 xl:items-end justify-between">
                   <div className="flex-1 min-w-0">
                      <div className="flex items-center flex-wrap gap-4 mb-6">
                        <span className="bg-[var(--gold)] text-black text-xs font-black uppercase tracking-widest rounded-sm" style={{ padding: '6px 16px' }}>
                          {course.type || 'Public'}
                        </span>
                        <FavoriteButton courseId={course.id} initialFavorited={isFavorited} isSignedIn={!!userId} />
                      </div>
                      
                      <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white tracking-tight" style={{ fontFamily: 'var(--font-serif)', wordBreak: 'break-word', overflowWrap: 'break-word', marginBottom: '1.5rem' }}>
                        {course.name.replace(' Golf Course Inc', '').replace(' Golf Course, Inc.', '')}
                      </h1>
                      
                      <div className="flex items-center gap-4" style={{ color: 'rgba(255,255,255,0.5)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.25em', fontWeight: 700, fontFamily: 'var(--font-sans)', display: 'flex', alignItems: 'center' }}>
                        <MapPin size={14} style={{ color: 'var(--gold)' }} />
                        <span>{course.address ? `${course.address}, ` : ''}{course.city}, {course.state} {course.zip}</span>
                      </div>

                      {/* Amenities Row */}
                      {(course.hasDrivingRange || course.hasPuttingGreen || course.hasChippingArea || course.hasProShop) && (
                        <div className="flex flex-wrap gap-2 mt-8">
                          {course.hasDrivingRange && <span className="bg-white/5 border border-white/5 text-white/70 text-xs tracking-wider uppercase rounded-sm" style={{ padding: '4px 12px' }}>Range</span>}
                          {course.hasPuttingGreen && <span className="bg-white/5 border border-white/5 text-white/70 text-xs tracking-wider uppercase rounded-sm" style={{ padding: '4px 12px' }}>Putting Green</span>}
                          {course.hasChippingArea && <span className="bg-white/5 border border-white/5 text-white/70 text-xs tracking-wider uppercase rounded-sm" style={{ padding: '4px 12px' }}>Chipping Area</span>}
                          {course.hasProShop && <span className="bg-white/5 border border-white/5 text-white/70 text-xs tracking-wider uppercase rounded-sm" style={{ padding: '4px 12px' }}>Pro Shop</span>}
                          {course.yearBuilt && <span className="bg-[rgba(197,160,89,0.1)] border border-[rgba(197,160,89,0.2)] text-[var(--gold)] text-xs tracking-wider uppercase rounded-sm" style={{ padding: '4px 12px' }}>Est {course.yearBuilt}</span>}
                        </div>
                      )}
                   </div>

                   {/* Right Side Info Strip */}
                   <div className="flex flex-col md:flex-row xl:flex-col gap-6 lg:gap-10 min-w-0 flex-shrink-0">
                      
                      {/* KPI Flat Bar */}
                      <div className="flex flex-wrap items-center gap-6 lg:gap-10 border-b border-white/10 pb-6 lg:pb-0 lg:border-0">
                         <div>
                           <div className="text-[10px] text-white/40 uppercase tracking-widest mb-1 font-bold">Holes</div>
                           <div className="text-3xl font-black text-white font-mono flex items-center gap-2">
                             <Flag size={20} className="text-[var(--gold)]" />
                             {course.holes || '18'}
                           </div>
                         </div>
                         <div className="w-px h-10 bg-white/10 hidden sm:block" />
                         <div>
                           <div className="text-[10px] text-white/40 uppercase tracking-widest mb-1 font-bold">Par</div>
                           <div className="text-3xl font-black text-white font-mono">{course.par || '72'}</div>
                         </div>
                      </div>

                      {/* Contact Flat Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-y-3 gap-x-6 pt-2">
                         {course.phone && (
                           <div className="flex items-center gap-3 text-white/80 text-sm">
                              <Phone size={14} className="text-[var(--gold)] flex-shrink-0" /> {course.phone}
                           </div>
                         )}
                         <a href={`mailto:${course.email || (course.id === 10619 ? 'info@eaglevale.com' : 'info@tourneylinks.com')}`} className="flex items-center gap-3 text-white/80 text-sm hover:text-[var(--gold)] transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--gold)] flex-shrink-0"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                            <span className="truncate">{course.email || (course.id === 10619 ? 'info@eaglevale.com' : 'Contact Course Admin')}</span>
                         </a>
                         {course.website && (
                           <a href={course.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-[var(--gold)] text-sm font-bold hover:text-white transition-colors">
                              <Globe size={14} className="flex-shrink-0" /> Official Website
                           </a>
                         )}
                         
                         {!course.claimedByUserId && (
                           <div className="col-span-1 sm:col-span-2 lg:col-span-1 mt-4 pt-4 border-t border-white/5">
                              <div className="text-[9px] uppercase tracking-widest text-white/40 mb-2 font-bold">Course Administration</div>
                              <Link href={`/courses/${course.id}/claim`} className="flex items-center justify-between w-full bg-white/5 hover:bg-[var(--gold)]/10 border border-white/10 hover:border-[var(--gold)]/30 rounded-lg px-4 py-2.5 transition-all text-xs font-bold text-white/80 hover:text-[var(--gold)] group">
                                <span>Claim Pro Access</span>
                                <span className="opacity-0 group-hover:opacity-100 transition-opacity">&rarr;</span>
                              </Link>
                           </div>
                         )}
                      </div>
                   </div>
                </div>
             </div>
          </div>

          <div className="w-full bg-[#050B08]">
             {/* Guest Policy Band */}
             {course.guestPolicy && (
               <div className="w-full border-b border-[rgba(255,255,255,0.03)] bg-[#020604]">
                 <div className="w-full flex flex-col md:flex-row lg:items-center gap-4 lg:gap-12" style={{ maxWidth: '1300px', margin: '0 auto', paddingLeft: 'clamp(2rem, 5vw, 4rem)', paddingRight: 'clamp(2rem, 5vw, 4rem)', paddingBottom: '2rem', paddingTop: '2rem' }}>
                   <h3 className="text-[var(--gold)] font-black uppercase tracking-widest text-[10px] flex-shrink-0">Guest Policy</h3>
                   <p className="text-white/70 text-sm leading-relaxed max-w-4xl">{course.guestPolicy}</p>
                 </div>
               </div>
             )}

             {/* Digital Scorecard Injection */}
             <DigitalScorecards scorecards={scorecards} />

             {/* Builder Module */}
             <div className="w-full relative z-30">
               {course.id === 10619 ? (
                 <EagleValePricing courseName={course.name} courseEmail={course.email || 'info@eaglevale.com'} />
               ) : (
                 <div className="w-full" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '8rem 2rem', background: 'linear-gradient(180deg, rgba(2,6,4,0) 0%, rgba(20,35,20,0.6) 50%, rgba(2,6,4,0) 100%)', position: 'relative', borderTop: '1px solid rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.03)', marginTop: '2rem' }}>
                    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '800px', height: '800px', background: 'radial-gradient(circle, rgba(201,168,76,0.05) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />
                    
                    <h2 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontFamily: "'Clash Display', sans-serif", fontWeight: 600, color: 'var(--white)', marginBottom: '1.5rem', position: 'relative', zIndex: 10, letterSpacing: '-0.02em' }}>
                      Host at <span style={{ color: 'var(--gold)' }}>{course.name}</span>
                    </h2>
                    
                    <p style={{ fontSize: '1.25rem', color: 'rgba(255,255,255,0.6)', maxWidth: '750px', lineHeight: 1.7, marginBottom: '3.5rem', position: 'relative', zIndex: 10 }}>
                      Bring your tournament to life on these pristine fairways. We streamline the registration and management process, delivering a premium, transparent experience for organizers and players alike.
                    </p>
                    
                    <a href={`mailto:${course.email || 'info@tourneylinks.com'}`} className="gold-foil-hover hover:brightness-125" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: '1.4rem 3.5rem', background: 'rgba(201,168,76,0.05)', border: '1px solid rgba(201,168,76,0.3)', color: 'var(--gold)', letterSpacing: '0.2em', textTransform: 'uppercase', fontSize: '0.9rem', fontWeight: 600, transition: 'all 0.3s ease', position: 'relative', zIndex: 10, textDecoration: 'none' }}>
                      Contact Director &rarr;
                    </a>
                 </div>
               )}
             </div>
          </div>

          {/* PHASE 41: THE LOCAL ECOSYSTEM LOOP */}
          {hostedTournaments.length > 0 && (
            <div style={{ marginTop: '4rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.8rem', color: 'var(--white)', fontWeight: 600, fontFamily: "'Clash Display', sans-serif" }}>
                  Active Tournaments
                </h2>
                <span style={{ background: 'rgba(212,175,55,0.1)', color: 'var(--gold)', padding: '0.4rem 1rem', borderRadius: '50px', fontSize: '0.8rem', fontWeight: 700 }}>
                  {hostedTournaments.length} Event{hostedTournaments.length !== 1 ? 's' : ''}
                </span>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
                {hostedTournaments.map((t) => (
                  <Link href={`/tournaments/${t.id}`} key={t.id} style={{ textDecoration: 'none' }}>
                    <div className="hover:-translate-y-1 hover:shadow-xl hover:shadow-[rgba(212,175,55,0.1)]" style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '1.5rem', cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 4px 15px rgba(0,0,0,0.2)' }}>
                      <div style={{ fontSize: '0.8rem', color: 'var(--gold)', fontWeight: 600, marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
                        {new Date(t.dateStart).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </div>
                      <h3 style={{ color: 'var(--white)', fontSize: '1.1rem', marginBottom: '1rem', lineHeight: 1.3, fontWeight: 600 }}>
                        {t.name}
                      </h3>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1rem' }}>
                        <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem' }}>{t.format || 'Standard Format'}</span>
                        <span style={{ color: 'var(--gold)', fontWeight: 700, fontSize: '0.9rem' }}>View Event &rarr;</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

      </main>
    </div>
  );
}
