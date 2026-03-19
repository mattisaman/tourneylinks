'use client';

import React, { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

export default function DonateFormClient({ tournamentId, charityName }: { tournamentId: number, charityName: string }) {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  
  const PRESET_AMOUNTS = [50, 100, 250, 500];
  
  const [amountType, setAmountType] = useState<'preset' | 'custom'>('preset');
  const [selectedPreset, setSelectedPreset] = useState<number>(100);
  const [customAmount, setCustomAmount] = useState<string>('');
  
  const [donorName, setDonorName] = useState<string>('');
  const [donorEmail, setDonorEmail] = useState<string>('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Auto-fill from signed-in user
  React.useEffect(() => {
    if (isLoaded && user) {
      setDonorName(user.fullName || '');
      setDonorEmail(user.primaryEmailAddress?.emailAddress || '');
    }
  }, [isLoaded, user]);

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');

    let finalAmount = 0;
    if (amountType === 'preset') {
      finalAmount = selectedPreset;
    } else {
      finalAmount = parseInt(customAmount, 10);
    }

    if (!finalAmount || finalAmount < 5) {
      setErrorMsg('Donation amount must be at least $5.');
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/stripe/donate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tournamentId,
          amount: finalAmount, // In dollars
          donorName: donorName || 'Anonymous Donor',
          donorEmail: donorEmail || 'anonymous@example.com',
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to initialize donation session.');
      }

      if (data.url) {
        router.push(data.url);
      } else {
        throw new Error('No checkout URL returned.');
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message);
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleCheckout} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* AMOUNT SELECTION */}
      <div>
        <label style={{ display: 'block', fontWeight: 600, color: 'var(--ink)', marginBottom: '0.8rem' }}>Select Amount</label>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.8rem', marginBottom: '1rem' }}>
          {PRESET_AMOUNTS.map(amt => (
            <button
              key={amt}
              type="button"
              onClick={() => { setAmountType('preset'); setSelectedPreset(amt); }}
              style={{
                padding: '0.8rem',
                borderRadius: '8px',
                border: amountType === 'preset' && selectedPreset === amt ? '2px solid var(--forest)' : '1px solid rgba(26,46,26,0.1)',
                background: amountType === 'preset' && selectedPreset === amt ? 'rgba(26,46,26,0.05)' : '#fff',
                color: amountType === 'preset' && selectedPreset === amt ? 'var(--forest)' : 'var(--ink)',
                fontWeight: amountType === 'preset' && selectedPreset === amt ? 700 : 500,
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              ${amt}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
           <input 
             type="radio" 
             id="customAmt"
             checked={amountType === 'custom'}
             onChange={() => setAmountType('custom')}
           />
           <label htmlFor="customAmt" style={{ color: 'var(--mist)' }}>Custom Amount</label>
           
           {amountType === 'custom' && (
             <div style={{ position: 'relative', flex: 1 }}>
               <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--ink)', fontWeight: 600 }}>$</span>
               <input
                 type="number"
                 min="5"
                 value={customAmount}
                 onChange={(e) => setCustomAmount(e.target.value)}
                 placeholder="Other amount"
                 style={{ width: '100%', padding: '0.8rem 1rem 0.8rem 2rem', borderRadius: '8px', border: '1px solid rgba(26,46,26,0.2)' }}
                 required={amountType === 'custom'}
               />
             </div>
           )}
        </div>
      </div>

      <hr style={{ borderTop: '1px solid rgba(26,46,26,0.08)' }} />

      {/* DONOR INFO */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--mist)', marginBottom: '0.4rem' }}>Your Name (Optional)</label>
          <input
            type="text"
            value={donorName}
            onChange={(e) => setDonorName(e.target.value)}
            placeholder="Jane Doe"
            style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid rgba(26,46,26,0.2)' }}
          />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--mist)', marginBottom: '0.4rem' }}>Email Address</label>
          <input
            type="email"
            value={donorEmail}
            onChange={(e) => setDonorEmail(e.target.value)}
            placeholder="jane@example.com"
            required
            style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid rgba(26,46,26,0.2)' }}
          />
        </div>
      </div>

      {errorMsg && (
        <div style={{ color: 'red', fontSize: '0.9rem', background: '#ffebee', padding: '0.8rem', borderRadius: '4px' }}>
          {errorMsg}
        </div>
      )}

      <button 
        type="submit" 
        disabled={isLoading}
        className="btn-primary" 
        style={{ width: '100%', padding: '1.2rem', fontSize: '1.1rem', marginTop: '1rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}
      >
        {isLoading ? 'Processing...' : `Donate $${amountType === 'preset' ? selectedPreset : (customAmount || '0')} via Stripe`}
      </button>
      <div style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--mist)' }}>
        🔒 Secure checkout provided by Stripe
      </div>

    </form>
  );
}
