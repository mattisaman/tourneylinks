'use client';
import React, { useState } from 'react';
import { useUser } from '@clerk/nextjs';

export default function StripeCheckoutButton({ tournamentId, entryFee }: { tournamentId: number, entryFee: number }) {
  const { isSignedIn } = useUser();
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    if (!isSignedIn) {
      alert("Please sign in or create an account to securely register for this event.");
      // Optional: Redirect to sign-in programmatically if needed
      return;
    }
    
    try {
      setLoading(true);
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tournamentId })
      });
      
      const data = await res.json();
      
      if (data.url) {
        window.location.href = data.url; // Fire the redirect into the Stripe tunnel
      } else {
        alert(data.error || 'Failed to initiate checkout.');
        setLoading(false);
      }
    } catch (error) {
       console.error(error);
       alert('An unexpected error occurred initializing the Payment Gateway.');
       setLoading(false);
    }
  };

  return (
    <button 
      onClick={handleCheckout}
      disabled={loading}
      className="btn-primary" 
      style={{ 
        display: 'inline-flex', 
        alignItems: 'center', 
        gap: '0.8rem', 
        padding: '1rem 3rem', 
        fontSize: '1.15rem', 
        background: 'linear-gradient(135deg, #635BFF, #4a42e5)', 
        color: 'white', 
        border: 'none', 
        borderRadius: 'var(--radius)',
        boxShadow: '0 8px 25px rgba(99,91,255,0.4)', 
        transition: 'all 0.2s', 
        fontWeight: 700,
        cursor: loading ? 'wait' : 'pointer' 
      }}
    >
      {loading ? 'Securing Registration Line...' : `Register Now • $${entryFee}`} 💳
    </button>
  );
}
