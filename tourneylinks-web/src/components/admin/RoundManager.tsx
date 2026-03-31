'use client';

import React, { useState, useEffect } from 'react';
import { SCORING_FORMATS } from '@/lib/formats';

type Round = {
  id: number;
  roundNumber: number;
  dateString: string;
  scoringFormat: string;
  courseId: number | null;
};

export default function RoundManager({ tournamentId }: { tournamentId: number }) {
  const [rounds, setRounds] = useState<Round[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ roundNumber: 1, dateString: '', scoringFormat: 'STROKE_NET' });

  useEffect(() => {
    fetch(`/api/admin/tournaments/${tournamentId}/rounds`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
            setRounds(data);
            if (data.length > 0) {
               setForm(prev => ({ ...prev, roundNumber: data.length + 1 }));
            }
        }
        setLoading(false);
      });
  }, [tournamentId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const res = await fetch(`/api/admin/tournaments/${tournamentId}/rounds`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });
    
    if (res.ok) {
        const { round } = await res.json();
        const updated = [...rounds, round];
        setRounds(updated);
        setForm({ roundNumber: updated.length + 1, dateString: '', scoringFormat: 'STROKE_NET' });
    } else {
        alert('Failed to add round');
    }
    setSubmitting(false);
  };

  const deleteRound = async (id: number) => {
    if (!confirm('Are you sure you want to delete this round?')) return;
    const res = await fetch(`/api/admin/tournaments/${tournamentId}/rounds?roundId=${id}`, { method: 'DELETE' });
    if (res.ok) {
       setRounds(rounds.filter(r => r.id !== id));
    }
  };

  const formatList = Object.values(SCORING_FORMATS);

  return (
    <div className="dash-card" style={{ marginBottom: '1.5rem' }}>
      <div className="dash-card-header">
        <div className="dash-card-title">🗓️ Multi-Round Engine</div>
      </div>
      
      <div style={{ padding: '1.5rem' }}>
        <p style={{ fontSize: '0.85rem', color: 'var(--mist)', marginBottom: '1.5rem' }}>
           Define multiple rounds for your tournament to support Ryder Cup formats, 3-Day Invitationals, or Multi-Course rotations. 
        </p>

        {loading ? (
             <div style={{ fontSize: '0.8rem', color: 'var(--mist)' }}>Loading rounds...</div>
        ) : rounds.length === 0 ? (
             <div style={{ fontSize: '0.8rem', color: 'var(--mist)', fontStyle: 'italic', marginBottom: '2rem' }}>No defined rounds. System defaults to the parent tournament settings.</div>
        ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
                {rounds.map(r => {
                    const formatDef = SCORING_FORMATS[r.scoringFormat];
                    return (
                    <div key={r.id} style={{ background: '#fafaf5', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '8px', padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#05120c' }}>Round {r.roundNumber} - {r.dateString}</div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--gold)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.2rem' }}>
                                <span style={{ background: 'rgba(201,168,76,0.1)', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>{formatDef ? formatDef.name : r.scoringFormat}</span>
                                <span style={{ color: 'var(--mist)' }}>{formatDef ? formatDef.type : ''}</span>
                            </div>
                        </div>
                        <button onClick={() => deleteRound(r.id)} style={{ background: 'none', border: 'none', color: '#ff4d4f', cursor: 'pointer', fontSize: '1.2rem', padding: '0.5rem' }}>×</button>
                    </div>
                )})}
            </div>
        )}

        <div style={{ background: 'rgba(0,0,0,0.02)', padding: '1.5rem', borderRadius: '8px', border: '1px dashed rgba(0,0,0,0.1)' }}>
          <h4 style={{ fontSize: '0.9rem', marginBottom: '1rem', fontWeight: 600 }}>Create New Round</h4>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
             
             <div style={{ display: 'flex', gap: '1rem' }}>
               <div className="reg-field" style={{ width: '80px' }}>
                 <label style={{ fontSize: '0.75rem', color: 'var(--mist)', textTransform: 'uppercase', marginBottom: '0.25rem', display: 'block' }}>Round</label>
                 <input required type="number" min={1} max={10} value={form.roundNumber} onChange={e => setForm({...form, roundNumber: parseInt(e.target.value)})} style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid rgba(0,0,0,0.1)' }} />
               </div>
               <div className="reg-field" style={{ flex: 1 }}>
                 <label style={{ fontSize: '0.75rem', color: 'var(--mist)', textTransform: 'uppercase', marginBottom: '0.25rem', display: 'block' }}>Date</label>
                 <input required type="date" value={form.dateString} onChange={e => setForm({...form, dateString: e.target.value})} style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid rgba(0,0,0,0.1)' }} />
               </div>
             </div>
             
             <div className="reg-field">
                 <label style={{ fontSize: '0.75rem', color: 'var(--mist)', textTransform: 'uppercase', marginBottom: '0.25rem', display: 'block' }}>Engine Protocol (30+ Formats)</label>
                 <select required value={form.scoringFormat} onChange={e => setForm({...form, scoringFormat: e.target.value})} style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid rgba(0,0,0,0.1)', background: 'white' }}>
                    <optgroup label="Individual Scoring">
                        {formatList.filter(f => f.type === 'INDIVIDUAL').map(f => (
                            <option key={f.id} value={f.id}>{f.name} {f.usesHandicap ? '(Hdcp)' : ''}</option>
                        ))}
                    </optgroup>
                    <optgroup label="Team Scoring">
                        {formatList.filter(f => f.type === 'TEAM').map(f => (
                            <option key={f.id} value={f.id}>{f.name} {f.usesHandicap ? '(Hdcp)' : ''}</option>
                        ))}
                    </optgroup>
                 </select>
                 <div style={{ fontSize: '0.75rem', color: 'var(--mist)', marginTop: '0.4rem', fontStyle: 'italic' }}>
                    {SCORING_FORMATS[form.scoringFormat]?.description}
                 </div>
             </div>

             <button disabled={submitting} className="btn-primary" style={{ padding: '0.75rem', marginTop: '0.5rem', width: '200px', cursor: submitting ? 'not-allowed' : 'pointer' }}>
               {submitting ? 'Creating...' : 'Initialize Round'}
             </button>
          </form>
        </div>
      </div>
    </div>
  );
}
