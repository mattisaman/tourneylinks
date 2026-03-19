'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SystemLogin() {
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/system/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passcode })
      });

      if (res.ok) {
        router.push('/system/dashboard');
      } else {
        const data = await res.json();
        setError(data.error || 'UNAUTHORIZED CALL.');
        setPasscode('');
        setLoading(false);
      }
    } catch (err) {
      setError('Internal Handshake Error');
      setLoading(false);
    }
  };

  return (
    <div style={{ background: '#050505', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'DM Mono', monospace", color: '#0f0' }}>
      
      <div style={{ width: '100%', maxWidth: '400px', border: '1px solid #1a1a1a', background: '#0a0a0a', padding: '3rem 2rem', position: 'relative', overflow: 'hidden' }}>
        
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '4px', background: 'linear-gradient(90deg, #111, var(--gold), #111)' }}></div>
        
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--gold)', letterSpacing: '4px', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
            System Core
          </div>
          <div style={{ fontSize: '0.7rem', color: '#666', letterSpacing: '2px' }}>
            RESTRICTED ACCESS PROTOCOL
          </div>
        </div>

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
           <div>
             <label style={{ display: 'block', fontSize: '0.75rem', color: '#555', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem' }}>
               Authentication Passcode
             </label>
             <input 
               type="password" 
               value={passcode}
               onChange={e => setPasscode(e.target.value)}
               autoFocus
               placeholder="Enter strictly authorized key..."
               style={{ 
                 width: '100%', 
                 padding: '1rem', 
                 background: '#000', 
                 border: '1px solid #222', 
                 color: 'var(--gold)', 
                 outline: 'none',
                 fontFamily: "'DM Mono', monospace",
                 fontSize: '1rem'
               }} 
             />
           </div>

           {error && (
             <div style={{ color: '#f00', fontSize: '0.75rem', padding: '0.5rem', borderLeft: '2px solid #f00', background: 'rgba(255,0,0,0.05)' }}>
               {error}
             </div>
           )}

           <button 
             type="submit" 
             disabled={loading}
             style={{
               width: '100%',
               padding: '1rem',
               background: 'var(--gold)',
               color: '#000',
               border: 'none',
               fontWeight: 800,
               fontSize: '0.9rem',
               letterSpacing: '2px',
               textTransform: 'uppercase',
               cursor: 'pointer',
               fontFamily: "'DM Mono', monospace",
               marginTop: '1rem',
               opacity: loading ? 0.7 : 1
             }}
           >
             {loading ? 'Decrypting...' : 'Initiate Handshake'}
           </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '2.5rem', fontSize: '0.65rem', color: '#333' }}>
          TOURNEYLINKS CORPORATION © {new Date().getFullYear()}
        </div>

      </div>
    </div>
  );
}
