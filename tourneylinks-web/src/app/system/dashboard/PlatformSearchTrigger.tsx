'use client';

import React, { useState } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function PlatformSearchTrigger({ isNextAction = false }: { isNextAction?: boolean }) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progressStr, setProgressStr] = useState('');
  const [totalInserted, setTotalInserted] = useState(0);
  const router = useRouter();

  const platforms = [
    "golfstatus.com",
    "birdease.com",
    "perfectgolfevent.com",
    "eventcaddy.com"
  ];
  
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

  const totalCombinations = platforms.length * nyMetros.length;

  const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

  const startAutomatedSweep = async () => {
    if (isProcessing) return;
    setIsProcessing(true);
    setTotalInserted(0);
    
    let currentInserted = 0;
    let step = 1;

    for (const platform of platforms) {
      for (const metro of nyMetros) {
        setProgressStr(`[ ${step} / ${totalCombinations} ] ${metro} (${platform})`);
        
        try {
          const res = await fetch('/api/system/platform-search', { 
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              platform: platform,
              query: `charity golf tournament 2026 "${metro}"`
            })
          });
          const data = await res.json();
          
          if (res.ok) {
            currentInserted += data.inserted || 0;
            setTotalInserted(currentInserted);
          }
        } catch (err) {
          console.error(`Error on ${platform} - ${metro}:`, err);
        }
        
        step++;
        // Space out requests by 3 seconds to avoid getting blocked by Firecrawl / Google
        await delay(3000);
      }
    }
    
    setProgressStr(`Sweep Complete! Inserted ${currentInserted} events.`);
    
    setTimeout(() => {
      setIsProcessing(false);
      setProgressStr('');
      router.refresh();
    }, 5000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '0.5rem', background: 'var(--white)', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.05)', boxShadow: isNextAction ? '0 0 0 2px var(--forest), var(--shadow-sm)' : 'var(--shadow-sm)', minWidth: '280px', height: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
        <Search size={16} color="var(--forest)" />
        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--forest)' }}>
          Step 3: Search Event Platforms
        </span>
        {isNextAction && <div style={{ background: 'var(--forest)', color: 'white', fontSize: '0.65rem', fontWeight: 800, padding: '0.15rem 0.4rem', borderRadius: '4px', marginLeft: 'auto', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Next Action</div>}
      </div>
      <p style={{ fontSize: '0.75rem', color: 'var(--mist)', margin: 0, lineHeight: 1.3 }}>
        1-Click automated sweep across {platforms.length} platforms and {nyMetros.length} NY regions.
      </p>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', width: '100%', marginTop: 'auto' }}>
        <button 
          onClick={startAutomatedSweep}
          disabled={isProcessing}
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            gap: '0.5rem', 
            background: isProcessing ? 'var(--sand)' : 'var(--emerald)', 
            color: isProcessing ? 'var(--mist)' : 'var(--white)', 
            padding: '0.8rem 1.5rem', 
            borderRadius: '8px', 
            fontWeight: 700, 
            cursor: isProcessing ? 'not-allowed' : 'pointer',
            border: isProcessing ? '1px solid rgba(0,0,0,0.1)' : 'none',
            transition: 'all 0.2s',
            height: '48px',
            width: '100%',
            whiteSpace: 'nowrap'
          }}
          title="Run automated sequence for all regions and platforms"
        >
          {isProcessing ? <Loader2 size={18} className="pulse-dot" /> : <Search size={18} />}
          {isProcessing ? 'Executing Sweep...' : 'Run NY State Sweep'}
        </button>

        {progressStr && (
          <div style={{ 
            marginTop: '0.25rem', 
            padding: '0.5rem', 
            background: '#ECFDF5', 
            borderRadius: '6px',
            fontSize: '0.7rem',
            color: '#065F46',
            fontWeight: 600,
            textAlign: 'center'
          }}>
            {progressStr}
            {isProcessing && <div style={{ marginTop: '0.25rem', fontSize: '0.65rem' }}>Total Inserted: {totalInserted}</div>}
          </div>
        )}
      </div>
    </div>
  );
}
