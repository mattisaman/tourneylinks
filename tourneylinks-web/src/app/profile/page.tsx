import React from 'react';
import { getCurrentUser } from '@/lib/auth-util';
import { getUserId } from '@/lib/auth-util';
import { redirect } from 'next/navigation';
import { db, users, registrations, tournaments, saved_courses, courses } from '@/lib/db';
import { eq, desc } from 'drizzle-orm';
import { UserPlus, Trophy, Link as LinkIcon, Edit3, MapPin, Bell } from 'lucide-react';
import TransferTicketModal from '@/components/profile/TransferTicketModal';

export default async function ProfilePage() {
  const { userId } = await getUserId();

  // 1. Defend the Route: Only Authed Players Allowed
  if (!userId) {
    redirect('/');
  }

  // 2. Fetch the rich User Object from Clerk securely
  const user = await getCurrentUser();
  if (!user) {
    redirect('/');
  }

  // 3. Database Synchronization Protocol
  // Check if they exist in our Database (Drizzle ORM)
  let dbUser = await db.select().from(users).where(eq(users.clerkId, userId)).then(res => res[0]);

  // First Time Login - Inject them into PostgreSQL automatically!
  if (!dbUser) {
    const freshUser = await db.insert(users).values({
      clerkId: userId,
      email: user.emailAddresses[0]?.emailAddress || '',
      fullName: `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Golfer',
      avatarUrl: user.imageUrl,
      role: 'PLAYER',
    }).returning().then(res => res[0]);
    
    dbUser = freshUser;
  }

  // Fetch active tournament registrations
  const userRegistrations = await db.select({
    registration: registrations,
    tournament: tournaments
  }).from(registrations)
    .innerJoin(tournaments, eq(registrations.tournamentId, tournaments.id))
    .where(eq(registrations.userId, dbUser.id))
    .orderBy(desc(registrations.createdAt));

  // Phase 43: Fetch the Player's Tracked Radar Courses
  const userRadars = await db.select({
    radar: saved_courses,
    course: courses
  }).from(saved_courses)
    .innerJoin(courses, eq(saved_courses.courseId, courses.id))
    .where(eq(saved_courses.userId, userId))
    .orderBy(desc(saved_courses.createdAt));

  return (
    <div className="min-h-screen flex flex-col bg-[#050B08] pt-[80px]">

      {/* Cinematic Prestige Profile Header */}
      <div className="w-full relative border-b border-[rgba(255,255,255,0.05)] bg-[var(--ink)]">
         <div className="absolute inset-0 pointer-events-none opacity-20 bg-[url('/hero-bg-4.jpg')] bg-cover bg-center mix-blend-overlay" />
         <div className="absolute top-0 left-0 w-[40vw] h-[40vh] bg-[var(--gold)] opacity-[0.02] rounded-br-full pointer-events-none blur-3xl" />
         <div className="absolute inset-0 bg-gradient-to-t from-[#050B08] via-transparent to-transparent pointer-events-none opacity-80" />

         <div className="w-full relative z-10 flex flex-col md:flex-row items-start md:items-end justify-between gap-8" style={{ maxWidth: '1300px', margin: '0 auto', paddingLeft: 'clamp(2rem, 5vw, 4rem)', paddingRight: 'clamp(2rem, 5vw, 4rem)', paddingBottom: '4rem', paddingTop: '3rem' }}>
            
            <div className="flex items-center gap-6 lg:gap-10">
              <img 
                src={dbUser.avatarUrl || '/placeholder_avatar.png'} 
                alt="Profile Avatar" 
                className="w-24 h-24 lg:w-32 lg:h-32 object-cover border border-[rgba(255,255,255,0.1)]"
              />
              <div>
                <h1 className="text-4xl lg:text-5xl font-bold text-white mb-2 tracking-tight flex items-center gap-4 border-b border-transparent pb-1" style={{ fontFamily: 'var(--font-serif)' }}>
                  {dbUser.fullName}
                  {dbUser.role === 'HOST' && (
                    <span className="bg-[var(--gold)] text-black font-black uppercase tracking-widest relative top-[-4px] rounded-sm" style={{ padding: '4px 12px', fontSize: '10px' }}>Host Director</span>
                  )}
                </h1>
                <p className="text-[rgba(255,255,255,0.5)] text-lg font-light tracking-wide">{dbUser.email}</p>
                
                <div className="mt-6 flex flex-wrap items-center gap-4">
                  <div className="flex items-center gap-4 border border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.05)] rounded-md" style={{ padding: '8px 16px' }}>
                    <span className="text-[10px] uppercase tracking-widest text-[var(--gold)] font-bold">GHIN Handcap</span>
                    <span className="w-px h-6 bg-[rgba(255,255,255,0.1)]" />
                    <span className="font-mono text-lg font-bold text-white">
                      {dbUser.verifiedGhin ? dbUser.handicapIndex : <span className="text-[rgba(255,255,255,0.3)] text-sm">--</span>}
                    </span>
                  </div>

                  <a href="/verify" className="text-[10px] text-[rgba(255,255,255,0.5)] hover:text-[var(--gold)] uppercase tracking-widest font-bold transition-colors border-b border-transparent hover:border-[var(--gold)] pb-1">
                     {dbUser.verifiedGhin ? 'Update GHIN' : 'Verify Account'}
                  </a>
                </div>
              </div>
            </div>
            
            <a href="/profile/settings" className="border border-[rgba(255,255,255,0.1)] bg-[rgba(0,0,0,0.2)] text-[rgba(255,255,255,0.7)] hover:text-[var(--gold)] hover:border-[var(--gold)] font-bold uppercase tracking-widest transition-colors flex items-center gap-2 rounded-md" style={{ padding: '12px 24px', fontSize: '10px' }}>
               <Edit3 size={14} /> Profile Settings
            </a>
         </div>
      </div>

      <main className="flex-1 w-full pb-20">
        <div className="w-full" style={{ maxWidth: '1300px', margin: '0 auto', paddingLeft: 'clamp(2rem, 5vw, 4rem)', paddingRight: 'clamp(2rem, 5vw, 4rem)', paddingTop: '3rem', paddingBottom: '3rem' }}>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start w-full">
            
            {/* Widget 1: Communications Command Center */}
            <div className="w-full relative bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.05)] p-6 hover:border-[rgba(212,175,55,0.3)] transition-colors flex flex-col shadow-xl">
               <h3 className="text-[10px] uppercase tracking-widest font-black mb-6 flex items-center justify-between text-white border-b border-[rgba(255,255,255,0.05)] pb-4">
                 <div className="flex items-center gap-3"><Bell size={14} className="text-[var(--gold)]" /> Command Center</div>
                 <span className="bg-[var(--gold)] text-black px-2 py-0.5 rounded font-black text-[9px] animate-pulse">ALERTS</span>
               </h3>
               <div className="flex-1 flex flex-col gap-4">
                  <p className="text-sm text-[rgba(255,255,255,0.4)] leading-relaxed font-light">Internal routing system for secure transmissions directly from Hosts and Platform Support.</p>
                  <div className="mt-auto flex flex-col gap-2 pt-4">
                     <a href="/profile/inbox" className="w-full text-center bg-white text-black font-bold uppercase tracking-widest text-[9px] py-3 hover:bg-[var(--gold)] transition-colors">Access Inbox</a>
                     <a href="/profile/settings" className="w-full text-center border border-[rgba(255,255,255,0.1)] text-white hover:border-[var(--gold)] hover:text-[var(--gold)] font-bold uppercase tracking-widest text-[9px] py-3 transition-colors">Notification Rules</a>
                  </div>
               </div>
            </div>

            {/* Widget 2: Registrations & Game Day Mobile Scorer */}
            <div className="md:col-span-2 w-full relative bg-[#020604] border-t-2 border-[var(--gold)] p-6 hover:border-[rgba(212,175,55,0.6)] transition-colors shadow-2xl flex flex-col h-full min-h-[300px]">
               <div className="flex items-center justify-between border-b border-[rgba(255,255,255,0.05)] pb-4 mb-4">
                 <h3 className="text-[10px] uppercase tracking-widest font-black flex items-center gap-3 text-white">
                   <Trophy size={14} className="text-[var(--gold)]" /> Active Registrations
                 </h3>
                 <a href="/tournaments" className="text-[9px] text-[var(--gold)] hover:text-white border border-transparent hover:border-[var(--gold)] px-3 py-1 uppercase tracking-widest font-bold transition-all rounded-sm">Directory</a>
               </div>
               
               <div className="flex-1 flex flex-col px-2 overflow-y-auto max-h-[350px]">
                 {userRegistrations.length === 0 ? (
                   <div className="w-full h-full flex flex-col items-center justify-center py-10 opacity-50">
                     <p className="text-sm font-light mb-4 text-center">No active tournament flights booked.</p>
                   </div>
                 ) : (
                   <div className="flex flex-col">
                     {userRegistrations.map((row, idx) => (
                       <div key={row.registration.id} className={`py-4 ${idx !== 0 ? 'border-t border-[rgba(255,255,255,0.05)]' : ''} flex flex-col xl:flex-row xl:items-center justify-between gap-4 group hover:bg-[rgba(255,255,255,0.02)] -mx-2 px-2 transition-colors`}>
                         <div className="min-w-0 pr-4">
                           <div className="text-lg font-bold text-white group-hover:text-[var(--gold)] transition-colors" style={{ fontFamily: 'var(--font-serif)' }}>{row.tournament.name}</div>
                           <div className="flex items-center gap-3 text-[10px] font-mono text-[rgba(255,255,255,0.5)] mt-1">
                             <span className="flex items-center gap-1"><span className="text-[var(--gold)] opacity-70">DATE</span> {new Date(row.tournament.dateStart || '').toLocaleDateString()}</span>
                             <span className="w-px h-2 bg-[rgba(255,255,255,0.2)]" />
                             <span className={`uppercase font-bold tracking-widest ${row.registration.status === 'TRANSFERRED' ? 'text-red-400' : 'text-[#4ade80]'}`}>{row.registration.status}</span>
                           </div>
                         </div>
                         
                         {row.registration.status === 'CONFIRMED' && (
                           <div className="flex items-center gap-3 mt-2 xl:mt-0 opacity-80 group-hover:opacity-100 transition-opacity">
                             {/* Mocking Game Day logic */}
                             {new Date().toISOString().split('T')[0] === row.tournament.dateStart || true ? (
                               <a href={`/tournaments/${row.tournament.id}/scorer`} className="bg-[var(--gold)] text-[#050B08] uppercase font-black tracking-widest text-[9px] px-4 py-2 rounded-sm shadow-[0_0_15px_rgba(212,175,55,0.3)] hover:bg-white transition-colors flex items-center gap-2 animate-pulse whitespace-nowrap">
                                  Launch Scorer
                               </a>
                             ) : null}
                             <div className="scale-[0.8] origin-right">
                                <TransferTicketModal registrationId={row.registration.id} tournamentName={row.tournament.name} />
                             </div>
                           </div>
                         )}
                       </div>
                     ))}
                   </div>
                 )}
               </div>
            </div>

            {/* Widget 3: Target Radars */}
            <div className="w-full relative bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.05)] p-6 hover:border-[rgba(212,175,55,0.3)] transition-colors shadow-xl">
               <h3 className="text-[10px] uppercase tracking-widest font-black flex items-center gap-3 text-white pb-4 border-b border-[rgba(255,255,255,0.05)] mb-4">
                 <MapPin size={14} className="text-[var(--gold)]" /> Course Radars
               </h3>
               {userRadars.length === 0 ? (
                 <div className="text-center py-6 opacity-40">
                   <p className="text-[10px] font-light mb-3">No radar uplinks established.</p>
                 </div>
               ) : (
                 <div className="flex flex-col max-h-[200px] overflow-y-auto">
                   {userRadars.map((row, idx) => (
                     <a href={`/courses/${row.course.id}`} key={row.radar.id} className={`group block py-3 ${idx !== 0 ? 'border-t border-[rgba(255,255,255,0.05)]' : ''} hover:bg-[rgba(255,255,255,0.03)] px-2 -mx-2 transition-colors`}>
                       <div className="flex items-center justify-between">
                         <div className="min-w-0 pr-4">
                           <div className="text-sm font-bold text-white truncate group-hover:text-[var(--gold)] transition-colors">{row.course.name}</div>
                           <div className="text-[9px] text-[rgba(255,255,255,0.4)] mt-1 uppercase tracking-widest">{row.course.city}, {row.course.state}</div>
                         </div>
                         {row.radar.notifyOnNewTournament && (
                           <div className="w-1.5 h-1.5 bg-[#4ade80] rounded-full shadow-[0_0_8px_rgba(74,222,128,0.5)]"></div>
                         )}
                       </div>
                     </a>
                   ))}
                 </div>
               )}
            </div>

            {/* Widget 4: Affiliate Architecture */}
            <div className="w-full relative bg-[#050B08] border border-[rgba(255,255,255,0.05)] p-6 shadow-xl">
               <div className="absolute inset-0 bg-[url('/hero-bg-4.jpg')] opacity-[0.05] pointer-events-none mix-blend-overlay" />
               <h3 className="text-[10px] uppercase tracking-widest font-black mb-4 text-white pb-4 border-b border-[rgba(255,255,255,0.05)] relative z-10 flex items-center justify-between">
                  Credit Bank <span className="text-[var(--gold)]">$0.00</span>
               </h3>
               <p className="text-[10px] text-[rgba(255,255,255,0.5)] mb-4 font-light leading-relaxed relative z-10">
                 Earn <strong className="text-white font-bold">$25</strong> when a Director registers via your link.
               </p>
               <div className="bg-black border border-[rgba(255,255,255,0.1)] p-2 mb-4 flex items-center justify-between group cursor-pointer hover:border-[var(--gold)] transition-colors relative z-10 rounded">
                  <span className="text-[9px] font-mono text-[var(--gold)] truncate select-all opacity-80 pl-1">tourneylinks.com/r/{dbUser.id}T{userId.substring(userId.length-4)}</span>
               </div>
               <div className="grid grid-cols-2 gap-3 relative z-10">
                  <div className="text-center border border-[rgba(255,255,255,0.05)] bg-[rgba(255,255,255,0.02)] py-2 rounded">
                     <div className="text-[8px] text-[rgba(255,255,255,0.3)] uppercase tracking-widest mb-1 font-bold">Clicks</div>
                     <div className="text-sm font-black text-white font-mono">0</div>
                  </div>
                  <div className="text-center border border-[rgba(74,222,128,0.2)] bg-[rgba(74,222,128,0.05)] py-2 rounded">
                     <div className="text-[8px] text-[#4ade80] opacity-80 uppercase tracking-widest mb-1 font-bold">Convs</div>
                     <div className="text-sm font-black text-[#4ade80] font-mono">0</div>
                  </div>
               </div>
            </div>

            {/* Widget 5: Pairing Network */}
            <div className="w-full bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.05)] p-6 hover:border-[rgba(212,175,55,0.3)] transition-colors flex flex-col justify-between shadow-xl cursor-not-allowed group">
               <h3 className="text-[10px] uppercase tracking-widest font-black mb-3 text-[rgba(255,255,255,0.4)] pb-4 border-b border-[rgba(255,255,255,0.02)] flex items-center gap-3">
                 <UserPlus size={14} /> Pairing Network
               </h3>
               <div className="py-4 text-center">
                 <p className="text-[10px] text-[rgba(255,255,255,0.3)] font-light leading-relaxed mb-4">Invite friends to let the Auto-Flight Engine pair you together efficiently.</p>
                 <div className="inline-block text-[9px] text-[rgba(255,255,255,0.2)] bg-[rgba(255,255,255,0.02)] px-4 py-2 uppercase tracking-widest font-bold rounded border border-[rgba(255,255,255,0.02)]">
                   Sync Unavailable
                 </div>
               </div>
            </div>

          </div>

        </div>
      </main>
    </div>
  );
}
