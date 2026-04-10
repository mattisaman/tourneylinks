'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CampaignBuilderClient({ initialTournament, initialCourse, initialInventory, initialSponsors }: any) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'CONTENT' | 'FINANCE' | 'SPONSORS'>('CONTENT');
  const [deviceScale, setDeviceScale] = useState<'desktop' | 'mobile'>('desktop');

  // Unified Form State Engine (Tracks unsaved UI changes flawlessly)
  const [tourneyData, setTourneyData] = useState(initialTournament);
  
  // Simulated Math Cart for Finance Preview
  const [fakeCart, setFakeCart] = useState<Record<number, number>>({});
  const totalCart = Object.entries(fakeCart).reduce((acc, [id, qty]) => {
     let i = initialInventory.find((inv: any) => inv.id === parseInt(id));
     return acc + ((i ? i.price : 0) * qty);
  }, 0) / 100;

  const handleStripeCheckout = async () => {
    const cartArray = Object.entries(fakeCart).map(([id, qty]) => {
      let item = initialInventory.find((inv: any) => inv.id === parseInt(id));
      return {
        id,
        title: item?.name || 'Add-on',
        price: item?.price || 0, // already in cents
        qty
      };
    }).filter(x => x.qty > 0);

    try {
      const res = await fetch('/api/stripe/checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tournamentId: tourneyData.id,
          entryFee: tourneyData.entryFee,
          cartItems: cartArray
        })
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || 'Failed to initialize checkout');
      }
    } catch (err) {
      console.error(err);
      alert('Network error communicating with Stripe API');
    }
  };

  // --------- RIGHT PANEL: CONTROL FORMS ---------
  const renderControlForm = () => {
    switch (activeTab) {
       case 'CONTENT':
         return (
           <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                 <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--ink)' }}>Tournament Name</label>
                 <input 
                    type="text" 
                    value={tourneyData.name} 
                    onChange={e => setTourneyData({ ...tourneyData, name: e.target.value })}
                    style={{ width: '100%', border: '1px solid rgba(0,0,0,0.1)', padding: '0.8rem', borderRadius: '8px', marginTop: '0.5rem', fontSize: '1rem', outline: 'none' }}
                 />
              </div>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ flex: 1 }}>
                   <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--ink)' }}>Start Date</label>
                   <input type="date" value={tourneyData.dateStart?.split('T')[0]} onChange={e => setTourneyData({...tourneyData, dateStart: e.target.value})} style={{ width: '100%', border: '1px solid rgba(0,0,0,0.1)', padding: '0.8rem', borderRadius: '8px', marginTop: '0.5rem' }} />
                </div>
                <div style={{ flex: 1 }}>
                   <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--ink)' }}>Format</label>
                   <select value={tourneyData.format} onChange={e => setTourneyData({...tourneyData, format: e.target.value})} style={{ width: '100%', border: '1px solid rgba(0,0,0,0.1)', padding: '0.8rem', borderRadius: '8px', marginTop: '0.5rem', WebkitAppearance: 'none' }}>
                      <option value="SCRAMBLE">Standard Scramble</option>
                      <option value="STROKE">Stroke Play</option>
                   </select>
                </div>
              </div>
              <div>
                 <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--ink)' }}>Prizes & Itinerary (Markdown)</label>
                 <textarea 
                    rows={6} 
                    value="* 7:30 AM: Registration Open\n* 9:00 AM: Shotgun Start\n* 2:00 PM: Clubhouse BBQ\n\n**1st Place Prize:** Foursome at Pebble Beach"
                    readOnly
                    style={{ width: '100%', border: '1px solid rgba(0,0,0,0.1)', padding: '0.8rem', borderRadius: '8px', marginTop: '0.5rem', fontFamily: 'monospace', fontSize: '0.85rem' }}
                 />
              </div>
              <button style={{ padding: '1rem', background: '#05120c', color: 'var(--gold)', borderRadius: '8px', fontWeight: 800, marginTop: '1rem' }}>Save Metadata</button>
           </div>
         );

       case 'FINANCE':
         return (
           <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ background: 'rgba(76,175,80,0.05)', padding: '1.5rem', borderRadius: '12px', border: '1px solid rgba(76,175,80,0.1)' }}>
                 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <div style={{ fontWeight: 800, fontSize: '1.1rem', color: '#2e7d32' }}>Base Entry Fee</div>
                    <div style={{ fontWeight: 800, fontSize: '1.5rem', color: 'var(--ink)' }}>${tourneyData.entryFee}</div>
                 </div>
                 <input type="range" min="0" max="1000" step="5" value={tourneyData.entryFee} onChange={e => setTourneyData({...tourneyData, entryFee: parseInt(e.target.value)})} style={{ width: '100%' }} />
              </div>

              <div>
                 <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--ink)', display: 'block', marginBottom: '0.5rem' }}>Allowed Checkout Methods</label>
                 <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                    
                    {/* PRIMARY: PAYPAL GIVING FUND */}
                    <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.8rem', background: '#eaf4ff', border: '1px solid #c2deff', borderRadius: '8px', cursor: 'pointer' }}>
                       <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                           <input type="checkbox" checked={true} readOnly /> 
                           <div>
                              <div style={{ fontWeight: 800, color: '#003087', fontSize: '0.95rem' }}>PayPal Giving Fund</div>
                              <div style={{ fontSize: '0.75rem', color: '#005ea6', marginTop: '0.1rem' }}>Funds deposit instantly with 0% processing fees.</div>
                           </div>
                       </div>
                       <div style={{ background: '#003087', color: '#fff', fontSize: '0.7rem', fontWeight: 800, padding: '0.2rem 0.5rem', borderRadius: '4px' }}>RECOMMENDED</div>
                    </label>

                    {/* SECONDARY: STRIPE */}
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', opacity: 0.8 }}><input type="checkbox" checked={true} readOnly /> Valid Credit/Debit (Stripe API Flow)</label>
                    
                    {/* FALLBACK: OFFLINE */}
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', opacity: 0.8 }}><input type="checkbox" checked={tourneyData.allowOfflinePayment} onChange={e => setTourneyData({...tourneyData, allowOfflinePayment: e.target.checked})} /> Commit to Post-Dated Check / Cash On-Arrival</label>
                 </div>
              </div>

              <div style={{ height: '1px', background: 'rgba(0,0,0,0.05)', margin: '1rem 0' }}></div>

              <div>
                 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--ink)' }}>Scramble Store Assets</label>
                    <button style={{ border: 'none', background: 'none', color: 'var(--gold)', fontWeight: 800, cursor: 'pointer', fontSize: '0.85rem' }}>+ Add Item</button>
                 </div>
                 <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {initialInventory.length === 0 ? <div style={{ fontSize: '0.85rem', color: 'var(--mist)' }}>No e-commerce add-ons active for this tournament.</div> : initialInventory.map((inv: any) => (
                        <div key={inv.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.8rem', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '8px', background: '#fafaf5' }}>
                            <div>
                               <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--ink)' }}>{inv.title}</div>
                               <div style={{ fontSize: '0.75rem', color: 'var(--mist)' }}>Max: {inv.maxPerPlayer || 'Unlimited'}</div>
                            </div>
                            <div style={{ fontWeight: 800, color: 'var(--forest)' }}>${(inv.price/100).toFixed(2)}</div>
                        </div>
                    ))}
                 </div>
              </div>

           </div>
         );

       case 'SPONSORS':
         return (
           <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(0,0,0,0.1)', paddingBottom: '1rem' }}>
                 <div style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--ink)' }}>Sponsorship Deck</div>
                 <button style={{ padding: '0.5rem 1rem', background: 'var(--gold)', color: '#000', borderRadius: '4px', fontWeight: 800, fontSize: '0.85rem', border: 'none' }}>+ Mint Tier</button>
              </div>
              <div style={{ background: 'rgba(46,125,50,0.05)', padding: '1.5rem', borderRadius: '12px', border: '1px solid rgba(46,125,50,0.2)' }}>
                   <div style={{ fontWeight: 800, color: '#2e7d32', fontSize: '1.2rem', marginBottom: '0.2rem' }}>Hole-in-One Sponsor</div>
                   <div style={{ fontSize: '0.85rem', color: 'var(--ink)' }}>Includes signage on 3 holes and a complimentary foursome grouping.</div>
                   <div style={{ fontWeight: 800, fontSize: '1.4rem', marginTop: '1rem' }}>$2,500<span style={{ fontSize: '0.8rem', color: 'var(--mist)', fontWeight: 400 }}>/yr</span></div>
              </div>
           </div>
         );
    }
  };

  // --------- LEFT PANEL: LIVE PREVIEW ---------
  const renderPreview = () => {
    switch (activeTab) {
       case 'CONTENT':
         return (
             <div style={{ background: '#f8faf9', minHeight: '100%', padding: '2rem' }}>
                  <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                      <p style={{ color: 'var(--gold)', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 800, fontSize: '0.8rem', marginBottom: '0.5rem' }}>{initialCourse.name} • {tourneyData.dateStart?.split('T')[0]}</p>
                      <h1 style={{ fontSize: '3.5rem', fontWeight: 900, color: 'var(--ink)', letterSpacing: '-1px', lineHeight: 1.1, marginBottom: '1rem' }}>{tourneyData.name}</h1>
                      <div style={{ background: 'var(--gold)', color: '#000', display: 'inline-block', padding: '0.4rem 1rem', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase' }}>
                         {tourneyData.format}
                      </div>
                  </div>
                  <div style={{ maxWidth: '600px', margin: '0 auto', background: '#fff', padding: '2rem', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
                       <h3 style={{ fontSize: '1.4rem', fontWeight: 800, borderBottom: '1px solid rgba(0,0,0,0.1)', paddingBottom: '1rem', marginBottom: '1rem' }}>Event Itinerary</h3>
                       <ul style={{ paddingLeft: '1.5rem', lineHeight: 1.8, color: 'var(--ink)' }}>
                          <li><strong>7:30 AM:</strong> Registration Open</li>
                          <li><strong>9:00 AM:</strong> Shotgun Start</li>
                          <li><strong>2:00 PM:</strong> Clubhouse BBQ</li>
                       </ul>
                  </div>
             </div>
         );
       
       case 'FINANCE':
         return (
             <div style={{ background: '#f8faf9', minHeight: '100%', padding: '2rem' }}>
                 <div style={{ maxWidth: '500px', margin: '0 auto', background: '#fff', borderRadius: '24px', boxShadow: '0 20px 40px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
                      
                      <div style={{ background: '#05120c', padding: '1.5rem', color: 'white', textAlign: 'center' }}>
                          <div style={{ fontSize: '0.85rem', color: 'var(--gold)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 800, marginBottom: '0.2rem' }}>Secure Integration</div>
                          <div style={{ fontSize: '1.2rem', fontWeight: 600 }}>Live Cart Preview</div>
                      </div>

                      <div style={{ padding: '2rem' }}>
                         
                         {/* Registration Breakdown */}
                         <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '1.1rem', color: 'var(--ink)', marginBottom: '0.5rem' }}>
                             <span>{tourneyData.name} Entry</span>
                             <span style={{ fontWeight: 800 }}>${tourneyData.entryFee}</span>
                         </div>
                         <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem', color: 'var(--mist)', paddingBottom: '1.5rem', borderBottom: '1px solid rgba(0,0,0,0.1)' }}>
                             <span>1 Solo Golfer (Foursome Split Available)</span>
                             <span>---</span>
                         </div>

                         {/* Live Scramble Math Simulator */}
                         <div style={{ margin: '1.5rem 0' }}>
                            <div style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--mist)', fontWeight: 800, marginBottom: '1rem' }}>3. Expand your package</div>
                            {initialInventory.map((inv:any) => {
                                const q = fakeCart[inv.id] || 0;
                                return (
                                <div key={inv.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '12px', marginBottom: '0.5rem' }}>
                                    <div>
                                        <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--ink)' }}>{inv.title}</div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--mist)' }}>${(inv.price/100).toFixed(2)} each</div>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                                        <button onClick={() => setFakeCart({...fakeCart, [inv.id]: Math.max(0, q-1)})} style={{ width: '30px', height: '30px', borderRadius: '50%', border: '1px solid rgba(0,0,0,0.1)', background: '#fafaf5', fontWeight: 800, cursor: 'pointer' }}>-</button>
                                        <div style={{ width: '15px', textAlign: 'center', fontWeight: 800 }}>{q}</div>
                                        <button onClick={() => setFakeCart({...fakeCart, [inv.id]: q+1})} style={{ width: '30px', height: '30px', borderRadius: '50%', border: '1px solid rgba(0,0,0,0.1)', background: '#fafaf5', fontWeight: 800, cursor: 'pointer' }}>+</button>
                                    </div>
                                </div>
                                );
                            })}
                         </div>

                         {/* Live Total Output */}
                         <div style={{ background: '#f8faf9', padding: '1.5rem', borderRadius: '12px' }}>
                             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '1.5rem', fontWeight: 900, color: 'var(--forest)' }}>
                                 <span>Total Due</span>
                                 <span>${(tourneyData.entryFee + totalCart).toFixed(2)}</span>
                             </div>
                             <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--mist)', marginTop: '0.5rem' }}>
                                 <span>Platform Fee Absorbed (0%)</span>
                                 <span>+$0.00</span>
                             </div>
                         </div>

                         <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <button style={{ width: '100%', padding: '1.2rem', background: '#ffc439', color: '#003087', borderRadius: '12px', fontWeight: 900, fontSize: '1.1rem', border: '1px solid #f2b724' }}>
                               Pay ${(tourneyData.entryFee + totalCart).toFixed(2)} with PayPal
                            </button>
                            <button onClick={handleStripeCheckout} style={{ width: '100%', padding: '0.8rem', background: '#05120c', color: 'var(--gold)', borderRadius: '12px', fontWeight: 700, fontSize: '0.9rem', border: 'none', cursor: 'pointer' }}>
                               Pay with Credit/Debit (Stripe)
                            </button>
                            {tourneyData.allowOfflinePayment && (
                                <button style={{ width: '100%', padding: '0.8rem', background: 'transparent', color: 'var(--ink)', borderRadius: '12px', fontWeight: 700, fontSize: '0.9rem', border: '1px solid rgba(0,0,0,0.1)' }}>
                                    Commit to Mail Check / Pay Cash
                                </button>
                            )}
                         </div>

                      </div>
                 </div>
             </div>
         );

       case 'SPONSORS':
         return (
             <div style={{ background: '#f8faf9', minHeight: '100%', padding: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                 <div style={{ maxWidth: '400px', width: '100%', background: '#fff', borderRadius: '24px', boxShadow: '0 20px 40px rgba(0,0,0,0.08)', padding: '2rem', textAlign: 'center' }}>
                      <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🤝</div>
                      <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--ink)', marginBottom: '0.5rem' }}>Secure Sponsorship</h2>
                      <p style={{ color: 'var(--mist)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '2rem' }}>
                         The company will upload their high-res logo file and select their tier. They will then immediately push funds mapping straight to your PayPal Giving Fund charitable vault, with zero processing fees.
                      </p>
                      <button style={{ width: '100%', padding: '1.2rem', background: '#ffc439', color: '#003087', borderRadius: '12px', fontWeight: 900, border: '1px solid #f2b724', marginBottom: '0.5rem' }}>
                         Pledge $2,500.00 via PayPal
                      </button>
                      <button style={{ width: '100%', padding: '0.8rem', background: '#05120c', color: '#fff', borderRadius: '12px', fontWeight: 700, border: 'none', fontSize: '0.85rem' }}>
                         Pledge via Credit/Debit (Stripe)
                      </button>
                 </div>
             </div>
         );
    }
  };

  return (
    <div style={{ display: 'flex', flex: 1, overflow: 'hidden', background: '#e0e5eb' }}>
       
       {/* 1. STATE NAVIGATOR MENU (Far Left) */}
       <div style={{ width: '250px', background: '#1c2120', display: 'flex', flexDirection: 'column', padding: '2rem 1rem' }}>
           <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 800, marginBottom: '1rem', paddingLeft: '1rem' }}>Build Flow</div>
           <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <button onClick={() => setActiveTab('CONTENT')} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem', background: activeTab === 'CONTENT' ? 'rgba(212,175,55,0.1)' : 'transparent', color: activeTab === 'CONTENT' ? 'var(--gold)' : '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', textAlign: 'left', fontWeight: activeTab==='CONTENT'?800:500, transition: 'all 0.2s' }}>
                 <span style={{ fontSize: '1.2rem' }}>✏️</span> Details & Content
              </button>
              <button onClick={() => setActiveTab('FINANCE')} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem', background: activeTab === 'FINANCE' ? 'rgba(212,175,55,0.1)' : 'transparent', color: activeTab === 'FINANCE' ? 'var(--gold)' : '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', textAlign: 'left', fontWeight: activeTab==='FINANCE'?800:500, transition: 'all 0.2s' }}>
                 <span style={{ fontSize: '1.2rem' }}>💳</span> Checkout & Payments
              </button>
              <button onClick={() => setActiveTab('SPONSORS')} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem', background: activeTab === 'SPONSORS' ? 'rgba(212,175,55,0.1)' : 'transparent', color: activeTab === 'SPONSORS' ? 'var(--gold)' : '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', textAlign: 'left', fontWeight: activeTab==='SPONSORS'?800:500, transition: 'all 0.2s' }}>
                 <span style={{ fontSize: '1.2rem' }}>🤝</span> Sponsorship Deck
              </button>
           </div>
       </div>

       {/* 2. THE LIVE PREVIEW iFRAME SIMULATOR (Middle Canvas 50%) */}
       <div style={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative' }}>
          
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '40px', background: 'rgba(0,0,0,0.03)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', borderBottom: '1px solid rgba(0,0,0,0.05)', zIndex: 10 }}>
             <button onClick={() => setDeviceScale('desktop')} style={{ border: 'none', background: deviceScale === 'desktop' ? '#fff' : 'transparent', padding: '4px 12px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 700, boxShadow: deviceScale === 'desktop' ? '0 2px 4px rgba(0,0,0,0.05)' : 'none', cursor: 'pointer' }}>Desktop View</button>
             <button onClick={() => setDeviceScale('mobile')} style={{ border: 'none', background: deviceScale === 'mobile' ? '#fff' : 'transparent', padding: '4px 12px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 700, boxShadow: deviceScale === 'mobile' ? '0 2px 4px rgba(0,0,0,0.05)' : 'none', cursor: 'pointer' }}>Mobile View</button>
          </div>

          <div style={{ flex: 1, background: '#e0e5eb', display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: '40px', overflowY: 'auto' }}>
             <div style={{ 
                width: deviceScale === 'desktop' ? '100%' : '400px', 
                height: deviceScale === 'desktop' ? '100%' : '800px', 
                background: '#fff', 
                boxShadow: deviceScale === 'mobile' ? '0 25px 50px -12px rgba(0,0,0,0.25)' : 'none',
                borderRadius: deviceScale === 'mobile' ? '30px' : '0',
                border: deviceScale === 'mobile' ? '8px solid #000' : 'none',
                overflowY: 'auto',
                transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
             }}>
                 {renderPreview()}
             </div>
          </div>
       </div>

       {/* 3. THE CONFIGURATION FORM INPUTS (Right Panel) */}
       <div style={{ width: '400px', background: '#fff', borderLeft: '1px solid rgba(0,0,0,0.1)', overflowY: 'auto', padding: '2rem' }}>
          <div style={{ marginBottom: '2rem' }}>
             <h2 style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--ink)' }}>{activeTab === 'CONTENT' ? 'Tournament Details' : activeTab === 'FINANCE' ? 'Monetization' : 'Sponsors'}</h2>
             <p style={{ fontSize: '0.85rem', color: 'var(--mist)', marginTop: '0.2rem' }}>Any changes you make here will automatically reflect in the live simulator to the left.</p>
          </div>
          {renderControlForm()}
       </div>

    </div>
  );
}
