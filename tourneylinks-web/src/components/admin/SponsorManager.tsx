'use client';

import React, { useState, useEffect } from 'react';

type Sponsor = { id: number; name: string; logoUrl: string; holeAssignment: number | null };

export default function SponsorManager({ tournamentId }: { tournamentId: number }) {
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ name: '', logoUrl: '', holeAssignment: '' });

  useEffect(() => {
    fetch(`/api/admin/tournaments/${tournamentId}/sponsors`)
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) setSponsors(data);
        setLoading(false);
      });
  }, [tournamentId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const res = await fetch(`/api/admin/tournaments/${tournamentId}/sponsors`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });
    
    if (res.ok) {
        const { sponsor } = await res.json();
        setSponsors([...sponsors, sponsor]);
        setForm({ name: '', logoUrl: '', holeAssignment: '' });
    } else {
        alert('Failed to add sponsor');
    }
    setSubmitting(false);
  };

  return (
    <div className="dash-card" style={{ marginBottom: '1.5rem' }}>
      <div className="dash-card-header">
        <div className="dash-card-title">💼 Sponsor & Hole Integration</div>
      </div>
      
      <div style={{ padding: '1.5rem' }}>
        <p style={{ fontSize: '0.85rem', color: 'var(--mist)', marginBottom: '1.5rem' }}>
           Upload sponsor logos and assign them securely to specific holes. They will automatically render on the mobile scoring app when a player reaches that hole.
        </p>

        {/* Existing Sponsors Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
           {loading ? (
             <div style={{ fontSize: '0.8rem', color: 'var(--mist)' }}>Loading sponsors...</div>
           ) : sponsors.length === 0 ? (
             <div style={{ fontSize: '0.8rem', color: 'var(--mist)', fontStyle: 'italic' }}>No active hole sponsors.</div>
           ) : sponsors.map(sp => (
               <div key={sp.id} style={{ border: '1px solid rgba(0,0,0,0.1)', padding: '1rem', borderRadius: '8px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                 <div style={{ width: '100%', height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.5rem' }}>
                    <img src={sp.logoUrl} alt={sp.name} style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }} onError={(e) => (e.currentTarget.style.display = 'none')} />
                 </div>
                 <div style={{ fontWeight: 600, fontSize: '0.9rem', textAlign: 'center' }}>{sp.name}</div>
                 <div style={{ fontSize: '0.75rem', color: 'var(--gold)', fontWeight: 700, marginTop: '0.2rem' }}>
                    {sp.holeAssignment ? `HOLE ${sp.holeAssignment}` : 'GENERAL SPONSOR'}
                 </div>
               </div>
           ))}
        </div>

        {/* Add Sponsor Form */}
        <div style={{ background: 'rgba(0,0,0,0.02)', padding: '1.5rem', borderRadius: '8px', border: '1px dashed rgba(0,0,0,0.1)' }}>
          <h4 style={{ fontSize: '0.9rem', marginBottom: '1rem', fontWeight: 600 }}>Add New Sponsor</h4>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
             
             <div style={{ display: 'flex', gap: '1rem' }}>
               <div className="reg-field" style={{ flex: 1 }}>
                 <label style={{ fontSize: '0.75rem', color: 'var(--mist)', textTransform: 'uppercase', marginBottom: '0.25rem', display: 'block' }}>Sponsor Name</label>
                 <input required type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="e.g. Callaway" style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid rgba(0,0,0,0.1)' }} />
               </div>
               <div className="reg-field" style={{ width: '150px' }}>
                 <label style={{ fontSize: '0.75rem', color: 'var(--mist)', textTransform: 'uppercase', marginBottom: '0.25rem', display: 'block' }}>Hole Assignment</label>
                 <select value={form.holeAssignment} onChange={e => setForm({...form, holeAssignment: e.target.value})} style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid rgba(0,0,0,0.1)', background: 'white' }}>
                    <option value="">General (None)</option>
                    {[...Array(18)].map((_, i) => (
                      <option key={i} value={i+1}>Hole {i+1}</option>
                    ))}
                 </select>
               </div>
             </div>
             
             <div className="reg-field">
                 <label style={{ fontSize: '0.75rem', color: 'var(--mist)', textTransform: 'uppercase', marginBottom: '0.25rem', display: 'block' }}>Logo URL</label>
                 <input required type="url" value={form.logoUrl} onChange={e => setForm({...form, logoUrl: e.target.value})} placeholder="https://example.com/logo.png" style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid rgba(0,0,0,0.1)' }} />
             </div>

             <button disabled={submitting} className="btn-primary" style={{ padding: '0.75rem', marginTop: '0.5rem', width: '200px', cursor: submitting ? 'not-allowed' : 'pointer' }}>
               {submitting ? 'Adding...' : 'Save Sponsor'}
             </button>
          </form>
        </div>
      </div>
    </div>
  );
}
