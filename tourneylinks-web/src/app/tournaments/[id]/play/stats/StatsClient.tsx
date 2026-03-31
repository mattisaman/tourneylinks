'use client';

import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts';

export default function StatsClient({ tournamentId }: { tournamentId: number }) {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch(`/api/tournaments/${tournamentId}/stats`)
      .then(res => res.json())
      .then(json => setData(json))
      .catch(err => console.error(err));
  }, [tournamentId]);

  if (!data) {
     return <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--mist)' }}>Crunching data...</div>;
  }

  if (!data.courseAverages && (!data.holeDifficulties || data.holeDifficulties.length === 0)) {
     return <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--mist)' }}>No advanced stats generated yet. Play some holes!</div>;
  }

  const avgGross = data.courseAverages?.averageGrossScore?.toFixed(1) || '--';
  const avgPutts = data.courseAverages?.averagePutts?.toFixed(1) || '--';
  const firPct = data.courseAverages?.firPercentage !== null && data.courseAverages?.firPercentage !== undefined ? data.courseAverages.firPercentage?.toFixed(0) + '%' : '--';
  const girPct = data.courseAverages?.girPercentage !== null && data.courseAverages?.girPercentage !== undefined ? data.courseAverages.girPercentage?.toFixed(0) + '%' : '--';

  return (
    <div style={{ padding: '1.5rem 1rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
       {/* 1. Global Field Metrics */}
       <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '12px', padding: '1rem', textAlign: 'center' }}>
             <div style={{ fontSize: '0.75rem', color: 'var(--mist)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Field Avg</div>
             <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--cream)' }}>{avgGross}</div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '12px', padding: '1rem', textAlign: 'center' }}>
             <div style={{ fontSize: '0.75rem', color: 'var(--mist)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Avg Putts</div>
             <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--cream)' }}>{avgPutts}</div>
          </div>
          <div style={{ background: 'rgba(78,201,160,0.1)', borderRadius: '12px', padding: '1rem', textAlign: 'center', border: '1px solid rgba(78,201,160,0.3)' }}>
             <div style={{ fontSize: '0.75rem', color: 'var(--mist)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>FIR %</div>
             <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#4ec9a0' }}>{firPct}</div>
          </div>
          <div style={{ background: 'rgba(78,201,160,0.1)', borderRadius: '12px', padding: '1rem', textAlign: 'center', border: '1px solid rgba(78,201,160,0.3)' }}>
             <div style={{ fontSize: '0.75rem', color: 'var(--mist)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>GIR %</div>
             <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#4ec9a0' }}>{girPct}</div>
          </div>
       </div>

       {/* 2. Graphical Chart */}
       <div>
          <div style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--gold)', letterSpacing: '0.05em', textTransform: 'uppercase', textAlign: 'center' }}>Hole Difficulty (+/- Par)</div>
          <div style={{ height: '280px', background: 'rgba(255,255,255,0.02)', padding: '1rem 0', borderRadius: '12px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.holeDifficulties} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                <XAxis dataKey="holeNumber" stroke="rgba(255,255,255,0.5)" tick={{fill: 'var(--mist)'}} />
                <YAxis stroke="rgba(255,255,255,0.5)" tick={{fill: 'var(--mist)'}} />
                <Tooltip cursor={{fill: 'rgba(255,255,255,0.05)'}} contentStyle={{ backgroundColor: '#05120c', border: '1px solid var(--gold)', borderRadius: '8px' }} formatter={(value: number) => [value > 0 ? `+${value.toFixed(2)}` : value.toFixed(2), "Avg to Par"]} />
                <Bar dataKey="avgToPar" radius={[4, 4, 0, 0]}>
                   {
                     data.holeDifficulties.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={entry.avgToPar > 0 ? '#ff4d4f' : entry.avgToPar < 0 ? '#4ec9a0' : '#d4af37'} />
                     ))
                   }
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '1rem', fontSize: '0.75rem', color: 'var(--mist)' }}>
             <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><div style={{ width: '10px', height: '10px', background: '#ff4d4f', borderRadius: '50%' }}></div> Harder</div>
             <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><div style={{ width: '10px', height: '10px', background: '#d4af37', borderRadius: '50%' }}></div> Par</div>
             <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><div style={{ width: '10px', height: '10px', background: '#4ec9a0', borderRadius: '50%' }}></div> Easier</div>
          </div>
       </div>

    </div>
  );
}
