'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function DemoController() {
    const [closed, setClosed] = useState(false);

    // Only render if we are definitively in explicitly set Demo Mode
    if (process.env.NEXT_PUBLIC_IS_DEMO !== 'true' || closed) return null;

    return (
        <div style={{
            position: 'sticky',
            top: 0,
            zIndex: 9999,
            background: 'linear-gradient(90deg, #d4af37, #e0be4e)',
            color: '#05120c',
            padding: '0.4rem 1rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '0.85rem',
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            boxShadow: '0 4px 15px rgba(212, 175, 55, 0.3)'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                <span style={{ fontWeight: 900, background: '#05120c', color: '#d4af37', padding: '0.2rem 0.5rem', borderRadius: '4px', letterSpacing: '0.1em' }}>
                    DEMO MODE
                </span>
                <span className="hidden md:inline" style={{ opacity: 0.8 }}>Choose your experience:</span>
                
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <Link href="/profile" style={{ background: 'rgba(0,0,0,0.1)', padding: '0.2rem 0.75rem', borderRadius: '12px', textDecoration: 'none', color: '#05120c', transition: '0.2s' }} onMouseOver={e => e.currentTarget.style.background = 'rgba(0,0,0,0.2)'} onMouseOut={e => e.currentTarget.style.background = 'rgba(0,0,0,0.1)'}>Golfer</Link>
                    <Link href="/admin" style={{ background: 'rgba(0,0,0,0.1)', padding: '0.2rem 0.75rem', borderRadius: '12px', textDecoration: 'none', color: '#05120c', transition: '0.2s' }} onMouseOver={e => e.currentTarget.style.background = 'rgba(0,0,0,0.2)'} onMouseOut={e => e.currentTarget.style.background = 'rgba(0,0,0,0.1)'}>Organizer</Link>
                    <Link href="/courses" style={{ background: 'rgba(0,0,0,0.1)', padding: '0.2rem 0.75rem', borderRadius: '12px', textDecoration: 'none', color: '#05120c', transition: '0.2s' }} onMouseOver={e => e.currentTarget.style.background = 'rgba(0,0,0,0.2)'} onMouseOut={e => e.currentTarget.style.background = 'rgba(0,0,0,0.1)'}>Course Pro</Link>
                    <Link href="/tournaments/1/sponsor" style={{ background: 'rgba(0,0,0,0.1)', padding: '0.2rem 0.75rem', borderRadius: '12px', textDecoration: 'none', color: '#05120c', transition: '0.2s' }} onMouseOver={e => e.currentTarget.style.background = 'rgba(0,0,0,0.2)'} onMouseOut={e => e.currentTarget.style.background = 'rgba(0,0,0,0.1)'}>Sponsor</Link>
                </div>
            </div>

            <button 
                onClick={() => setClosed(true)} 
                style={{ background: 'transparent', border: 'none', color: '#05120c', cursor: 'pointer', opacity: 0.6, fontSize: '1rem', padding: '0 0.5rem' }}
                aria-label="Close Demo Banner"
            >
                ✕
            </button>
        </div>
    );
}
