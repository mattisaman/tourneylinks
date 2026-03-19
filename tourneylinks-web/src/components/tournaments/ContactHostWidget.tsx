'use client';

import React, { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { MessageSquare, CheckCircle } from 'lucide-react';

interface Tournament {
  id: number;
  organizerName: string | null;
  organizerEmail: string | null;
  organizerPhone: string | null;
}

export default function ContactHostWidget({ tournament }: { tournament: Tournament }) {
  const { user } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  React.useEffect(() => {
    if (user?.primaryEmailAddress?.emailAddress && !email) {
      setEmail(user.primaryEmailAddress.emailAddress);
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message || !email) return;

    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/tournaments/${tournament.id}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, message }),
      });

      if (res.ok) {
        setIsSuccess(true);
        setMessage('');
      } else {
        alert('Failed to send message.');
      }
    } catch (err) {
      console.error(err);
      alert('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div style={{ background: 'var(--white)', border: '1px solid rgba(26,46,26,0.06)', borderRadius: 'var(--radius-lg)', padding: '2.5rem 2rem', marginBottom: '1.5rem', textAlign: 'center' }}>
        <CheckCircle size={48} color="var(--grass)" style={{ margin: '0 auto 1rem auto' }} />
        <h3 className="section-eyebrow" style={{ color: 'var(--forest)', marginBottom: '0.5rem' }}>Message Sent</h3>
        <p style={{ fontSize: '0.9rem', color: 'var(--mist)', lineHeight: '1.5' }}>
          Your message has been securely sent to the Organizer. They will reply to: <br/><strong>{email}</strong>
        </p>
      </div>
    );
  }

  return (
    <div style={{ background: 'rgba(26,46,26,0.02)', border: '1px solid rgba(26,46,26,0.06)', borderRadius: 'var(--radius-lg)', padding: '2rem', marginBottom: '1.5rem' }}>
      <h3 className="section-eyebrow">Organizer</h3>
      
      {!isOpen ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1.5rem' }}>
          {tournament.organizerName && (
            <div>
              <div className="t-detail-label">Name</div>
              <div className="t-detail-val">{tournament.organizerName}</div>
            </div>
          )}
          {tournament.organizerEmail && (
            <div>
              <div className="t-detail-label">Email</div>
              <div className="t-detail-val" style={{ color: 'var(--mist)' }}>Protected (In-App Messaging)</div>
            </div>
          )}
          {tournament.organizerPhone && (
            <div>
              <div className="t-detail-label">Phone</div>
              <a href={`tel:${tournament.organizerPhone}`} style={{ color: 'var(--grass)', textDecoration: 'none', fontWeight: 500 }}>{tournament.organizerPhone}</a>
            </div>
          )}
          {!tournament.organizerName && !tournament.organizerEmail && !tournament.organizerPhone && (
             <span style={{ fontStyle: 'italic', color: 'var(--mist)' }}>No organizer info.</span>
          )}

          {tournament.organizerEmail && (
            <button onClick={() => setIsOpen(true)} className="btn-hero-outline" style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', width: '100%', padding: '0.8rem' }}>
               <MessageSquare size={16} /> Contact Host
            </button>
          )}
        </div>
      ) : (
        <div style={{ marginTop: '1.5rem' }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--forest)' }}>YOUR EMAIL</label>
              <input 
                type="email" 
                required 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ width: '100%', padding: '0.8rem', borderRadius: '6px', border: '1px solid rgba(26,46,26,0.2)', marginTop: '0.3rem', fontSize: '0.9rem', outline: 'none' }} 
                placeholder="Where should they reply?"
              />
            </div>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--forest)' }}>MESSAGE</label>
              <textarea 
                required 
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                style={{ width: '100%', padding: '0.8rem', borderRadius: '6px', border: '1px solid rgba(26,46,26,0.2)', marginTop: '0.3rem', fontSize: '0.9rem', minHeight: '120px', resize: 'vertical', outline: 'none' }} 
                placeholder="Ask about refunds, waitlists, or transfers..."
              />
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
              <button type="button" onClick={() => setIsOpen(false)} className="btn-ghost" style={{ flex: 1, padding: '0.8rem', fontSize: '0.9rem', textAlign: 'center' }}>Cancel</button>
              <button type="submit" disabled={isSubmitting} className="btn-primary" style={{ flex: 2, padding: '0.8rem', fontSize: '0.9rem', display: 'flex', justifyContent: 'center' }}>
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
