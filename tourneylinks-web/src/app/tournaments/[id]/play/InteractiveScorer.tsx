'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

type PlayerConfig = {
  id: number;
  firstName: string | null;
  lastName: string | null;
  handicapIndex: string | null;
};

type ScoreMeta = {
  registrationId: number;
  holeNumber: number;
  grossScore: number;
  putts?: number;
  fir?: boolean;
  gir?: boolean;
};

export default function InteractiveScorer({ 
  tournamentId, 
  currentHole,
  courseId 
}: { 
  tournamentId: number, 
  currentHole: number,
  courseId: number 
}) {
  const router = useRouter();
  
  // Data for the Single Team Rendering
  const [activeTeam, setActiveTeam] = useState<PlayerConfig | null>(null);
  
  // HUD Telemetry
  const [totalStrokes, setTotalStrokes] = useState(0);
  const [holesPlayed, setHolesPlayed] = useState(0);
  const [currentRank, setCurrentRank] = useState<string>('T-1st');
  const [displayScore, setDisplayScore] = useState<string>('E');
  
  // Active Hole Score State
  const [currentHoleScore, setCurrentHoleScore] = useState<number>(4);
  const [currentPutts, setCurrentPutts] = useState<number>(2);
  const [currentFIR, setCurrentFIR] = useState<boolean>(false);
  const [currentGIR, setCurrentGIR] = useState<boolean>(false);
  const [holePar, setHolePar] = useState<number>(4);
  const [saving, setSaving] = useState<boolean>(false);

  // Phase 7: Haversine GPS State
  const [pinTarget, setPinTarget] = useState<{ lat: number, lng: number } | null>(null);
  const [distanceToPin, setDistanceToPin] = useState<number | null>(null);
  const [gpsStatus, setGpsStatus] = useState<string>('SEARCHING SATELLITES...');

  // Phase 11: Beverage Cart
  const [bevStatus, setBevStatus] = useState<'IDLE'|'ORDERING'|'SENT'>('IDLE');

  const handleCallBevCart = () => {
     if (!activeTeam || bevStatus === 'ORDERING') return;
     setBevStatus('ORDERING');
     
     if (typeof navigator !== 'undefined' && 'geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(async (pos) => {
           try {
              await fetch(`/api/tournaments/${tournamentId}/drinks`, {
                 method: 'POST',
                 headers: { 'Content-Type': 'application/json' },
                 body: JSON.stringify({
                    registrationId: activeTeam.id,
                    latitude: pos.coords.latitude,
                    longitude: pos.coords.longitude
                 })
              });
              setBevStatus('SENT');
              setTimeout(() => setBevStatus('IDLE'), 5000);
           } catch {
              setBevStatus('IDLE');
           }
        }, () => setBevStatus('IDLE'), { enableHighAccuracy: true });
     } else {
        setBevStatus('IDLE');
     }
  };

  // Phase 11: Banter Feed
  const [showBanter, setShowBanter] = useState(false);
  const [banterMsg, setBanterMsg] = useState("");
  const [sendingBanter, setSendingBanter] = useState(false);

  const submitBanter = async () => {
      if (!banterMsg.trim() || !activeTeam || sendingBanter) return;
      setSendingBanter(true);
      try {
         await fetch(`/api/tournaments/${tournamentId}/banter`, {
             method: 'POST',
             headers: { 'Content-Type': 'application/json' },
             body: JSON.stringify({ 
                 authorName: `${activeTeam.firstName} ${activeTeam.lastName}`, 
                 message: banterMsg 
             })
         });
         setBanterMsg("");
         setShowBanter(false);
      } catch (err) {}
      setSendingBanter(false);
  };

  useEffect(() => {
     const fetchData = async () => {
        try {
           const [playersRes, scoresRes, courseRes, leaderboardRes] = await Promise.all([
             fetch(`/api/admin/tournaments/${tournamentId}/registrants`),
             fetch(`/api/tournaments/${tournamentId}/scores`),
             fetch(`/api/courses/${courseId}`),
             fetch(`/api/tournaments/${tournamentId}/leaderboard`)
           ]);
           
           const playersData: PlayerConfig[] = await playersRes.json();
           const scoresData: ScoreMeta[] = await scoresRes.json();
           const leaderboardData = leaderboardRes.ok ? await leaderboardRes.json() : null;

           if (playersData.length > 0) {
              const myTeam = playersData[0]; // Simulating "Team Woods" phone
              setActiveTeam(myTeam);

              // Find my team's specific score for the Active Hole from DB
              const myHoleScore = scoresData.find(s => s.registrationId === myTeam.id && s.holeNumber === currentHole);
              setCurrentHoleScore(myHoleScore ? myHoleScore.grossScore : 4);
              setCurrentPutts(myHoleScore?.putts ?? 2);
              setCurrentFIR(myHoleScore?.fir ?? false);
              setCurrentGIR(myHoleScore?.gir ?? false);

              // Pull physical Pin location from PostgreSQL Database
              if (courseRes.ok) {
                 const cData = await courseRes.json();
                 const holeLayout = cData.find((h: any) => h.holeNumber === currentHole);
                 if (holeLayout) {
                     setHolePar(holeLayout.par || 4);
                     if (holeLayout.pinLat && holeLayout.pinLng) {
                         setPinTarget({ lat: holeLayout.pinLat, lng: holeLayout.pinLng });
                     } else {
                         setGpsStatus('UNMAPPED TARGET');
                     }
                 }
              }

              // Determine My HUD Stats
              // Pull live telemetry from the multi-format FormatEngine Backend
              if (leaderboardData && leaderboardData.leaderboard) {
                 const lbRaw = leaderboardData.leaderboard;
                 const myStats = lbRaw.find((l: any) => l.registrationId === myTeam.id);
                 if (myStats) {
                     setTotalStrokes(myStats.totalStrokes);
                     setHolesPlayed(myStats.holesPlayed);
                     setDisplayScore(myStats.displayScore);
                     
                     // Rank Logic 
                     const rankIndex = lbRaw.findIndex((l: any) => l.sortValue === myStats.sortValue);
                     const tiedCount = lbRaw.filter((l: any) => l.sortValue === myStats.sortValue).length;
                     const rank = rankIndex + 1;
                     
                     setCurrentRank(tiedCount > 1 ? `T-${rank}` : `${rank}`);
                 }
              }
           }
        } catch (err) {}
     };
     
     fetchData();
  }, [tournamentId, currentHole, courseId]);

  // Phase 10: MARAUDERS MAP / Real-Time Telemetry Pinging
  useEffect(() => {
     if (!activeTeam) return;

     let watchId: number;
     if (typeof navigator !== 'undefined' && 'geolocation' in navigator) {
        watchId = navigator.geolocation.watchPosition((pos) => {
            const { latitude, longitude, accuracy } = pos.coords;
            
            // Fire and forget Ping to Command Center
            fetch(`/api/tournaments/${tournamentId}/telemetry`, {
               method: 'POST',
               headers: { 'Content-Type': 'application/json' },
               body: JSON.stringify({
                  registrationId: activeTeam.id,
                  latitude,
                  longitude,
                  accuracy
               })
            }).catch(() => {}); // Suppress network drops

            // Haversine Distance Calculator
            if (pinTarget) {
               const R = 6371e3; // Earth radius in meters
               const φ1 = latitude * Math.PI/180;
               const φ2 = pinTarget.lat * Math.PI/180;
               const Δφ = (pinTarget.lat - latitude) * Math.PI/180;
               const Δλ = (pinTarget.lng - longitude) * Math.PI/180;
   
               const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
                         Math.cos(φ1) * Math.cos(φ2) *
                         Math.sin(Δλ/2) * Math.sin(Δλ/2);
               const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
   
               const distMeters = R * c; 
               const yards = Math.round(distMeters * 1.09361);
               
               setDistanceToPin(yards);
               setGpsStatus('ACQUIRED');
            }

        }, () => {
            setGpsStatus('GPS DENIED');
        }, {
           enableHighAccuracy: true,
           timeout: 10000,
           maximumAge: 5000
        });
     }

     return () => {
        if (watchId) navigator.geolocation.clearWatch(watchId);
     }
  }, [tournamentId, activeTeam, pinTarget]);


  const saveInteraction = async (newScore: number, newPutts: number, newFIR: boolean, newGIR: boolean) => {
     if (!activeTeam) return;
     setSaving(true);
     try {
       await fetch(`/api/tournaments/${tournamentId}/scores`, {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({
            registrationId: activeTeam.id,
            holeNumber: currentHole,
            grossScore: newScore,
            putts: newPutts,
            fir: newFIR,
            gir: newGIR
         })
       });
       // Force sibling layouts (Traditional Grid) to autonomously re-sync visual calculations
       window.dispatchEvent(new CustomEvent('scoreSaved'));
     } catch (err) {
       console.error("Save failed", err);
     } finally {
       setSaving(false);
     }
  };

  const updateScore = (delta: number) => {
      const newScore = Math.max(1, currentHoleScore + delta);
      setCurrentHoleScore(newScore);
      setTotalStrokes(prev => prev + delta);
      saveInteraction(newScore, currentPutts, currentFIR, currentGIR);
  };

  const toggleFIR = () => {
      const nw = !currentFIR;
      setCurrentFIR(nw);
      saveInteraction(currentHoleScore, currentPutts, nw, currentGIR);
  }
  
  const toggleGIR = () => {
      const nw = !currentGIR;
      setCurrentGIR(nw);
      saveInteraction(currentHoleScore, currentPutts, currentFIR, nw);
  }
  
  const updatePutts = (delta: number) => {
      const nw = Math.max(0, currentPutts + delta);
      setCurrentPutts(nw);
      saveInteraction(currentHoleScore, nw, currentFIR, currentGIR);
  }

  const handleNextHole = () => {
      let next = currentHole + 1;
      if (next > 18) next = 1; // Loop back for demo purposes
      router.push(`/tournaments/${tournamentId}/play?hole=${next}`);
  };

  if (!activeTeam) {
      return (
          <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--mist)' }}>
              Loading sync roster...
          </div>
      );
  }


  return (
    <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
       
       {showBanter && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.9)', zIndex: 9999, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
             <h3 style={{ color: 'var(--gold)', fontFamily: 'serif', fontSize: '2rem', marginBottom: '0.5rem' }}>The Banter Feed</h3>
             <p style={{ color: 'var(--mist)', fontSize: '0.9rem', marginBottom: '2rem' }}>Broadcast your trash talk to the entire field.</p>
             <textarea 
                value={banterMsg}
                onChange={(e) => setBanterMsg(e.target.value)}
                placeholder="He shanked it into the fescue again..."
                style={{ width: '100%', maxWidth: '400px', height: '120px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '12px', padding: '1rem', color: 'white', fontSize: '1.2rem', resize: 'none' }}
                maxLength={140}
             />
             <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                <button onClick={() => setShowBanter(false)} style={{ background: 'transparent', border: '1px solid white', color: 'white', padding: '1rem 2rem', borderRadius: '30px', fontWeight: 600 }}>Cancel</button>
                <button onClick={submitBanter} disabled={sendingBanter || !banterMsg.trim()} style={{ background: 'var(--gold)', border: 'none', color: 'black', padding: '1rem 2rem', borderRadius: '30px', fontWeight: 800 }}>
                    {sendingBanter ? 'Sending...' : 'Broadcast'}
                </button>
             </div>
          </div>
       )}

       {/* ACTIVE TEAM CARD */}
       <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Identity Header & Haversine Engine Output */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.75rem' }}>
             <div>
                <div style={{ fontWeight: 800, fontSize: '1.3rem', color: 'var(--cream)' }}>{activeTeam.firstName} {activeTeam.lastName}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--mist)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Captain: HDCP {activeTeam.handicapIndex}</div>
                 <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
                    <button 
                      onClick={() => router.push(`/tournaments/${tournamentId}/play/watch?hole=${currentHole}`)}
                      style={{ background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.3)', borderRadius: '20px', padding: '0.25rem 0.75rem', color: 'var(--gold)', fontSize: '0.7rem', fontWeight: 800, letterSpacing: '0.05em', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                    >
                      ⌚ WATCH MODE
                    </button>
                    <button 
                      onClick={handleCallBevCart}
                      disabled={bevStatus !== 'IDLE'}
                      style={{ background: bevStatus === 'SENT' ? 'rgba(78,201,160,0.1)' : 'rgba(59,130,246,0.1)', border: bevStatus === 'SENT' ? '1px solid rgba(78,201,160,0.3)' : '1px solid rgba(59,130,246,0.3)', borderRadius: '20px', padding: '0.25rem 0.75rem', color: bevStatus === 'SENT' ? '#4ec9a0' : '#60a5fa', fontSize: '0.7rem', fontWeight: 800, letterSpacing: '0.05em', cursor: bevStatus !== 'IDLE' ? 'default' : 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                    >
                      {bevStatus === 'ORDERING' ? '📡 PINGING...' : bevStatus === 'SENT' ? '🍻 CART DISPATCHED' : '🍻 CALL BEV CART'}
                    </button>
                    <button 
                      onClick={() => setShowBanter(true)}
                      style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '20px', padding: '0.25rem 0.75rem', color: 'white', fontSize: '0.7rem', fontWeight: 800, letterSpacing: '0.05em', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                    >
                      💬 TRASH TALK
                    </button>
                 </div>
              </div>
             
             <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'center' }}>
                <div style={{ fontSize: '0.65rem', color: distanceToPin ? '#4CAF50' : 'var(--mist)', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 800 }}>
                   {gpsStatus === 'ACQUIRED' ? 'DISTANCE TO PIN' : gpsStatus}
                </div>
                {distanceToPin !== null && (
                   <div style={{ fontSize: '1.8rem', fontWeight: 900, color: 'white', letterSpacing: '-0.02em', marginTop: '-0.2rem' }}>
                      {distanceToPin} <span style={{ fontSize: '1rem', color: '#4CAF50' }}>YDS</span>
                   </div>
                )}
             </div>
          </div>
          
          {/* HUD TELEMETRY BAR */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(0,0,0,0.3)', padding: '0.75rem 1rem', borderRadius: '8px' }}>
             <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '0.65rem', color: 'var(--mist)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Position</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--gold)' }}>{currentRank}</div>
             </div>
             <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '0.65rem', color: 'var(--mist)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Score</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: displayScore.startsWith('+') ? '#ff4d4f' : displayScore === 'E' || displayScore === '--' ? 'white' : 'var(--mist)' }}>{displayScore}</div>
             </div>
             <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '0.65rem', color: 'var(--mist)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Thru</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 800 }}>{holesPlayed === 18 ? 'F' : holesPlayed === 0 ? '-' : holesPlayed}</div>
             </div>
          </div>
          
          {/* SCORING INTERFACE */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.25rem' }}>
             <div style={{ fontSize: '0.9rem', color: 'var(--mist)', fontWeight: 600 }}>Active Hole Score</div>
             <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                <button 
                  onClick={() => updateScore(-1)}
                  style={{ width: '45px', height: '45px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: 'white', fontSize: '1.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                >
                  -
                </button>
                
                <div style={{ border: '2px solid rgba(212,175,55,0.4)', background: 'rgba(212,175,55,0.05)', width: '60px', height: '60px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 800, color: saving ? 'var(--gold)' : 'white' }}>
                  {currentHoleScore}
                </div>

                <button 
                  onClick={() => updateScore(1)}
                  style={{ width: '45px', height: '45px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: 'white', fontSize: '1.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                >
                  +
                </button>
              </div>
           </div>

           {/* ADVANCED STATS INTERFACE */}
           <div style={{ marginTop: '0.5rem', paddingTop: '1.25rem', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
             
             {/* Putts */}
             <div style={{ background: 'rgba(0,0,0,0.3)', padding: '0.75rem', borderRadius: '8px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                 <div style={{ fontSize: '0.65rem', color: 'var(--mist)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Putts</div>
                 <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                     <button onClick={() => updatePutts(-1)} style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>-</button>
                     <div style={{ fontSize: '1.2rem', fontWeight: 800 }}>{currentPutts}</div>
                     <button onClick={() => updatePutts(1)} style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
                 </div>
             </div>

             {/* FIR / GIR */}
             <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                 {holePar > 3 && (
                     <button onClick={toggleFIR} style={{ flex: 1, background: currentFIR ? 'rgba(78,201,160,0.1)' : 'rgba(0,0,0,0.3)', border: currentFIR ? '1px solid #4ec9a0' : '1px solid rgba(255,255,255,0.05)', color: currentFIR ? '#4ec9a0' : 'var(--mist)', borderRadius: '8px', padding: '0.5rem', fontWeight: 700, fontSize: '0.75rem', cursor: 'pointer', transition: 'all 0.2s', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                         {currentFIR ? '✓ Fairway Hit' : 'Fairway Hit?'}
                     </button>
                 )}
                 <button onClick={toggleGIR} style={{ flex: 1, background: currentGIR ? 'rgba(78,201,160,0.1)' : 'rgba(0,0,0,0.3)', border: currentGIR ? '1px solid #4ec9a0' : '1px solid rgba(255,255,255,0.05)', color: currentGIR ? '#4ec9a0' : 'var(--mist)', borderRadius: '8px', padding: '0.5rem', fontWeight: 700, fontSize: '0.75rem', cursor: 'pointer', transition: 'all 0.2s', textTransform: 'uppercase', letterSpacing: '0.05em', height: holePar <= 3 ? '100%' : 'auto' }}>
                     {currentGIR ? '✓ Green in Reg' : 'Green in Reg?'}
                 </button>
             </div>
           </div>

        </div>

       <div style={{ textAlign: 'center', marginTop: '1rem' }}>
           <button onClick={handleNextHole} style={{ background: 'var(--gold)', color: '#05120c', border: 'none', padding: '1rem 3rem', borderRadius: '30px', fontWeight: 800, letterSpacing: '0.1em', cursor: 'pointer', fontSize: '1rem', textTransform: 'uppercase' }}>
              Save & Next Hole ➔
           </button>
       </div>
    </div>
  );
}
