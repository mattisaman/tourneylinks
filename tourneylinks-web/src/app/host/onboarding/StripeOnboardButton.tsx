'use client';
import React, { useState } from 'react';

export default function StripeOnboardButton() {
  const [loading, setLoading] = useState(false);

  const startOnboarding = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/stripe/account-link', {
        method: 'POST',
      });
      const data = await res.json();
      
      if (data.url) {
        window.location.href = data.url; // Trigger external redirect to Stripe
      } else {
        alert(data.error || 'Failed to generate Stripe link.');
        setLoading(false);
      }
    } catch (err) {
      console.error(err);
      alert('Internal error initializing Stripe Connect.');
      setLoading(false);
    }
  };

  return (
    <button 
      onClick={startOnboarding} 
      disabled={loading}
      className="btn-primary" 
      style={{ 
        padding: '1.2rem 3rem', 
        fontSize: '1.1rem', 
        background: '#635BFF', // Stripe Blurple Brand Color
        color: '#fff', 
        border: 'none', 
        borderRadius: '8px', 
        cursor: loading ? 'wait' : 'pointer',
        boxShadow: '0 4px 14px rgba(99,91,255,0.4)',
        transition: 'all 0.2s',
        fontWeight: 600
      }}
    >
      {loading ? 'Initializing Secure Bridge...' : 'Connect to Stripe ➔'}
    </button>
  );
}
