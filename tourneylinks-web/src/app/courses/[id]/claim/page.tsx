import React from 'react';
import { db, courses } from '@/lib/db';
import { eq } from 'drizzle-orm';
import { notFound, redirect } from 'next/navigation';
import { getUserId } from '@/lib/auth-util';
import ClaimCourseClient from './ClaimCourseClient';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function CourseClaimPage(props: { params: Promise<{ id: string }> }) {
  const { userId } = await getUserId();
  if (!userId) {
    redirect('/sign-in'); // Standard Clerk boundary
  }

  const params = await props.params;
  const courseId = parseInt(params.id, 10);
  if (isNaN(courseId)) notFound();

  const courseRows = await db.select().from(courses).where(eq(courses.id, courseId)).limit(1);
  const course = courseRows[0];

  if (!course) notFound();

  // If already claimed, prevent re-claiming for now (unless we want multi-admin)
  if (course.claimedByUserId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050B08] p-8">
        <div className="max-w-md text-center">
          <h1 className="text-[var(--gold)] text-3xl font-bold mb-4 font-serif">Venue Already Claimed</h1>
          <p className="text-white/60 mb-8">This facility is already managed by a verified Professional on TourneyLinks.</p>
          <Link href={`/courses/${courseId}`} className="btn-hero-outline px-8 py-3 rounded-full border border-white/20 text-white hover:text-[var(--gold)] transition-colors">
            Return to Venue
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7] relative overflow-hidden font-sans">
      
      {/* 
         DARK FOREST TOP HEADER 
         Serves two purposes: 
         1. Provides a beautiful dark backdrop so the transparent Top Navbar text remains legible. 
         2. Roots the design in the official Max Pro Palette var(--admin-forest-dark).
      */}
      <div className="absolute top-0 left-0 right-0 h-[540px] z-0" style={{ background: 'linear-gradient(180deg, var(--admin-forest-dark) 0%, #053321 100%)' }} />

      {/* Subtle Canvas Dot Grid for Physical Texture (From Aggregator) */}
      <div style={{ position: 'absolute', top: '540px', left: 0, right: 0, bottom: 0, backgroundImage: 'radial-gradient(rgba(0, 0, 0, 0.04) 2px, transparent 2px)', backgroundSize: '30px 30px', zIndex: 0, pointerEvents: 'none' }}></div>

      {/* Ambient Glassmorphism Background Washes (From Aggregator) */}
      <div style={{ position: 'absolute', top: '300px', right: '-5%', width: '700px', height: '700px', background: 'radial-gradient(circle, rgba(230, 194, 122, 0.25) 0%, rgba(255,255,255,0) 70%)', filter: 'blur(70px)', zIndex: 0, pointerEvents: 'none', mixBlendMode: 'multiply' }}></div>
      <div style={{ position: 'absolute', bottom: '-10%', left: '-5%', width: '900px', height: '900px', background: 'radial-gradient(circle, rgba(91, 123, 97, 0.2) 0%, rgba(255,255,255,0) 80%)', filter: 'blur(90px)', zIndex: 0, pointerEvents: 'none', mixBlendMode: 'multiply' }}></div>
      <div style={{ position: 'absolute', top: '40%', left: '30%', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(126, 99, 238, 0.08) 0%, rgba(255,255,255,0) 70%)', filter: 'blur(100px)', zIndex: 0, pointerEvents: 'none', mixBlendMode: 'multiply' }}></div>


      <div className="w-full relative z-10 flex flex-col items-center pb-32 px-4 md:px-12">
         
         {/* Super Admin Header Pattern */}
         <div className="w-full max-w-4xl mb-16 text-center md:text-left" style={{ marginTop: '180px' }}>
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-8">
               <div className="flex-1">
                 <h1 className="text-5xl md:text-6xl font-serif font-bold tracking-tight mb-4" style={{ letterSpacing: '-0.5px', color: 'var(--admin-golf-white)', textShadow: '0 4px 20px rgba(0,0,0,0.4)' }}>
                   Course Administration Node
                 </h1>
                 <p className="text-lg md:text-xl max-w-2xl leading-relaxed" style={{ color: 'var(--admin-sand)' }}>
                   Securely bind <strong className="text-white font-bold">{course.name}</strong> to your Professional Account to unlock dynamic pricing, lead routing, and roster management.
                 </p>
               </div>
               
               <div className="flex-shrink-0 pt-2">
                  <Link href={`/courses/${courseId}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.8rem 1.6rem', background: 'rgba(255,255,255,0.1)', color: 'var(--admin-golf-white)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '12px', fontWeight: 600, fontSize: '0.95rem', cursor: 'pointer', transition: 'all 0.2s', backdropFilter: 'blur(10px)' }} className="hover:bg-white/20 shadow-md">
                    <ChevronLeft size={18} /> Cancel Request
                  </Link>
               </div>
            </div>
         </div>

         {/* Centered Form Card (Aggregator Style) */}
         <div className="w-full max-w-4xl bg-white border border-[rgba(0,0,0,0.04)] rounded-[2.5rem] p-10 md:p-16 shadow-[0_30px_80px_rgba(0,0,0,0.15)] relative z-20">
            <ClaimCourseClient courseId={course.id} courseName={course.name} />
         </div>

      </div>
    </div>
  );
}
