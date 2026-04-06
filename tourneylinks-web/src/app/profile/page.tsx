import React from 'react';
import { getCurrentUser } from '@/lib/auth-util';
import { getUserId } from '@/lib/auth-util';
import { redirect } from 'next/navigation';
import { db, users, registrations, tournaments, saved_courses, courses } from '@/lib/db';
import { eq, desc } from 'drizzle-orm';
import { UserPlus, Trophy, Link as LinkIcon, Edit3, MapPin, Bell } from 'lucide-react';
import TransferTicketModal from '@/components/profile/TransferTicketModal';
import DeleteDraftButton from '@/components/profile/DeleteDraftButton';
import GolfSponsorshipWidget from '@/components/profile/GolfSponsorshipWidget';

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

  // Fetch the Player's Hosted Events & Drafts
  const hostedEvents = await db.select().from(tournaments).where(eq(tournaments.hostUserId, dbUser.id)).orderBy(desc(tournaments.createdAt));

  return (
    <div className="min-h-screen flex flex-col pt-[80px] relative" style={{
        background: `linear-gradient(to bottom, rgba(5,11,8,0.7), rgba(2,6,4,0.95)), url('/hero-bg-4.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
    }}>

      {/* Cinematic Prestige Profile Header */}
      <div className="w-full relative z-10 border-b border-[rgba(255,255,255,0.05)] bg-[var(--ink)]/30 backdrop-blur-md">
         <div className="absolute top-0 left-0 w-[40vw] h-[40vh] bg-[var(--gold)] opacity-[0.03] rounded-br-full pointer-events-none blur-3xl" />
         <div className="absolute inset-0 bg-gradient-to-t from-[#050B08] via-transparent to-transparent pointer-events-none opacity-90" />

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
            <div className="w-full relative bg-[rgba(255,255,255,0.02)] backdrop-blur-2xl border border-[rgba(255,255,255,0.05)] p-10 lg:p-12 hover:border-[var(--gold)] transition-colors flex flex-col shadow-2xl rounded-2xl z-10">
               <h3 className="text-sm uppercase tracking-[0.15em] font-black mb-8 flex items-center justify-between text-white border-b border-[rgba(255,255,255,0.1)] pb-4">
                 <div className="flex items-center gap-4"><Bell size={18} className="text-[var(--gold)]" /> Command Center</div>
                 <span className="bg-[var(--gold)] text-black px-3 py-1 rounded font-black text-xs animate-pulse shadow-[0_0_15px_rgba(212,175,55,0.4)]">ALERTS</span>
               </h3>
               <div className="flex-1 flex flex-col gap-6">
                  <p className="text-base text-[rgba(255,255,255,0.6)] leading-relaxed font-light">Internal routing system for secure transmissions directly from Hosts and Platform Support.</p>
                  <div className="mt-auto flex flex-col gap-3 pt-6">
                     <a href="/profile/inbox" className="w-full text-center bg-white text-black font-bold uppercase tracking-widest text-xs py-4 rounded hover:bg-[var(--gold)] hover:shadow-[0_0_20px_rgba(212,175,55,0.3)] transition-all">Access Inbox</a>
                     <a href="/profile/settings" className="w-full text-center border border-[rgba(255,255,255,0.2)] text-white hover:border-[var(--gold)] hover:text-[var(--gold)] font-bold uppercase tracking-widest text-xs py-4 rounded transition-all">Notification Rules</a>
                  </div>
               </div>
            </div>

            {/* Widget 2: Registrations & Game Day Mobile Scorer */}
            <div className="md:col-span-2 w-full relative bg-[rgba(2,6,4,0.6)] backdrop-blur-2xl border-t-[3px] border-[var(--gold)] p-10 lg:p-12 hover:border-[rgba(212,175,55,1)] transition-colors shadow-2xl flex flex-col h-full min-h-[400px] rounded-b-2xl z-10">
               <div className="flex items-center justify-between border-b border-[rgba(255,255,255,0.1)] pb-6 mb-6">
                 <h3 className="text-sm uppercase tracking-[0.15em] font-black flex items-center gap-3 text-white">
                   <Trophy size={18} className="text-[var(--gold)]" /> Active Registrations
                 </h3>
                 <a href="/tournaments" className="text-xs text-[var(--gold)] hover:text-black hover:bg-[var(--gold)] border border-[var(--gold)] px-4 py-2 uppercase tracking-widest font-bold transition-all rounded">Directory</a>
               </div>
               
               <div className="flex-1 flex flex-col px-2 overflow-y-auto max-h-[500px] custom-scrollbar">
                 {userRegistrations.length === 0 ? (
                   <div className="w-full h-full flex flex-col items-center justify-center py-16 opacity-50">
                     <p className="text-lg font-light mb-4 text-center">No active tournament flights booked.</p>
                   </div>
                 ) : (
                   <div className="flex flex-col gap-2">
                     {userRegistrations.map((row) => (
                       <div key={row.registration.id} className="py-6 border-b border-[rgba(255,255,255,0.05)] flex flex-col xl:flex-row xl:items-center justify-between gap-6 group hover:bg-[rgba(255,255,255,0.03)] px-4 rounded-xl transition-colors">
                         <div className="min-w-0 pr-4">
                           <div className="text-2xl font-bold text-white group-hover:text-[var(--gold)] transition-colors" style={{ fontFamily: 'var(--font-serif)' }}>{row.tournament.name}</div>
                           <div className="flex items-center gap-4 text-xs font-mono text-[rgba(255,255,255,0.6)] mt-2">
                             <span className="flex items-center gap-2"><span className="text-[var(--gold)] opacity-80">DATE</span> {new Date(row.tournament.dateStart || '').toLocaleDateString()}</span>
                             <span className="w-px h-3 bg-[rgba(255,255,255,0.3)]" />
                             <span className={`uppercase font-bold tracking-widest ${row.registration.status === 'TRANSFERRED' ? 'text-red-400' : 'text-[#4ade80]'}`}>{row.registration.status}</span>
                           </div>
                         </div>
                         
                         {row.registration.status === 'CONFIRMED' && (
                           <div className="flex items-center gap-4 mt-2 xl:mt-0 transition-opacity">
                             {/* Mocking Game Day logic */}
                             {new Date().toISOString().split('T')[0] === row.tournament.dateStart || true ? (
                               <a href={`/tournaments/${row.tournament.id}/scorer`} className="bg-[var(--gold)] text-[#050B08] uppercase font-black tracking-widest text-xs px-6 py-3 rounded shadow-[0_0_20px_rgba(212,175,55,0.4)] hover:bg-white transition-colors flex items-center gap-2 animate-pulse whitespace-nowrap">
                                  Launch Scorer
                               </a>
                             ) : null}
                             <div className="origin-right">
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
            <div className="w-full relative bg-[rgba(255,255,255,0.02)] backdrop-blur-2xl border border-[rgba(255,255,255,0.05)] p-10 lg:p-12 hover:border-[var(--gold)] transition-colors shadow-2xl rounded-2xl z-10">
               <h3 className="text-sm uppercase tracking-[0.15em] font-black flex items-center gap-3 text-white pb-6 border-b border-[rgba(255,255,255,0.1)] mb-6">
                 <MapPin size={18} className="text-[var(--gold)]" /> Course Radars
               </h3>
               {userRadars.length === 0 ? (
                 <div className="text-center py-10 opacity-40">
                   <p className="text-sm font-light mb-3">No radar uplinks established.</p>
                 </div>
               ) : (
                 <div className="flex flex-col max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                   {userRadars.map((row) => (
                     <a href={`/courses/${row.course.id}`} key={row.radar.id} className="group block py-5 border-b border-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.03)] px-4 rounded-xl transition-colors">
                       <div className="flex items-center justify-between">
                         <div className="min-w-0 pr-4">
                           <div className="text-lg font-bold text-white truncate group-hover:text-[var(--gold)] transition-colors" style={{ fontFamily: 'var(--font-serif)' }}>{row.course.name}</div>
                           <div className="text-xs text-[rgba(255,255,255,0.5)] mt-1 uppercase tracking-widest">{row.course.city}, {row.course.state}</div>
                         </div>
                         {row.radar.notifyOnNewTournament && (
                           <div className="w-2 h-2 bg-[#4ade80] rounded-full shadow-[0_0_10px_rgba(74,222,128,0.6)]"></div>
                         )}
                       </div>
                     </a>
                   ))}
                 </div>
               )}
            </div>

            {/* Widget 3.5: Hosted Events & Drafts */}
            <div className="md:col-span-2 w-full relative bg-[rgba(255,255,255,0.02)] backdrop-blur-2xl border border-[rgba(255,255,255,0.05)] p-10 lg:p-12 hover:border-[var(--gold)] transition-colors shadow-2xl rounded-2xl z-10 flex flex-col h-full min-h-[400px]">
               <div className="flex items-center justify-between border-b border-[rgba(255,255,255,0.1)] pb-6 mb-6">
                 <h3 className="text-sm uppercase tracking-[0.15em] font-black flex items-center gap-3 text-white">
                   <Edit3 size={18} className="text-[var(--gold)]" /> Hosted Events & Drafts
                 </h3>
                 <a href="/host" className="text-xs bg-[var(--gold)] text-black hover:bg-white hover:text-black hover:shadow-[0_0_15px_rgba(255,255,255,0.5)] px-4 py-2 uppercase tracking-widest font-bold transition-all rounded">+ Create New</a>
               </div>
               
               <div className="flex-1 flex flex-col px-2 overflow-y-auto max-h-[500px] custom-scrollbar">
                 {hostedEvents.length === 0 ? (
                   <div className="w-full h-full flex flex-col items-center justify-center py-16 opacity-50">
                     <p className="text-lg font-light mb-4 text-center">No hosted events or drafts found.</p>
                   </div>
                 ) : (
                   <div className="flex flex-col gap-2">
                     {hostedEvents.map((t) => (
                       <div key={t.id} className="py-6 border-b border-[rgba(255,255,255,0.05)] flex flex-col xl:flex-row xl:items-center justify-between gap-6 group hover:bg-[rgba(255,255,255,0.03)] px-4 rounded-xl transition-colors">
                         <div className="min-w-0 pr-4">
                           <div className="text-2xl font-bold text-white group-hover:text-[var(--gold)] transition-colors" style={{ fontFamily: 'var(--font-serif)' }}>{t.name}</div>
                           <div className="flex items-center gap-4 text-xs font-mono text-[rgba(255,255,255,0.6)] mt-2">
                             <span className="flex items-center gap-2"><span className="text-[var(--gold)] opacity-80">DATE</span> {t.dateStart ? new Date(t.dateStart).toLocaleDateString() : 'TBD'}</span>
                             <span className="w-px h-3 bg-[rgba(255,255,255,0.3)]" />
                             {t.isActive ? (
                               <span className="uppercase font-bold tracking-widest text-[#4ade80]">LIVE</span>
                             ) : (
                               <span className="uppercase font-bold tracking-widest text-[#f1c40f]">DRAFT</span>
                             )}
                           </div>
                         </div>
                         
                         <div className="flex items-center gap-4 mt-2 xl:mt-0 transition-opacity">
                            <a href={`/host?tournamentId=${t.id}`} className="bg-transparent border border-white text-white hover:border-[var(--gold)] hover:text-[var(--gold)] uppercase font-black tracking-widest text-xs px-6 py-3 rounded transition-colors flex items-center gap-2 whitespace-nowrap">
                               Continue Editing
                            </a>
                            {t.isActive ? (
                               <a href={`/tournaments/${t.id}`} className="bg-[var(--gold)] text-[#050B08] uppercase font-black tracking-widest text-xs px-6 py-3 rounded shadow-[0_0_20px_rgba(212,175,55,0.4)] hover:bg-white transition-colors flex items-center gap-2 whitespace-nowrap">
                                  View Live
                               </a>
                            ) : (
                               <DeleteDraftButton tournamentId={t.id} />
                            )}
                         </div>
                       </div>
                     ))}
                   </div>
                 )}
               </div>
            </div>

            {/* Widget 4: Affiliate Architecture */}
            <div className="w-full relative bg-[rgba(5,11,8,0.7)] backdrop-blur-2xl border border-[rgba(255,255,255,0.1)] p-10 lg:p-12 shadow-2xl rounded-2xl overflow-hidden hover:border-[var(--gold)] transition-colors z-10">
               <div className="absolute inset-0 bg-[url('/hero-bg-4.jpg')] opacity-[0.02] pointer-events-none mix-blend-overlay" />
               <h3 className="text-sm uppercase tracking-[0.15em] font-black mb-6 text-white pb-6 border-b border-[rgba(255,255,255,0.1)] relative z-10 flex items-center justify-between">
                  Credit Bank <span className="text-[var(--gold)] text-lg">$0.00</span>
               </h3>
               <p className="text-sm text-[rgba(255,255,255,0.6)] mb-6 font-light leading-relaxed relative z-10">
                 Earn <strong className="text-white font-bold">$25</strong> automatically when a Director registers their first tournament via your link.
               </p>
               <div className="bg-black border border-[rgba(255,255,255,0.2)] p-4 mb-6 flex items-center justify-between group cursor-pointer hover:border-[var(--gold)] hover:shadow-[0_0_15px_rgba(212,175,55,0.15)] transition-all relative z-10 rounded">
                  <span className="text-xs font-mono text-[var(--gold)] truncate select-all opacity-90 group-hover:opacity-100 pl-1">tourneylinks.com/r/{dbUser.id}T{userId.substring(userId.length-4)}</span>
               </div>
               <div className="grid grid-cols-2 gap-4 relative z-10">
                  <div className="text-center border border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.02)] py-5 rounded-xl">
                     <div className="text-[10px] text-[rgba(255,255,255,0.4)] uppercase tracking-[0.2em] mb-2 font-bold">Clicks</div>
                     <div className="text-2xl font-black text-white font-mono">0</div>
                  </div>
                  <div className="text-center border border-[rgba(74,222,128,0.3)] bg-[rgba(74,222,128,0.05)] py-5 rounded-xl">
                     <div className="text-[10px] text-[#4ade80] opacity-90 uppercase tracking-[0.2em] mb-2 font-bold">Convs</div>
                     <div className="text-2xl font-black text-[#4ade80] font-mono">0</div>
                  </div>
               </div>
            </div>

            {/* Widget 5: Pairing Network */}
            <div className="w-full bg-[rgba(255,255,255,0.01)] backdrop-blur-2xl border border-[rgba(255,255,255,0.05)] p-10 lg:p-12 hover:border-[var(--gold)] transition-colors flex flex-col justify-between shadow-2xl cursor-not-allowed group rounded-2xl z-10">
               <h3 className="text-sm uppercase tracking-[0.15em] font-black mb-6 text-[rgba(255,255,255,0.5)] pb-6 border-b border-[rgba(255,255,255,0.05)] flex items-center gap-3">
                 <UserPlus size={18} /> Pairing Network
               </h3>
               <div className="py-6 text-center">
                 <p className="text-sm text-[rgba(255,255,255,0.4)] font-light leading-relaxed mb-6">Invite playing partners using their verified email address to let the Auto-Flight Engine securely pair you together.</p>
                 <div className="inline-block text-xs text-[rgba(255,255,255,0.3)] bg-[rgba(255,255,255,0.03)] px-6 py-3 uppercase tracking-widest font-bold rounded shadow-inner">
                   Sync Unavailable
                 </div>
               </div>
            </div>

            {/* Widget 6: G.O.L.F. Sponsorship Coverage */}
            <GolfSponsorshipWidget tournaments={hostedEvents} />

          </div>

        </div>
      </main>
    </div>
  );
}
