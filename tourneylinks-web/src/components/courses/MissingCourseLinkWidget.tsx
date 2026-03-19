'use client';

import React, { useState } from 'react';
import { Link as LinkIcon, CheckCircle } from 'lucide-react';

export default function MissingCourseLinkWidget({ courseId, courseName }: { courseId: number, courseName: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [url, setUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;

    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/courses/${courseId}/submit-link`, {
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
      <div style={{ padding: '0.8rem', background: 'rgba(90, 140, 58, 0.05)', borderRadius: '4px', border: '1px solid rgba(90, 140, 58, 0.2)', textAlign: 'center', marginTop: '0.5rem' }}>
        <CheckCircle size={20} color="var(--grass)" style={{ margin: '0 auto 0.4rem auto' }} />
        <p style={{ color: 'var(--forest)', fontSize: '0.8rem', fontWeight: 500 }}>Link submitted for review! Thank you.</p>
      </div>
    );
  }

  return (
    <div style={{ marginTop: '0.5rem', width: '100%' }}>
      {!isOpen ? (
        <button onClick={() => setIsOpen(true)} style={{ background: 'white', border: '1px solid var(--forest)', color: 'var(--forest)', padding: '0.3rem 0.6rem', fontSize: '0.75rem', borderRadius: '4px', cursor: 'pointer', fontWeight: 600, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
          <LinkIcon size={12} /> Submit Missing URL
        </button>
      ) : (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem' }}>
          <input 
            type="url" 
            required 
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            style={{ width: '100%', padding: '0.6rem', borderRadius: '4px', border: '1px solid rgba(26,46,26,0.3)', fontSize: '0.85rem', outline: 'none' }} 
            placeholder={`Official site for ${courseName}...`}
          />
          <div style={{ display: 'flex', gap: '0.4rem' }}>
            <button type="button" onClick={() => setIsOpen(false)} style={{ flex: 1, padding: '0.4rem', fontSize: '0.8rem', background: 'transparent', border: '1px solid var(--mist)', color: 'var(--mist)', borderRadius: '4px', cursor: 'pointer' }}>Cancel</button>
            <button type="submit" disabled={isSubmitting} style={{ flex: 1, padding: '0.4rem', fontSize: '0.8rem', background: 'var(--forest)', border: 'none', color: 'white', borderRadius: '4px', cursor: 'pointer' }}>
              {isSubmitting ? 'Sending...' : 'Submit'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
