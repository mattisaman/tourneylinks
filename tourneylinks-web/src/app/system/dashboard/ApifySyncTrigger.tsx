'use client';

import React, { useState } from 'react';
import { DownloadCloud, Layers } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ApifySyncTrigger({ isNextAction = false }: { isNextAction?: boolean }) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState('');
  const router = useRouter();

  const startSync = async () => {
    if (isProcessing) return;
    setIsProcessing(true);
    setMessage('Pulling latest run...');
    
    try {
      const res = await fetch('/api/system/apify-sync', { method: 'POST' });
      const data = await res.json();
      
      if (res.ok) {
        setMessage(`Success! Ingested ${data.inserted} events.`);
      } else {
        setMessage(`Failed: ${data.error || 'Unknown error'}`);
      }
    } catch (err) {
      console.error(err);
      setMessage('Network error during sync.');
    }
    
    // Briefly hold the success message before resetting
    setTimeout(() => {
      setIsProcessing(false);
      setMessage('');
      router.refresh();
    }, 3000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '0.5rem', background: 'var(--white)', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.05)', boxShadow: isNextAction ? '0 0 0 2px var(--forest), var(--shadow-sm)' : 'var(--shadow-sm)', minWidth: '220px', height: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
        <DownloadCloud size={16} color="var(--forest)" />
        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--forest)' }}>
          Step 1: Sync External Scrapers
        </span>
        {isNextAction && <div style={{ background: 'var(--forest)', color: 'white', fontSize: '0.65rem', fontWeight: 800, padding: '0.15rem 0.4rem', borderRadius: '4px', marginLeft: 'auto', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Next Action</div>}
      </div>
      <p style={{ fontSize: '0.75rem', color: 'var(--mist)', margin: 0, lineHeight: 1.3 }}>
        Pulls latest Eventbrite & FB runs if webhooks fail.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', width: '100%', marginTop: 'auto' }}>
        <button 
          onClick={startSync}
          disabled={isProcessing}
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            gap: '0.5rem', 
            background: isProcessing ? 'rgba(0,0,0,0.05)' : '#1877F2', 
            color: isProcessing ? 'var(--mist)' : 'var(--white)', 
            padding: '0.8rem 1.5rem', 
            borderRadius: '8px', 
            fontWeight: 700, 
            cursor: isProcessing ? 'not-allowed' : 'pointer',
            border: 'none',
            transition: 'all 0.2s',
            height: '48px',
            width: '100%',
            whiteSpace: 'nowrap'
          }}
        >
          <DownloadCloud size={18} />
          {message || 'Manual Sync'}
        </button>
      </div>
    </div>
  );
}
