'use client';

import React, { useState } from 'react';
import { Send, X, CheckCircle } from 'lucide-react';
import { useUser } from '@clerk/nextjs';

export default function ContactHostModal({ tournamentId }: { tournamentId: number }) {
  const { user } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  React.useEffect(() => {
    if (isOpen && user?.primaryEmailAddress?.emailAddress && !email) {
      setEmail(user.primaryEmailAddress.emailAddress);
    }
  }, [isOpen, user, email]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !message) return;
    setIsSubmitting(true);
    
    try {
      const res = await fetch('/api/contact-host', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tournamentId, email, message }),
      });
      if (res.ok) setIsSuccess(true);
      else alert('Failed to send message.');
    } catch (err) {
      alert('Network error.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        style={{ padding: '0.8rem 1.5rem', borderRadius: '8px', border: '1px solid var(--gold)', color: 'var(--gold)', fontWeight: 700, textDecoration: 'none', transition: 'all 0.2s', display: 'inline-block', background: 'transparent', cursor: 'pointer' }}
        onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(212,175,55,0.05)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
      >
        Contact Host
      </button>

      {isOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(7, 21, 16, 0.8)', padding: '1.5rem', backdropFilter: 'blur(8px)' }}>
          <div style={{ background: '#fff', borderRadius: '16px', padding: '2.5rem', width: '100%', maxWidth: '500px', position: 'relative', boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }}>
            <button onClick={() => setIsOpen(false)} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--mist)' }}>
              <X size={24} />
            </button>
            
            {isSuccess ? (
              <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                <CheckCircle size={60} color="var(--grass)" style={{ margin: '0 auto 1.5rem auto' }} />
                <h3 style={{ fontSize: '1.8rem', color: 'var(--forest)', marginBottom: '0.5rem', fontFamily: "'Playfair Display', serif" }}>Message Sent!</h3>
                <p style={{ color: 'var(--mist)', lineHeight: 1.5 }}>The Tournament Director has received your inquiry. They will reply to your email shortly.</p>
              </div>
            ) : (
              <>
                <h3 style={{ fontSize: '1.8rem', color: 'var(--forest)', marginBottom: '0.5rem', fontFamily: "'Playfair Display', serif" }}>Contact Host</h3>
                <p style={{ color: 'var(--mist)', marginBottom: '1.5rem' }}>Send a secure message directly to the event director.</p>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--forest)' }}>YOUR EMAIL</label>
                    <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} style={{ padding: '0.8rem', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.1)', fontSize: '0.95rem' }} placeholder="Where should they reply?" />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--forest)' }}>YOUR MESSAGE</label>
                    <textarea required value={message} onChange={(e) => setMessage(e.target.value)} style={{ padding: '0.8rem', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.1)', fontSize: '0.95rem', minHeight: '120px', resize: 'vertical' }} placeholder="Ask a question..." />
                  </div>
                  <button type="submit" disabled={isSubmitting} className="btn-hero-outline" style={{ marginTop: '0.5rem', padding: '1rem', width: '100%', justifyContent: 'center' }}>
                    {isSubmitting ? 'Sending...' : <><Send size={18} /> Send Inquiry</>}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
