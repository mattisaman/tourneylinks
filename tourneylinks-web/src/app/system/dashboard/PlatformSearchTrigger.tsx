'use client';

import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function PlatformSearchTrigger() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState('');
  const [platform, setPlatform] = useState('golfstatus.com');
  const router = useRouter();

  const startSearch = async () => {
    if (isProcessing) return;
    setIsProcessing(true);
    setMessage(`Searching ${platform}...`);
    
    try {
      const res = await fetch('/api/system/platform-search', { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          platform: platform,
          query: "charity golf tournament 2026"
        })
      });
      const data = await res.json();
      
      if (res.ok) {
        setMessage(`Found ${data.searched} URLs. Inserted ${data.inserted} new events.`);
      } else {
        setMessage(`Failed: ${data.error || 'Unknown error'}`);
      }
    } catch (err) {
      console.error(err);
      setMessage('Network error during search.');
    }
    
    // Briefly hold the success message before resetting
    setTimeout(() => {
      setIsProcessing(false);
      setMessage('');
      router.refresh();
    }, 4000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '0.5rem' }}>
      <div style={{ display: 'flex', gap: '0.5rem', width: '100%' }}>
        <select 
          value={platform}
          onChange={(e) => setPlatform(e.target.value)}
          disabled={isProcessing}
          style={{
            padding: '0 0.5rem',
            borderRadius: '8px',
            border: '1px solid rgba(0,0,0,0.1)',
            background: 'var(--white)',
            fontSize: '0.85rem',
            color: 'var(--forest)'
          }}
        >
          <option value="golfstatus.com">GolfStatus</option>
          <option value="birdease.com">Birdease</option>
          <option value="perfectgolfevent.com">Perfect Golf Event</option>
          <option value="eventcaddy.com">Event Caddy</option>
        </select>

        <button 
          onClick={startSearch}
          disabled={isProcessing}
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            gap: '0.5rem', 
            background: isProcessing ? 'rgba(0,0,0,0.05)' : 'var(--emerald)', 
            color: isProcessing ? 'var(--mist)' : 'var(--white)', 
            padding: '0.8rem 1.5rem', 
            borderRadius: '8px', 
            fontWeight: 700, 
            cursor: isProcessing ? 'not-allowed' : 'pointer',
            border: 'none',
            transition: 'all 0.2s',
            height: '48px',
            flex: 1,
            whiteSpace: 'nowrap'
          }}
          title="Search the selected platform for 2026 events via Google"
        >
          <Search size={18} />
          {message || 'Targeted Search'}
        </button>
      </div>
      <div style={{ fontSize: '0.75rem', color: 'var(--mist)', fontWeight: 500, lineHeight: 1.3, maxWidth: '220px' }}>
        Finds registration pages via Google and queues them for Gemini processing.
      </div>
    </div>
  );
}
