'use client';

import React, { useState } from 'react';
import { triggerCheckbackEngine } from './actions';
import { Zap } from 'lucide-react';

export default function CheckbackTrigger({ pendingCount }: { pendingCount: number }) {
  const [isTriggering, setIsTriggering] = useState(false);
  const [message, setMessage] = useState('');

  const handleTrigger = async () => {
    if (isTriggering) return;
    setIsTriggering(true);
    setMessage('');
    
    try {
      const res = await triggerCheckbackEngine();
      if (res.success) {
        setMessage('Engine triggered! Checkbacks running in background.');
      }
    } catch (err) {
      console.error(err);
      setMessage('Failed to trigger engine.');
    } finally {
      setTimeout(() => {
        setIsTriggering(false);
        setTimeout(() => setMessage(''), 5000); // clear message after 5s
      }, 1000);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
      <button 
        onClick={handleTrigger}
        disabled={isTriggering || pendingCount === 0}
        style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '0.5rem', 
          background: isTriggering ? 'var(--mist)' : (pendingCount > 0 ? 'var(--gold-dark)' : 'rgba(0,0,0,0.1)'), 
          color: pendingCount > 0 && !isTriggering ? 'var(--white)' : 'var(--mist)', 
          padding: '0.8rem 1.5rem', 
          borderRadius: '8px', 
          fontWeight: 700, 
          cursor: isTriggering || pendingCount === 0 ? 'not-allowed' : 'pointer',
          border: 'none',
          transition: 'all 0.2s',
          opacity: pendingCount > 0 ? 1 : 0.5
        }}
      >
        <Zap size={18} />
        {isTriggering ? 'Initializing...' : 'Trigger AI Checkbacks'}
      </button>
      {message && <div style={{ fontSize: '0.8rem', color: 'var(--grass)', fontWeight: 600 }}>{message}</div>}
      <div style={{ fontSize: '0.75rem', color: 'var(--mist)', fontWeight: 600 }}>
        {pendingCount} Pending TBD Events
      </div>
    </div>
  );
}
