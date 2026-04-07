import React from 'react';
import { getCurrentUser } from '@/lib/auth-util';
import { getUserId } from '@/lib/auth-util';
import { redirect } from 'next/navigation';
import { db, users, registrations, tournaments, saved_courses, courses } from '@/lib/db';
import { eq, desc, inArray } from 'drizzle-orm';
import { Edit3, Flag } from 'lucide-react';

// Specialized OS Widgets
import CalendarWidget from '@/components/profile/widgets/CalendarWidget';
import RegistrationsWidget from '@/components/profile/widgets/RegistrationsWidget';
import RadarsWidget from '@/components/profile/widgets/RadarsWidget';
import HostedDraftsWidget from '@/components/profile/widgets/HostedDraftsWidget';
import CommsWidget from '@/components/profile/widgets/CommsWidget';
import AffiliateWidget from '@/components/profile/widgets/AffiliateWidget';
import PairingWidget from '@/components/profile/widgets/PairingWidget';

export default async function ProfilePage() {
  const { userId } = await getUserId();
  if (!userId) redirect('/');

  const user = await getCurrentUser();
  if (!user) redirect('/');

  let dbUser = await db.select().from(users).where(eq(users.clerkId, userId)).then(res => res[0]);

  if (!dbUser) {
    dbUser = await db.insert(users).values({
      clerkId: userId,
      email: user.emailAddresses[0]?.emailAddress || '',
      fullName: `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Golfer',
      avatarUrl: user.imageUrl,
      role: 'PLAYER',
    }).returning().then(res => res[0]);
  }

  const userRegistrations = await db.select({
    registration: registrations,
    tournament: tournaments
  }).from(registrations)
    .innerJoin(tournaments, eq(registrations.tournamentId, tournaments.id))
    .where(eq(registrations.userId, dbUser.id))
    .orderBy(desc(registrations.createdAt));

  const userRadars = await db.select({
    radar: saved_courses,
    course: courses
  }).from(saved_courses)
    .innerJoin(courses, eq(saved_courses.courseId, courses.id))
    .where(eq(saved_courses.userId, userId))
    .orderBy(desc(saved_courses.createdAt));

  const radarCourseIds = userRadars.map(r => r.course.id);
  const radarTournaments = radarCourseIds.length > 0 
    ? await db.select().from(tournaments).where(inArray(tournaments.courseId, radarCourseIds))
    : [];

  const hostedEvents = await db.select().from(tournaments).where(eq(tournaments.hostUserId, dbUser.id)).orderBy(desc(tournaments.createdAt));

// Replaced DraggableGrid logic with fixed CSS grid rendering structure below.

  return (
    <div className="min-h-[120vh] flex flex-col pb-32 relative bg-[#071510] overflow-hidden" style={{ paddingTop: '220px' }}>
      
      {/* Home Page Baseline Background Implementation */}
      <div className="fixed inset-0 pointer-events-none z-0">
         <div className="ambient-orb ambient-orb-1" />
         <div className="ambient-orb ambient-orb-2" />
         <div className="absolute inset-0" style={{
             backgroundImage: `
               linear-gradient(to right, rgba(7, 21, 16, 0.85) 0%, rgba(7, 21, 16, 0.60) 40%, rgba(7, 21, 16, 0.20) 100%),
               linear-gradient(to bottom, rgba(7, 21, 16, 0.80) 0%, transparent 60%),
               linear-gradient(to top, rgba(7, 21, 16, 0.90) 0%, transparent 40%),
               url('/profile-bg.jpg')
             `,
             backgroundSize: 'cover',
             backgroundPosition: 'left 20%',
             backgroundRepeat: 'no-repeat'
         }} />
         <div className="hero-grid absolute inset-0 pointer-events-none z-10 opacity-[0.04]" />
         <div className="hero-dots absolute inset-0 pointer-events-none z-20 opacity-[0.05]" />
      </div>

      <main className="flex-1 w-full relative z-30 flex flex-col gap-12">
         {/* PRESTIGE HERO SECTION */}
         <section className="w-full flex flex-col md:flex-row items-center justify-between gap-8 relative z-40 mb-12 lg:mb-20" style={{ paddingLeft: 'clamp(2rem, 6vw, 10rem)', paddingRight: 'clamp(2rem, 6vw, 10rem)' }}>
            <div className="flex flex-col md:flex-row items-center md:items-start text-center md:text-left gap-6 lg:gap-10">
               <div className="relative group shrink-0">
                  <div className="absolute -inset-1 bg-gradient-to-tr from-[var(--gold)] to-[var(--amber)] rounded-full blur-xl opacity-30 transition-opacity duration-1000" />
                  <img 
                    src={dbUser.avatarUrl || '/placeholder_avatar.png'} 
                    alt="Profile Avatar" 
                    className="relative w-32 h-32 lg:w-48 lg:h-48 object-cover rounded-full shadow-[0_0_50px_rgba(0,0,0,0.8)] bg-[var(--forest)] p-1 border-2 border-[var(--gold)]"
                    style={{ filter: 'drop-shadow(0 0 20px rgba(212,175,55,0.4))' }}
                  />
               </div>
                <div className="flex flex-col pt-0 md:pt-2">
                  <h1 className="hero-headline !mb-0 shrink-0 leading-none py-2 flex items-center justify-center md:justify-start drop-shadow-[0_3px_5px_rgba(0,0,0,0.8)]" style={{ fontSize: 'clamp(2.5rem, 5vw, 6rem)', transform: 'translateY(5px)' }}>
                    <span style={{ 
                        fontFamily: 'var(--font-serif), var(--font-cinzel), serif', 
                        letterSpacing: '0.02em',
                        backgroundImage: 'linear-gradient(to bottom, #fffdf2 0%, #dfb962 100%)',
                        WebkitBackgroundClip: 'text',
                        backgroundClip: 'text',
                        color: 'transparent',
                        paddingRight: '1rem'
                      }}>
                      {dbUser.fullName}
                    </span>
                  </h1>
               </div>
            </div>

            {/* Handicap Foil Display & Inbox */}
            <div className="flex flex-col md:flex-row items-center gap-6 mt-6 md:mt-0 shrink-0">

               {/* Handicap */}
               <div className="flex flex-col items-center md:items-end text-center md:text-right">
                  <div className="uppercase tracking-[0.2em] font-bold pr-2 flex items-center justify-end gap-6 w-full" style={{ marginBottom: '1rem', fontFamily: 'var(--font-cinzel), serif' }}>
                    <span className="text-xl" style={{ color: 'var(--mist)' }}>HDCP</span>
                    <button className="text-sm font-sans tracking-widest uppercase font-bold text-[var(--gold)] hover:text-white transition-colors flex items-center gap-2 drop-shadow-xl" style={{ paddingBottom: '2px' }}>
                      <Edit3 size={16} /> Update
                    </button>
                  </div>
                  <div className="flex items-center justify-center">
                     <span className="font-serif font-bold tracking-tight leading-none text-[#d4af37]" style={{ textShadow: '0 4px 20px rgba(0,0,0,0.6)', fontSize: '5rem' }}>
                       {dbUser.verifiedGhin ? dbUser.handicapIndex : '--.--'}
                     </span>
                  </div>
               </div>
            </div>
         </section>

         {/* OS GRID - Bento Layout */}
         <div className="w-full relative z-30 pt-16 lg:pt-24 lg:mt-12 pb-24" style={{ borderTop: '1px solid rgba(212,175,55,0.1)', paddingLeft: 'clamp(2rem, 6vw, 10rem)', paddingRight: 'clamp(2rem, 6vw, 10rem)' }}>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 auto-rows-min">
               
               {/* ROW 1 */}
               <div className="lg:col-span-4 min-h-[22rem]">
                  <CalendarWidget registrations={userRegistrations} hostedEvents={hostedEvents} radarTournaments={radarTournaments} />
               </div>
               
               <div className="lg:col-span-3 min-h-[22rem]">
                  <RegistrationsWidget userRegistrations={userRegistrations} />
               </div>

               <div className="lg:col-span-3 min-h-[22rem]">
                  <HostedDraftsWidget hostedEvents={hostedEvents} />
               </div>

               <div className="lg:col-span-2 min-h-[22rem]">
                  <CommsWidget />
               </div>

               {/* ROW 2 */}
               <div className="lg:col-span-4 min-h-[16rem]">
                  <RadarsWidget userRadars={userRadars} />
               </div>

               <div className="lg:col-span-5 min-h-[16rem]">
                  <PairingWidget />
               </div>

               <div className="lg:col-span-3 min-h-[16rem]">
                  <AffiliateWidget dbUser={dbUser} userId={userId} />
               </div>

            </div>
         </div>
      </main>
    </div>
  );
}
