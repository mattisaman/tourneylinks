'use client';

import React, { useState, useEffect } from 'react';

export default function BanterStream({ tournamentId }: { tournamentId: number }) {
   const [banters, setBanters] = useState<any[]>([]);

   useEffect(() => {
       const fetchBanter = async () => {
           try {
               const res = await fetch(`/api/tournaments/${tournamentId}/banter`);
               if (res.ok) setBanters(await res.json());
           } catch (e) {}
       };
       fetchBanter();
       const int = setInterval(fetchBanter, 5000);
       return () => clearInterval(int);
   }, [tournamentId]);

   if (banters.length === 0) return null;

   return (
       <div style={{ background: 'var(--gold)', color: 'black', padding: '0.5rem 0', overflow: 'hidden', whiteSpace: 'nowrap', position: 'relative', display: 'flex', alignItems: 'center', boxShadow: '0 5px 15px rgba(212,175,55,0.2)' }}>
           
           {/* Fade Edges */}
           <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, background: 'linear-gradient(90deg, var(--gold) 0%, transparent 100%)', width: '50px', zIndex: 10 }} />
           <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, background: 'linear-gradient(-90deg, var(--gold) 0%, transparent 100%)', width: '50px', zIndex: 10 }} />

           <div style={{ fontWeight: 900, textTransform: 'uppercase', fontSize: '0.75rem', position: 'absolute', left: '1rem', zIndex: 11, background: '#05120c', color: 'var(--gold)', padding: '0.2rem 0.5rem', borderRadius: '4px', letterSpacing: '0.1em' }}>LIVE TRASH TALK</div>
           
           <div style={{
               animation: 'marquee 25s linear infinite',
               display: 'inline-block',
               whiteSpace: 'nowrap',
               paddingLeft: '100vw'
           }}>
              {banters.map(b => (
                  <span key={b.id} style={{ margin: '0 3rem', fontSize: '0.95rem', fontWeight: 600 }}>
                      <span style={{ opacity: 0.6, marginRight: '0.5rem' }}>@{b.authorName.split(' ')[0]}</span> 
                      "{b.message}"
                  </span>
              ))}
           </div>
           
           <style dangerouslySetInnerHTML={{__html: `
              @keyframes marquee {
                  0% { transform: translateX(0); }
                  100% { transform: translateX(-100%); }
              }
           `}} />
       </div>
   );
}
