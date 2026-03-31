'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function WatchScorerClient({ tournamentId, courseId, holeQuery }: { tournamentId: number, courseId: number, holeQuery: number }) {
  const router = useRouter();
  const currentHole = holeQuery || 1;

  const [score, setScore] = useState<number>(4);
  const [par, setPar] = useState<number>(4);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<string>('');
  
  // Data State
  const [activeTeamId, setActiveTeamId] = useState<number | null>(null);

  useEffect(() => {
     // Fetch minimalist data
     const loadData = async () => {
         try {
             setStatus('SYNCING...');
             const [playersRes, scoresRes, courseRes] = await Promise.all([
                 fetch(`/api/admin/tournaments/${tournamentId}/registrants`),
                 fetch(`/api/tournaments/${tournamentId}/scores`),
                 fetch(`/api/courses/${courseId}`)
             ]);

             const players = await playersRes.json();
             const scores = await scoresRes.json();
             const courseHoles = courseRes.ok ? await courseRes.json() : [];

             if (players.length > 0) {
                 const myId = players[0].id; // Simulated login identity
                 setActiveTeamId(myId);
                 
                 const holeScore = scores.find((s: any) => s.registrationId === myId && s.holeNumber === currentHole);
                 const hData = courseHoles.find((h: any) => h.holeNumber === currentHole);
                 
                 setScore(holeScore ? holeScore.grossScore : (hData?.par || 4));
                 setPar(hData?.par || 4);
                 setStatus('READY');
             } else {
                 setStatus('NO TEAM');
             }

         } catch (e) {
             setStatus('OFFLINE');
         }
     }
     loadData();
  }, [tournamentId, courseId, currentHole]);

  const saveInteraction = async (newGross: number) => {
      if (!activeTeamId) return;
      setSaving(true);
      setStatus('SAVING...');
      
      try {
          await fetch(`/api/tournaments/${tournamentId}/scores`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                  registrationId: activeTeamId,
                  holeNumber: currentHole,
                  grossScore: newGross,
                  putts: 2, // Defaulting putts for watch UX
                  fir: null,
                  gir: null
              })
          });
          setStatus('SAVED');
          setTimeout(() => setStatus('READY'), 2000);
      } catch (err) {
          setStatus('FAILED');
      } finally {
          setSaving(false);
      }
  };

  const updateScore = (delta: number) => {
      const nw = Math.max(1, score + delta);
      setScore(nw);
      saveInteraction(nw);
  }

  const navHole = (delta: number) => {
      let target = currentHole + delta;
      if (target > 18) target = 1;
      if (target < 1) target = 18;
      router.push(`/tournaments/${tournamentId}/play/watch?hole=${target}`);
  }

  // Prevent double-tap zoom manually
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';
    document.body.style.overscrollBehaviorY = 'none';

    return () => {
       document.body.style.overflow = '';
       document.body.style.position = '';
       document.body.style.width = '';
       document.body.style.overscrollBehaviorY = '';
    }
  }, []);

  return (
    <div style={{ height: '100vh', width: '100vw', background: 'black', color: 'white', display: 'flex', flexDirection: 'column', fontFamily: 'sans-serif' }}>
       
       {/* Top Navigation */}
       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 10px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <button 
             onClick={() => navHole(-1)} 
             style={{ background: 'none', border: 'none', color: 'var(--gold)', fontSize: '24px', padding: '10px', touchAction: 'manipulation' }}
          >
             &#9664;
          </button>
          <div style={{ textAlign: 'center' }}>
             <div style={{ fontSize: '18px', fontWeight: 800 }}>Hole {currentHole}</div>
             <div style={{ fontSize: '12px', color: 'var(--mist)', marginTop: '2px', textTransform: 'uppercase' }}>Par {par}</div>
          </div>
          <button 
             onClick={() => navHole(1)} 
             style={{ background: 'none', border: 'none', color: 'var(--gold)', fontSize: '24px', padding: '10px', touchAction: 'manipulation' }}
          >
             &#9654;
          </button>
       </div>

       {/* Massive Score View */}
       <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
          <div style={{ fontSize: '110px', fontWeight: 900, lineHeight: 1, color: score > par ? '#ff4d4f' : score < par ? '#4ec9a0' : 'white', userSelect: 'none' }}>
             {score}
          </div>
          <div style={{ position: 'absolute', bottom: '15px', fontSize: '10px', color: status === 'SAVING...' ? 'var(--gold)' : 'var(--mist)', letterSpacing: '0.1em', fontWeight: 800, textTransform: 'uppercase' }}>
             {status}
          </div>
       </div>

       {/* Fat Touch Targets for Action */}
       <div style={{ display: 'flex', height: '100px' }}>
          <button 
             onClick={() => updateScore(-1)}
             style={{ flex: 1, background: '#1a1a1a', border: 'none', color: 'white', fontSize: '40px', touchAction: 'manipulation' }}
          >
             –
          </button>
          <button 
             onClick={() => updateScore(1)}
             style={{ flex: 1.2, background: 'var(--gold)', border: 'none', color: 'black', fontSize: '40px', fontWeight: 800, touchAction: 'manipulation' }}
          >
             +
          </button>
       </div>

    </div>
  );
}
