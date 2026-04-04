import React from 'react';
import { db, course_claims, courses, users } from '@/lib/db';
import { eq, desc } from 'drizzle-orm';
import Navbar from '@/components/ui/Navbar';
import Link from 'next/link';
import { CheckCircle2, ShieldAlert } from 'lucide-react';
import ApproveClaimButton from './ApproveClaimButton';

export const dynamic = 'force-dynamic';

export default async function AdminCourseClaimsPage() {
  const claimsRows = await db.select({
      claim: course_claims,
      course: courses,
      user: users
  })
  .from(course_claims)
  .leftJoin(courses, eq(course_claims.courseId, courses.id))
  .leftJoin(users, eq(course_claims.userId, users.id))
  .orderBy(desc(course_claims.createdAt));

  return (
    <div className="min-h-screen bg-[#050B08] pt-[120px] pb-24">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 lg:px-12">
         <div className="mb-12">
            <h1 className="text-4xl text-white font-serif mb-2">Claim Approvals</h1>
            <p className="text-white/50">Verify PGA Professionals to unlock their Course Dashboards.</p>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {claimsRows.length === 0 && (
               <div className="col-span-full py-16 text-center text-white/30 border border-white/5 rounded-2xl border-dashed">
                 No pending claims in the queue.
               </div>
            )}

            {claimsRows.map(({ claim, course, user }) => (
               <div key={claim.id} className="bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.05)] rounded-2xl overflow-hidden flex flex-col relative">
                  
                  {claim.status === 'APPROVED' && (
                    <div className="absolute top-4 right-4 bg-[var(--gold)] text-black text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-sm z-10">
                      APPROVED
                    </div>
                  )}

                  {/* ID Image Preview */}
                  <div className="w-full h-48 bg-black relative border-b border-white/10 group overflow-hidden flex items-center justify-center">
                    <img src={claim.pgaCardImageUrl} alt="PGA Card" className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:opacity-100 transition-opacity" />
                    
                    {claim.pgaCardImageUrl.includes('mock') && (
                       <span className="relative z-10 bg-black/60 text-white/50 text-xs px-4 py-2 rounded-full border border-white/10 backdrop-blur-md font-mono">
                         Mock S3 Upload
                       </span>
                    )}
                  </div>

                  <div className="p-6 flex-1 flex flex-col">
                     <Link href={\`/courses/\${course?.id}\`} className="text-[var(--gold)] font-bold text-lg mb-1 hover:underline truncate">
                       {course?.name}
                     </Link>

                     <div className="text-white/70 text-sm mb-4">
                       <span className="text-white font-semibold">{user?.fullName || 'Unknown User'}</span>
                       <br />
                       E: {user?.email}
                       <br />
                       P: {claim.directPhone}
                     </div>

                     {/* AI Output Block */}
                     <div className="bg-[#050B08] border border-white/5 rounded-xl p-4 mb-6">
                        <div className="text-[10px] font-bold text-[var(--gold)] tracking-widest uppercase mb-2 flex items-center gap-2">
                           <ShieldAlert size={12} /> Gemini AI Scan
                        </div>
                        <div className="text-white/60 text-xs font-mono leading-relaxed whitespace-pre-line">
                           {claim.extractedOcrText || 'No OCR data.'}
                        </div>
                     </div>

                     <div className="mt-auto">
                        <ApproveClaimButton claimId={claim.id} currentStatus={claim.status} />
                     </div>
                  </div>
               </div>
            ))}
         </div>
      </div>
    </div>
  );
}
