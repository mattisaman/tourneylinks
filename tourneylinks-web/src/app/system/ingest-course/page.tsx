'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Globe, Search, ArrowRight, CheckCircle2, AlertTriangle, Loader2, Sparkles, MapPin, Flag } from 'lucide-react';
import Link from 'next/link';

export default function AIIngestor() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleIngest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;
    
    setLoading(true);
    setError('');
    setResult(null);
    
    try {
      const res = await fetch('/api/system/ingest-course', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
      });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || 'Failed to ingest course');
      setResult(data.course);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: 'var(--ink)', minHeight: '100vh', display: 'flex', flexDirection: 'column', paddingTop: '80px', position: 'relative', overflow: 'hidden' }}>
      
      {/* Background Gradient */}
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 50% 10%, rgba(201,168,76,0.15) 0%, transparent 70%)', zIndex: 0 }} />

      <div style={{ position: 'relative', zIndex: 1, padding: '4rem 1.5rem', width: '100%', maxWidth: '800px', margin: '0 auto', flex: 1 }}>
        
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.3)', padding: '0.4rem 1rem', borderRadius: '30px', color: 'var(--gold)', fontSize: '0.85rem', fontWeight: 600, marginBottom: '2rem' }}>
          <Sparkles size={14} /> AI Web Scraper Engine v1.0
        </div>
        
        <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', fontFamily: "'Clash Display', sans-serif", fontWeight: 600, color: 'var(--white)', marginBottom: '1rem', lineHeight: 1.1 }}>
          Ingest a new course <br />in milliseconds.
        </h1>
        <p style={{ fontSize: '1.2rem', color: 'rgba(255,255,255,0.7)', marginBottom: '3rem', lineHeight: 1.6 }}>
          Missing a golf course from our Global Directory? Drop the official website URL below. Our Gemini 2.5 Flash pipeline will crawl the site, extract all metadata, and normalize it into PostgreSQL instantly.
        </p>

        {/* Input Form */}
        <form onSubmit={handleIngest} style={{ background: 'rgba(20,35,20,0.6)', backdropFilter: 'blur(16px)', padding: '1.5rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 20px 40px rgba(0,0,0,0.5)', marginBottom: '4rem' }}>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <div style={{ flex: '1 1 300px', position: 'relative' }}>
              <Globe size={20} style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.4)' }} />
              <input 
                type="url" 
                placeholder="https://www.pebblebeach.com/golf/pebble-beach-golf-links/" 
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                required
                style={{ width: '100%', padding: '1.25rem 1.25rem 1.25rem 3.5rem', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '1.1rem', color: 'white', outline: 'none', transition: 'all 0.2s' }}
                onFocus={(e) => e.target.style.borderColor = 'var(--gold)'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                disabled={loading}
              />
            </div>
            <button 
               className="btn-primary" 
               type="submit" 
               disabled={loading}
               style={{ flex: '0 0 auto', padding: '0 2.5rem', background: 'var(--gold)', color: 'var(--ink)', border: 'none', opacity: loading ? 0.7 : 1 }}
            >
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Loader2 size={18} className="animate-spin" /> Crawling...
                </span>
              ) : (
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  Execute Extraction <ArrowRight size={18} />
                </span>
              )}
            </button>
          </div>
        </form>

        {/* Status Blocks */}
        {error && (
          <div style={{ background: 'rgba(220, 38, 38, 0.1)', border: '1px solid rgba(220, 38, 38, 0.3)', color: '#fca5a5', padding: '1.5rem', borderRadius: '12px', display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
            <AlertTriangle size={24} style={{ flexShrink: 0 }} />
            <div>
              <h3 style={{ margin: 0, fontWeight: 600, fontSize: '1.1rem', marginBottom: '0.2rem' }}>Extraction Failed</h3>
              <p style={{ margin: 0, opacity: 0.8 }}>{error}</p>
            </div>
          </div>
        )}

        {result && (
          <div style={{ background: 'rgba(26,46,26,0.9)', border: '1px solid rgba(201,168,76,0.2)', padding: '2rem', borderRadius: '16px', boxShadow: '0 12px 30px rgba(0,0,0,0.3)', animation: 'fadeInUp 0.5s ease-out' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
              <div style={{ background: 'rgba(201,168,76,0.2)', padding: '0.8rem', borderRadius: '50%' }}>
                <CheckCircle2 size={32} color="var(--gold)" />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.5rem', color: 'var(--white)', fontWeight: 600 }}>Injection Successful</h3>
                <p style={{ margin: 0, color: 'rgba(255,255,255,0.6)' }}>Database synced and matrix compiled in real-time.</p>
              </div>
            </div>

            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1.5rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', marginBottom: '2rem' }}>
              <h4 style={{ fontSize: '1.3rem', color: 'var(--gold)', margin: '0 0 0.5rem 0', fontFamily: "'Clash Display', sans-serif" }}>{result.name}</h4>
              <div style={{ display: 'flex', gap: '1rem', color: 'var(--white)', fontSize: '0.9rem', flexWrap: 'wrap', opacity: 0.8 }}>
                 <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><MapPin size={14} /> {result.city}, {result.state}</span>
                 <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><Flag size={14} /> {result.holes} Holes | Par {result.par}</span>
                 <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>Type: {result.type}</span>
              </div>
            </div>

            <Link href={`/courses/${result.id}`} className="btn-primary" style={{ display: 'inline-block', background: 'transparent', border: '1px solid var(--gold)', color: 'var(--gold)', width: '100%', textAlign: 'center' }}>
               View Public Course Profile
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
