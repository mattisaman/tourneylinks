'use client';

import React, { useState } from 'react';
import { Play, Loader2, Target, CheckCircle2, AlertCircle } from 'lucide-react';

export default function SpiderDispatcher() {
  const [regions, setRegions] = useState<string>("New York State, Texas, Florida");
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState<string>('');

  const handleDispatch = async () => {
    if (!regions.trim()) return;

    setStatus('loading');
    setMessage('Connecting to Upstash Global Network...');

    const parsedRegions = regions.split(',').map(r => r.trim()).filter(Boolean);

    try {
      const response = await fetch('/api/spider/trigger', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ regions: parsedRegions }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to dispatch payload');
      }

      setStatus('success');
      setMessage(`[System] Successfully queued ${data.jobsQueued} parallel crawling sequences globally.`);
      
      // Reset back to idle after 5 seconds to allow for more scans
      setTimeout(() => setStatus('idle'), 5000);
      
    } catch (err: any) {
      console.error(err);
      setStatus('error');
      setMessage(`[Error] ${err.message}`);
    }
  };

  return (
    <div style={{ background: 'linear-gradient(180deg, rgba(20,20,20,1) 0%, rgba(10,10,10,1) 100%)', border: '1px solid #333', borderRadius: '12px', padding: '1.5rem', marginBottom: '2rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
        <div style={{ background: 'rgba(212,175,55,0.1)', padding: '0.4rem', borderRadius: '6px' }}>
          <Target size={20} color="var(--gold)" />
        </div>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#fff', margin: 0 }}>Visual Web Crawler Dispatch Terminal</h3>
      </div>
      
      <p style={{ color: '#888', fontSize: '0.9rem', marginBottom: '1.5rem', lineHeight: 1.5 }}>
        Enter target search vectors (comma-separated). You can enter massive arrays of zip codes natively here. You can also specify entire states like &quot;New York State&quot;, but be aware that Google search engines cap out at ~100 results per query. For total maximum geographic penetration, inputting specific city names (e.g., &quot;Rochester NY, Buffalo NY&quot;) provides the deepest tournament yield.
      </p>

      <textarea 
        value={regions}
        onChange={(e) => setRegions(e.target.value)}
        placeholder="e.g. 14623, Orlando FL, New York State"
        disabled={status === 'loading'}
        style={{
          width: '100%',
          minHeight: '80px',
          background: '#111',
          border: '1px solid #333',
          borderRadius: '8px',
          padding: '1rem',
          color: '#fff',
          fontFamily: 'monospace',
          fontSize: '0.9rem',
          resize: 'vertical',
          marginBottom: '1rem',
          outline: 'none',
          transition: 'all 0.2s',
        }}
        onFocus={(e) => { e.target.style.borderColor = 'var(--gold)' }}
        onBlur={(e) => { e.target.style.borderColor = '#333' }}
      />

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        
        {/* Status Area */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', fontWeight: 500 }}>
          {status === 'loading' && (
            <>
              <Loader2 size={16} color="var(--gold)" className="animate-spin" />
              <span style={{ color: 'var(--gold)' }}>{message}</span>
            </>
          )}
          {status === 'success' && (
            <>
              <CheckCircle2 size={16} color="#4CAF50" />
              <span style={{ color: '#4CAF50' }}>{message}</span>
            </>
          )}
          {status === 'error' && (
            <>
              <AlertCircle size={16} color="#F44336" />
              <span style={{ color: '#F44336' }}>{message}</span>
            </>
          )}
          {status === 'idle' && (
            <span style={{ color: '#666' }}>Engine standby. Awaiting coordinates.</span>
          )}
        </div>

        {/* Action Button */}
        <button 
          onClick={handleDispatch}
          disabled={status === 'loading' || !regions.trim()}
          style={{
            background: status === 'loading' ? '#333' : 'var(--gold)',
            color: status === 'loading' ? '#888' : '#000',
            border: 'none',
            padding: '0.75rem 1.5rem',
            borderRadius: '6px',
            fontSize: '0.9rem',
            fontWeight: 800,
            cursor: status === 'loading' ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            transition: 'all 0.2s',
            opacity: !regions.trim() ? 0.5 : 1
          }}
        >
          {status === 'loading' ? 'Deploying...' : 'Launch Crawler Payload'}
          {!status.includes('loading') && <Play size={16} />}
        </button>
      </div>
    </div>
  );
}
