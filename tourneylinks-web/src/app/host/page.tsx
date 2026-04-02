'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Smartphone, Image as ImageIcon, DollarSign, Settings, ShoppingBag, Plus, UploadCloud } from 'lucide-react';
import StripeOnboardButton from './onboarding/StripeOnboardButton';

export default function HostLiveCampaignBuilder() {
  const [activeTab, setActiveTab] = useState<'content' | 'finance' | 'sponsorships'>('content');

  // Form State
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [course, setCourse] = useState('');
  const [city, setCity] = useState('');
  const [desc, setDesc] = useState('');
  const [selectedFormat, setSelectedFormat] = useState('scramble');
  const [selectedVis, setSelectedVis] = useState('private');

  const [price, setPrice] = useState(125);
  const [maxPlayers, setMaxPlayers] = useState(80);
  const [holes, setHoles] = useState('18 Holes');
  const [org, setOrg] = useState('');
  const [email, setEmail] = useState('');
  const [passFees, setPassFees] = useState(false);

  const [themeColor, setThemeColor] = useState('#c9a84c');
  const [secondaryThemeColor, setSecondaryThemeColor] = useState('#1a2e1a');
  
  const [sponsors, setSponsors] = useState([
     { tier: 'Title Sponsor', price: 5000, spots: 1 },
     { tier: 'Beverage Cart', price: 1500, spots: 2 }
  ]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const p = new URLSearchParams(window.location.search);
      if (p.get('courseName')) setCourse(p.get('courseName') || '');
      const ct = p.get('courseCity');
      const st = p.get('courseState');
      if (ct && st) setCity(`${ct}, ${st}`);
      else if (ct) setCity(ct);
    }
  }, []);

  const formatNames: Record<string, string> = {
    'scramble': '4-Man Scramble',
    '2scramble': '2-Man Scramble',
    'bestball': 'Best Ball',
    'stroke': 'Stroke Play',
    'match': 'Match Play',
    'stableford': 'Stableford'
  };

  const formatName = formatNames[selectedFormat] || selectedFormat;

  const fee = price || 0;
  const stripeFee = fee > 0 ? (fee * 0.029 + 0.30) : 0;
  let totalFee = fee;
  let organizerRevenue = fee - stripeFee;

  if (passFees) {
    totalFee = fee + stripeFee;
    organizerRevenue = fee;
  }

  // --- EDITOR UI CHUNKS --- //

  const renderContentTab = () => (
     <div className="builder-section fade-in">
        <div className="pro-tip-alert" style={{ background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.4)', borderRadius: '8px', padding: '1rem', marginBottom: '2rem', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
           <div style={{ fontSize: '1.2rem' }}>💡</div>
           <div>
              <strong style={{ color: 'var(--forest)', fontSize: '0.85rem', display: 'block', marginBottom: '0.2rem' }}>PRO TIP: Detailed Profiles Convert</strong>
              <div style={{ color: 'var(--mist)', fontSize: '0.8rem', lineHeight: 1.5 }}>
                 Tournaments with a description over 150 words and a custom Hero Image see a <strong style={{ color: 'var(--forest)' }}>40% higher registration rate</strong>.
              </div>
           </div>
        </div>

        <div className="wizard-card" style={{ marginBottom: '2rem' }}>
          <div className="wizard-card-title">Tournament Logistics</div>
          <div className="wform-grid">
            <div className="wfield wform-full">
              <label>Tournament Name *</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Oak Hill Classic Invitational" />
            </div>
            <div className="wfield">
              <label>Host Course</label>
              <input type="text" value={course} onChange={e => setCourse(e.target.value)} placeholder="Full course name" />
            </div>
            <div className="wfield">
              <label>City & State</label>
              <input type="text" value={city} onChange={e => setCity(e.target.value)} placeholder="e.g. Victor, NY" />
            </div>
            <div className="wfield">
              <label>Start Date</label>
              <input type="date" value={date} onChange={e => setDate(e.target.value)} />
            </div>
            <div className="wfield">
               <label>Shotgun / Tee Time</label>
               <input type="time" defaultValue="08:00" />
            </div>
            <div className="wfield wform-full">
               <label>Public Description</label>
               <textarea rows={4} value={desc} onChange={e => setDesc(e.target.value)} placeholder="Tell players what makes this tournament special..."></textarea>
            </div>
          </div>
        </div>

        <div className="wizard-card" style={{ marginBottom: '2rem' }}>
          <div className="wizard-card-title">Format & Branding</div>
          <div className="wform-grid">
             <div className="wfield">
                <label>Format</label>
                <select value={selectedFormat} onChange={e => setSelectedFormat(e.target.value)}>
                   <option value="scramble">4-Man Scramble</option>
                   <option value="2scramble">2-Man Scramble</option>
                   <option value="bestball">Best Ball</option>
                   <option value="stroke">Stroke Play</option>
                </select>
             </div>
             <div className="wfield">
               <label>Number of Holes</label>
               <select value={holes} onChange={e => setHoles(e.target.value)}>
                 <option>18 Holes</option>
                 <option>9 Holes</option>
               </select>
             </div>
             <div className="wfield">
                <label>Primary Theme Color</label>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                   <input type="color" value={themeColor} onChange={e => setThemeColor(e.target.value)} style={{ padding: 0, width: '40px', height: '40px', border: 'none', borderRadius: '4px', cursor: 'pointer' }} />
                   <span style={{ fontSize: '0.8rem', fontFamily: 'monospace', color: 'var(--ink)' }}>{themeColor.toUpperCase()}</span>
                </div>
             </div>
          </div>
          
          <div style={{ marginTop: '1.5rem' }}>
             <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--mist)', marginBottom: '0.5rem' }}>Hero Branding Image</label>
             <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', border: '2px dashed rgba(0,0,0,0.1)', borderRadius: '8px', padding: '2rem', background: '#fafaf5', cursor: 'pointer' }} onClick={() => alert('Media Library opens here.')}>
                <UploadCloud color="var(--mist)" size={32} style={{ marginBottom: '0.5rem' }} />
                <span style={{ fontSize: '0.85rem', color: 'var(--forest)', fontWeight: 600 }}>Click to Upload Media</span>
             </div>
          </div>
        </div>
     </div>
  );

  const renderFinanceTab = () => (
     <div className="builder-section fade-in">
        <div className="wizard-card" style={{ marginBottom: '2rem' }}>
          <div className="wizard-card-title">Registration Engine</div>
          
          <div className="wform-grid" style={{ marginBottom: '1.5rem' }}>
            <div className="wfield">
              <label>Entry Fee (per player)</label>
              <div style={{ position: 'relative' }}>
                 <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', fontWeight: 600, color: 'var(--mist)' }}>$</span>
                 <input type="number" value={price} onChange={e => setPrice(Number(e.target.value))} style={{ paddingLeft: '2rem' }} />
              </div>
            </div>
            <div className="wfield">
              <label>Max Field Size</label>
              <input type="number" value={maxPlayers} onChange={e => setMaxPlayers(Number(e.target.value))} />
            </div>
          </div>

          <div className="pricing-box" style={{ background: '#f8faf9', padding: '1.25rem', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.05)' }}>
            <div className="pricing-row" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
               <span style={{ color: 'var(--mist)' }}>Entry fee subtotal</span>
               <strong>${fee.toFixed(2)}</strong>
            </div>
            <div className="pricing-row" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', fontSize: '0.9rem' }}>
              <span style={{ color: 'var(--mist)' }}>
                 Platform & Processing <br/>
                 <span style={{ fontSize: '0.75rem' }}>{passFees ? '(Paid by Registrant)' : '(Deducted from Payout)'}</span>
              </span>
              <strong style={{ color: passFees ? 'var(--mist)' : '#e74c3c' }}>{passFees ? '' : '-'}${stripeFee.toFixed(2)}</strong>
            </div>
            
            <div className="notif-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '1rem 0', padding: '1rem', background: '#fff', borderRadius: '6px', border: '1px solid rgba(0,0,0,0.1)' }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--ink)' }}>Pass Fees to Registrant</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--mist)' }}>Automatically append transaction costs to checkout.</div>
              </div>
              <label className="toggle-switch">
                <input type="checkbox" checked={passFees} onChange={e => setPassFees(e.target.checked)} />
                <span className="toggle-slider"></span>
              </label>
            </div>

            <div style={{ height: '1px', background: 'rgba(0,0,0,0.1)', margin: '1rem 0' }}></div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: 700, color: 'var(--ink)' }}>Registrant Pays</span>
              <span style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--ink)' }}>${totalFee.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
               <span style={{ fontWeight: 700, color: 'var(--grass)' }}>You Receive</span>
               <span style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--grass)' }}>${organizerRevenue.toFixed(2)}</span>
            </div>
          </div>
        </div>
        
        <div className="wizard-card">
           <div className="wizard-card-title">Launch Protocol</div>
           <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '1rem' }}>
             <button className="btn-primary" style={{ flex: 1, padding: '1rem', background: 'var(--gold)', color: '#000', fontWeight: 700, border: 'none' }}>
               Pay $99 to Publish 🚀
             </button>
             <button className="btn-hero-outline" style={{ flex: 1, padding: '1rem' }} onClick={() => alert('Saved to Drafts')}>
               Save as Draft
             </button>
           </div>
        </div>
     </div>
  );

  const renderSponsorTab = () => (
     <div className="builder-section fade-in">
        <div className="pro-tip-alert" style={{ background: 'rgba(46, 204, 113, 0.08)', border: '1px solid rgba(46, 204, 113, 0.4)', borderRadius: '8px', padding: '1rem', marginBottom: '2rem', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
           <div style={{ fontSize: '1.2rem' }}>💰</div>
           <div>
              <strong style={{ color: 'var(--forest)', fontSize: '0.85rem', display: 'block', marginBottom: '0.2rem' }}>PRO TIP: Sponsor Tiers Maximize Revenue</strong>
              <div style={{ color: 'var(--mist)', fontSize: '0.8rem', lineHeight: 1.5 }}>
                 Pre-selling automated digital sponsorship real estate can cover the entire cost of the tournament before a single golfer registers.
              </div>
           </div>
        </div>

        <div className="wizard-card">
           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div className="wizard-card-title" style={{ marginBottom: 0 }}>Sponsorship Inventory</div>
              <button className="btn-hero-outline" style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                 <Plus size={14} /> Mint Sponsor Tier
              </button>
           </div>
           
           <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {sponsors.map((s, i) => (
                 <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', border: '1px solid rgba(0,0,0,0.05)', borderRadius: '8px', background: '#f8faf9' }}>
                    <div>
                       <div style={{ fontWeight: 700, color: 'var(--forest)', fontSize: '0.95rem' }}>{s.tier}</div>
                       <div style={{ fontSize: '0.75rem', color: 'var(--mist)', marginTop: '0.2rem' }}>{s.spots} spots remaining</div>
                    </div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--grass)' }}>${s.price}</div>
                 </div>
              ))}
           </div>
        </div>
     </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: '#f4f7f5', paddingBottom: '4rem' }}>
       {/* Global Title Header */}
       <div style={{ background: '#fff', borderBottom: '1px solid rgba(0,0,0,0.05)', padding: '1.5rem 0' }}>
          <div style={{ maxWidth: '1600px', margin: '0 auto', padding: '0 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
             <div>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--gold)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.2rem' }}>Administration Hub</div>
                <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '2rem', color: 'var(--forest)', margin: 0 }}>Live Campaign Builder</h1>
             </div>
             <div style={{ fontSize: '0.85rem', color: 'var(--mist)' }}>
                Draft Auto-Saved at {new Date().toLocaleTimeString()}
             </div>
          </div>
       </div>

       {/* Campaign Builder Two-Column Grid */}
       <div style={{ maxWidth: '1600px', margin: '2rem auto 0 auto', padding: '0 2rem', display: 'flex', flexDirection: 'column', gap: '2rem' }} className="md:flex-row">
          
          {/* EDITOR COLUMN (Left) */}
          <div style={{ flex: '1.2 1 600px', display: 'flex', flexDirection: 'column' }}>
             
             {/* 3-State Tab Nav */}
             <div style={{ display: 'flex', gap: '0.5rem', background: '#fff', padding: '0.5rem', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.05)', marginBottom: '2rem', boxShadow: '0 4px 15px rgba(0,0,0,0.02)' }}>
                <button 
                  onClick={() => setActiveTab('content')}
                  style={{ flex: 1, padding: '0.8rem', background: activeTab === 'content' ? 'var(--forest)' : 'transparent', color: activeTab === 'content' ? '#fff' : 'var(--mist)', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', transition: '0.2s' }}>
                   <Settings size={16} /> Campaign Setup
                </button>
                <button 
                  onClick={() => setActiveTab('finance')}
                  style={{ flex: 1, padding: '0.8rem', background: activeTab === 'finance' ? 'var(--forest)' : 'transparent', color: activeTab === 'finance' ? '#fff' : 'var(--mist)', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', transition: '0.2s' }}>
                   <DollarSign size={16} /> Financials
                </button>
                <button 
                  onClick={() => setActiveTab('sponsorships')}
                  style={{ flex: 1, padding: '0.8rem', background: activeTab === 'sponsorships' ? 'var(--forest)' : 'transparent', color: activeTab === 'sponsorships' ? '#fff' : 'var(--mist)', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', transition: '0.2s' }}>
                   <ShoppingBag size={16} /> Sponsorships
                </button>
             </div>

             {/* Tab Render */}
             {activeTab === 'content' && renderContentTab()}
             {activeTab === 'finance' && renderFinanceTab()}
             {activeTab === 'sponsorships' && renderSponsorTab()}

          </div>

          {/* SIMULATOR COLUMN (Right) */}
          <div style={{ flex: '0.8 1 400px', display: 'flex', justifyContent: 'center', alignItems: 'flex-start' }} className="hidden lg:flex">
             {/* Sticky Wrapper */}
             <div style={{ position: 'sticky', top: '120px', width: '100%', maxWidth: '380px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--mist)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                   <Smartphone size={14} /> Live Mobile Preview
                </div>
                
                {/* iPhone Frame Envelope */}
                <div style={{
                   width: '100%',
                   height: '750px',
                   background: '#fff',
                   borderRadius: '40px', // iPhone hardware curves
                   border: '12px solid #0f1512', // Black device frame
                   boxShadow: '0 25px 50px rgba(0,0,0,0.1), inset 0 0 0 1px rgba(255,255,255,0.2)',
                   position: 'relative',
                   overflow: 'hidden',
                   display: 'flex',
                   flexDirection: 'column'
                }}>
                   {/* Dynamic Notch */}
                   <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: '120px', height: '25px', background: '#0f1512', borderBottomLeftRadius: '16px', borderBottomRightRadius: '16px', zIndex: 50 }}></div>

                   {/* SIMULATED WEB BROWSER CANVAS */}
                   <div style={{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch', position: 'relative' }}>
                      
                      {/* Simulated Hero Section */}
                      <div style={{ height: '300px', background: `linear-gradient(135deg, ${secondaryThemeColor}, #112814)`, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '1.5rem', position: 'relative' }}>
                         {/* Dynamic gradient wash over hero */}
                         <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: `radial-gradient(circle at top right, ${themeColor} 0%, transparent 60%)`, opacity: 0.3, pointerEvents: 'none' }}></div>
                         
                         <div style={{ position: 'relative', zIndex: 10 }}>
                            <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '0.5rem' }}>
                               <span style={{ fontSize: '0.65rem', padding: '0.2rem 0.5rem', background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(4px)', color: '#fff', borderRadius: '4px', fontWeight: 700 }}>{formatName}</span>
                            </div>
                            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.8rem', color: 'var(--cream)', margin: 0, lineHeight: 1.1, textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>
                               {name || 'Tournament Title'}
                            </h2>
                            <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.8)', marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                               📍 {course ? `${course} ${city ? `· ${city}` : ''}` : 'Course TBD'}
                            </div>
                         </div>
                      </div>

                      {/* Simulated Body Content */}
                      <div style={{ padding: '1.5rem', background: '#fff' }}>
                         <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', paddingBottom: '1.5rem', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                            <div>
                               <div style={{ fontSize: '0.7rem', color: 'var(--mist)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.2rem' }}>Entry Fee</div>
                               <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--forest)' }}>${totalFee.toFixed(2)}</div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                               <div style={{ fontSize: '0.7rem', color: 'var(--mist)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.2rem' }}>Date</div>
                               <div style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--ink)', fontFamily: 'DM Mono, monospace' }}>
                                  {date ? new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' }) : 'TBD'}
                               </div>
                            </div>
                         </div>

                         {desc && (
                            <div style={{ marginBottom: '1.5rem' }}>
                               <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--ink)', marginBottom: '0.5rem' }}>About Event</div>
                               <div style={{ fontSize: '0.85rem', color: 'var(--mist)', lineHeight: 1.6 }}>{desc}</div>
                            </div>
                         )}

                         <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--ink)', marginBottom: '0.75rem' }}>Live Sponsors</div>
                         <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '2rem' }}>
                            {sponsors.map((s, idx) => (
                               <div key={idx} style={{ padding: '1rem', background: '#f8faf9', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                  <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--forest)' }}>{s.tier}</span>
                                  <span style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--grass)' }}>${s.price}</span>
                               </div>
                            ))}
                         </div>
                      </div>

                      {/* Sticky Bottom Action Mobile */}
                      <div style={{ position: 'sticky', bottom: 0, background: '#fff', padding: '1rem', borderTop: '1px solid rgba(0,0,0,0.05)', display: 'flex', justifyContent: 'center' }}>
                         <button style={{ width: '100%', padding: '0.8rem', background: themeColor, color: '#fff', fontWeight: 700, border: 'none', borderRadius: '8px', boxShadow: `0 4px 14px ${themeColor}40` }}>
                            Register Now
                         </button>
                      </div>
                   </div>
                </div>
             </div>
          </div>

       </div>
    </div>
  );
}
