'use client';

import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function PlatformSearchTrigger() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState('');
  const [platform, setPlatform] = useState('golfstatus.com');
  
  // Extended NY Regions to cover Western, Central, Eastern, and Southern Tier
  const nyMetros = [
    "New York City, NY",
    "Long Island, NY",
    "Albany, NY",
    "Syracuse, NY",
    "Rochester, NY",
    "Buffalo, NY",
    "Binghamton, NY",
    "Ithaca, NY",
    "Corning, NY",
    "Elmira, NY",
    "Geneseo, NY",
    "Jamestown, NY"
  ];
  const [selectedMetro, setSelectedMetro] = useState(nyMetros[0]);
  
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
          query: `charity golf tournament 2026 "${selectedMetro}"`
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
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '0.5rem', background: 'var(--white)', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.05)', boxShadow: 'var(--shadow-sm)', minWidth: '280px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
        <Search size={16} color="var(--forest)" />
        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--forest)' }}>
          Phase 2: SaaS Platforms
        </span>
      </div>
      <p style={{ fontSize: '0.75rem', color: 'var(--mist)', margin: 0, lineHeight: 1.3 }}>
        Searches specific platforms via Google.
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', width: '100%' }}>
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
            color: 'var(--forest)',
            width: '100%',
            height: '36px'
          }}
        >
          <option value="golfstatus.com">GolfStatus</option>
          <option value="birdease.com">Birdease</option>
          <option value="perfectgolfevent.com">Perfect Golf Event</option>
          <option value="eventcaddy.com">Event Caddy</option>
        </select>
        
        <select 
          value={selectedMetro}
          onChange={(e) => setSelectedMetro(e.target.value)}
          disabled={isProcessing}
          style={{
            padding: '0 0.5rem',
            borderRadius: '8px',
            border: '1px solid rgba(0,0,0,0.1)',
            background: 'var(--white)',
            fontSize: '0.85rem',
            color: 'var(--forest)',
            width: '100%',
            height: '36px'
          }}
        >
          {nyMetros.map(m => (
            <option key={m} value={m}>{m}</option>
          ))}
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
    </div>
  );
}
