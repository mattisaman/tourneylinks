import { db, tournaments, tournament_sponsors, registrations } from '@/lib/db';
import { eq } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import InteractiveScorer from './InteractiveScorer';
import TraditionalScorecard from './TraditionalScorecard';

export const dynamic = 'force-dynamic';

export default async function LiveScoringApp({ params, searchParams }: { params: Promise<{ id: string }>, searchParams: Promise<{ hole?: string }> }) {
  const resolvedParams = await params;
  const resolvedSearch = await searchParams;
  
  const tourneyId = parseInt(resolvedParams.id);
  if (isNaN(tourneyId)) return notFound();
  // Simulated internal state: Which hole is the player currently viewing?
  let startingLocation = 1;
  const mySession = await db.select().from(registrations).where(eq(registrations.tournamentId, tourneyId)).limit(1);
  if (mySession.length > 0 && mySession[0].startingHole) {
      startingLocation = mySession[0].startingHole;
  }
  const currentHole = resolvedSearch.hole ? parseInt(resolvedSearch.hole) : startingLocation;

  // 1. Fetch Tournament
  const tourneys = await db.select().from(tournaments).where(eq(tournaments.id, tourneyId)).limit(1);
  const tourney = tourneys[0];
  if (!tourney) return notFound();

  // 2. Fetch Hole Sponsors
  const sponsors = await db.select().from(tournament_sponsors).where(eq(tournament_sponsors.tournamentId, tourneyId));
  
  // Find if this specific hole has a sponsor natively mapped
  const activeSponsor = sponsors.find(s => s.holeAssignment === currentHole);
  const generalSponsors = sponsors.filter(s => !s.holeAssignment);

  return (
    <div style={{ background: '#05120c', minHeight: '100vh', color: 'white', fontFamily: 'sans-serif', paddingBottom: '90px' }}>
      
      {/* Dynamic Sponsor Header */}
      {activeSponsor ? (
        <div style={{ background: 'white', padding: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', borderBottom: '4px solid var(--gold)', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
          <div style={{ fontSize: '0.9rem', color: '#666', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.2em' }}>Proudly Sponsored By</div>
          <img src={activeSponsor.logoUrl} alt={activeSponsor.name} style={{ height: '80px', maxWidth: '300px', objectFit: 'contain' }} />
        </div>
      ) : generalSponsors.length > 0 ? (
        <div style={{ background: '#0a1a12', padding: '1rem', textAlign: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--mist)', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '0.75rem', fontWeight: 600 }}>Proudly Supported By</div>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
             {generalSponsors.map(sp => (
               <div key={sp.id} style={{ background: 'white', padding: '0.5rem', borderRadius: '8px' }}>
                 <img src={sp.logoUrl} alt={sp.name} style={{ height: '50px', maxWidth: '120px', objectFit: 'contain' }} />
               </div>
             ))}
          </div>
        </div>
      ) : null}

      {/* Main Scoring Interface (Scaffold) */}
      <div style={{ padding: '1.5rem', maxWidth: '600px', margin: '0 auto' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
           <h1 style={{ fontFamily: 'serif', fontSize: '1.5rem', marginBottom: '0.25rem' }}>{tourney.name}</h1>
           <div style={{ color: 'var(--gold)', fontWeight: 600, fontSize: '0.9rem', letterSpacing: '0.1em' }}>LIVE SCORING</div>
        </div>

        {/* Hole Navigator */}
        <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '16px', padding: '1.5rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
           {/* Subtle Watermark */}
           <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: '120px', opacity: 0.03, pointerEvents: 'none' }}>⛳</div>
           
           <div style={{ fontSize: '1rem', color: 'var(--mist)', textTransform: 'uppercase', letterSpacing: '0.2em' }}>Current Hole</div>
           
           {/* Interactive Hole Selection */}
           <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.5rem', marginBottom: '0.5rem', padding: '0 1rem' }}>
              <Link href={`/tournaments/${tourneyId}/play?hole=${currentHole > 1 ? currentHole - 1 : 18}`} style={{ fontSize: '2rem', color: 'var(--gold)', textDecoration: 'none', padding: '1rem' }}>
                 &#8592;
              </Link>
              
              <div style={{ fontSize: '5rem', fontWeight: 900, fontFamily: 'serif', lineHeight: 1, color: 'var(--cream)' }}>
                {currentHole}
              </div>

              <Link href={`/tournaments/${tourneyId}/play?hole=${currentHole < 18 ? currentHole + 1 : 1}`} style={{ fontSize: '2rem', color: 'var(--gold)', textDecoration: 'none', padding: '1rem' }}>
                 &#8594;
              </Link>
           </div>
           
           <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginTop: '1rem' }}>
             <div>
               <div style={{ fontSize: '0.75rem', color: 'var(--mist)', textTransform: 'uppercase' }}>Par</div>
               <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>4</div>
             </div>
             <div>
               <div style={{ fontSize: '0.75rem', color: 'var(--mist)', textTransform: 'uppercase' }}>Hdcp</div>
               <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>12</div>
             </div>
           </div>
        </div>
        <InteractiveScorer tournamentId={tourneyId} currentHole={currentHole} courseId={(tourney as any).courseId || 1} />

        <TraditionalScorecard tournamentId={tourneyId} courseId={(tourney as any).courseId || 1} />
      </div>

      {/* FIXED BOTTOM NAVIGATION */}
      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, height: '80px', background: 'rgba(5, 18, 12, 0.95)', backdropFilter: 'blur(10px)', borderTop: '1px solid rgba(255,255,255,0.1)', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', paddingBottom: '20px' }}>
         <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', borderTop: '3px solid var(--gold)', marginTop: '-1px' }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '0.2rem' }}>📝</div>
            <div style={{ color: 'var(--gold)', textAlign: 'center', fontSize: '0.75rem', fontWeight: 800 }}>Score</div>
         </div>
         <Link href={`/tournaments/${tourneyId}/play/leaderboard?hole=${currentHole}`} prefetch={true} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '0.2rem' }}>🏆</div>
            <div style={{ color: 'var(--mist)', textAlign: 'center', fontSize: '0.75rem', fontWeight: 600 }}>Leaderboard</div>
         </Link>
         <Link href={`/tournaments/${tourneyId}/play/stats?hole=${currentHole}`} prefetch={true} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '0.2rem' }}>📊</div>
            <div style={{ color: 'var(--mist)', textAlign: 'center', fontSize: '0.75rem', fontWeight: 600 }}>Stats</div>
         </Link>
      </div>

    </div>
  );
}
