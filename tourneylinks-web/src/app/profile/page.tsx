import React from 'react';
import { getCurrentUser } from '@/lib/auth-util';
import { getUserId } from '@/lib/auth-util';
import { redirect } from 'next/navigation';
import { db, users, registrations, tournaments, saved_courses, courses } from '@/lib/db';
import { eq, desc } from 'drizzle-orm';
import { Edit3 } from 'lucide-react';

// Draggable OS Elements
import DraggableGrid from '@/components/profile/DraggableGrid';
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

  const hostedEvents = await db.select().from(tournaments).where(eq(tournaments.hostUserId, dbUser.id)).orderBy(desc(tournaments.createdAt));

  const widgetMap = {
    calendar: { component: <CalendarWidget registrations={userRegistrations} hostedEvents={hostedEvents} />, span: 2 },
    registrations: { component: <RegistrationsWidget userRegistrations={userRegistrations} />, span: 2 },
    radars: { component: <RadarsWidget userRadars={userRadars} />, span: 1 },
    hosted: { component: <HostedDraftsWidget hostedEvents={hostedEvents} />, span: 2 },
    comms: { component: <CommsWidget />, span: 1 },
    affiliate: { component: <AffiliateWidget dbUser={dbUser} userId={userId} />, span: 1 },
    pairing: { component: <PairingWidget />, span: 1 },
    sponsorship: { component: <GolfSponsorshipWidget tournaments={hostedEvents} />, span: 3 }
  };
  
  const defaultOrder = ['calendar', 'radars', 'registrations', 'hosted', 'comms', 'pairing', 'affiliate', 'sponsorship'];

  return (
    <div className="min-h-screen flex flex-col pt-[80px] relative bg-[#0a0c0a]">
      
      {/* Dynamic Dramatic Background Simulation */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
         {/* Base dark canvas */}
         <div className="absolute inset-0 bg-[#050605]" />
         {/* Moody central green spotlight mimicking the golf bag night image */}
         <div className="absolute top-[10%] left-[-10%] w-[70vw] h-[70vw] bg-[radial-gradient(ellipse_at_center,rgba(40,80,50,0.15),transparent_60%)] filter blur-3xl opacity-80 mix-blend-screen" />
         <div className="absolute top-[30%] right-[-10%] w-[50vw] h-[50vw] bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.05),transparent_60%)] filter blur-3xl opacity-60 mix-blend-screen" />
         {/* Heavy vignette for edge darkness */}
         <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.8)_100%)]" />
         {/* Optional texture overly */}
         <div className="absolute inset-0 opacity-[0.02] bg-[url('/hero-bg-4.jpg')] bg-cover bg-center mix-blend-overlay" />
      </div>

      {/* Cinematic Prestige Profile Header */}
      <div className="w-full relative z-10 border-b border-[rgba(255,255,255,0.02)] bg-[rgba(5,6,5,0.4)] backdrop-blur-3xl pt-16 pb-8 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
         <div className="w-full relative z-10 flex flex-col md:flex-row items-start md:items-end justify-between gap-8" style={{ maxWidth: '1400px', margin: '0 auto', paddingLeft: 'clamp(2rem, 5vw, 4rem)', paddingRight: 'clamp(2rem, 5vw, 4rem)' }}>
            
            <div className="flex items-center gap-8 lg:gap-12">
              <div className="relative group">
                 {/* Avatar Ring Glow */}
                 <div className="absolute -inset-1 bg-gradient-to-tr from-[var(--gold)] to-[rgba(40,80,50,1)] rounded-full blur opacity-30 group-hover:opacity-60 transition-opacity duration-500" />
                 <img 
                   src={dbUser.avatarUrl || '/placeholder_avatar.png'} 
                   alt="Profile Avatar" 
                   className="relative w-28 h-28 lg:w-36 lg:h-36 object-cover rounded-full border-4 border-[#111] shadow-2xl"
                 />
              </div>
              <div>
                <h1 
                  className="text-5xl lg:text-7xl font-black mb-3 tracking-tight flex items-center gap-4 relative z-10" 
                  style={{ 
                     fontFamily: 'var(--font-serif)',
                     color: '#e5e5e5', // High contrast silver/grey
                     // Advanced stitched leather embossed effect using text-shadows
                     textShadow: '0px 2px 3px rgba(0,0,0,1), -1px -1px 1px rgba(255,255,255,0.1), 0px 0px 20px rgba(0,0,0,0.8)',
                     letterSpacing: '-0.02em',
                  }}
                >
                  <span className="bg-clip-text text-transparent bg-gradient-to-b from-[#f9f9f9] to-[#999] relative">
                     {dbUser.fullName}
                  </span>
                  
                  {dbUser.role === 'HOST' && (
                    <span className="bg-[var(--gold)] text-[#222] font-black uppercase tracking-widest relative top-[-8px] rounded-sm shadow-[0_0_10px_rgba(212,175,55,0.3)]" style={{ padding: '4px 12px', fontSize: '12px' }}>Director</span>
                  )}
                </h1>
                <p className="text-[rgba(255,255,255,0.4)] text-lg font-light tracking-wide">{dbUser.email}</p>
                
                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <div className="flex items-center gap-4 bg-[rgba(10,15,10,0.8)] border-t border-[rgba(255,255,255,0.05)] border-b border-[rgba(0,0,0,0.8)] rounded-lg shadow-inner" style={{ padding: '10px 20px' }}>
                    <span className="text-[10px] uppercase tracking-widest text-[var(--gold)] font-bold opacity-80">GHIN Handcap</span>
                    <span className="w-px h-6 bg-[rgba(255,255,255,0.05)]" />
                    <span className="font-mono text-xl font-bold text-white tracking-widest" style={{ textShadow: '0 0 15px rgba(255,255,255,0.3)'}}>
                      {dbUser.verifiedGhin ? dbUser.handicapIndex : <span className="text-[rgba(255,255,255,0.2)] text-base">--.--</span>}
                    </span>
                  </div>

                  <a href="/verify" className="text-[10px] bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.05)] text-[rgba(255,255,255,0.6)] hover:text-[#fff] hover:border-[var(--gold)] hover:bg-[rgba(212,175,55,0.1)] uppercase tracking-widest font-bold transition-all px-4 py-3 rounded-lg">
                     {dbUser.verifiedGhin ? 'SYNC GHIN' : 'VERIFY ACCOUNT'}
                  </a>
                </div>
              </div>
            </div>
            
            <a href="/profile/settings" className="border border-[rgba(255,255,255,0.05)] bg-[rgba(10,15,10,0.8)] text-[rgba(255,255,255,0.6)] hover:text-[var(--gold)] hover:border-[var(--gold)] font-bold uppercase tracking-widest transition-colors flex items-center gap-2 rounded-lg backdrop-blur-md shadow-2xl hover:shadow-[0_0_20px_rgba(212,175,55,0.15)]" style={{ padding: '14px 28px', fontSize: '11px' }}>
               <Edit3 size={14} /> OS Settings
            </a>
         </div>
      </div>

      <main className="flex-1 w-full pb-24 relative z-10">
        <div className="w-full" style={{ maxWidth: '1400px', margin: '0 auto', paddingLeft: 'clamp(2rem, 5vw, 4rem)', paddingRight: 'clamp(2rem, 5vw, 4rem)', paddingTop: '4rem' }}>
          
          <div className="mb-6 flex items-center justify-between">
             <h2 className="text-[10px] text-[rgba(255,255,255,0.4)] uppercase tracking-[0.3em] font-bold">Personalized Dashboard</h2>
             <span className="text-[10px] text-[rgba(255,255,255,0.3)] uppercase tracking-[0.1em] flex items-center gap-2"><div className="w-1.5 h-1.5 bg-[#4ade80] rounded-full shadow-[0_0_5px_#4ade80]"></div> DRAG TILES TO REORGANIZE</span>
          </div>

          <DraggableGrid childrenMap={widgetMap} defaultOrder={defaultOrder} />

        </div>
      </main>
    </div>
  );
}
