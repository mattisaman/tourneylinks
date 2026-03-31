'use client';

import React, { useState } from 'react';

export default function MasterDemoSandbox() {
  const [wiping, setWiping] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');
  const [tid, setTid] = useState<number>(1);

  React.useEffect(() => {
     fetch('/api/demo/latest')
        .then(res => res.json())
        .then(data => data.id && setTid(data.id))
        .catch(() => console.error("Could not trace latest sequenced ID."));
  }, [wiping]);

  const executeHardReset = async () => {
     if (!confirm('WARNING: This will permanently eradicate the entire local Database and seamlessly rebuild the Pebble Beach Scramble iteration from scratch. Proceed?')) return;
     
     setWiping(true);
     setStatusMsg('Obliterating Database Ledgers...');
     
     try {
        const res = await fetch('/api/demo/reset', { method: 'POST' });
        const data = await res.json();
        
        if (data.success) {
           setStatusMsg('Demo Environment Successfully Reconstructed! ✅');
           setTimeout(() => setStatusMsg(''), 5000);
        } else {
           setStatusMsg(`Error: ${data.error}`);
        }
     } catch(err) {
        setStatusMsg('Critical Systems Failure during Reset.');
     } finally {
        setWiping(false);
     }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#e0e5eb', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
       <div style={{ width: '100%', maxWidth: '800px', background: '#fff', borderRadius: '24px', boxShadow: '0 30px 60px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
          
          <div style={{ background: '#05120c', padding: '3rem 2rem', textAlign: 'center' }}>
             <h1 style={{ color: 'var(--cream)', fontSize: '2.5rem', marginBottom: '0.5rem', fontWeight: 800 }}>TourneyLinks<span style={{ color: 'var(--gold)' }}>.Sandbox</span></h1>
             <p style={{ color: 'var(--mist)', fontSize: '1.1rem', maxWidth: '500px', margin: '0 auto' }}>Master Demo Controller. Seamlessly transition between roles to visualize end-to-end telemetry flows without passwords.</p>
          </div>

          <div style={{ padding: '3rem 2rem' }}>
             
             <h3 style={{ fontSize: '1.2rem', color: 'var(--ink)', marginBottom: '1.5rem', fontWeight: 800 }}>1. Persona Impersonation</h3>
             <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '3rem' }}>
                 
                 <a href="/admin" target="_blank" style={{ textDecoration: 'none', background: '#fafaf5', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '12px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', transition: 'all 0.2s', cursor: 'pointer', color: 'var(--ink)' }}>
                    <div style={{ fontSize: '2rem' }}>🏢</div>
                    <div style={{ fontWeight: 800, fontSize: '1.1rem' }}>SaaS Organizer</div>
                    <p style={{ fontSize: '0.85rem', color: 'var(--mist)', margin: 0 }}>Step into the Master Setup Dashboard. Configure Stripe, Scrambles, and GPS Coordinates.</p>
                 </a>

                 <a href={`/tournaments/${tid}`} target="_blank" style={{ textDecoration: 'none', background: '#fafaf5', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '12px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', transition: 'all 0.2s', cursor: 'pointer', color: 'var(--ink)' }}>
                    <div style={{ fontSize: '2rem' }}>🏌️</div>
                    <div style={{ fontWeight: 800, fontSize: '1.1rem' }}>The Golfer</div>
                    <p style={{ fontSize: '0.85rem', color: 'var(--mist)', margin: 0 }}>Navigate the public gateway. View the Course map, purchase Scramble store entries, and Split Payments.</p>
                 </a>

                 <a href={`/tournaments/${tid}/pro`} target="_blank" style={{ textDecoration: 'none', background: '#fafaf5', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '12px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', transition: 'all 0.2s', cursor: 'pointer', color: 'var(--ink)' }}>
                    <div style={{ fontSize: '2rem' }}>⛳</div>
                    <div style={{ fontWeight: 800, fontSize: '1.1rem' }}>Course Pro</div>
                    <p style={{ fontSize: '0.85rem', color: 'var(--mist)', margin: 0 }}>Access the locked Clubhouse telemetry screen natively monitoring Pace-of-Play speeds.</p>
                 </a>

             </div>

             <div style={{ height: '1px', background: 'rgba(0,0,0,0.05)', marginBottom: '3rem' }}></div>

             <h3 style={{ fontSize: '1.2rem', color: 'var(--ink)', marginBottom: '1.5rem', fontWeight: 800 }}>2. Infrastructure Tools</h3>
             <div style={{ background: 'rgba(255,77,79,0.05)', border: '1px solid rgba(255,77,79,0.2)', borderRadius: '12px', padding: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                 <div>
                    <h4 style={{ color: '#ff4d4f', fontSize: '1.1rem', marginBottom: '0.2rem', fontWeight: 800 }}>Hard Reset Workspace</h4>
                    <p style={{ color: 'var(--ink)', fontSize: '0.85rem', margin: 0, opacity: 0.7 }}>Irrecoverably wipes the active database and rigorously injects a perfectly clean Pebble Beach architecture instance.</p>
                 </div>
                 <button 
                    onClick={executeHardReset}
                    disabled={wiping}
                    style={{ background: '#ff4d4f', color: '#fff', border: 'none', padding: '1rem 2rem', borderRadius: '8px', fontWeight: 800, fontSize: '1rem', cursor: wiping ? 'not-allowed' : 'pointer', opacity: wiping ? 0.7 : 1, transition: 'opacity 0.2s', whiteSpace: 'nowrap' }}
                 >
                    {wiping ? '♻️ Erasing Matrix...' : '🚨 Reset Demo Database'}
                 </button>
             </div>
             {statusMsg && (
                <div style={{ marginTop: '1rem', padding: '1rem', background: statusMsg.includes('Error') ? 'rgba(255,0,0,0.1)' : 'rgba(76,175,80,0.1)', color: statusMsg.includes('Error') ? 'red' : 'green', borderRadius: '8px', textAlign: 'center', fontWeight: 600 }}>
                   {statusMsg}
                </div>
             )}

          </div>
       </div>
    </div>
  );
}
