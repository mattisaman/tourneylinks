'use client';

import React, { useState, useEffect } from 'react';
import { Zap } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function CheckbackTrigger({ pendingCount, isNextAction = false }: { pendingCount: number, isNextAction?: boolean }) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedCount, setProcessedCount] = useState(0);
  const [initialCount, setInitialCount] = useState(pendingCount);
  const [currentTournament, setCurrentTournament] = useState('');
  const [message, setMessage] = useState('');
  const router = useRouter();

  // Reset initial count when pendingCount changes significantly (like page refresh)
  useEffect(() => {
    if (!isProcessing && pendingCount > 0) {
      setInitialCount(pendingCount);
      setProcessedCount(0);
    }
  }, [pendingCount, isProcessing]);

  const startProcessing = async () => {
    if (isProcessing) return;
    setIsProcessing(true);
    setInitialCount(pendingCount);
    setProcessedCount(0);
    setMessage('Initializing AI Pipeline...');
    setCurrentTournament('');
    
    let isComplete = false;
    let localProcessed = 0;

    const BATCH_LIMIT = 100;
    const itemsToProcess = Math.min(pendingCount, BATCH_LIMIT);

    while (!isComplete && localProcessed < itemsToProcess) {
      try {
        const res = await fetch('/api/system/normalize-next', { method: 'POST' });
        const data = await res.json();
        
        if (data.complete) {
          isComplete = true;
          setMessage('Pipeline complete! All events normalized.');
        } else {
          localProcessed++;
          setProcessedCount(localProcessed);
          setCurrentTournament(data.tournamentName || `Event ID ${data.processedId}`);
          setMessage(`[${data.action}] Processing ${localProcessed} of ${itemsToProcess}...`);
          
          // STRICT 15 RPM RATE LIMITING FOR GEMINI FREE TIER
          // We must wait ~4 seconds between requests so we never exceed 15 requests per minute.
          if (localProcessed < itemsToProcess && !isComplete) {
            setMessage(`[${data.action}] Throttling for 4s to respect Gemini rate limits...`);
            await new Promise(resolve => setTimeout(resolve, 4200));
          }
        }
      } catch (err) {
        console.error(err);
        setMessage('Network error, pausing pipeline.');
        isComplete = true;
      }
    }
    
    setIsProcessing(false);
    setCurrentTournament('');
    router.refresh();
  };

  const progressPercentage = initialCount > 0 ? Math.min(100, Math.round((processedCount / initialCount) * 100)) : 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '0.5rem', background: 'var(--white)', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.05)', boxShadow: isNextAction ? '0 0 0 2px var(--forest), var(--shadow-sm)' : 'var(--shadow-sm)', minWidth: '280px', height: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
        <Zap size={16} color="var(--forest)" />
        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--forest)' }}>
          Step 4: Clean & Format Raw Data
        </span>
        {isNextAction && <div style={{ background: 'var(--forest)', color: 'white', fontSize: '0.65rem', fontWeight: 800, padding: '0.15rem 0.4rem', borderRadius: '4px', marginLeft: 'auto', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Next Action</div>}
      </div>
      <p style={{ fontSize: '0.75rem', color: 'var(--mist)', margin: 0, lineHeight: 1.3 }}>
        Process {pendingCount} raw tournaments using Gemini Flash.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', width: '100%', marginTop: 'auto' }}>
        <button 
          onClick={startProcessing}
          disabled={isProcessing || pendingCount === 0}
        style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          gap: '0.5rem', 
          background: isProcessing ? 'var(--mist)' : (pendingCount > 0 ? 'var(--gold-dark)' : 'rgba(0,0,0,0.1)'), 
          color: pendingCount > 0 && !isProcessing ? 'var(--white)' : 'var(--mist)', 
          padding: '0.8rem 1.5rem', 
          borderRadius: '8px', 
          fontWeight: 700, 
          width: '100%',
          cursor: isProcessing || pendingCount === 0 ? 'not-allowed' : 'pointer',
          border: 'none',
          transition: 'all 0.2s',
          opacity: pendingCount > 0 ? 1 : 0.5
        }}
      >
        <Zap size={18} />
        {isProcessing ? 'AI Normalizer Running...' : 'Run Universal AI Normalizer'}
      </button>

      {/* Progress Bar UI */}
      {isProcessing && (
        <div style={{ width: '100%', background: 'rgba(0,0,0,0.05)', borderRadius: '4px', height: '6px', overflow: 'hidden', marginTop: '0.25rem' }}>
          <div style={{ 
            height: '100%', 
            width: `${progressPercentage}%`, 
            background: 'var(--gold-dark)',
            transition: 'width 0.3s ease-out'
          }} />
        </div>
      )}

      {isProcessing && currentTournament && (
         <div style={{ fontSize: '0.75rem', color: 'var(--mist)', fontWeight: 500, alignSelf: 'flex-start', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', width: '100%' }}>
            Working on: <span style={{ color: 'var(--forest)', fontWeight: 700 }}>{currentTournament}</span>
         </div>
      )}

      {message && <div style={{ fontSize: '0.75rem', color: 'var(--grass)', fontWeight: 600 }}>{message}</div>}
      
      {!isProcessing && (
        <div style={{ fontSize: '0.75rem', color: 'var(--mist)', fontWeight: 600, alignSelf: 'flex-start', lineHeight: 1.3 }}>
          {pendingCount} raw tournaments require validation. Click to use Gemini to structure their data.
        </div>
      )}
      </div>
    </div>
  );
}
