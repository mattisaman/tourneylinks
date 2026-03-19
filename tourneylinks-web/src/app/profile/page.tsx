import React from 'react';
import { auth, currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { db, users, registrations, tournaments } from '@/lib/db';
import { eq, desc } from 'drizzle-orm';
import { UserPlus, Search, Trophy, Link as LinkIcon, Edit3 } from 'lucide-react';
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

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#071510', color: 'var(--cream)' }}>

      <main className="flex-1 max-w-[1200px] w-full mx-auto px-4 py-12">
        
        {/* Profile Header Block */}
        <div className="mb-10 flex flex-col md:flex-row items-start md:items-center justify-between p-6 md:p-10 rounded-2xl border border-[rgba(78,201,160,0.15)] shadow-xl relative overflow-hidden" style={{ background: 'linear-gradient(135deg, rgba(12,31,23,0.8) 0%, rgba(7,21,16,0.95) 100%)' }}>
          
          <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--gold)] opacity-5 rounded-bl-full pointer-events-none"></div>

          <div className="flex items-center gap-6 z-10">
            <img 
              src={dbUser.avatarUrl || '/placeholder_avatar.png'} 
              alt="Profile Avatar" 
              className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-[var(--gold)] object-cover shadow-[0_0_20px_rgba(235,189,129,0.2)]"
            />
            <div>
              <h1 className="text-3xl md:text-5xl font-bold mb-2 tracking-tight flex items-center gap-3" style={{ fontFamily: 'var(--font-serif), serif' }}>
                {dbUser.fullName}
                {dbUser.role === 'HOST' && (
                  <span className="text-xs bg-[var(--gold)] text-[#071510] px-2 py-1 rounded font-bold uppercase tracking-wider">Host</span>
                )}
              </h1>
              <p className="text-[var(--mist)] text-lg mb-4">{dbUser.email}</p>
              
              <div className="flex items-center gap-4">
                <div className="border border-[rgba(201,168,76,0.3)] rounded-lg text-center shadow-inner" style={{ background: 'rgba(255,255,255,0.02)', padding: '0.8rem 1.25rem' }}>
                  <div className="text-xs uppercase tracking-widest text-[var(--gold)] font-bold mb-1" style={{ lineHeight: '1.2' }}>GHIN Handicap</div>
                  <div className="text-2xl font-bold" style={{ paddingTop: '0.3rem' }}>
                    {dbUser.verifiedGhin ? (
                      <span className="text-[#4ade80]">{dbUser.handicapIndex}</span>
                    ) : (
                      <span className="text-[var(--mist)] italic text-lg opacity-80">Not Verified</span>
                    )}
                  </div>
                </div>

                  <a href="/verify" className="btn-hero-outline ml-2 text-sm uppercase tracking-widest px-4 py-2">
                     {dbUser.verifiedGhin ? 'Update GHIN' : 'Verify Account'}
                  </a>
              </div>
              
              {!dbUser.verifiedGhin && (
                <a href="https://www.ghin.com/create-profile" target="_blank" rel="noopener noreferrer" className="text-xs text-[var(--mist)] hover:text-[var(--gold)] underline transition-colors opacity-80 mt-3 inline-block">
                  Don't have a GHIN? Set one up here to improve your game.
                </a>
              )}
            </div>
          </div>
          
          <div className="mt-6 md:mt-0 z-10 w-full md:w-auto">
             <a href="/profile/settings" className="btn-ghost flex items-center justify-center gap-2 w-full md:w-auto">
                <Edit3 size={16} className="text-[var(--gold)]" /> Edit Settings
             </a>
          </div>
        </div>

        {/* Dashboard Grid Modules */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Tournaments & Friends */}
          <div className="lg:col-span-2 space-y-8">
            
             {/* My Friends Network */}
             <div className="p-8 rounded-2xl border border-[rgba(78,201,160,0.1)] shadow-lg" style={{ background: 'rgba(12,31,23,0.4)' }}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold flex items-center gap-3" style={{ fontFamily: 'var(--font-serif), serif' }}>
                  <UserPlus className="text-[var(--gold)]" /> The Golf Network
                </h2>
                <button className="btn-ghost" style={{ padding: '0.4rem 1rem' }}>
                   + Add Friend
                </button>
              </div>
              <div className="flex items-center justify-center h-32 border-2 border-dashed border-[rgba(78,201,160,0.2)] rounded-xl" style={{ background: 'rgba(255,255,255,0.01)' }}>
                <p className="text-[var(--mist)]">Invite friends to let the Auto-Flight Engine pair you together!</p>
              </div>
            </div>

            {/* My Tournaments Panel */}
            <div className="p-8 rounded-2xl border border-[rgba(78,201,160,0.1)] shadow-lg" style={{ background: 'rgba(12,31,23,0.4)' }}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold flex items-center gap-3" style={{ fontFamily: 'var(--font-serif), serif' }}>
                  <Trophy className="text-[var(--gold)]" /> My Tournaments
                </h2>
                <a href="/tournaments" className="text-sm text-[var(--gold)] hover:text-[var(--amber)] hover:underline uppercase tracking-wider font-bold transition-colors">Find Events</a>
              </div>
              
              {userRegistrations.length === 0 ? (
                <div className="text-center border-2 border-dashed border-[rgba(78,201,160,0.2)] rounded-xl" style={{ background: 'rgba(255,255,255,0.01)', padding: '4rem 2rem' }}>
                  <p className="text-[var(--mist)] mb-6 text-lg">You have not registered for any upcoming events.</p>
                  <a href="/tournaments" className="btn-hero text-sm px-8 py-3 tracking-widest">
                    Browse TourneyLinks
                  </a>
                </div>
              ) : (
                <div className="space-y-4">
                  {userRegistrations.map((row) => (
                    <div key={row.registration.id} className="bg-[rgba(255,255,255,0.05)] border border-[rgba(212,175,55,0.2)] rounded-lg p-4 flex items-center justify-between">
                      <div>
                        <div className="text-lg font-bold text-[var(--gold)]">{row.tournament.name}</div>
                        <div className="text-sm text-[var(--mist)] mt-1 flex items-center gap-2">
                          <span>📅 {new Date(row.tournament.dateStart || '').toLocaleDateString()}</span>
                          <span>|</span>
                          <span className={row.registration.status === 'TRANSFERRED' ? 'text-red-400 font-bold uppercase text-xs' : 'text-green-400 font-bold uppercase text-xs'}>
                            {row.registration.status}
                          </span>
                        </div>
                      </div>
                      
                      {row.registration.status === 'CONFIRMED' && (
                        <TransferTicketModal 
                          registrationId={row.registration.id} 
                          tournamentName={row.tournament.name}
                        />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

          {/* Right Column: Widgets */}
          <div className="space-y-8">
            
            {/* Automatic Saved Searches */}
            <div className="p-6 rounded-2xl border border-[rgba(78,201,160,0.1)] shadow-inner" style={{ background: 'rgba(12,31,23,0.4)' }}>
               <h3 className="text-xl font-bold mb-4 flex items-center gap-2" style={{ fontFamily: 'var(--font-serif), serif' }}>
                 <Search className="text-[var(--gold)]" size={20} /> Saved Radars
               </h3>
               <p className="text-sm text-[var(--mist)] mb-6 leading-relaxed">
                 Configure a radar to automatically alert your email when our crawlers discover a tournament matching your filters.
               </p>
               <button className="btn-hero-outline w-full justify-center">
                 + Create Radar
               </button>
            </div>

            {/* Referral / Affiliate Architecture */}
            <div className="p-6 rounded-2xl border border-[var(--gold)] shadow-[0_0_15px_rgba(235,189,129,0.1)] relative overflow-hidden text-center" style={{ background: 'linear-gradient(135deg, rgba(12,31,23,0.95), rgba(7,21,16,1))' }}>
               <div className="absolute inset-0 bg-gradient-to-tr from-[var(--gold)] via-transparent to-transparent opacity-10 pointer-events-none"></div>
               <h3 className="text-xl font-bold mb-2 text-[var(--gold)]" style={{ fontFamily: 'var(--font-serif), serif' }}>Earn $25 Tournament Credit</h3>
               <p className="text-sm text-[var(--mist)] mb-5">
                 Share TourneyLinks. Automatically earn $25 towards your next event when a Director registers their first tournament via your link.
               </p>
               <div className="border border-[rgba(201,168,76,0.3)] rounded p-3 mb-5 flex items-center justify-between group cursor-pointer hover:border-[var(--gold)] transition-colors" style={{ background: 'rgba(255,255,255,0.03)' }}>
                  <span className="text-xs font-mono text-[var(--gold)] truncate select-all opacity-80 group-hover:opacity-100">tourneylinks.com/r/{dbUser.id}T{userId.substring(userId.length-4)}</span>
                  <LinkIcon size={16} className="text-[var(--gold)] opacity-50 group-hover:opacity-100 transition-opacity" />
               </div>
               <div className="grid grid-cols-2 gap-4">
                  <div className="rounded text-center border border-[rgba(255,255,255,0.05)]" style={{ background: 'rgba(255,255,255,0.02)', padding: '1rem' }}>
                     <div className="text-xs text-[var(--mist)] uppercase tracking-wider mb-2">Clicks</div>
                     <div className="text-3xl font-bold text-[var(--cream)]">0</div>
                  </div>
                  <div className="rounded text-center border border-[rgba(255,255,255,0.05)]" style={{ background: 'rgba(255,255,255,0.02)', padding: '1rem' }}>
                     <div className="text-xs text-[var(--mist)] uppercase tracking-wider mb-2">Convs</div>
                     <div className="text-3xl font-bold text-[#4ade80]">0</div>
                  </div>
               </div>
            </div>

          </div>

        </div>
      </main>
    </div>
  );
}
