'use client';

import React, { useEffect, useState } from 'react';

export default function LiveRadarClient({ tournamentId }: { tournamentId: number }) {
  const [telemetry, setTelemetry] = useState<any[]>([]);
  const [lastPing, setLastPing] = useState<Date | null>(null);

  useEffect(() => {
     const fetchRadar = async () => {
         try {
             const res = await fetch(`/api/tournaments/${tournamentId}/telemetry`);
             if (res.ok) {
                 const data = await res.json();
                 setTelemetry(data);
                 setLastPing(new Date());
             }
         } catch (e) {
             console.error('Radar offline');
         }
     };

     // Initial boot
     fetchRadar();

     // Radar sweeping every 15 seconds
     const interval = setInterval(fetchRadar, 15000);
     return () => clearInterval(interval);
  }, [tournamentId]);

  // If no one is on the course yet
  if (telemetry.length === 0) {
      return (
         <div style={{ background: '#0a1a12', border: '1px solid rgba(78,201,160,0.3)', borderRadius: '16px', padding: '3rem', textAlign: 'center' }}>
            <div style={{ color: '#4ec9a0', fontSize: '1.2rem', fontWeight: 600, letterSpacing: '0.1em' }}>RADAR SWEEPING...</div>
            <div style={{ color: 'rgba(255,255,255,0.5)', marginTop: '0.5rem', fontSize: '0.9rem' }}>Awaiting first telemetry ping from the field.</div>
         </div>
      );
  }

  // Auto-bounding box to ensure all carts remain strictly visible inside the view
  const padding = 0.0005; // ~50 meters padding
  const lats = telemetry.map(t => t.latitude);
  const lngs = telemetry.map(t => t.longitude);
  
  const minLat = Math.min(...lats) - padding;
  const maxLat = Math.max(...lats) + padding;
  const minLng = Math.min(...lngs) - padding;
  const maxLng = Math.max(...lngs) + padding;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0, color: 'white', fontWeight: 600 }}>The Marauder's Map (Live Fleet Tracking)</h3>
          <div style={{ fontSize: '0.75rem', color: 'var(--mist)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
             Last Ping: {lastPing ? lastPing.toLocaleTimeString() : '--'}
          </div>
       </div>
       
       {/* Radar Topological Canvas */}
       <div style={{ 
          position: 'relative', 
          width: '100%', 
          height: '400px', 
          background: 'radial-gradient(circle, #0a1a12 0%, #030805 100%)',
          border: '1px solid rgba(78,201,160,0.2)',
          borderRadius: '16px',
          overflow: 'hidden',
          backgroundImage: 'linear-gradient(rgba(78,201,160,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(78,201,160,0.05) 1px, transparent 1px)',
          backgroundSize: '40px 40px'
       }}>
          
          {/* Radar Sweep Animation (CSS native rendering) */}
          <div style={{
             position: 'absolute',
             top: '50%', left: '50%',
             width: '100%', height: '100%',
             background: 'conic-gradient(from 0deg, transparent 70%, rgba(78,201,160,0.4) 100%)',
             transformOrigin: '0% 0%',
             animation: 'radar-sweep 4s linear infinite',
             pointerEvents: 'none'
          }}></div>

          <style dangerouslySetInnerHTML={{__html: `
            @keyframes radar-sweep {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }
            @keyframes pulse-red {
              0% { box-shadow: 0 0 0 0 rgba(255, 77, 79, 0.7); }
              70% { box-shadow: 0 0 0 10px rgba(255, 77, 79, 0); }
              100% { box-shadow: 0 0 0 0 rgba(255, 77, 79, 0); }
            }
          `}} />

          {/* Plotting the Field */}
          {telemetry.map(t => {
             // Calculate absolute % mapping inside the auto-bounding box
             const latPercent = ((t.latitude - minLat) / (maxLat - minLat)) * 100;
             const lngPercent = ((t.longitude - minLng) / (maxLng - minLng)) * 100;

             // Pace of Play Warning Logic: If they haven't pinged in > 5 mins, assume they are stuck
             const msSincePing = new Date().getTime() - new Date(t.timestamp).getTime();
             const isStuck = msSincePing > (5 * 60 * 1000); 

             return (
                <div 
                   key={t.registrationId}
                   style={{
                      position: 'absolute',
                      top: `${100 - latPercent}%`, // Invert Y axis for Latitudes (North is UP)
                      left: `${lngPercent}%`,
                      transform: 'translate(-50%, -50%)',
                      width: '12px',
                      height: '12px',
                      background: isStuck ? '#ff4d4f' : '#4ec9a0',
                      borderRadius: '50%',
                      boxShadow: isStuck ? 'none' : '0 0 10px #4ec9a0',
                      animation: isStuck ? 'pulse-red 2s infinite' : 'none',
                      cursor: 'pointer',
                      zIndex: 10
                   }}
                   title={`Registration ID: ${t.registrationId} | Paced: ${Math.floor(msSincePing/1000/60)}m ago`}
                >
                   {/* Tooltip Hover Label */}
                   <div style={{ position: 'absolute', top: '-25px', left: '15px', background: 'black', padding: '2px 6px', borderRadius: '4px', fontSize: '10px', color: 'white', whiteSpace: 'nowrap', border: `1px solid ${isStuck ? '#ff4d4f' : '#4ec9a0'}` }}>
                      Cart {t.registrationId}
                   </div>
                </div>
             );
          })}
       </div>
    </div>
  );
}
