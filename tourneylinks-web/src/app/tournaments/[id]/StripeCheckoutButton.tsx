'use client';
import React, { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

export default function StripeCheckoutButton({ tournamentId, entryFee }: { tournamentId: number, entryFee: number }) {
  const { isSignedIn } = useUser();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleCheckout = () => {
    if (!isSignedIn) {
      alert("Please sign in or create an account to securely register for this event.");
      return;
    }
    setLoading(true);
    router.push(`/tournaments/${tournamentId}/register`);
  };

  return (
    <button 
      onClick={handleCheckout}
      disabled={loading}
      className="btn-primary" 
      style={{ 
        display: 'inline-flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        gap: '0.8rem', 
        padding: '1.2rem 3rem', 
        fontSize: '1.25rem', 
        background: 'linear-gradient(135deg, var(--gold), #aa8529)',
        color: '#000', 
        border: 'none', 
        borderRadius: 'var(--radius)',
        boxShadow: '0 8px 30px rgba(212,175,55,0.4)', 
        transition: 'all 0.2s', 
        fontWeight: 800,
        textTransform: 'uppercase',
        letterSpacing: '1px',
        cursor: loading ? 'wait' : 'pointer' 
      }}
    >
      {loading ? 'Initializing...' : `Select Players`} 🎟️
    </button>
  );
}
