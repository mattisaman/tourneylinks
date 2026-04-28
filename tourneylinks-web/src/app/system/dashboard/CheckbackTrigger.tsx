'use client';

import React, { useState, useEffect } from 'react';
import { Zap } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function CheckbackTrigger({ pendingCount }: { pendingCount: number }) {
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

    while (!isComplete && localProcessed < pendingCount) {
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
          setMessage(`[${data.action}] Processing next...`);
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
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem', width: '350px' }}>
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
        <div style={{ fontSize: '0.75rem', color: 'var(--mist)', fontWeight: 600 }}>
          {pendingCount} Tournaments Require Validation
        </div>
      )}
    </div>
  );
}
