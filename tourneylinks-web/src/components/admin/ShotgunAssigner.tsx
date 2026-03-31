'use client';

import React, { useState } from 'react';

export default function ShotgunAssigner({ 
  tournamentId, 
  registrationId, 
  initialHole 
}: { 
  tournamentId: number, 
  registrationId: number, 
  initialHole: number | null 
}) {
  const [hole, setHole] = useState<number | ''>(initialHole || '');
  const [saving, setSaving] = useState(false);

  const handleUpdate = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newVal = e.target.value === '' ? '' : parseInt(e.target.value);
    setHole(newVal);
    setSaving(true);

    try {
       await fetch(`/api/admin/tournaments/${tournamentId}/registrants/${registrationId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ startingHole: newVal === '' ? null : newVal })
       });
    } catch(err) {
       console.error("Shotgun assign failed", err);
    } finally {
       setSaving(false);
    }
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
       <select 
         value={hole}
         onChange={handleUpdate}
         disabled={saving}
         style={{ 
            padding: '0.4rem', 
            borderRadius: '4px', 
            border: '1px solid rgba(255,255,255,0.1)', 
            background: 'rgba(0,0,0,0.3)', 
            color: 'white',
            outline: 'none',
            fontSize: '0.8rem',
            cursor: saving ? 'wait' : 'pointer'
         }}
       >
         <option value="">Start Hole...</option>
         {Array.from({ length: 18 }, (_, i) => i + 1).map(h => (
           <option key={h} value={h}>Hole {h}</option>
         ))}
       </select>
       {saving && <span style={{ fontSize: '0.75rem', color: 'var(--gold)' }}>saving...</span>}
    </div>
  );
}
