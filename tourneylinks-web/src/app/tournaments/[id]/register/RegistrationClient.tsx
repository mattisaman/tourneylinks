'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RegistrationClient({ tournament }: { tournament: any }) {
  const router = useRouter();
  const [playerCount, setPlayerCount] = useState<number>(1);
  const [paymentMode, setPaymentMode] = useState<'full' | 'split'>('full');
  const [teammateEmails, setTeammateEmails] = useState<string[]>(['', '', '']);
  const [loading, setLoading] = useState(false);

  // Math
  const baseFee = tournament.entryFee;
  const totalDueFull = baseFee * playerCount;
  const totalDueSplit = baseFee; // Split means they just pay for themselves today

  const handleCheckout = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          tournamentId: tournament.id,
          playerCount,
          paymentMode, // 'full' or 'split'
          teammateEmails: paymentMode === 'split' ? teammateEmails.slice(0, playerCount - 1).filter(e => e.trim() !== '') : []
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
      
      <h3 style={{ fontSize: '1.4rem', color: 'var(--ink)', marginBottom: '1.5rem', fontWeight: 700 }}>1. How many players?</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '3rem' }}>
        {[1, 2, 3, 4].map(num => (
          <button
            key={num}
            onClick={() => { setPlayerCount(num); if(num === 1) setPaymentMode('full'); }}
            style={{
              padding: '1.5rem',
              borderRadius: '16px',
              border: playerCount === num ? '2px solid var(--gold)' : '2px solid rgba(0,0,0,0.05)',
              background: playerCount === num ? '#fffefaa0' : '#fff',
              color: 'var(--forest)',
              fontSize: '1.3rem',
              fontWeight: 800,
              cursor: 'pointer',
              transition: 'all 0.2s',
              boxShadow: playerCount === num ? '0 10px 20px rgba(212,175,55,0.1)' : 'none'
            }}
          >
            {num} {num === 1 ? 'Solo' : num === 4 ? 'Foursome' : 'Players'}
          </button>
        ))}
      </div>

      {playerCount > 1 && (
        <>
          <h3 style={{ fontSize: '1.4rem', color: 'var(--ink)', marginBottom: '1.5rem', fontWeight: 700 }}>2. How are you paying?</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '3rem' }}>
            
            {/* Split Payment Toggle */}
            <div 
              onClick={() => setPaymentMode('split')}
              style={{ padding: '2rem', borderRadius: '16px', border: paymentMode === 'split' ? '2px solid var(--gold)' : '2px solid rgba(0,0,0,0.05)', background: paymentMode === 'split' ? '#fffefaa0' : '#fff', cursor: 'pointer', transition: 'all 0.2s', boxShadow: paymentMode === 'split' ? '0 10px 20px rgba(212,175,55,0.1)' : 'none' }}
            >
              <div style={{ color: 'var(--gold)', fontSize: '2rem', marginBottom: '1rem' }}>➗</div>
              <h4 style={{ fontSize: '1.2rem', color: 'var(--ink)', marginBottom: '0.5rem', fontWeight: 700 }}>Split Payment (Invite Team)</h4>
              <p style={{ color: 'var(--mist)', fontSize: '0.9rem', lineHeight: '1.5', minHeight: '60px' }}>
                Pay ONLY your <b>${baseFee}</b> portion today. We will give you {playerCount - 1} Magic Links to send to your teammates so they can pay their own shares.
              </p>
            </div>

            {/* Pay Full Toggle */}
            <div 
              onClick={() => setPaymentMode('full')}
              style={{ padding: '2rem', borderRadius: '16px', border: paymentMode === 'full' ? '2px solid var(--gold)' : '2px solid rgba(0,0,0,0.05)', background: paymentMode === 'full' ? '#fffefaa0' : '#fff', cursor: 'pointer', transition: 'all 0.2s', boxShadow: paymentMode === 'full' ? '0 10px 20px rgba(212,175,55,0.1)' : 'none' }}
            >
              <div style={{ color: 'var(--gold)', fontSize: '2rem', marginBottom: '1rem' }}>💳</div>
              <h4 style={{ fontSize: '1.2rem', color: 'var(--ink)', marginBottom: '0.5rem', fontWeight: 700 }}>Pay Full Amount Now</h4>
              <p style={{ color: 'var(--mist)', fontSize: '0.9rem', lineHeight: '1.5', minHeight: '60px' }}>
                Secure all {playerCount} spots immediately with a single <b>${baseFee * playerCount}</b> transaction on your card.
              </p>
            </div>

          </div>
          
          {paymentMode === 'split' && (
            <div style={{ marginTop: '0.5rem', padding: '1.5rem', background: '#f8faf9', borderRadius: '16px', border: '1px solid rgba(0,0,0,0.05)' }}>
              <h4 style={{ fontSize: '1.1rem', color: 'var(--ink)', marginBottom: '0.4rem', fontWeight: 700 }}>Invite Your Teammates (Optional)</h4>
              <p style={{ color: 'var(--mist)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>Enter their emails below. We'll automatically send them a secure Magic Link to pay their portion!</p>
              
              {Array.from({ length: playerCount - 1 }).map((_, idx) => (
                <div key={idx} style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--forest)', fontWeight: 600, marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Teammate {idx + 1} Email
                  </label>
                  <input 
                    type="email" 
                    placeholder="player@example.com"
                    value={teammateEmails[idx] || ''}
                    onChange={(e) => {
                      const newEmails = [...teammateEmails];
                      newEmails[idx] = e.target.value;
                      setTeammateEmails(newEmails);
                    }}
                    style={{ width: '100%', padding: '0.8rem 1rem', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.1)', fontSize: '0.95rem', outline: 'none' }}
                  />
                </div>
              ))}
            </div>
          )}
        </>
      )}

      <div style={{ padding: '2rem', background: '#f8faf9', borderRadius: '16px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '1.1rem', color: 'var(--ink)' }}>
          <span>Tournament Entry Fee</span>
          <span style={{ fontWeight: 600 }}>${baseFee} / player</span>
        </div>
        
        {paymentMode === 'full' && playerCount > 1 && (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '1rem', color: 'var(--mist)' }}>
            <span>Multiply by {playerCount} Players</span>
            <span>x {playerCount}</span>
          </div>
        )}

        <div style={{ width: '100%', height: '1px', background: 'rgba(0,0,0,0.1)', margin: '0.5rem 0' }}></div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '1.4rem', color: 'var(--forest)', fontWeight: 800 }}>
          <span>Total Due Today</span>
          <span>${paymentMode === 'split' ? totalDueSplit : totalDueFull}</span>
        </div>
      </div>

      <button 
        onClick={handleCheckout}
        disabled={loading}
        className="btn-primary"
        style={{ width: '100%', padding: '1.2rem', fontSize: '1.2rem', background: 'linear-gradient(135deg, var(--gold), #aa8529)', color: '#000', border: 'none', borderRadius: '12px', fontWeight: 800, marginTop: '2rem', boxShadow: '0 8px 30px rgba(212,175,55,0.4)', textTransform: 'uppercase', letterSpacing: '1px', cursor: loading ? 'wait' : 'pointer' }}
      >
        {loading ? 'Initializing Secure Cart...' : `Proceed to Secure Checkout`} 🔒
      </button>

    </div>
  );
}
