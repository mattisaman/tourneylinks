'use client';

import React, { useState } from 'react';

type StripeAccount = {
  stripeAccountId: string;
  chargesEnabled: boolean;
  payoutsEnabled: boolean;
};

export default function StripeConnectWidget({ account }: { account: StripeAccount | null }) {
  const [loading, setLoading] = useState(false);

  const initiateOnboarding = async () => {
      setLoading(true);
      try {
         const res = await fetch('/api/admin/finance/onboard', { method: 'POST' });
         const data = await res.json();
         if (data.url) {
             // Rip them securely into the remote Stripe hosted modal flow via window object redirection
             window.location.href = data.url;
         } else {
             alert('Failed to construct secure payment gateway link.');
             setLoading(false);
         }
      } catch (err) {
         console.error('Onboarding Error:', err);
         setLoading(false);
      }
  };

  const isFullyConnected = account?.chargesEnabled && account?.payoutsEnabled;

  return (
    <div className="dash-card">
       <div className="dash-card-header" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '1rem' }}>
           <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(99,91,255,0.1)', border: '1px solid #635bff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem' }}>
                 🏦
              </div>
              <div>
                 <div className="dash-card-title">Financial Gateway & Payouts</div>
                 <div style={{ fontSize: '0.75rem', color: 'var(--mist)', marginTop: '0.1rem' }}>Zero-fee routing. Direct connected payouts.</div>
              </div>
           </div>
           
           {isFullyConnected ? (
              <span className="status-pill status-paid" style={{ fontSize: '0.75rem', background: 'rgba(76,175,80,0.1)', color: '#4CAF50', border: '1px solid rgba(76,175,80,0.2)' }}>
                 Verified Active
              </span>
           ) : (
              <span className="status-pill status-unpaid" style={{ fontSize: '0.75rem', background: 'rgba(255,77,79,0.1)', color: '#ff4d4f', border: '1px solid rgba(255,77,79,0.2)' }}>
                 Connection Required
              </span>
           )}
       </div>

       <div style={{ padding: '1.5rem' }}>
          {isFullyConnected ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <p style={{ fontSize: '0.85rem', color: 'var(--mist)', lineHeight: 1.5 }}>
                     Your underlying merchant account matches regulatory compliances. When players purchase registration packages or scramble additions below, the transaction flows magically to your physical bank securely. TourneyLinks has a complete zero-liability API gateway routing funds cleanly.
                  </p>
                  
                  <div style={{ display: 'flex', gap: '1rem', background: 'rgba(0,0,0,0.3)', padding: '1rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                     <div>
                         <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--mist)', marginBottom: '0.2rem' }}>Stripe ID</div>
                         <div style={{ fontFamily: 'monospace', color: 'var(--cream)', fontSize: '0.85rem' }}>{account.stripeAccountId}</div>
                     </div>
                  </div>

                  {/* Future integration: link them back to their dashboard.stripe.com securely using login_links */}
                  <button onClick={initiateOnboarding} disabled={loading} className="btn-secondary" style={{ padding: '0.75rem', marginTop: '0.5rem' }}>
                     {loading ? 'Routing...' : 'Update Bank Information'}
                  </button>
              </div>
          ) : (
              <div style={{ textAlign: 'center', padding: '1rem 0' }}>
                  <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>💸</div>
                  <h3 style={{ color: 'var(--cream)', marginBottom: '0.5rem', fontSize: '1.1rem' }}>You cannot accept team registrations.</h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--mist)', marginBottom: '1.5rem', maxWidth: '400px', margin: '0 auto 1.5rem auto' }}>
                     TourneyLinks operates a strictly zero-touch processing network. You must formally route your local bank matrix through Stripe so teams can safely transfer event funds bypassing our physical servers globally.
                  </p>
                  <button onClick={initiateOnboarding} disabled={loading} style={{ background: '#635bff', color: 'white', border: 'none', padding: '0.85rem 2rem', borderRadius: '6px', fontWeight: 600, fontSize: '0.9rem', cursor: loading ? 'not-allowed' : 'pointer', transition: 'all 0.2s', opacity: loading ? 0.7 : 1 }}>
                     {loading ? 'Encrypting Connection...' : 'Connect Bank via Stripe →'}
                  </button>
              </div>
          )}
       </div>
    </div>
  );
}
