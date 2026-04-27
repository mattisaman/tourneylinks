'use client';

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

const FORMATS = ['scramble', 'stroke', 'best-ball', 'match', 'stableford', 'alternate-shot', 'chapman'];
const STATES = [
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
  'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
  'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
];
const YEARS = ['2023', '2024', '2025', '2026', '2027'];
const MONTHS = [
  { val: '01', label: 'Jan' }, { val: '02', label: 'Feb' }, { val: '03', label: 'Mar' },
  { val: '04', label: 'Apr' }, { val: '05', label: 'May' }, { val: '06', label: 'Jun' },
  { val: '07', label: 'Jul' }, { val: '08', label: 'Aug' }, { val: '09', label: 'Sep' },
  { val: '10', label: 'Oct' }, { val: '11', label: 'Nov' }, { val: '12', label: 'Dec' }
];

export default function AnalyticsFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentState = searchParams?.get('state') || '';
  const currentFormat = searchParams?.get('format') || '';
  const currentYear = searchParams?.get('year') || '';
  const currentMonth = searchParams?.get('month') || '';

  const updateParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams?.toString() || '');
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`?${params.toString()}`);
  };

  const clearFilters = () => {
    router.push('/system/analytics');
  };

  return (
    <div style={{ background: 'var(--white)', border: '1px solid rgba(0,0,0,0.05)', borderRadius: '12px', padding: '1.5rem', boxShadow: 'var(--shadow-sm)', marginBottom: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
         <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--forest)', margin: 0 }}>Filter Insights</h3>
         {(currentState || currentFormat || currentYear || currentMonth) && (
            <button onClick={clearFilters} style={{ background: 'none', border: 'none', color: 'var(--mist)', fontSize: '0.85rem', cursor: 'pointer', textDecoration: 'underline' }}>
              Clear All
            </button>
         )}
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
        {/* State Filter */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--ink)' }}>State</label>
          <select 
            value={currentState} 
            onChange={(e) => updateParam('state', e.target.value)}
            style={{ padding: '0.6rem', borderRadius: '6px', border: '1px solid rgba(0,0,0,0.1)', background: '#fcfcfc', fontSize: '0.9rem', color: 'var(--ink)' }}
          >
            <option value="">All Regions</option>
            {STATES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        {/* Format Filter */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--ink)' }}>Format</label>
          <select 
            value={currentFormat} 
            onChange={(e) => updateParam('format', e.target.value)}
            style={{ padding: '0.6rem', borderRadius: '6px', border: '1px solid rgba(0,0,0,0.1)', background: '#fcfcfc', fontSize: '0.9rem', color: 'var(--ink)', textTransform: 'capitalize' }}
          >
            <option value="">All Formats</option>
            {FORMATS.map(f => <option key={f} value={f}>{f.replace('-', ' ')}</option>)}
          </select>
        </div>

        {/* Year Filter */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--ink)' }}>Year</label>
          <select 
            value={currentYear} 
            onChange={(e) => updateParam('year', e.target.value)}
            style={{ padding: '0.6rem', borderRadius: '6px', border: '1px solid rgba(0,0,0,0.1)', background: '#fcfcfc', fontSize: '0.9rem', color: 'var(--ink)' }}
          >
            <option value="">All Years (2023+)</option>
            {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>

        {/* Month Filter */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--ink)' }}>Month</label>
          <select 
            value={currentMonth} 
            onChange={(e) => updateParam('month', e.target.value)}
            style={{ padding: '0.6rem', borderRadius: '6px', border: '1px solid rgba(0,0,0,0.1)', background: '#fcfcfc', fontSize: '0.9rem', color: 'var(--ink)' }}
          >
            <option value="">All Months</option>
            {MONTHS.map(m => <option key={m.val} value={m.val}>{m.label}</option>)}
          </select>
        </div>
      </div>
    </div>
  );
}
