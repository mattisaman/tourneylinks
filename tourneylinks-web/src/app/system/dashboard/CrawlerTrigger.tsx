'use client';

import React, { useState, useEffect } from 'react';
import { Network } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function CrawlerTrigger({ pendingCount, isNextAction = false }: { pendingCount: number, isNextAction?: boolean }) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedCount, setProcessedCount] = useState(0);
  const [initialCount, setInitialCount] = useState(pendingCount);
  const [currentCourse, setCurrentCourse] = useState('');
  const [message, setMessage] = useState('');
  const router = useRouter();

  // Reset initial count when pendingCount changes significantly
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
    setMessage('Initializing Clubhouse Crawler...');
    setCurrentCourse('');
    
    let isComplete = false;
    let localProcessed = 0;
    
    // Safety limit to avoid burning all Firecrawl credits at once
    const BATCH_LIMIT = 10;
    const processLimit = Math.min(pendingCount, BATCH_LIMIT);

    while (!isComplete && localProcessed < processLimit) {
      try {
        const res = await fetch('/api/system/crawler-courses', { method: 'POST' });
        const data = await res.json();
        
        if (data.complete) {
          isComplete = true;
          setMessage('Crawl complete! All eligible courses checked.');
        } else {
          localProcessed++;
          setProcessedCount(localProcessed);
          setCurrentCourse(data.courseName || `Course ID ${data.processedId}`);
          setMessage(`[${data.action}] Processing next...`);
        }
      } catch (err) {
        console.error(err);
        setMessage('Network error, pausing crawler.');
        isComplete = true;
      }
    }
    
    setIsProcessing(false);
    setCurrentCourse('');
    
    if (localProcessed >= BATCH_LIMIT && !isComplete) {
       setMessage(`Batch of ${BATCH_LIMIT} complete. Click to run again.`);
    }
    
    router.refresh();
  };

  const progressPercentage = initialCount > 0 ? Math.min(100, Math.round((processedCount / Math.min(initialCount, 10)) * 100)) : 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '0.5rem', background: 'var(--white)', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.05)', boxShadow: isNextAction ? '0 0 0 2px var(--forest), var(--shadow-sm)' : 'var(--shadow-sm)', minWidth: '280px', height: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
        <Network size={16} color="var(--forest)" />
        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--forest)' }}>
          Step 5: Fetch Course Logos & Amenities
        </span>
        {isNextAction && <div style={{ background: 'var(--forest)', color: 'white', fontSize: '0.65rem', fontWeight: 800, padding: '0.15rem 0.4rem', borderRadius: '4px', marginLeft: 'auto', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Next Action</div>}
      </div>
      <p style={{ fontSize: '0.75rem', color: 'var(--mist)', margin: 0, lineHeight: 1.3 }}>
        Extract amenities & logos from {pendingCount} courses.
      </p>

    return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', width: '100%', marginTop: 'auto' }}>
        <button 
          onClick={startProcessing}
          disabled={isProcessing || pendingCount === 0}
        style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          gap: '0.5rem', 
          background: isProcessing ? 'var(--mist)' : (pendingCount > 0 ? 'var(--forest)' : 'rgba(0,0,0,0.1)'), 
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
        <Network size={18} />
        {isProcessing ? 'Crawler Running...' : 'Extract Course Intelligence (Batch of 10)'}
      </button>

      {/* Progress Bar UI */}
      {isProcessing && (
        <div style={{ width: '100%', background: 'rgba(0,0,0,0.05)', borderRadius: '4px', height: '6px', overflow: 'hidden', marginTop: '0.25rem' }}>
          <div style={{ 
            height: '100%', 
            width: `${progressPercentage}%`, 
            background: 'var(--forest)',
            transition: 'width 0.3s ease-out'
          }} />
        </div>
      )}

      {isProcessing && currentCourse && (
         <div style={{ fontSize: '0.75rem', color: 'var(--mist)', fontWeight: 500, alignSelf: 'flex-start', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', width: '100%' }}>
            Scraping: <span style={{ color: 'var(--forest)', fontWeight: 700 }}>{currentCourse}</span>
         </div>
      )}

      {message && <div style={{ fontSize: '0.75rem', color: 'var(--grass)', fontWeight: 600 }}>{message}</div>}
      
      {!isProcessing && (
        <div style={{ fontSize: '0.75rem', color: 'var(--mist)', fontWeight: 600, alignSelf: 'flex-start', lineHeight: 1.3 }}>
          {pendingCount} Courses ready. Scrapes website for PDF brochures, Host-An-Event URLs, and Coordinator contact info.
        </div>
      )}
      </div>
    </div>
  );
}
