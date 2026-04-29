'use client';

import { useState } from 'react';
import { RefreshCw, Play, Search } from 'lucide-react';

export default function SmartSpiderTrigger() {
  const [isSyncing, setIsSyncing] = useState(false);
  const [result, setResult] = useState<any>(null);

  // Hardcoded to NY Metros for Phase 1
  const nyMetros = [
    "New York City, NY",
    "Buffalo, NY",
    "Rochester, NY",
    "Syracuse, NY",
    "Albany, NY",
    "Binghamton, NY",
    "Ithaca, NY"
  ];
  const [selectedMetro, setSelectedMetro] = useState(nyMetros[0]);

  const handleSync = async () => {
    setIsSyncing(true);
    setResult(null);

    try {
      const response = await fetch('/api/system/smart-spider', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ region: selectedMetro })
      });
      const data = await response.json();
      setResult(data);
    } catch (e: any) {
      setResult({ error: e.message });
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div style={{ position: 'relative' }}>
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column',
        gap: '0.5rem',
        background: 'var(--white)',
        padding: '1rem',
        borderRadius: '12px',
        border: '1px solid rgba(0,0,0,0.05)',
        boxShadow: 'var(--shadow-sm)',
        minWidth: '280px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
          <Search size={16} color="var(--forest)" />
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--forest)' }}>
            Phase 3: Smart Spider (Local)
          </span>
        </div>
        
        <p style={{ fontSize: '0.75rem', color: 'var(--mist)', margin: 0, lineHeight: 1.3 }}>
          Headless Playwright scan of Facebook. Bypasses duplicates automatically.
        </p>

        <select 
          value={selectedMetro}
          onChange={(e) => setSelectedMetro(e.target.value)}
          style={{
            padding: '0.5rem',
            borderRadius: '6px',
            border: '1px solid rgba(0,0,0,0.1)',
            fontSize: '0.85rem',
            background: 'var(--sand)',
            cursor: 'pointer'
          }}
        >
          {nyMetros.map(m => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>

        <button 
          onClick={handleSync}
          disabled={isSyncing}
          className="btn-hero"
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            gap: '0.5rem',
            padding: '0.6rem 1rem',
            fontSize: '0.85rem',
            opacity: isSyncing ? 0.7 : 1,
            cursor: isSyncing ? 'not-allowed' : 'pointer',
            background: isSyncing ? 'var(--mist)' : 'var(--emerald)'
          }}
        >
          {isSyncing ? (
            <><RefreshCw size={14} className="pulse-dot" /> Running Playwright...</>
          ) : (
            <><Play size={14} /> Launch Headless Scan</>
          )}
        </button>

        {result && (
          <div style={{ 
            marginTop: '0.5rem', 
            padding: '0.75rem', 
            background: result.error ? '#FEE2E2' : '#ECFDF5', 
            borderRadius: '6px',
            fontSize: '0.75rem',
            color: result.error ? '#991B1B' : '#065F46'
          }}>
            {result.error ? (
              <span>Error: {result.error}</span>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                <strong>Scanned {result.scraped} Raw URLs</strong>
                <span>✅ Inserted: {result.inserted}</span>
                <span>⏭️ Skipped (Dupes): {result.skipped}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
