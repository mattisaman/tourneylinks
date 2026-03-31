'use client';

import React, { useState, useEffect } from 'react';

type StoreItem = {
   id?: number;
   title: string;
   price: number;
   maxPerPlayer: number | null;
};

export default function ScrambleStoreManager({ tournamentId }: { tournamentId: number }) {
  const [items, setItems] = useState<StoreItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [priceStr, setPriceStr] = useState('');
  const [maxStr, setMaxStr] = useState('');

  const fetchItems = async () => {
      try {
         const res = await fetch(`/api/admin/tournaments/${tournamentId}/store`);
         if (res.ok) {
             const data = await res.json();
             setItems(data);
         }
      } catch (err) {
         console.error(err);
      } finally {
         setLoading(false);
      }
  };

  useEffect(() => {
     fetchItems();
  }, [tournamentId]);

  const handleCreate = async () => {
      if (!title || !priceStr) return;
      setSaving(true);
      
      const priceCents = parseInt((parseFloat(priceStr) * 100).toFixed(0));
      const maxLimit = maxStr ? parseInt(maxStr) : null;

      try {
         const res = await fetch(`/api/admin/tournaments/${tournamentId}/store`, {
             method: 'POST',
             headers: { 'Content-Type': 'application/json' },
             body: JSON.stringify({ title, price: priceCents, maxPerPlayer: maxLimit })
         });
         
         if (res.ok) {
             setTitle('');
             setPriceStr('');
             setMaxStr('');
             await fetchItems();
         }
      } catch (err) {
         console.error(err);
      } finally {
         setSaving(false);
      }
  };

  const deleteItem = async (id: number) => {
      if (!confirm('Eliminate this Store Asset completely?')) return;
      try {
         const res = await fetch(`/api/admin/tournaments/${tournamentId}/store?itemId=${id}`, {
             method: 'DELETE'
         });
         if (res.ok) {
             setItems(items.filter(i => i.id !== id));
         }
      } catch (err) {
         console.error(err);
      }
  };

  if (loading) return <div style={{ color: 'var(--mist)', padding: '2rem' }}>Loading E-Commerce Engine...</div>;

  return (
    <div className="dash-card">
       <div className="dash-card-header" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '1rem' }}>
           <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(212,175,55,0.1)', border: '1px solid var(--gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem' }}>
                 🛍️
              </div>
              <div>
                 <div className="dash-card-title">The Scramble Store</div>
                 <div style={{ fontSize: '0.75rem', color: 'var(--mist)', marginTop: '0.1rem' }}>Mint custom Add-ons for the Team checkout flow.</div>
              </div>
           </div>
       </div>

       <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1.25rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'flex-end' }}>
              <div style={{ flex: '1 1 200px' }}>
                 <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--mist)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Asset Name</label>
                 <input 
                    type="text" 
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Mulligan Package (2)" 
                    style={{ width: '100%', padding: '0.75rem', background: '#fafaf5', border: '1px solid rgba(26,46,26,0.12)', borderRadius: '4px', fontSize: '0.85rem' }} 
                 />
              </div>
              <div style={{ flex: '1 1 100px' }}>
                 <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--mist)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Price (USD)</label>
                 <input 
                    type="number" 
                    step="1"
                    value={priceStr}
                    onChange={(e) => setPriceStr(e.target.value)}
                    placeholder="20" 
                    style={{ width: '100%', padding: '0.75rem', background: '#fafaf5', border: '1px solid rgba(26,46,26,0.12)', borderRadius: '4px', fontSize: '0.85rem' }} 
                 />
              </div>
              <div style={{ flex: '1 1 100px' }}>
                 <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--mist)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Max Per Player</label>
                 <input 
                    type="number"
                    step="1" 
                    value={maxStr}
                    onChange={(e) => setMaxStr(e.target.value)}
                    placeholder="Unlimited" 
                    style={{ width: '100%', padding: '0.75rem', background: '#fafaf5', border: '1px solid rgba(26,46,26,0.12)', borderRadius: '4px', fontSize: '0.85rem' }} 
                 />
              </div>
              <div>
                 <button onClick={handleCreate} disabled={saving} className="btn-primary" style={{ padding: '0.75rem 1.5rem', height: '42px', display: 'flex', alignItems: 'center' }}>
                    {saving ? 'Minting...' : '+ Add to Store'}
                 </button>
              </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
             {items.length === 0 ? (
                 <div style={{ textAlign: 'center', color: 'var(--mist)', fontSize: '0.85rem', padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '4px', border: '1px dashed rgba(255,255,255,0.1)' }}>
                    No store assets minted yet. Teams will just pay the base entry fee.
                 </div>
             ) : (
                 items.map(item => (
                     <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '6px' }}>
                         <div>
                            <div style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--cream)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                               {item.title}
                               {item.maxPerPlayer !== null && (
                                  <span style={{ fontSize: '0.65rem', background: 'var(--gold)', color: '#05120c', padding: '0.1rem 0.4rem', borderRadius: '10px', fontWeight: 800 }}>MAX {item.maxPerPlayer}</span>
                               )}
                            </div>
                         </div>
                         <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{ fontWeight: 800, fontSize: '1.1rem', color: '#4CAF50' }}>
                               ${(item.price / 100).toFixed(2)}
                            </div>
                            <button onClick={() => item.id && deleteItem(item.id)} style={{ background: 'none', border: 'none', color: '#ff4d4f', cursor: 'pointer', fontSize: '1.2rem', padding: '0.2rem' }}>×</button>
                         </div>
                     </div>
                 ))
             )}
          </div>
       </div>
    </div>
  );
}
