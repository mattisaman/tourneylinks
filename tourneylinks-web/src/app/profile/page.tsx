import React from 'react';
import { getCurrentUser } from '@/lib/auth-util';
import { getUserId } from '@/lib/auth-util';
import { redirect } from 'next/navigation';
import { db, users, registrations, tournaments, saved_courses, courses } from '@/lib/db';
import { eq, desc, inArray } from 'drizzle-orm';
import { Edit3 } from 'lucide-react';

// Draggable OS Elements
import DraggableGrid from '@/components/profile/DraggableGrid';
import ProfileWidget from '@/components/profile/widgets/ProfileWidget';
import CalendarWidget from '@/components/profile/widgets/CalendarWidget';
import RegistrationsWidget from '@/components/profile/widgets/RegistrationsWidget';
import RadarsWidget from '@/components/profile/widgets/RadarsWidget';
import HostedDraftsWidget from '@/components/profile/widgets/HostedDraftsWidget';
import CommsWidget from '@/components/profile/widgets/CommsWidget';
import AffiliateWidget from '@/components/profile/widgets/AffiliateWidget';
import PairingWidget from '@/components/profile/widgets/PairingWidget';
import GolfSponsorshipWidget from '@/components/profile/GolfSponsorshipWidget';

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

  const widgetMap = {
    calendar: { component: <CalendarWidget registrations={userRegistrations} hostedEvents={hostedEvents} radarTournaments={radarTournaments} />, span: 2 },
    registrations: { component: <RegistrationsWidget userRegistrations={userRegistrations} />, span: 1 },
    radars: { component: <RadarsWidget userRadars={userRadars} />, span: 1 },
    hosted: { component: <HostedDraftsWidget hostedEvents={hostedEvents} />, span: 2 },
    comms: { component: <CommsWidget />, span: 1 },
    affiliate: { component: <AffiliateWidget dbUser={dbUser} userId={userId} />, span: 1 },
    pairing: { component: <PairingWidget />, span: 1 },
    sponsorship: { component: <GolfSponsorshipWidget tournaments={hostedEvents} />, span: 2 }
  };
  
  const defaultOrder = ['calendar', 'radars', 'registrations', 'hosted', 'comms', 'pairing', 'affiliate', 'sponsorship'];

  return (
    <div className="min-h-[120vh] flex flex-col pb-32 relative bg-[#071510] overflow-hidden" style={{ paddingTop: '220px' }}>
      
      {/* Home Page Baseline Background Implementation */}
      <div className="fixed inset-0 pointer-events-none z-0">
         <div className="absolute inset-0" style={{
             backgroundImage: `
               linear-gradient(to right, rgba(7, 21, 16, 0.98) 0%, rgba(7, 21, 16, 0.85) 40%, rgba(7, 21, 16, 0.45) 100%),
               linear-gradient(to bottom, rgba(7, 21, 16, 0.95) 0%, transparent 60%),
               linear-gradient(to top, rgba(7, 21, 16, 1) 0%, transparent 40%),
               url('/profile-bg.jpg')
             `,
             backgroundSize: 'cover',
             backgroundPosition: 'left 20%',
             backgroundRepeat: 'no-repeat'
         }} />
         <div className="hero-grid fixed inset-0 pointer-events-none z-10 opacity-[0.04]" />
         <div className="hero-dots fixed inset-0 pointer-events-none z-20 opacity-[0.05]" />
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
               <div className="flex flex-col pt-2 md:pt-6">
                  <h1 className="hero-headline !mb-2 shrink-0 leading-tight flex flex-wrap items-center justify-center md:justify-start gap-4 md:gap-6" style={{ fontSize: 'clamp(4rem, 8vw, 8rem)' }}>
                    <span className="metallic-text" style={{ fontFamily: 'var(--font-cursive)', textTransform: 'capitalize', filter: 'drop-shadow(2px 4px 6px rgba(0,0,0,0.9))', textShadow: '1px 1px 0 rgba(255,255,255,0.4), -1px -1px 0 rgba(0,0,0,0.8)' }}>
                      {dbUser.fullName.split(' ')[0]}
                    </span>
                    <span className="metallic-text" style={{ fontFamily: 'var(--font-cursive)', textTransform: 'capitalize', filter: 'drop-shadow(2px 4px 6px rgba(0,0,0,0.9))', textShadow: '1px 1px 0 rgba(255,255,255,0.4), -1px -1px 0 rgba(0,0,0,0.8)' }}>
                      {dbUser.fullName.split(' ').slice(1).join(' ')}
                    </span>
                  </h1>
               </div>
            </div>

            {/* Handicap Foil Display */}
            <div className="flex flex-col items-center md:items-end text-center md:text-right mt-6 md:mt-0 shrink-0">
               <div className="text-sm uppercase tracking-[0.2em] font-bold pr-2" style={{ color: 'var(--mist)', marginBottom: '1.5rem', fontFamily: 'var(--font-cinzel), serif' }}>Platform Handicap Index</div>
               <div className="metallic-gold flex items-center justify-center transition-all duration-500 hover:scale-105 shadow-2xl border-2 border-[rgba(212,175,55,0.3)]" style={{ borderRadius: '4rem', padding: '1.5rem 4rem' }}>
                  <span className="font-serif text-6xl lg:text-7xl font-bold tracking-tight" style={{ textShadow: '0 2px 20px rgba(0,0,0,0.3)' }}>
                    {dbUser.verifiedGhin ? dbUser.handicapIndex : '--.--'}
                  </span>
               </div>
            </div>
         </section>

         {/* OS GRID */}
         <div className="w-full relative z-30 pt-16 lg:pt-24 lg:mt-12" style={{ borderTop: '1px solid rgba(212,175,55,0.1)', paddingLeft: 'clamp(2rem, 6vw, 10rem)', paddingRight: 'clamp(2rem, 6vw, 10rem)' }}>
            <DraggableGrid childrenMap={widgetMap} defaultOrder={defaultOrder} />
         </div>
      </main>
    </div>
  );
}
