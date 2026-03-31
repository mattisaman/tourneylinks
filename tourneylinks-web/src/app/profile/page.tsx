import React from 'react';
import { auth, currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { db, users, registrations, tournaments, saved_courses, courses } from '@/lib/db';
import { eq, desc } from 'drizzle-orm';
import { UserPlus, Trophy, Link as LinkIcon, Edit3, MapPin } from 'lucide-react';
import TransferTicketModal from '@/components/profile/TransferTicketModal';

export default async function ProfilePage() {
  const { userId } = await auth();

  // 1. Defend the Route: Only Authed Players Allowed
  if (!userId) {
    redirect('/');
  }

  // 2. Fetch the rich User Object from Clerk securely
  const user = await currentUser();
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
          
          <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_400px] gap-12 xl:gap-20 items-start w-full">
            
            {/* Left Column: Vertical Flat Lists */}
            <div className="w-full flex-col flex gap-16 min-w-0">
              
               {/* My Tournaments Panel */}
               <div className="w-full">
                 <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-4 border-b border-[var(--gold)] gap-4">
                   <h2 className="text-2xl lg:text-3xl font-bold flex items-center gap-3 text-white uppercase tracking-wider" style={{ fontFamily: 'var(--font-serif)' }}>
                     <Trophy className="text-[var(--gold)]" /> Active Registrations
                   </h2>
                   <a href="/tournaments" className="text-[10px] text-[rgba(255,255,255,0.5)] hover:text-[var(--gold)] uppercase tracking-widest font-bold transition-colors">Find Tournaments</a>
                 </div>
                 
                 {userRegistrations.length === 0 ? (
                   <div className="w-full py-16 flex flex-col items-center justify-center border-b border-[rgba(255,255,255,0.05)]">
                     <p className="text-[rgba(255,255,255,0.3)] text-sm font-light mb-6 text-center max-w-sm">No active tournament registrations detected in your player profile.</p>
                     <a href="/tournaments" className="bg-transparent border border-[var(--gold)] text-[var(--gold)] hover:bg-[var(--gold)] hover:text-black transition-colors px-6 py-3 text-[10px] uppercase tracking-widest font-bold">
                       Browse Directory
                     </a>
                   </div>
                 ) : (
                   <div className="flex flex-col border-b border-[rgba(255,255,255,0.05)]">
                     {userRegistrations.map((row) => (
                       <div key={row.registration.id} className="group py-6 border-t border-[rgba(255,255,255,0.05)] flex flex-col md:flex-row md:items-center justify-between gap-6 transition-colors hover:bg-[rgba(255,255,255,0.05)] px-4 -mx-4">
                         <div className="min-w-0">
                           <div className="text-xl md:text-2xl font-bold text-white group-hover:text-[var(--gold)] transition-colors mb-2" style={{ fontFamily: 'var(--font-serif)' }}>{row.tournament.name}</div>
                           <div className="flex items-center gap-4 text-xs font-mono text-[rgba(255,255,255,0.5)]">
                             <span className="flex items-center gap-2"><span className="text-[var(--gold)]">DATE </span> {new Date(row.tournament.dateStart || '').toLocaleDateString()}</span>
                             <span className="w-px h-3 bg-[rgba(255,255,255,0.2)]" />
                             <span className={`font-bold tracking-widest uppercase ${row.registration.status === 'TRANSFERRED' ? 'text-red-400' : 'text-[#4ade80]'}`}>
                               {row.registration.status}
                             </span>
                           </div>
                         </div>
                         
                         {row.registration.status === 'CONFIRMED' && (
                           <div className="flex-shrink-0">
                             <TransferTicketModal 
                               registrationId={row.registration.id} 
                               tournamentName={row.tournament.name}
                             />
                           </div>
                         )}
                       </div>
                     ))}
                   </div>
                 )}
               </div>

               {/* The Golf Network */}
               <div className="w-full">
                 <div className="flex items-end justify-between mb-8 pb-4 border-b border-[rgba(255,255,255,0.1)]">
                   <h2 className="text-2xl lg:text-3xl font-bold flex items-center gap-3 text-white uppercase tracking-wider opacity-50" style={{ fontFamily: 'var(--font-serif)' }}>
                     <UserPlus /> Pairing Network
                   </h2>
                 </div>
                 <div className="w-full py-16 flex flex-col items-center justify-center border border-[rgba(255,255,255,0.05)] bg-[rgba(255,255,255,0.02)] relative group cursor-pointer hover:bg-[rgba(197,160,89,0.02)] hover:border-[rgba(197,160,89,0.2)] transition-colors">
                   <div className="absolute inset-0 bg-[url('/hero-bg-4.jpg')] opacity-5 mix-blend-overlay pointer-events-none" />
                   <p className="text-[rgba(255,255,255,0.3)] text-sm font-light text-center max-w-sm relative z-10 transition-colors group-hover:text-[var(--gold)]">
                      Invite friends to let the Auto-Flight Engine pair you together in upcoming events.
                   </p>
                   <div className="mt-6 text-[10px] text-[rgba(255,255,255,0.5)] group-hover:text-white uppercase tracking-widest font-bold border-b border-[rgba(255,255,255,0.2)] pb-1 transition-colors relative z-10">
                      Sync Contacts
                   </div>
                 </div>
               </div>

            </div>

            {/* Right Column: Sharp Vertical Strips */}
            <div className="w-full min-w-0 flex flex-col gap-12">
              
              {/* Phase 43: The Active Course Radar */}
              <div className="w-full relative bg-[#020604] border-t-2 border-[var(--gold)] p-8 shadow-2xl">
                 <h3 className="text-[10px] uppercase tracking-widest font-black mb-8 flex items-center gap-3 text-[var(--gold)] pb-4 border-b border-[rgba(255,255,255,0.1)]">
                   <MapPin size={14} /> Course Radars
                 </h3>
                 
                 {userRadars.length === 0 ? (
                   <div className="text-center py-10">
                     <p className="text-xs font-light text-[rgba(255,255,255,0.3)] mb-6 max-w-[200px] mx-auto">No courses actively tracked for tournament alerts.</p>
                     <a href="/courses" className="text-[9px] uppercase tracking-widest text-[var(--gold)] border border-[var(--gold)] px-4 py-2 hover:bg-[var(--gold)] hover:text-black transition-colors">Directory</a>
                   </div>
                 ) : (
                   <div className="flex flex-col border-t border-[rgba(255,255,255,0.05)]">
                     {userRadars.map((row) => (
                       <a href={`/courses/${row.course.id}`} key={row.radar.id} className="group block py-4 border-b border-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.05)] px-2 -mx-2 transition-colors">
                         <div className="flex items-center justify-between">
                           <div className="min-w-0 pr-4">
                             <div className="text-base font-bold text-white truncate group-hover:text-[var(--gold)] transition-colors" style={{ fontFamily: 'var(--font-serif)' }}>{row.course.name}</div>
                             <div className="text-[10px] text-[rgba(255,255,255,0.4)] mt-1 uppercase tracking-widest">{row.course.city}, {row.course.state}</div>
                           </div>
                           {row.radar.notifyOnNewTournament && (
                             <div className="flex-shrink-0 flex items-center justify-center" title="Alerts Active">
                               <div className="w-2 h-2 bg-[#4ade80] shadow-[0_0_8px_rgba(74,222,128,0.5)]"></div>
                             </div>
                           )}
                         </div>
                       </a>
                     ))}
                   </div>
                 )}
              </div>

              {/* Affiliate Architecture */}
              <div className="w-full relative bg-[#0A110D] p-8 shadow-2xl">
                 <div className="absolute inset-0 bg-[url('/hero-bg-4.jpg')] opacity-[0.05] pointer-events-none mix-blend-overlay" />
                 
                 <h3 className="text-2xl font-bold mb-4 text-white pb-4 border-b border-[rgba(255,255,255,0.1)] relative z-10" style={{ fontFamily: 'var(--font-serif)' }}>Earn Credit</h3>
                 <p className="text-xs text-[rgba(255,255,255,0.5)] mb-8 font-light leading-relaxed relative z-10">
                   Share TourneyLinks. Automatically earn <strong className="text-[var(--gold)] font-bold"> $25 </strong> towards your next event when a Director registers their first tournament via your link.
                 </p>
                 
                 <div className="bg-[#020604] border-l-2 border-[var(--gold)] p-3 mb-8 flex items-center justify-between group cursor-pointer hover:bg-[rgba(255,255,255,0.05)] transition-colors relative z-10">
                    <span className="text-[10px] font-mono text-[var(--gold)] truncate select-all opacity-80 group-hover:opacity-100 pr-2">tourneylinks.com/r/{dbUser.id}T{userId.substring(userId.length-4)}</span>
                    <LinkIcon size={12} className="text-[var(--gold)] flex-shrink-0 opacity-50 group-hover:opacity-100 transition-opacity" />
                 </div>
                 
                 <div className="grid grid-cols-2 gap-4 relative z-10">
                    <div className="text-center border border-[rgba(255,255,255,0.05)] bg-[#020604] py-4">
                       <div className="text-[9px] text-[rgba(255,255,255,0.3)] uppercase tracking-widest mb-1 font-bold">Clicks</div>
                       <div className="text-xl font-black text-white font-mono">0</div>
                    </div>
                    <div className="text-center border border-[rgba(74,222,128,0.2)] bg-[#0A110D] py-4">
                       <div className="text-[9px] text-[#4ade80] opacity-80 uppercase tracking-widest mb-1 font-bold">Convs</div>
                       <div className="text-xl font-black text-[#4ade80] font-mono">0</div>
                    </div>
                 </div>
              </div>

            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
