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
  const [relativePar, setRelativePar] = useState<number>(0);
  
  // Active Hole Score State
  const [currentHoleScore, setCurrentHoleScore] = useState<number>(4);
  const [saving, setSaving] = useState<boolean>(false);

  // Phase 7: Haversine GPS State
  const [pinTarget, setPinTarget] = useState<{ lat: number, lng: number } | null>(null);
  const [distanceToPin, setDistanceToPin] = useState<number | null>(null);
  const [gpsStatus, setGpsStatus] = useState<string>('SEARCHING SATELLITES...');

  useEffect(() => {
     const fetchData = async () => {
        try {
           const [playersRes, scoresRes, courseRes] = await Promise.all([
             fetch(`/api/admin/tournaments/${tournamentId}/registrants`),
             fetch(`/api/tournaments/${tournamentId}/scores`),
             fetch(`/api/courses/${courseId}`)
           ]);
           
           const playersData: PlayerConfig[] = await playersRes.json();
           const scoresData: ScoreMeta[] = await scoresRes.json();

           if (playersData.length > 0) {
              const myTeam = playersData[0]; // Simulating "Team Woods" phone
              setActiveTeam(myTeam);

              // Find my team's specific score for the Active Hole from DB
              const myHoleScore = scoresData.find(s => s.registrationId === myTeam.id && s.holeNumber === currentHole);
              setCurrentHoleScore(myHoleScore ? myHoleScore.grossScore : 4);

              // Pull physical Pin location from PostgreSQL Database
              if (courseRes.ok) {
                 const cData = await courseRes.json();
                 const holeLayout = cData.find((h: any) => h.holeNumber === currentHole);
                 if (holeLayout && holeLayout.pinLat && holeLayout.pinLng) {
                     setPinTarget({ lat: holeLayout.pinLat, lng: holeLayout.pinLng });
                 } else {
                     setGpsStatus('UNMAPPED TARGET');
                 }
              }

              // Calculate All Leaderboard Stats to find Rank
              const leaderboardMath = playersData.map(p => {
                 const pScores = scoresData.filter(s => s.registrationId === p.id);
                 const strokes = pScores.reduce((sum, s) => sum + s.grossScore, 0);
                 const pPlayed = pScores.length;
                 const pRelPar = pPlayed > 0 ? strokes - (pPlayed * 4) : 0;
                 return { id: p.id, pRelPar, strokes, pPlayed };
              }).sort((a, b) => a.pRelPar - b.pRelPar);

              // Determine My HUD Stats
              const myStats = leaderboardMath.find(l => l.id === myTeam.id);
              if (myStats) {
                 setTotalStrokes(myStats.strokes);
                 setHolesPlayed(myStats.pPlayed);
                 setRelativePar(myStats.pRelPar);
                 
                 // Rank Logic
                 const rankIndex = leaderboardMath.findIndex(l => l.pRelPar === myStats.pRelPar);
                 const tiedCount = leaderboardMath.filter(l => l.pRelPar === myStats.pRelPar).length;
                 const rank = rankIndex + 1;
                 
                 setCurrentRank(tiedCount > 1 ? `T-${rank}` : `${rank}`);
              }
           }
        } catch (err) {}
     };
     
     fetchData();
  }, [tournamentId, currentHole, courseId]);

  // Phase 7: Subsystem initializing the HTML5 Navigator & Haversine Formula
  useEffect(() => {
     if (!pinTarget) return;

     if (!('geolocation' in navigator)) {
         setGpsStatus('GPS UNAVAILABLE');
         return;
     }

     const getDistanceYards = (lat1: number, lon1: number, lat2: number, lon2: number) => {
         const R = 6371; // Radius of the Earth in Kilometers
         const dLat = (lat2 - lat1) * (Math.PI / 180);
         const dLon = (lon2 - lon1) * (Math.PI / 180);
         const a = 
             Math.sin(dLat / 2) * Math.sin(dLat / 2) +
             Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * 
             Math.sin(dLon / 2) * Math.sin(dLon / 2);
         const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)); 
         const d = R * c; 
         return Math.round(d * 1093.61); // Dynamically convert km to physical yards
     };

     const watchId = navigator.geolocation.watchPosition(
         (pos) => {
             const userLat = pos.coords.latitude;
             const userLng = pos.coords.longitude;
             const distance = getDistanceYards(userLat, userLng, pinTarget.lat, pinTarget.lng);
             setDistanceToPin(distance);
             setGpsStatus('ACQUIRED');
         },
         (err) => {
             setGpsStatus('GPS DENIED');
         },
         { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
     );

     return () => navigator.geolocation.clearWatch(watchId);
  }, [pinTarget]);

  const updateScore = async (delta: number) => {
     if (!activeTeam) return;
     const newScore = Math.max(1, currentHoleScore + delta); // minimum score is 1
     setCurrentHoleScore(newScore);

     setSaving(true);
     try {
       await fetch(`/api/tournaments/${tournamentId}/scores`, {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({
            registrationId: activeTeam.id,
            holeNumber: currentHole,
            grossScore: newScore
         })
       });
       // Instantly pseudo-update the local HUD math!
       setRelativePar(prev => prev + delta);
       setTotalStrokes(prev => prev + delta);
       
       // Force sibling layouts (Traditional Grid) to autonomously re-sync visual calculations
       window.dispatchEvent(new CustomEvent('scoreSaved'));
     } catch (err) {
       console.error("Save failed", err);
     } finally {
       setSaving(false);
     }
  };

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

  const displayScore = holesPlayed === 0 ? 'E' : relativePar > 0 ? `+${relativePar}` : relativePar === 0 ? 'E' : `${relativePar}`;

  return (
    <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
       
       {/* ACTIVE TEAM CARD */}
       <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Identity Header & Haversine Engine Output */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.75rem' }}>
             <div>
                <div style={{ fontWeight: 800, fontSize: '1.3rem', color: 'var(--cream)' }}>{activeTeam.firstName} {activeTeam.lastName}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--mist)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Captain: HDCP {activeTeam.handicapIndex}</div>
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
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: relativePar < 0 ? '#ff4d4f' : relativePar > 0 ? 'var(--mist)' : 'white' }}>{displayScore}</div>
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
       </div>

       <div style={{ textAlign: 'center', marginTop: '1rem' }}>
           <button onClick={handleNextHole} style={{ background: 'var(--gold)', color: '#05120c', border: 'none', padding: '1rem 3rem', borderRadius: '30px', fontWeight: 800, letterSpacing: '0.1em', cursor: 'pointer', fontSize: '1rem', textTransform: 'uppercase' }}>
              Save & Next Hole ➔
           </button>
       </div>
    </div>
  );
}
