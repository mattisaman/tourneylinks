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
import CourseProfileClient from '@/components/courses/CourseProfileClient';
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
          <div className="w-full relative border-b border-white/10 overflow-hidden flex flex-col justify-end" style={{ backgroundColor: '#020503', minHeight: '500px' }}>
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

          <CourseProfileClient course={course} scorecards={scorecards} hostedTournaments={hostedTournaments} />
      </main>
    </div>
  );
}
