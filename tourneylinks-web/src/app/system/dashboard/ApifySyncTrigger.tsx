'use client';

import React, { useState } from 'react';
import { DownloadCloud, Layers } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ApifySyncTrigger() {
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
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '0.5rem' }}>
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
        {message || 'Sync Latest Apify Run'}
      </button>
      <div style={{ fontSize: '0.75rem', color: 'var(--mist)', fontWeight: 500, lineHeight: 1.3, maxWidth: '220px' }}>
        Pulls latest Eventbrite & Facebook runs. Click after a webhook fails.
      </div>
    </div>
  );
}
