'use client';

import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell, LineChart, Line } from 'recharts';

export default function AdminInsightsClient({ tournamentId, tourneyName }: { tournamentId: number, tourneyName: string }) {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch(`/api/tournaments/${tournamentId}/stats`)
      .then(res => res.json())
      .then(json => setData(json))
      .catch(err => console.error(err));
  }, [tournamentId]);

  if (!data) {
     return <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--mist)', fontSize: '1.2rem', fontWeight: 600 }}>Analyzing Field Data...</div>;
  }

  if (!data.courseAverages && (!data.holeDifficulties || data.holeDifficulties.length === 0)) {
     return <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--mist)', fontSize: '1.2rem', fontWeight: 600 }}>Insufficient Data. The field needs to record some scores first!</div>;
  }

  return (
    <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem', background: '#0a1a12', minHeight: 'calc(100vh - 60px)' }}>
       
       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontFamily: 'serif', fontSize: '2rem', margin: 0, color: 'white' }}>Statistical Insights</h1>
            <div style={{ color: 'var(--mist)', letterSpacing: '0.1em', textTransform: 'uppercase', fontSize: '0.8rem', marginTop: '0.25rem' }}>{tourneyName}</div>
          </div>
          <div style={{ background: 'rgba(212,175,55,0.1)', padding: '0.5rem 1rem', borderRadius: '30px', border: '1px solid rgba(212,175,55,0.3)', color: 'var(--gold)', fontWeight: 800 }}>
              LIVE SENSORS ACTIVE
          </div>
       </div>

       {/* GLOBAL AGGREGATES */}
       <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem' }}>
          <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1.5rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
             <div style={{ color: 'var(--mist)', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.1em' }}>Field Avg Score</div>
             <div style={{ fontSize: '2.5rem', fontWeight: 900, color: 'white', marginTop: '0.5rem' }}>{data.courseAverages?.averageGrossScore?.toFixed(2) || '--'}</div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1.5rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
             <div style={{ color: 'var(--mist)', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.1em' }}>Field Avg Putts</div>
             <div style={{ fontSize: '2.5rem', fontWeight: 900, color: 'white', marginTop: '0.5rem' }}>{data.courseAverages?.averagePutts?.toFixed(2) || '--'}</div>
          </div>
          <div style={{ background: 'rgba(78,201,160,0.05)', padding: '1.5rem', borderRadius: '12px', border: '1px solid rgba(78,201,160,0.2)' }}>
             <div style={{ color: '#4ec9a0', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.1em' }}>Fairways in Reg</div>
             <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#4ec9a0', marginTop: '0.5rem' }}>{data.courseAverages?.firPercentage?.toFixed(1) || '--'}%</div>
          </div>
          <div style={{ background: 'rgba(78,201,160,0.05)', padding: '1.5rem', borderRadius: '12px', border: '1px solid rgba(78,201,160,0.2)' }}>
             <div style={{ color: '#4ec9a0', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.1em' }}>Greens in Reg</div>
             <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#4ec9a0', marginTop: '0.5rem' }}>{data.courseAverages?.girPercentage?.toFixed(1) || '--'}%</div>
          </div>
       </div>

       {/* DIAGNOSTIC CHARTS */}
       <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          
          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', padding: '1.5rem', borderRadius: '16px' }}>
             <h3 style={{ margin: '0 0 1.5rem 0', color: 'white', fontWeight: 600 }}>Hole Difficulty vs Par</h3>
             <div style={{ height: '350px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.holeDifficulties} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                    <XAxis dataKey="holeNumber" stroke="rgba(255,255,255,0.5)" tick={{fill: 'var(--mist)'}} />
                    <YAxis stroke="rgba(255,255,255,0.5)" tick={{fill: 'var(--mist)'}} />
                    <Tooltip cursor={{fill: 'rgba(255,255,255,0.05)'}} contentStyle={{ backgroundColor: '#05120c', border: '1px solid var(--gold)', borderRadius: '8px', color: 'white' }} formatter={(value: number) => [value > 0 ? `+${value.toFixed(2)}` : value.toFixed(2), "Avg to Par"]} />
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
          </div>

          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', padding: '1.5rem', borderRadius: '16px' }}>
             <h3 style={{ margin: '0 0 1.5rem 0', color: 'white', fontWeight: 600 }}>Stroke Distribution Tracker</h3>
             <div style={{ height: '350px' }}>
                {/* Shows Birdies vs Bogeys distribution line overlay */}
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data.holeDifficulties.sort((a: any, b: any) => a.holeNumber - b.holeNumber)} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                    <XAxis dataKey="holeNumber" stroke="rgba(255,255,255,0.5)" tick={{fill: 'var(--mist)'}} />
                    <YAxis stroke="rgba(255,255,255,0.5)" tick={{fill: 'var(--mist)'}} />
                    <Tooltip contentStyle={{ backgroundColor: '#05120c', border: '1px solid var(--gold)', borderRadius: '8px', color: 'white' }} />
                    <Line type="monotone" dataKey="birdiesOrBetter" name="Birdies (-1)" stroke="#4ec9a0" strokeWidth={3} dot={{r: 4}} />
                    <Line type="monotone" dataKey="bogeys" name="Bogeys (+1)" stroke="#ff4d4f" strokeWidth={3} dot={{r: 4}} />
                    <Line type="monotone" dataKey="doublesOrWorse" name="2x Bogeys (+2)" stroke="#bb86fc" strokeWidth={3} dot={{r: 4}} />
                  </LineChart>
                </ResponsiveContainer>
             </div>
          </div>

       </div>

    </div>
  );
}
