'use client';

import React, { useState, useEffect } from 'react';

type AIHole = {
  holeNumber: number;
  par: number;
  yardage: number;
  handicapData: number;
  pinLat: number | null;
  pinLng: number | null;
};

export default function CourseGPSMapper({ courseId }: { courseId: number }) {
  const [holes, setHoles] = useState<AIHole[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<'idle' | 'saving' | 'success'>('idle');

  useEffect(() => {
     fetch(`/api/courses/${courseId}`)
        .then(res => res.json())
        .then(data => {
            if (Array.isArray(data)) {
               setHoles(data.sort((a,b) => a.holeNumber - b.holeNumber));
            }
            setLoading(false);
        });
  }, [courseId]);

  const handleUpdate = (holeNumber: number, field: 'lat' | 'lng', value: string) => {
      const parsed = parseFloat(value);
      setHoles(holes.map(h => 
          h.holeNumber === holeNumber 
             ? { ...h, [field === 'lat' ? 'pinLat' : 'pinLng']: isNaN(parsed) ? null : parsed }
             : h
      ));
  };

  const autoMapDemo = () => {
       // Seed generic coordinates simulating an automated map overlay selection to save time typing!
       const baseLat = 36.568461;
       const baseLng = -121.950785; // Pebble Beach general Area
       
       setHoles(holes.map(h => ({
           ...h,
           pinLat: baseLat + (h.holeNumber * 0.001),
           pinLng: baseLng - (h.holeNumber * 0.0005)
       })));
  };

  const syncGPS = async () => {
      setStatus('saving');
      const payload = holes.filter(h => h.pinLat !== null && h.pinLng !== null).map(h => ({
         holeNumber: h.holeNumber,
         lat: h.pinLat,
         lng: h.pinLng
      }));

      try {
         const res = await fetch(`/api/admin/courses/${courseId}/gps`, {
             method: 'POST',
             headers: { 'Content-Type': 'application/json' },
             body: JSON.stringify({ coordinates: payload })
         });
         if (res.ok) {
             setStatus('success');
             setTimeout(() => setStatus('idle'), 3000);
         }
      } catch (err) {
         setStatus('idle');
         console.error('Failed to sync GPS data.');
      }
  };

  if (loading) return <div style={{ color: 'var(--mist)', padding: '2rem' }}>Loading Course Topography...</div>;

  if (holes.length === 0) {
      return null; // GPS mapping isn't available until the layout has been created!
  }

  return (
    <div className="dash-card">
       <div className="dash-card-header">
           <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(212,175,55,0.1)', border: '1px solid var(--gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem' }}>
                 📍
              </div>
              <div>
                 <div className="dash-card-title">Geospatial Mapper</div>
                 <div style={{ fontSize: '0.75rem', color: 'var(--mist)', marginTop: '0.1rem' }}>Define absolute target coordinates for exact yardage arrays</div>
              </div>
           </div>
           
           <div style={{ display: 'flex', gap: '0.75rem' }}>
             <button onClick={autoMapDemo} className="btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.75rem' }}>
                Auto-Map (Demo)
             </button>
             <button onClick={syncGPS} disabled={status === 'saving'} className="btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.75rem' }}>
                {status === 'saving' ? 'Syncing...' : status === 'success' ? 'Map Synced! ✅' : 'Save Coordinates'}
             </button>
           </div>
       </div>

       <div style={{ background: '#f8faf9', padding: '1.5rem', borderTop: '1px solid rgba(0,0,0,0.05)' }}>
          <div style={{ paddingBottom: '1rem', marginBottom: '1rem', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
             <p style={{ fontSize: '0.85rem', color: 'var(--mist)' }}>
                <strong>Tip:</strong> You can pull these coordinates by standing on the physical green with your phone, or by right-clicking the target green on Google Maps Desktop and selecting "Copy Coordinates".
             </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
             {holes.map((h) => (
                 <div key={h.holeNumber} style={{ background: '#ffffff', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '8px', padding: '1rem', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
                     <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', fontWeight: 800, fontSize: '0.9rem', color: 'var(--ink)' }}>
                         Hole {h.holeNumber}
                         <span style={{ color: 'var(--gold)' }}>Par {h.par}</span>
                     </div>
                     <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                         <label style={{ fontSize: '0.65rem', textTransform: 'uppercase', color: 'var(--mist)', fontWeight: 600 }}>Latitude</label>
                         <input 
                            type="number" 
                            step="any"
                            placeholder="e.g. 36.568"
                            value={h.pinLat === null ? '' : h.pinLat}
                            onChange={(e) => handleUpdate(h.holeNumber, 'lat', e.target.value)}
                            style={{ background: '#fafaf5', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '4px', padding: '0.5rem', color: 'var(--ink)', fontSize: '0.85rem', width: '100%', outline: 'none' }}
                         />
                         <label style={{ fontSize: '0.65rem', textTransform: 'uppercase', color: 'var(--mist)', fontWeight: 600, marginTop: '0.2rem' }}>Longitude</label>
                         <input 
                            type="number"
                            step="any" 
                            placeholder="e.g. -121.95"
                            value={h.pinLng === null ? '' : h.pinLng}
                            onChange={(e) => handleUpdate(h.holeNumber, 'lng', e.target.value)}
                            style={{ background: '#fafaf5', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '4px', padding: '0.5rem', color: 'var(--ink)', fontSize: '0.85rem', width: '100%', outline: 'none' }}
                         />
                     </div>
                 </div>
             ))}
          </div>
       </div>
    </div>
  );
}
