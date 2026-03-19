'use client';
import React, { useState } from 'react';

export default function ClaimClient({ tournament, teamGroupId, token, isLoggedIn }: { tournament: any, teamGroupId: number, token: string, isLoggedIn: boolean }) {
  const [loading, setLoading] = useState(false);

  const baseFee = tournament.entryFee;

  const handleClaim = async () => {
    if (!isLoggedIn) {
      alert("Please Sign In or Create an Account to securely claim your roster spot.");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          tournamentId: tournament.id,
          isClaim: true,
          teamGroupId,
          claimToken: token
        })
      });
      
      const data = await res.json();
      
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || 'Checkout initiation failed.');
        setLoading(false);
      }
    } catch (error) {
       console.error(error);
       alert('An error occurred reaching the Payment Gateway.');
       setLoading(false);
    }
  };

  return (
    <div style={{ background: '#fff', borderRadius: '24px', padding: '3rem', boxShadow: '0 20px 40px rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.05)' }}>
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <h3 style={{ fontSize: '1.4rem', color: 'var(--ink)', fontWeight: 700, marginBottom: '0.5rem' }}>Your Team Share</h3>
        <div style={{ fontSize: '4rem', fontWeight: 800, color: 'var(--forest)' }}>${baseFee}</div>
        <div style={{ color: 'var(--mist)', fontSize: '1rem', marginTop: '0.2rem', fontWeight: 500 }}>Per Player Entry Fee</div>
      </div>

      <div style={{ background: '#f8faf9', padding: '2rem', borderRadius: '16px', marginBottom: '2.5rem' }}>
        <p style={{ color: 'var(--ink)', fontSize: '1.1rem', lineHeight: '1.6', margin: 0 }}>
          Your Team Captain has already paid their portion and initiated the registration. By paying your <b>${baseFee}</b> share today, you will execute a secure spot lock-in. 
        </p>
      </div>

      <button 
        onClick={handleClaim}
        disabled={loading}
        className="btn-primary"
        style={{ width: '100%', padding: '1.2rem', fontSize: '1.2rem', background: 'linear-gradient(135deg, var(--gold), #aa8529)', color: '#000', border: 'none', borderRadius: '12px', fontWeight: 800, boxShadow: '0 8px 30px rgba(212,175,55,0.4)', textTransform: 'uppercase', letterSpacing: '1px', cursor: loading ? 'wait' : 'pointer' }}
      >
        {loading ? 'Initializing Secure Cart...' : `Pay My Share $${baseFee}`} 🔒
      </button>

      {!isLoggedIn && (
        <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.9rem', color: 'var(--mist)' }}>
          * Account creation takes 15 seconds. Use Google or Apple Sign-In on the next page.
        </div>
      )}
    </div>
  );
}
