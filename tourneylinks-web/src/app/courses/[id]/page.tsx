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
          <section className="hero relative flex flex-col justify-end overflow-hidden" style={{ padding: 0, maxWidth: 'none', minHeight: '500px' }}>
             {/* Actual Image Base Layer */}
             <div className="absolute inset-0 z-0 bg-black">
                <div className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity" style={{ backgroundImage: course.heroImageUrl && course.heroImageUrl !== 'DEFAULT_GRADIENT' ? `url('${course.heroImageUrl}')` : "url('/hero-bg-4.jpg')", opacity: 0.4 }} />
             </div>
             
             {/* Tech Mesh & Dots */}
             <div className="hero-grid absolute inset-0 z-0" style={{ opacity: 0.05 }} />
             <div className="hero-dots absolute inset-0 z-0" style={{ opacity: 0.1 }} />
             
             {/* Specular highlights */}
             <div className="absolute top-[-10%] right-[-10%] w-[50vw] h-[50vh] rounded-full pointer-events-none z-0" style={{ backgroundColor: 'var(--gold)', opacity: 0.2, filter: 'blur(120px)' }} />
             <div className="absolute bottom-[-10%] left-[-10%] w-[40vw] h-[40vh] rounded-full pointer-events-none z-0" style={{ backgroundColor: 'var(--gold)', opacity: 0.15, filter: 'blur(100px)' }} />
             
             {/* Gradient washout */}
             <div className="absolute inset-0 z-0 pointer-events-none" style={{ background: 'linear-gradient(to top, #050B08 0%, rgba(5,11,8,0.7) 40%, transparent 100%)' }} />

             <div className="hero-content relative z-10 w-full" style={{ maxWidth: '1800px', margin: '0 auto', paddingLeft: 'clamp(2rem, 5vw, 4rem)', paddingRight: 'clamp(2rem, 5vw, 4rem)', paddingTop: '0', paddingBottom: '6rem' }}>
                <Link href="/courses" className="inline-flex items-center gap-2 text-white hover:text-[var(--gold)] text-sm tracking-widest uppercase mb-8 transition-colors bg-white/5 border border-white/20 hover:bg-white/10 w-fit cursor-pointer shadow-lg" style={{ padding: '0.6rem 1.5rem', borderRadius: '100px' }}>
                  <ChevronLeft size={16} /> Directory
                </Link>

                <div className="flex flex-col xl:flex-row gap-10 xl:gap-16 xl:items-end justify-between">
                   <div className="flex-1 min-w-0">
                      <div className="flex items-center flex-wrap gap-4 mb-4">
                        <div className="hero-eyebrow" style={{ margin: 0, justifyContent: 'flex-start' }}>
                          {course.type || 'Public'}
                        </div>
                        <FavoriteButton courseId={course.id} initialFavorited={isFavorited} isSignedIn={!!userId} />
                      </div>
                      
                      <h1 className="hero-headline" style={{ maxWidth: '100%', textAlign: 'left', wordBreak: 'break-word', overflowWrap: 'break-word', marginBottom: '1rem', paddingBottom: 0 }}>
                        {course.name.replace(' Golf Course Inc', '').replace(' Golf Course, Inc.', '')}
                      </h1>
                      
                      <div className="flex items-center gap-4" style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: 700, fontFamily: 'var(--font-sans)' }}>
                        <MapPin size={16} style={{ color: 'var(--gold)' }} />
                        <span>{course.address ? `${course.address}, ` : ''}{course.city}, {course.state} {course.zip}</span>
                      </div>

                      {/* Amenities Row */}
                      {(course.hasDrivingRange || course.hasPuttingGreen || course.hasChippingArea || course.hasProShop) && (
                        <div className="flex flex-wrap gap-2 mt-6">
                          {course.hasDrivingRange && <span className="metallic-gold text-[var(--forest)] text-xs tracking-wider uppercase rounded-sm" style={{ padding: '6px 14px' }}>Range</span>}
                          {course.hasPuttingGreen && <span className="bg-white/5 border border-[var(--gold)]/30 text-[var(--gold)] text-xs tracking-wider uppercase rounded-sm" style={{ padding: '6px 14px' }}>Putting Green</span>}
                          {course.hasChippingArea && <span className="bg-white/5 border border-[var(--gold)]/30 text-[var(--gold)] text-xs tracking-wider uppercase rounded-sm" style={{ padding: '6px 14px' }}>Chipping Area</span>}
                          {course.hasProShop && <span className="bg-white/5 border border-[var(--gold)]/30 text-[var(--gold)] text-xs tracking-wider uppercase rounded-sm" style={{ padding: '6px 14px' }}>Pro Shop</span>}
                          {course.yearBuilt && <span className="bg-white/5 border border-[var(--gold)]/30 text-[var(--gold)] text-xs tracking-wider uppercase rounded-sm" style={{ padding: '6px 14px' }}>Est {course.yearBuilt}</span>}
                        </div>
                      )}
                   </div>

                   {/* Right Side Info Strip */}
                   <div className="flex flex-col md:flex-row xl:flex-col gap-6 lg:gap-8 min-w-0 flex-shrink-0">
                      
                      {/* KPI Flat Bar */}
                      <div className="flex flex-wrap items-center gap-8 lg:gap-12 border-b border-white/10 pb-6 lg:pb-0 lg:border-0">
                         <div>
                           <div className="text-[10px] text-[var(--gold)] uppercase tracking-widest mb-1 font-bold">Holes</div>
                           <div className="text-4xl font-black text-white font-mono flex items-center gap-2" style={{ textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
                             <Flag size={24} className="text-[var(--gold)]" />
                             {course.holes || '18'}
                           </div>
                         </div>
                         <div className="w-px h-12 bg-[var(--gold)]/20 hidden sm:block" />
                         <div>
                           <div className="text-[10px] text-[var(--gold)] uppercase tracking-widest mb-1 font-bold">Par</div>
                           <div className="text-4xl font-black text-white font-mono" style={{ textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>{course.par || '72'}</div>
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
                              <div className="text-[9px] uppercase tracking-widest text-[#67786f] mb-2 font-bold">Course Administration</div>
                              <Link href={`/courses/${course.id}/claim`} className="btn-hero-outline w-full text-center py-2" style={{ fontSize: '0.75rem', padding: '0.6rem 1rem' }}>
                                 Claim Pro Access →
                              </Link>
                           </div>
                         )}
                      </div>
                   </div>
                </div>
             </div>
          </section>

          <CourseProfileClient course={course} scorecards={scorecards} hostedTournaments={hostedTournaments} />
      </main>
    </div>
  );
}
