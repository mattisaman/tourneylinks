'use client';

import { useState } from 'react';
import { Play, Loader2, Bug } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function SmartSpiderTrigger({ isNextAction = false }: { isNextAction?: boolean }) {
  const [isSyncing, setIsSyncing] = useState(false);
  const [progressStr, setProgressStr] = useState('');
  const [totalInserted, setTotalInserted] = useState(0);
  const router = useRouter();

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

  const totalCombinations = nyMetros.length;
  const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

  const startAutomatedSweep = async () => {
    if (isSyncing) return;
    setIsSyncing(true);
    setTotalInserted(0);
    
    let currentInserted = 0;
    let step = 1;

    for (const metro of nyMetros) {
      setProgressStr(`[ ${step} / ${totalCombinations} ] Scraping: ${metro}...`);
      
      try {
        const response = await fetch('/api/system/smart-spider', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ region: metro })
        });
        const data = await response.json();
        
        if (response.ok) {
          currentInserted += data.inserted || 0;
          setTotalInserted(currentInserted);
        }
      } catch (e: any) {
        console.error(`Error on ${metro}:`, e);
      }
      
      step++;
      // Space out Playwright sessions by 10 seconds to avoid looking like a bot
      await delay(10000);
    }

    setProgressStr(`Headless Sweep Complete! Inserted ${currentInserted} events.`);
    
    setTimeout(() => {
      setIsSyncing(false);
      setProgressStr('');
      router.refresh();
    }, 5000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '0.5rem', background: 'var(--white)', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.05)', boxShadow: isNextAction ? '0 0 0 2px var(--forest), var(--shadow-sm)' : 'var(--shadow-sm)', minWidth: '280px', height: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
        <Bug size={16} color="var(--forest)" />
        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--forest)' }}>
          Step 2: Search Local Web (Local)
        </span>
        {isNextAction && <div style={{ background: 'var(--forest)', color: 'white', fontSize: '0.65rem', fontWeight: 800, padding: '0.15rem 0.4rem', borderRadius: '4px', marginLeft: 'auto', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Next Action</div>}
      </div>
      
      <p style={{ fontSize: '0.75rem', color: 'var(--mist)', margin: 0, lineHeight: 1.3 }}>
        1-Click automated headless sequence across {nyMetros.length} NY regions.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', width: '100%', marginTop: 'auto' }}>
        <button 
          onClick={startAutomatedSweep}
          disabled={isSyncing}
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            gap: '0.5rem', 
            background: isSyncing ? 'var(--sand)' : 'var(--forest)', 
            color: isSyncing ? 'var(--mist)' : 'var(--white)', 
            padding: '0.8rem 1.5rem', 
            borderRadius: '8px', 
            fontWeight: 700, 
            cursor: isSyncing ? 'not-allowed' : 'pointer',
            border: isSyncing ? '1px solid rgba(0,0,0,0.1)' : 'none',
            transition: 'all 0.2s',
            height: '48px',
            width: '100%',
            whiteSpace: 'nowrap'
          }}
          title="Run sequential Playwright scraping for all regions"
        >
          {isSyncing ? <Loader2 size={18} className="pulse-dot" /> : <Play size={18} />}
          {isSyncing ? 'Executing Script...' : 'Launch NY Headless Sweep'}
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
            {isSyncing && <div style={{ marginTop: '0.25rem', fontSize: '0.65rem' }}>Total Inserted: {totalInserted}</div>}
          </div>
        )}
      </div>
    </div>
  );
}
