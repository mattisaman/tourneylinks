'use client';

import React, { useState } from 'react';
import { Link as LinkIcon, CheckCircle } from 'lucide-react';

export default function MissingLinkWidget({ tournamentId }: { tournamentId: number }) {
  const [isOpen, setIsOpen] = useState(false);
  const [url, setUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;

    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/tournaments/${tournamentId}/submit-link`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });

      if (res.ok) {
        setIsSuccess(true);
        setUrl('');
      } else {
        alert('Failed to submit link.');
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
      <div style={{ padding: '0.8rem', background: 'rgba(90, 140, 58, 0.05)', borderRadius: '8px', border: '1px solid rgba(90, 140, 58, 0.2)', textAlign: 'center', marginTop: '1rem' }}>
        <CheckCircle size={20} color="var(--grass)" style={{ margin: '0 auto 0.4rem auto' }} />
        <p style={{ color: 'var(--forest)', fontSize: '0.8rem', fontWeight: 500 }}>Link submitted for review! Thank you.</p>
      </div>
    );
  }

  return (
    <div style={{ marginTop: '0.5rem', textAlign: 'center', width: '100%' }}>
      {!isOpen ? (
        <button onClick={() => setIsOpen(true)} className="btn-ghost" style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--mist)', textDecoration: 'underline' }}>
          <LinkIcon size={14} /> Submit Missing URL
        </button>
      ) : (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', background: 'rgba(26,46,26,0.02)', padding: '0.8rem', borderRadius: '8px', border: '1px solid rgba(26,46,26,0.06)' }}>
          <input 
            type="url" 
            required 
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            style={{ width: '100%', padding: '0.6rem', borderRadius: '4px', border: '1px solid rgba(26,46,26,0.2)', fontSize: '0.85rem', outline: 'none' }} 
            placeholder="Paste register URL here..."
          />
          <div style={{ display: 'flex', gap: '0.4rem' }}>
            <button type="button" onClick={() => setIsOpen(false)} className="btn-ghost" style={{ flex: 1, padding: '0.4rem', fontSize: '0.8rem' }}>Cancel</button>
            <button type="submit" disabled={isSubmitting} className="btn-primary" style={{ flex: 1, padding: '0.4rem', fontSize: '0.8rem' }}>
              {isSubmitting ? 'Sending...' : 'Submit'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
