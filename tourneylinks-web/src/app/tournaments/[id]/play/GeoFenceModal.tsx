'use client';

import React, { useState, useEffect } from 'react';

export default function GeoFenceModal({ sponsor }: { sponsor: any }) {
    const [open, setOpen] = useState(false);

    useEffect(() => {
        // Prevent spamming the user if they simply refresh the page.
        // It resets if they completely clear local storage or we could expire it after 24 hours.
        const viewedKey = `geofence_viewed_${sponsor.tournamentId}_${sponsor.holeAssignment}`;
        if (!localStorage.getItem(viewedKey)) {
            setOpen(true);
            localStorage.setItem(viewedKey, 'true');
        }
    }, [sponsor]);

    if (!open) return null;

    return (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999, background: 'rgba(5,18,12,0.98)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', animation: 'fadeIn 0.5s ease-out' }}>
            
            <style dangerouslySetInnerHTML={{__html: `
               @keyframes fadeIn {
                   from { opacity: 0; transform: scale(0.95); }
                   to { opacity: 1; transform: scale(1); }
               }
            `}} />

            <div style={{ color: 'var(--mist)', textTransform: 'uppercase', letterSpacing: '0.2em', fontSize: '0.8rem', marginBottom: '2rem' }}>
                HOLE {sponsor.holeAssignment} IS SPONSORED BY
            </div>

            <img src={sponsor.logoUrl} style={{ width: '80%', maxWidth: '300px', marginBottom: '2rem', objectFit: 'contain', filter: 'drop-shadow(0 0 20px rgba(255,255,255,0.1))' }} alt="Sponsor" />
            
            <h2 style={{ textAlign: 'center', color: 'white', fontSize: '2.5rem', marginBottom: '1rem', fontWeight: 900, lineHeight: 1.1 }}>
                {sponsor.popupAdCopy}
            </h2>

            <button 
                onClick={() => setOpen(false)} 
                style={{ 
                    background: 'var(--gold)', 
                    color: 'black', 
                    padding: '1.25rem 4rem', 
                    borderRadius: '40px', 
                    fontWeight: 900, 
                    fontSize: '1.1rem', 
                    marginTop: '3rem',
                    border: 'none',
                    cursor: 'pointer',
                    boxShadow: '0 10px 30px rgba(212,175,55,0.3)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em'
                }}
            >
                Proceed to Scorecard
            </button>
        </div>
    );
}
