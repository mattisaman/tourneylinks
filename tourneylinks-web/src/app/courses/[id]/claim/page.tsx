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
    <div className="min-h-screen bg-[#050B08] flex flex-col pt-[80px]">
      <div className="flex-1 w-full flex">
         
         {/* Left Side: Visuals */}
         <div className="hidden lg:flex flex-1 relative bg-[#020503] border-r border-white/5 p-16 flex-col justify-between">
           <div className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: course.heroImageUrl && course.heroImageUrl !== 'DEFAULT_GRADIENT' ? `url('${course.heroImageUrl}')` : "url('/hero-bg-4.jpg')", opacity: 0.2 }} />
           <div className="absolute inset-0 z-0 bg-gradient-to-t from-[#020503] to-transparent" />
           <div className="absolute inset-0 z-0 bg-gradient-to-r from-transparent to-[#050B08]" />
           
           <div className="relative z-10">
             <Link href={`/courses/${courseId}`} className="inline-flex items-center gap-2 text-white/50 hover:text-[var(--gold)] text-sm tracking-widest uppercase mb-12 transition-colors">
                <ChevronLeft size={16} /> Cancel
             </Link>
             <h1 className="text-5xl xl:text-6xl font-bold text-white tracking-tight" style={{ fontFamily: "'Clash Display', sans-serif" }}>
               Claim Official Venue Access
             </h1>
             <p className="text-white/60 mt-6 text-lg leading-relaxed max-w-lg">
               Securely lock {course.name} to your Pro Account to unlock dynamic pricing tools, direct tournament lead generation, and course roster management.
             </p>
           </div>

           <div className="relative z-10 border-t border-white/10 pt-8">
             <div className="flex items-center gap-4 text-white/40 text-sm font-mono tracking-widest uppercase mb-2">
               Security Layer Active
             </div>
             <p className="text-white/30 text-xs">PGA Affiliation verification powered by Gemini OCR Infrastructure.</p>
           </div>
         </div>

         {/* Right Side: Form Client */}
         <div className="flex-1 lg:max-w-2xl w-full flex items-center justify-center p-8 lg:p-16 relative z-10">
            <ClaimCourseClient courseId={course.id} courseName={course.name} />
         </div>

      </div>
    </div>
  );
}
