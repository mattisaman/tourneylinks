'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Smartphone, Image as ImageIcon, DollarSign, Settings, ShoppingBag, Plus, UploadCloud } from 'lucide-react';
import StripeOnboardButton from './onboarding/StripeOnboardButton';

export default function HostLiveCampaignBuilder() {
  const [activeTab, setActiveTab] = useState<'content' | 'finance' | 'sponsorships' | 'launch'>('content');

  // Form State
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [course, setCourse] = useState('');
  const [city, setCity] = useState('');
  const [desc, setDesc] = useState('');
  const [selectedFormat, setSelectedFormat] = useState('scramble');
  const [selectedVis, setSelectedVis] = useState('private');

  const [maxPlayers, setMaxPlayers] = useState(80);
  const [holes, setHoles] = useState('18 Holes');
  const [org, setOrg] = useState('');
  const [email, setEmail] = useState('');
  const [passFees, setPassFees] = useState(false);

  const [packages, setPackages] = useState<{name: string, price: number, isTeam: boolean}[]>([
     { name: 'Foursome & Golf', price: 500, isTeam: true },
     { name: 'Individual Golfer', price: 125, isTeam: false },
     { name: 'Dinner Ticket Only', price: 50, isTeam: false }
  ]);
  const [showPackageForm, setShowPackageForm] = useState(false);
  const [newPackage, setNewPackage] = useState<{name: string, price: number, isTeam: boolean}>({ name: '', price: 0, isTeam: false });

  const [addons, setAddons] = useState<{name: string, price: number, type: 'per_player'|'per_team'|'flat', maxQuantity?: number}[]>([
     { name: 'Mulligan', price: 20, type: 'per_player', maxQuantity: 2 }
  ]);
  const [showAddonForm, setShowAddonForm] = useState(false);
  const [newAddon, setNewAddon] = useState<{name: string, price: number, type: 'per_player'|'per_team'|'flat', maxQuantity?: number}>({ name: '', price: 0, type: 'per_player' });

  const [themeColor, setThemeColor] = useState('#c9a84c');
  const [secondaryThemeColor, setSecondaryThemeColor] = useState('#1a2e1a');
  
  const [heroImage, setHeroImage] = useState<string | null>(null);
  const [heroPosition, setHeroPosition] = useState('center');
  const [heroZoom, setHeroZoom] = useState(100);
  const [tileImage, setTileImage] = useState<string | null>(null);
  const [tilePosition, setTilePosition] = useState('center');
  const [tileZoom, setTileZoom] = useState(100);
  
  const [coHostEmail, setCoHostEmail] = useState('');
  
  const [courseSearch, setCourseSearch] = useState('');
  const [courseResults, setCourseResults] = useState<any[]>([]);
  
  const [sponsors, setSponsors] = useState<{tier: string, price: number, spots: number, incentives: string[]}[]>([
     { tier: 'Title Sponsor', price: 5000, spots: 1, incentives: ['Primary Logo on all Hero branding', 'Foursome included', 'Speaking opportunity at dinner'] },
     { tier: 'Beverage Cart', price: 1500, spots: 2, incentives: ['Logo on beverage cart', 'Custom branded napkins'] }
  ]);
  const [showSponsorForm, setShowSponsorForm] = useState(false);
  const [editingSponsorIdx, setEditingSponsorIdx] = useState<number | null>(null);
  const [newSponsor, setNewSponsor] = useState<{tier: string, price: number, spots: number, incentivesText: string}>({ tier: '', price: 0, spots: 1, incentivesText: '' });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const p = new URLSearchParams(window.location.search);
      if (p.get('courseName')) {
         setCourse(p.get('courseName') || '');
         setCourseSearch(p.get('courseName') || '');
      }
      const ct = p.get('courseCity');
      const st = p.get('courseState');
      if (ct && st) setCity(`${ct}, ${st}`);
      else if (ct) setCity(ct);
    }
  }, []);

  useEffect(() => {
    if (courseSearch.length > 2 && courseSearch !== course) {
      const fetchCourses = async () => {
         try {
            const res = await fetch(`/api/courses/search?q=${encodeURIComponent(courseSearch)}`);
            if (res.ok) {
               const data = await res.json();
               setCourseResults(data.courses || []);
            }
         } catch (err) {}
      };
      const to = setTimeout(() => fetchCourses(), 300);
      return () => clearTimeout(to);
    } else {
      setCourseResults([]);
    }
  }, [courseSearch, course]);

  const selectCourse = (c: any) => {
     setCourse(c.name);
     setCourseSearch(c.name);
     setCity(`${c.city}, ${c.state || ''}`);
     setCourseResults([]);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, setter: (val: string) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setter(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const formatNames: Record<string, string> = {
    'scramble': '4-Man Scramble',
    '2scramble': '2-Man Scramble',
    'bestball': 'Best Ball',
    'stroke': 'Stroke Play',
    'match': 'Match Play',
    'stableford': 'Stableford'
  };

  const formatName = formatNames[selectedFormat] || selectedFormat;

  const fee = packages.length > 0 ? packages[0].price : 0;
  const stripeFee = fee > 0 ? (fee * 0.029 + 0.30) : 0;
  let totalFee = fee;
  let organizerRevenue = fee - stripeFee;

  if (passFees) {
    totalFee = fee + stripeFee;
    organizerRevenue = fee;
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
            <div className="wfield" style={{ position: 'relative' }}>
              <label>Host Course</label>
              <input type="text" value={courseSearch} onChange={e => { setCourseSearch(e.target.value); if (e.target.value === '') setCourse(''); }} placeholder="Type to search courses..." />
              {courseResults.length > 0 && (
                 <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: '#fff', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '8px', zIndex: 50, maxHeight: '200px', overflowY: 'auto', boxShadow: '0 10px 20px rgba(0,0,0,0.05)', marginTop: '0.2rem' }}>
                    {courseResults.map(c => (
                       <div key={c.id} onClick={() => selectCourse(c)} style={{ padding: '0.6rem 1rem', cursor: 'pointer', borderBottom: '1px solid rgba(0,0,0,0.05)', fontSize: '0.85rem' }}>
                          <strong>{c.name}</strong>
                          <div style={{ fontSize: '0.75rem', color: 'var(--mist)' }}>{c.city}, {c.state}</div>
                       </div>
                    ))}
                 </div>
              )}
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
               <div style={{ border: '1px solid rgba(0,0,0,0.1)', borderRadius: '8px', overflow: 'hidden', transition: 'border-color 0.2s', background: '#fff' }}>
                 <div style={{ background: '#f4f7f5', borderBottom: '1px solid rgba(0,0,0,0.1)', padding: '0.4rem 0.6rem', display: 'flex', gap: '0.3rem', alignItems: 'center' }}>
                    <button type="button" style={{ background: 'none', border: 'none', fontWeight: 'bold', cursor: 'pointer', padding: '0.3rem 0.6rem', borderRadius: '4px', color: 'var(--ink)' }}>B</button>
                    <button type="button" style={{ background: 'none', border: 'none', fontStyle: 'italic', cursor: 'pointer', padding: '0.3rem 0.6rem', borderRadius: '4px', color: 'var(--ink)' }}>I</button>
                    <button type="button" style={{ background: 'none', border: 'none', textDecoration: 'underline', cursor: 'pointer', padding: '0.3rem 0.6rem', borderRadius: '4px', color: 'var(--ink)' }}>U</button>
                    <div style={{ width: '1px', height: '16px', background: 'rgba(0,0,0,0.1)', margin: '0 0.3rem' }}></div>
                    <button type="button" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.3rem 0.6rem', borderRadius: '4px', fontSize: '0.85rem', color: 'var(--ink)' }}>🔗 Link</button>
                    <button type="button" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.3rem 0.6rem', borderRadius: '4px', fontSize: '0.85rem', color: 'var(--ink)', fontWeight: 600 }}>• Bullet List</button>
                 </div>
                 <textarea style={{ border: 'none', width: '100%', padding: '1rem', outline: 'none', resize: 'vertical', minHeight: '120px', fontFamily: 'inherit', fontSize: '0.9rem' }} rows={4} value={desc} onChange={e => setDesc(e.target.value)} placeholder="Tell players what makes this tournament special. For example, copy-paste a bulleted list of events or schedule information here..."></textarea>
               </div>
            </div>
            <div className="wfield wform-full">
               <label>Co-Host UserID (Optional)</label>
               <input type="email" value={coHostEmail} onChange={e => setCoHostEmail(e.target.value)} placeholder="e.g. josh@tourneylinks.com" />
               <div style={{ fontSize: '0.7rem', color: 'var(--mist)', marginTop: '0.2rem' }}>Grant another email address full Administration Hub access to this event.</div>
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
                    <input type="text" value={themeColor.toUpperCase()} onChange={e => { let v = e.target.value.toLowerCase(); if(!v.startsWith('#')) v='#'+v; if(v.length<=7) setThemeColor(v); }} style={{ fontSize: '0.8rem', fontFamily: 'monospace', color: 'var(--ink)', width: '85px', padding: '0.4rem 0.6rem', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '4px' }} />
                 </div>
              </div>
              <div className="wfield">
                 <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.4rem' }}>
                    <label style={{ margin: 0 }}>Secondary Theme Color</label>
                    <span title="Optional: Set to grayscale or blank to disable the dynamic accent gradient, resulting in a single dominant primary color vibe." style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '14px', height: '14px', borderRadius: '50%', background: 'rgba(0,0,0,0.1)', color: 'rgba(0,0,0,0.5)', fontSize: '0.6rem', cursor: 'help' }}>?</span>
                 </div>
                 <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <input type="color" value={secondaryThemeColor} onChange={e => setSecondaryThemeColor(e.target.value)} style={{ padding: 0, width: '40px', height: '40px', border: 'none', borderRadius: '4px', cursor: 'pointer' }} />
                    <input type="text" value={secondaryThemeColor.toUpperCase()} onChange={e => { let v = e.target.value.toLowerCase(); if(!v.startsWith('#')) v='#'+v; if(v.length<=7) setSecondaryThemeColor(v); }} style={{ fontSize: '0.8rem', fontFamily: 'monospace', color: 'var(--ink)', width: '85px', padding: '0.4rem 0.6rem', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '4px' }} />
                 </div>
              </div>
          </div>
          
          <div style={{ marginTop: '1.5rem', display: 'grid', gap: '1.5rem', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
             <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                   <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--mist)' }}>Hero Branding Image</span>
                   {heroImage && (
                     <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                         <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                            <span style={{ fontSize: '0.65rem', color: 'var(--mist)' }}>Zoom</span>
                            <input type="range" min="50" max="250" value={heroZoom} onChange={e => setHeroZoom(Number(e.target.value))} style={{ width: '50px' }} />
                         </div>
                         <select value={heroPosition} onChange={e => setHeroPosition(e.target.value)} style={{ padding: '0.2rem 0.5rem', fontSize: '0.7rem', borderRadius: '4px', border: '1px solid rgba(0,0,0,0.1)' }}>
                            <option value="top">Align Top</option>
                            <option value="center">Align Center</option>
                            <option value="bottom">Align Bottom</option>
                         </select>
                     </div>
                   )}
                </label>
                <label style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', border: '2px dashed rgba(0,0,0,0.1)', borderRadius: '8px', padding: '2rem', background: heroImage ? `linear-gradient(135deg, ${secondaryThemeColor}99, ${themeColor}99), url(${heroImage}) ${heroPosition}/${heroZoom}%` : '#fafaf5', backgroundRepeat: 'no-repeat', cursor: 'pointer', minHeight: '160px', position: 'relative' }}>
                   <input type="file" style={{ display: 'none' }} accept="image/*" onChange={e => handleImageUpload(e, setHeroImage)} />
                   {!heroImage && (
                     <>
                        <UploadCloud color="var(--mist)" size={32} style={{ marginBottom: '0.5rem' }} />
                        <span style={{ fontSize: '0.85rem', color: 'var(--forest)', fontWeight: 600 }}>Upload Hero Media</span>
                     </>
                   )}
                   {heroImage && <span style={{ color: '#fff', fontWeight: 600, zIndex: 10 }}>Change Hero</span>}
                </label>
             </div>
             
             <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                   <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--mist)' }}>Directory Tile Thumbnail</span>
                   {tileImage && (
                     <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                         <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                            <span style={{ fontSize: '0.65rem', color: 'var(--mist)' }}>Zoom</span>
                            <input type="range" min="50" max="250" value={tileZoom} onChange={e => setTileZoom(Number(e.target.value))} style={{ width: '50px' }} />
                         </div>
                         <select value={tilePosition} onChange={e => setTilePosition(e.target.value)} style={{ padding: '0.2rem 0.5rem', fontSize: '0.7rem', borderRadius: '4px', border: '1px solid rgba(0,0,0,0.1)' }}>
                            <option value="top">Align Top</option>
                            <option value="center">Align Center</option>
                            <option value="bottom">Align Bottom</option>
                         </select>
                     </div>
                   )}
                </label>
                <label style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', border: '2px dashed rgba(0,0,0,0.1)', borderRadius: '8px', padding: '2rem', background: tileImage ? `linear-gradient(135deg, ${secondaryThemeColor}99, ${themeColor}99), url(${tileImage}) ${tilePosition}/${tileZoom}%` : '#fafaf5', backgroundRepeat: 'no-repeat', cursor: 'pointer', minHeight: '160px', position: 'relative' }}>
                   <input type="file" style={{ display: 'none' }} accept="image/*" onChange={e => handleImageUpload(e, setTileImage)} />
                   {!tileImage && (
                     <>
                        <ImageIcon color="var(--mist)" size={32} style={{ marginBottom: '0.5rem' }} />
                        <span style={{ fontSize: '0.85rem', color: 'var(--forest)', fontWeight: 600 }}>Upload Tile Media</span>
                     </>
                   )}
                   {tileImage && <span style={{ color: '#fff', fontWeight: 600, zIndex: 10 }}>Change Tile</span>}
                </label>
                
                {/* Embedded Tile Preview */}
                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--mist)', marginTop: '0.5rem' }}>Search Page Preview</div>
                <div style={{ width: '100%', borderRadius: '8px', overflow: 'hidden', border: '1px solid rgba(0,0,0,0.1)', background: '#fff' }}>
                   <div style={{ height: '140px', background: tileImage ? `url(${tileImage}) ${tilePosition}/${tileZoom}% no-repeat` : '#fafaf5' }}></div>
                   <div style={{ padding: '0.75rem' }}>
                      <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--forest)' }}>{name || 'Tournament Title'}</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--mist)' }}>{course ? `${course} · ${city}` : 'Course Location'}</div>
                   </div>
                </div>
             </div>
          </div>
        </div>
     </div>
  );

  const renderFinanceTab = () => (
     <div className="builder-section fade-in">
        <div className="wizard-card" style={{ marginBottom: '2rem' }}>
           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div className="wizard-card-title" style={{ marginBottom: 0 }}>Registration Packages</div>
              <button onClick={() => setShowPackageForm(!showPackageForm)} className="btn-hero-outline" style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                 {showPackageForm ? 'Cancel' : <><Plus size={14} /> Mint Package</>}
              </button>
           </div>
           
           {showPackageForm && (
              <div style={{ padding: '1.5rem', background: '#f4f7f5', borderRadius: '8px', border: '1px dashed rgba(0,0,0,0.1)', marginBottom: '1.5rem' }}>
                 <div style={{ fontWeight: 700, color: 'var(--forest)', marginBottom: '1rem', fontSize: '0.9rem' }}>Create Custom Package</div>
                 <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                       <div style={{ flex: 2 }}>
                          <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--mist)', marginBottom: '0.3rem', display: 'block' }}>Package Name</label>
                          <input type="text" value={newPackage.name} onChange={e => setNewPackage({...newPackage, name: e.target.value})} placeholder="e.g. Foursome & Golf" style={{ width: '100%', padding: '0.6rem', borderRadius: '4px', border: '1px solid rgba(0,0,0,0.1)' }} />
                       </div>
                       <div style={{ flex: 1 }}>
                          <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--mist)', marginBottom: '0.3rem', display: 'block' }}>Price ($)</label>
                          <input type="number" value={newPackage.price} onChange={e => setNewPackage({...newPackage, price: Number(e.target.value)})} style={{ width: '100%', padding: '0.6rem', borderRadius: '4px', border: '1px solid rgba(0,0,0,0.1)' }} />
                       </div>
                    </div>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                       <input type="checkbox" checked={newPackage.isTeam} onChange={e => setNewPackage({...newPackage, isTeam: e.target.checked})} />
                       <span style={{ fontSize: '0.8rem', color: 'var(--ink)', fontWeight: 600 }}>This is a Foursome/Team Package (Scales natively to 4 players)</span>
                    </label>
                    <button 
                       onClick={() => {
                          if (newPackage.name && newPackage.price >= 0) {
                             setPackages([...packages, newPackage]);
                             setNewPackage({ name: '', price: 0, isTeam: false });
                             setShowPackageForm(false);
                          }
                       }}
                       style={{ padding: '0.8rem', background: 'var(--forest)', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 700, cursor: 'pointer' }}>
                       Save Package to Registration
                    </button>
                 </div>
              </div>
           )}

           {!showPackageForm && packages.length === 0 && (
              <div style={{ color: 'var(--mist)', fontSize: '0.8rem', marginBottom: '1.5rem', lineHeight: 1.5 }}>
                 Mint packages for users to purchase (e.g. Foursome & Golf, Individual Golfer, Dinner Only ticket).
              </div>
           )}
           
           <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {packages.map((p, i) => (
                 <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', border: '1px solid rgba(0,0,0,0.05)', borderRadius: '8px', background: '#f8faf9' }}>
                    <div>
                       <div style={{ fontWeight: 600, color: 'var(--forest)', fontSize: '0.95rem' }}>{p.name}</div>
                       <div style={{ fontSize: '0.75rem', color: 'var(--mist)', marginTop: '0.2rem' }}>
                          {p.isTeam ? 'Foursome / Team Registration' : 'Individual Registration'}
                       </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                       <span style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--grass)' }}>${p.price.toFixed(2)}</span>
                       <button onClick={() => {
                          setNewPackage(p);
                          setPackages(packages.filter((_, idx) => idx !== i));
                          setShowPackageForm(true);
                       }} style={{ background: 'none', border: 'none', color: 'var(--forest)', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600 }}>Edit</button>
                       <button onClick={() => setPackages(packages.filter((_, idx) => idx !== i))} style={{ background: 'none', border: 'none', color: '#e74c3c', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600 }}>Remove</button>
                    </div>
                 </div>
              ))}
           </div>
           
           {/* Revenue Tracker tied to the primary top-level package */}
           {packages.length > 0 && (
             <div className="pricing-box" style={{ background: '#f8faf9', padding: '1.25rem', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.05)', marginTop: '1.5rem' }}>
                <div className="pricing-row" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                   <span style={{ color: 'var(--mist)' }}>Primary Package fee ({packages[0].name})</span>
                   <strong>${fee.toFixed(2)}</strong>
                </div>
                <div className="pricing-row" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', fontSize: '0.9rem' }}>
                  <span style={{ color: 'var(--mist)' }}>
                     Credit Card Processing Fee <br/>
                     <span style={{ fontSize: '0.75rem' }}>{passFees ? '(Paid by Registrant)' : '(Deducted from Payout)'}</span>
                  </span>
                  <strong style={{ color: passFees ? 'var(--mist)' : '#e74c3c' }}>{passFees ? '' : '-'}${stripeFee.toFixed(2)}</strong>
                </div>
                
                <div className="notif-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '1rem 0', padding: '1rem', background: '#fff', borderRadius: '6px', border: '1px solid rgba(0,0,0,0.1)' }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--ink)' }}>Pass Fees to Registrant</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--mist)' }}>Automatically append standard CC processor costs to checkout.</div>
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
           )}
        </div>
        
        
        <div className="wizard-card" style={{ marginBottom: '2rem' }}>
           <div className="wizard-card-title">Prizes & Raffles</div>
           <div className="pro-tip-alert" style={{ background: '#fff3cd', border: '1px solid #ffeeba', borderRadius: '8px', padding: '1rem', marginBottom: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
               <div style={{ fontSize: '1.2rem' }}>⚠️</div>
               <div>
                  <strong style={{ color: '#856404', fontSize: '0.85rem', display: 'block', marginBottom: '0.2rem' }}>Legal & Tax Implications</strong>
                  <div style={{ color: '#856404', fontSize: '0.8rem', lineHeight: 1.5 }}>
                     Strict Stripe Terms of Service prohibit processing digital "Raffles" or games of chance unless your organization is a verified 501(c)(3) and explicitly whitelisted by Stripe. 
                     We strongly advise collecting cash/check at the door for raffles until you achieve whitelisted status.
                  </div>
               </div>
            </div>
            <div style={{ color: 'var(--mist)', fontSize: '0.85rem' }}>Prizes setup will unlock once you connect a verified 501(c)(3) taxonomy code.</div>
        </div>
        
        <div className="wizard-card">
           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div className="wizard-card-title" style={{ marginBottom: 0 }}>Add-ons & Extras</div>
              <button onClick={() => setShowAddonForm(!showAddonForm)} className="btn-hero-outline" style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                 {showAddonForm ? 'Cancel' : <><Plus size={14} /> Mint Add-on</>}
              </button>
           </div>
           
           {showAddonForm && (
              <div style={{ padding: '1.5rem', background: '#f4f7f5', borderRadius: '8px', border: '1px dashed rgba(0,0,0,0.1)', marginBottom: '1.5rem' }}>
                 <div style={{ fontWeight: 700, color: 'var(--forest)', marginBottom: '1rem', fontSize: '0.9rem' }}>Create Custom Add-on</div>
                 <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                       <div style={{ flex: 2 }}>
                          <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--mist)', marginBottom: '0.3rem', display: 'block' }}>Add-on Name</label>
                          <input type="text" value={newAddon.name} onChange={e => setNewAddon({...newAddon, name: e.target.value})} placeholder="e.g. Mulligan Package" style={{ width: '100%', padding: '0.6rem', borderRadius: '4px', border: '1px solid rgba(0,0,0,0.1)' }} />
                       </div>
                       <div style={{ flex: 1 }}>
                          <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--mist)', marginBottom: '0.3rem', display: 'block' }}>Price ($)</label>
                          <input type="number" value={newAddon.price} onChange={e => setNewAddon({...newAddon, price: Number(e.target.value)})} style={{ width: '100%', padding: '0.6rem', borderRadius: '4px', border: '1px solid rgba(0,0,0,0.1)' }} />
                       </div>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                       <div style={{ flex: 2 }}>
                          <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--mist)', marginBottom: '0.3rem', display: 'block' }}>Application Logic</label>
                          <select value={newAddon.type} onChange={e => setNewAddon({...newAddon, type: e.target.value as any})} style={{ width: '100%', padding: '0.6rem', borderRadius: '4px', border: '1px solid rgba(0,0,0,0.1)' }}>
                             <option value="per_player">Per Player (Scales with roster size)</option>
                             <option value="per_team">Per Foursome Team (Flat team addition)</option>
                             <option value="flat">Flat Purchase (e.g. 50/50 Raffle Tickets)</option>
                          </select>
                       </div>
                       <div style={{ flex: 1 }}>
                          <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--mist)', marginBottom: '0.3rem', display: 'block' }}>Max Qty (Optional)</label>
                          <input type="number" value={newAddon.maxQuantity || ''} onChange={e => setNewAddon({...newAddon, maxQuantity: e.target.value ? Number(e.target.value) : undefined})} placeholder="e.g. 2" style={{ width: '100%', padding: '0.6rem', borderRadius: '4px', border: '1px solid rgba(0,0,0,0.1)' }} />
                       </div>
                    </div>
                    <button 
                       onClick={() => {
                          if (newAddon.name && newAddon.price >= 0) {
                             setAddons([...addons, newAddon]);
                             setNewAddon({ name: '', price: 0, type: 'per_player', maxQuantity: undefined });
                             setShowAddonForm(false);
                          }
                       }}
                       style={{ padding: '0.8rem', background: 'var(--forest)', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 700, cursor: 'pointer' }}>
                       Save Add-on to Cart
                    </button>
                 </div>
              </div>
           )}

           {!showAddonForm && addons.length === 0 && (
              <div style={{ color: 'var(--mist)', fontSize: '0.8rem', marginBottom: '1.5rem', lineHeight: 1.5 }}>
                 Configure optional purchases (e.g., Mulligans, Skins, Raffle Tickets) that players can seamlessly add to their cart during checkout.
              </div>
           )}
           
           <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {addons.map((a, i) => (
                 <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', border: '1px solid rgba(0,0,0,0.05)', borderRadius: '8px', background: '#f8faf9' }}>
                    <div>
                       <div style={{ fontWeight: 600, color: 'var(--forest)', fontSize: '0.95rem' }}>
                          {a.name}
                          {a.maxQuantity ? <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--mist)', marginLeft: '0.5rem' }}>(Max {a.maxQuantity})</span> : null}
                       </div>
                       <div style={{ fontSize: '0.75rem', color: 'var(--mist)', marginTop: '0.2rem' }}>
                          {a.type === 'per_player' ? 'Applied Per Player' : a.type === 'per_team' ? 'Applied Per Team' : 'Flat Purchase Item'}
                       </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                       <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--ink)' }}>${a.price.toFixed(2)}</div>
                       <button onClick={() => setAddons(addons.filter((_, idx) => idx !== i))} style={{ background: 'none', border: 'none', color: '#ff5f56', fontSize: '0.8rem', cursor: 'pointer', fontWeight: 600 }}>Remove</button>
                    </div>
                 </div>
              ))}
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
              <button 
                 onClick={() => {
                    setShowSponsorForm(!showSponsorForm);
                    setEditingSponsorIdx(null);
                    setNewSponsor({ tier: '', price: 0, spots: 1, incentivesText: '' });
                 }} 
                 className="btn-hero-outline" style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                 {showSponsorForm && editingSponsorIdx === null ? 'Cancel' : <><Plus size={14} /> Mint Sponsor Tier</>}
              </button>
           </div>
           
           {showSponsorForm && (
              <div style={{ padding: '1.5rem', background: '#f4f7f5', borderRadius: '8px', border: '1px dashed rgba(0,0,0,0.1)', marginBottom: '1.5rem' }}>
                 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <div style={{ fontWeight: 700, color: 'var(--forest)', fontSize: '0.9rem' }}>
                       {editingSponsorIdx !== null ? 'Edit Sponsor Tier' : 'Create Custom Tier'}
                    </div>
                    {editingSponsorIdx !== null && (
                       <button onClick={() => { setShowSponsorForm(false); setEditingSponsorIdx(null); }} style={{ background: 'none', border: 'none', color: 'var(--mist)', cursor: 'pointer', fontSize: '0.8rem' }}>Cancel</button>
                    )}
                 </div>
                 
                 <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                       <div style={{ flex: 2 }}>
                          <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--mist)', marginBottom: '0.3rem', display: 'block' }}>Tier Name</label>
                          <input type="text" value={newSponsor.tier} onChange={e => setNewSponsor({...newSponsor, tier: e.target.value})} placeholder="e.g. Title Sponsor" style={{ width: '100%', padding: '0.6rem', borderRadius: '4px', border: '1px solid rgba(0,0,0,0.1)' }} />
                       </div>
                       <div style={{ flex: 1 }}>
                          <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--mist)', marginBottom: '0.3rem', display: 'block' }}>Price ($)</label>
                          <input type="number" value={newSponsor.price} onChange={e => setNewSponsor({...newSponsor, price: Number(e.target.value)})} style={{ width: '100%', padding: '0.6rem', borderRadius: '4px', border: '1px solid rgba(0,0,0,0.1)' }} />
                       </div>
                       <div style={{ flex: 1 }}>
                          <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--mist)', marginBottom: '0.3rem', display: 'block' }}>Inventory</label>
                          <input type="number" value={newSponsor.spots} onChange={e => setNewSponsor({...newSponsor, spots: Number(e.target.value)})} style={{ width: '100%', padding: '0.6rem', borderRadius: '4px', border: '1px solid rgba(0,0,0,0.1)' }} />
                       </div>
                    </div>
                    <div>
                       <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--mist)', marginBottom: '0.3rem', display: 'block' }}>Incentives & Perks (One per line)</label>
                       <textarea 
                          value={newSponsor.incentivesText}
                          onChange={e => setNewSponsor({...newSponsor, incentivesText: e.target.value})}
                          placeholder="e.g. Foursome Included&#10;Logo on all Golf Carts"
                          rows={3}
                          style={{ width: '100%', padding: '0.6rem', borderRadius: '4px', border: '1px solid rgba(0,0,0,0.1)', resize: 'vertical' }}
                       />
                       <div style={{ fontSize: '0.65rem', color: 'var(--mist)', marginTop: '0.3rem' }}>Hit enter to create a new bullet point for the sponsor.</div>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                       <button 
                          onClick={() => {
                             if (!newSponsor.tier || newSponsor.price < 0) return;
                             const incArray = newSponsor.incentivesText.split('\n').map(i => i.trim()).filter(i => i !== '');
                             const sponsorObj = { tier: newSponsor.tier, price: newSponsor.price, spots: newSponsor.spots, incentives: incArray };
                             
                             if (editingSponsorIdx !== null) {
                                const clone = [...sponsors];
                                clone[editingSponsorIdx] = sponsorObj;
                                setSponsors(clone);
                             } else {
                                setSponsors([...sponsors, sponsorObj]);
                             }
                             setShowSponsorForm(false);
                             setEditingSponsorIdx(null);
                             setNewSponsor({ tier: '', price: 0, spots: 1, incentivesText: '' });
                          }}
                          style={{ flex: 1, padding: '0.8rem', background: 'var(--forest)', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 700, cursor: 'pointer' }}>
                          {editingSponsorIdx !== null ? 'Save Changes' : 'Mint Tier'}
                       </button>
                    </div>
                 </div>
              </div>
           )}

           {!showSponsorForm && sponsors.length === 0 && (
              <div style={{ color: 'var(--mist)', fontSize: '0.8rem', marginBottom: '1.5rem', lineHeight: 1.5 }}>
                 Clearly list what each sponsor tier includes. Incentives like "Foursome Included" or "Logo on Signage" help drive higher commitment.
              </div>
           )}
           
           <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {sponsors.map((s, i) => (
                 <div key={i} style={{ display: 'flex', flexDirection: 'column', padding: '1rem', border: '1px solid rgba(0,0,0,0.05)', borderRadius: '8px', background: '#f8faf9', transition: '0.2s', ...(editingSponsorIdx === i ? { opacity: 0.5, pointerEvents: 'none' } : {}) }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: s.incentives && s.incentives.length > 0 ? '1px solid rgba(0,0,0,0.05)' : 'none', paddingBottom: s.incentives && s.incentives.length > 0 ? '0.75rem' : 0, marginBottom: s.incentives && s.incentives.length > 0 ? '0.75rem' : 0 }}>
                       <div>
                          <div style={{ fontWeight: 700, color: 'var(--forest)', fontSize: '0.95rem' }}>{s.tier} <span style={{ fontSize: '0.7rem', color: 'var(--mist)', fontWeight: 400, marginLeft: '0.5rem' }}>({s.spots} {s.spots === 1 ? 'spot' : 'spots'})</span></div>
                       </div>
                       <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                          <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--grass)' }}>${s.price}</div>
                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                             <button onClick={() => {
                                setEditingSponsorIdx(i);
                                setNewSponsor({ tier: s.tier, price: s.price, spots: s.spots, incentivesText: (s.incentives || []).join('\n') });
                                setShowSponsorForm(true);
                             }} style={{ background: 'none', border: 'none', color: '#3399FF', fontSize: '0.75rem', cursor: 'pointer', fontWeight: 600 }}>Edit</button>
                             <button onClick={() => setSponsors(sponsors.filter((_, idx) => idx !== i))} style={{ background: 'none', border: 'none', color: '#ff5f56', fontSize: '0.75rem', cursor: 'pointer', fontWeight: 600 }}>Remove</button>
                          </div>
                       </div>
                    </div>
                    {s.incentives && s.incentives.length > 0 && (
                       <div style={{ paddingLeft: '0.5rem' }}>
                          {s.incentives.map((inc, incIdx) => (
                             <div key={incIdx} style={{ fontSize: '0.75rem', color: 'var(--mist)', display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.4rem' }}>
                                <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'var(--gold)' }}></div>
                                {inc}
                             </div>
                          ))}
                       </div>
                    )}
                 </div>
              ))}
           </div>
        </div>
     </div>
  );

   const renderLaunchTab = () => (
     <div className="builder-section fade-in">
        <div className="wizard-card" style={{ marginBottom: '2rem' }}>
           <div className="wizard-card-title">Payouts & Treasury</div>
           <div style={{ color: 'var(--mist)', fontSize: '0.85rem', marginBottom: '1.5rem', lineHeight: 1.5 }}>
              Connect a validated Stripe account to enable automated payouts. Player entry fees and sponsor revenue will bypass TourneyLinks and flow directly into your connected treasury account.
           </div>
           
           <div style={{ background: '#f8faf9', padding: '1.5rem', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
             <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <DollarSign color="var(--forest)" size={24} />
                <div>
                   <div style={{ fontWeight: 700, color: 'var(--forest)' }}>Stripe Connect Identity</div>
                   <div style={{ fontSize: '0.75rem', color: 'var(--mist)' }}>Awaiting Boarding...</div>
                </div>
             </div>
             <StripeOnboardButton />
           </div>
        </div>

        <div className="wizard-card">
           <div className="wizard-card-title">Launch Protocol</div>
           <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '1rem' }}>
             <button className="btn-primary" style={{ flex: 1, padding: '1rem', background: 'var(--gold)', color: '#000', fontWeight: 700, border: 'none', borderRadius: '8px', boxShadow: '0 4px 15px rgba(212,175,55,0.4)' }}>
               Pay $99 to Publish 🚀
             </button>
             <button className="btn-hero-outline" style={{ flex: 1, padding: '1rem', borderRadius: '8px' }} onClick={() => alert('Saved to Drafts')}>
               Save as Draft
             </button>
           </div>
        </div>
     </div>
  );

  const renderDesktopSimulator = () => {
     if (activeTab === 'content' || activeTab === 'launch') {
        return (
           <div style={{ height: '450px', overflowY: 'auto', background: '#f8faf9', display: 'flex', flexDirection: 'column' }}>
              <div style={{ padding: '2rem', background: heroImage ? `linear-gradient(135deg, ${secondaryThemeColor}99, ${themeColor}99), url(${heroImage}) ${heroPosition}/${heroZoom}% no-repeat` : `linear-gradient(135deg, ${secondaryThemeColor}, ${themeColor})`, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', position: 'relative', textAlign: 'center' }}>
                 <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: `radial-gradient(circle at top right, ${themeColor} 0%, transparent 60%)`, opacity: 0.3, pointerEvents: 'none' }}></div>
                 <div style={{ position: 'relative', zIndex: 10 }}>
                    <span style={{ fontSize: '0.7rem', padding: '0.2rem 0.6rem', background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(4px)', color: '#fff', borderRadius: '4px', fontWeight: 700, marginBottom: '0.75rem', display: 'inline-block' }}>{formatName}</span>
                    <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '2.5rem', color: '#fff', margin: 0, lineHeight: 1.1, textShadow: '0 2px 8px rgba(0,0,0,0.4), 0 4px 20px rgba(0,0,0,0.2)' }}>
                       {name || 'Tournament Title'}
                    </h2>
                    <div style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.8)', marginTop: '0.75rem', display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
                       <span>📍 {course || 'Course TBD'}</span>
                       <span>·</span>
                       <span>{date ? new Date(date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' }) : 'Date TBD'}</span>
                    </div>
                 </div>
              </div>
              
              <div style={{ padding: '1.5rem', display: 'flex', gap: '1.5rem', flex: 1 }}>
                 <div style={{ flex: '1 1 60%' }}>
                    <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--forest)', marginBottom: '0.5rem' }}>About Event</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--mist)', lineHeight: 1.6, marginBottom: '1.5rem', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{desc || 'Tournament description will appear here...'}</div>

                    <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--ink)', marginBottom: '0.75rem' }}>Sponsors</div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                       {sponsors.map((s, idx) => (
                          <div key={idx} style={{ padding: '0.75rem', background: '#fff', borderRadius: '6px', border: '1px solid rgba(0,0,0,0.05)', textAlign: 'center' }}>
                             <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--mist)' }}>{s.tier}</div>
                             <div style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--grass)' }}>${s.price}</div>
                          </div>
                       ))}
                    </div>
                 </div>

                 <div style={{ flex: '0 0 200px' }}>
                     <div style={{ background: '#fff', padding: '1.25rem', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.08)', boxShadow: '0 4px 15px rgba(0,0,0,0.03)', textAlign: 'center', position: 'sticky', top: '10px' }}>
                        <div style={{ fontSize: '0.75rem', color: 'var(--mist)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Registration</div>
                        <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--forest)', margin: '0.5rem 0' }}>${totalFee.toFixed(2)}</div>
                        <button style={{ width: '100%', padding: '0.8rem', background: `linear-gradient(135deg, ${themeColor}, ${secondaryThemeColor})`, color: '#fff', fontWeight: 700, border: `1px solid ${secondaryThemeColor}40`, borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem', boxShadow: `0 8px 20px ${themeColor}40`, transition: '0.2s' }}>Register Now</button>
                     </div>
                  </div>
              </div>
           </div>
        );
     }
     if (activeTab === 'finance') {
        const entryFeeSubtotal = fee;
        const totalAddon = addons.reduce((acc, a) => acc + a.price, 0);
        const totalProcessing = passFees ? (stripeFee * 4) : 0;
        const totalDue = entryFeeSubtotal + totalAddon + totalProcessing;

        return (
           <div style={{ height: '450px', overflowY: 'auto', background: '#f8faf9', display: 'flex', justifyContent: 'center', alignItems: 'flex-start', padding: '3rem 2rem' }}>
             <div style={{ width: '100%', maxWidth: '400px', background: '#fff', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.08)', boxShadow: '0 10px 40px rgba(0,0,0,0.05)', padding: '2rem' }}>
                <h3 style={{ margin: '0 0 0.5rem 0', fontFamily: 'Playfair Display, serif', fontSize: '1.5rem', color: 'var(--forest)' }}>Registration</h3>
                <div style={{ fontSize: '0.8rem', color: 'var(--mist)', marginBottom: '1.5rem' }}>{name || 'Tournament Title'}</div>

                <div style={{ borderTop: '1px solid rgba(0,0,0,0.05)', borderBottom: '1px solid rgba(0,0,0,0.05)', padding: '1.5rem 0', marginBottom: '1.5rem' }}>
                   <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', fontSize: '0.9rem' }}>
                      <span style={{ fontWeight: 600, color: 'var(--ink)' }}>Foursome Entry Fee</span>
                      <span style={{ fontWeight: 700, color: 'var(--ink)' }}>${entryFeeSubtotal.toFixed(2)}</span>
                   </div>
                   {addons.map((a, i) => (
                       <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', fontSize: '0.85rem' }}>
                          <span style={{ color: 'var(--mist)' }}>+ {a.name}</span>
                          <span style={{ fontWeight: 600, color: 'var(--mist)' }}>${a.price.toFixed(2)}</span>
                       </div>
                   ))}
                   {passFees && (
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', fontSize: '0.85rem' }}>
                         <span style={{ color: 'var(--mist)' }}>+ Platform & Tax</span>
                         <span style={{ fontWeight: 600, color: 'var(--mist)' }}>${(stripeFee * 4).toFixed(2)}</span>
                      </div>
                   )}
                   <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(0,0,0,0.05)' }}>
                      <span style={{ fontWeight: 800, color: 'var(--forest)', fontSize: '1.1rem' }}>Total Due</span>
                      <span style={{ fontWeight: 800, color: 'var(--forest)', fontSize: '1.1rem' }}>${totalDue.toFixed(2)}</span>
                   </div>
                   <div style={{ background: '#f4f7f5', padding: '0.8rem', borderRadius: '6px', marginTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--forest)' }}>💳 Universal Split Cart (BNPL / Team Link)</span>
                      <label className="toggle-switch" style={{ transform: 'scale(0.8)' }}>
                        <input type="checkbox" checked={false} readOnly />
                        <span className="toggle-slider"></span>
                      </label>
                   </div>
                   <div style={{ textAlign: 'right', fontSize: '0.7rem', color: 'var(--mist)', marginTop: '0.3rem', lineHeight: 1.4 }}>
                      Stripe Affirm/Klarna native percent splits.<br/>
                      Or generate a secure Link to text buddies!
                   </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                   <button style={{ width: '100%', padding: '0.9rem', background: '#000', color: '#fff', fontWeight: 700, border: 'none', borderRadius: '8px', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center' }}> Apple Pay</button>
                   <button style={{ width: '100%', padding: '0.9rem', background: '#0070ba', color: '#fff', fontWeight: 700, border: 'none', borderRadius: '8px', cursor: 'pointer' }}>PayPal</button>
                   <button style={{ width: '100%', padding: '0.9rem', background: '#fff', color: '#3399FF', fontWeight: 800, border: '2px solid #3399FF', borderRadius: '8px', cursor: 'pointer', fontStyle: 'italic' }}>venmo</button>
                   <button style={{ width: '100%', padding: '0.9rem', background: 'transparent', color: 'var(--forest)', fontWeight: 600, border: '1px solid rgba(0,0,0,0.1)', borderRadius: '8px', cursor: 'pointer', marginTop: '0.5rem', fontSize: '0.8rem' }}>Commit & Pay at Course (Cash/Check)</button>
                </div>
             </div>
          </div>
        );
     }
     if (activeTab === 'sponsorships') {
        const topSponsor = sponsors.length > 0 ? sponsors[0] : { tier: 'Title Sponsor', price: 5000, spots: 1, incentives: [] };
        // ACH is generally ~0.8% with a $5 cap. Let's accurately mock that calculation.
        const achFee = Math.min(topSponsor.price * 0.008, 5.00);

        return (
           <div style={{ height: '450px', overflowY: 'auto', background: '#f8faf9', display: 'flex', justifyContent: 'center', alignItems: 'flex-start', padding: '3rem 2rem' }}>
             <div style={{ width: '100%', maxWidth: '450px', background: '#fff', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.08)', boxShadow: '0 10px 40px rgba(0,0,0,0.05)', padding: '2rem' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--gold)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Secure Checkout</div>
                <h3 style={{ margin: '0 0 0.5rem 0', fontFamily: 'Playfair Display, serif', fontSize: '1.5rem', color: 'var(--forest)' }}>{topSponsor.tier}</h3>
                <div style={{ fontSize: '0.85rem', color: 'var(--mist)', marginBottom: '1.5rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                   <span>{topSponsor.spots} remaining</span>
                   {topSponsor.incentives && topSponsor.incentives.length > 0 && <span style={{ color: 'var(--forest)', background: 'rgba(46, 204, 113, 0.1)', padding: '0.1rem 0.4rem', borderRadius: '4px', fontSize: '0.7rem' }}>Includes Perks</span>}
                </div>

                <div style={{ borderTop: '1px solid rgba(0,0,0,0.05)', borderBottom: '1px solid rgba(0,0,0,0.05)', padding: '1.5rem 0', marginBottom: '1.5rem' }}>
                   <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', fontSize: '0.9rem' }}>
                      <span style={{ fontWeight: 600, color: 'var(--ink)' }}>Sponsorship Tier</span>
                      <span style={{ fontWeight: 700, color: 'var(--ink)' }}>${topSponsor.price.toFixed(2)}</span>
                   </div>
                   
                   <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', fontSize: '0.85rem' }}>
                      <span style={{ color: 'var(--mist)' }}>+ Bank Transfer (ACH - capped at $5)</span>
                      <span style={{ fontWeight: 600, color: 'var(--mist)' }}>${achFee.toFixed(2)}</span>
                   </div>
                   
                   <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(0,0,0,0.05)' }}>
                      <span style={{ fontWeight: 800, color: 'var(--forest)', fontSize: '1.1rem' }}>Total Due</span>
                      <span style={{ fontWeight: 800, color: 'var(--forest)', fontSize: '1.1rem' }}>${(topSponsor.price + achFee).toFixed(2)}</span>
                   </div>
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                   <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--ink)', marginBottom: '0.5rem' }}>Participant Intent</div>
                   <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      <button style={{ flex: 1, minWidth: '120px', padding: '0.6rem', border: '2px solid var(--forest)', background: 'var(--forest)', color: '#fff', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600 }}>Sponsor Only</button>
                      <button style={{ flex: 1, minWidth: '120px', padding: '0.6rem', border: '1px solid rgba(0,0,0,0.1)', background: '#fff', color: 'var(--mist)', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600 }}>Play & Sponsor</button>
                      <button style={{ flex: 1, minWidth: '120px', padding: '0.6rem', border: '1px solid rgba(0,0,0,0.1)', background: '#fff', color: 'var(--mist)', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600 }}>Sponsor & Dinner</button>
                   </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                   <button style={{ width: '100%', padding: '0.9rem', background: '#e0ece0', color: 'var(--forest)', fontWeight: 700, border: 'none', borderRadius: '8px', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>Connect Bank (ACH)</button>
                   <button style={{ width: '100%', padding: '0.9rem', background: '#000', color: '#fff', fontWeight: 700, border: 'none', borderRadius: '8px', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>Pay With Credit Card</button>
                </div>
                
                <div style={{ textAlign: 'center', fontSize: '0.65rem', color: 'var(--mist)', marginTop: '1rem' }}>
                   Credit card incurs standard 2.9% + 30¢ processing fee (${(topSponsor.price * 0.029 + 0.3).toFixed(2)}). ACH processing is recommended.
                </div>
             </div>
          </div>
        );
     }
     
     return null;
  };

  const renderMobileSimulator = () => {
     if (activeTab === 'content' || activeTab === 'launch') {
        return (
           <div style={{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch', position: 'relative' }}>
              <div style={{ height: '300px', background: heroImage ? `linear-gradient(135deg, ${secondaryThemeColor}99, ${themeColor}99), url(${heroImage}) ${heroPosition}/${heroZoom}% no-repeat` : `linear-gradient(135deg, ${secondaryThemeColor}, ${themeColor})`, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '1.5rem', position: 'relative' }}>
                 <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: `radial-gradient(circle at top right, ${themeColor} 0%, transparent 60%)`, opacity: 0.3, pointerEvents: 'none' }}></div>
                 
                 <div style={{ position: 'relative', zIndex: 10 }}>
                    <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '0.5rem' }}>
                       <span style={{ fontSize: '0.65rem', padding: '0.2rem 0.5rem', background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(4px)', color: '#fff', borderRadius: '4px', fontWeight: 700 }}>{formatName}</span>
                    </div>
                    <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.8rem', color: '#fff', margin: 0, lineHeight: 1.1, textShadow: '0 2px 8px rgba(0,0,0,0.4), 0 4px 20px rgba(0,0,0,0.2)' }}>
                       {name || 'Tournament Title'}
                    </h2>
                    <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.8)', marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                       📍 {course ? `${course} ${city ? `· ${city}` : ''}` : 'Course TBD'}
                    </div>
                 </div>
              </div>

              <div style={{ padding: '1.5rem', background: '#fff' }}>
                 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', paddingBottom: '1.5rem', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                    <div>
                       <div style={{ fontSize: '0.7rem', color: 'var(--mist)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.2rem' }}>Entry Fee</div>
                       <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--forest)' }}>${totalFee.toFixed(2)}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                       <div style={{ fontSize: '0.7rem', color: 'var(--mist)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.2rem' }}>Date</div>
                       <div style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--ink)', fontFamily: 'DM Mono, monospace' }}>
                          {date ? new Date(date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' }) : 'TBD'}
                       </div>
                    </div>
                 </div>

                 {desc && (
                    <div style={{ marginBottom: '1.5rem' }}>
                       <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--ink)', marginBottom: '0.5rem' }}>About Event</div>
                       <div style={{ fontSize: '0.85rem', color: 'var(--mist)', lineHeight: 1.6, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{desc}</div>
                    </div>
                 )}

                 <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--ink)', marginBottom: '0.75rem', marginTop: '1.5rem' }}>Live Sponsors</div>
                 <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem' }}>
                    {sponsors.map((s, idx) => (
                       <div key={idx} style={{ padding: '1rem', background: '#f8faf9', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--forest)' }}>{s.tier}</span>
                          <span style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--grass)' }}>${s.price}</span>
                       </div>
                    ))}
                 </div>

                 {packages.length > 0 && (
                    <div style={{ marginTop: '1.5rem' }}>
                       <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--ink)', marginBottom: '0.75rem' }}>Registration Packages</div>
                       <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                          {packages.map((p, idx) => (
                             <div key={idx} style={{ padding: '1rem', background: '#f4f7f5', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--ink)' }}>{p.name}</span>
                                <span style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--ink)' }}>${p.price}</span>
                             </div>
                          ))}
                       </div>
                    </div>
                 )}
              </div>

              <div style={{ position: 'sticky', bottom: 0, background: '#fff', padding: '1rem', borderTop: '1px solid rgba(0,0,0,0.05)', display: 'flex', justifyContent: 'center', zIndex: 50 }}>
                 <button style={{ width: '100%', padding: '0.9rem', background: `linear-gradient(135deg, ${themeColor}, ${secondaryThemeColor})`, color: '#fff', fontWeight: 700, border: `1px solid ${secondaryThemeColor}40`, borderRadius: '12px', boxShadow: `0 8px 20px ${themeColor}40` }}>
                    Register Now
                 </button>
              </div>
           </div>
        );
     }
     if (activeTab === 'finance') {
        const entryFeeSubtotal = fee;
        const totalAddon = addons.reduce((acc, a) => acc + a.price, 0);
        const totalProcessing = passFees ? (stripeFee * 4) : 0;
        const totalDue = entryFeeSubtotal + totalAddon + totalProcessing;
        
        return (
           <div style={{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch', position: 'relative', background: '#f8faf9', padding: '1.5rem' }}>
             <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.08)', boxShadow: '0 10px 40px rgba(0,0,0,0.05)', padding: '1.5rem' }}>
                <h3 style={{ margin: '0 0 0.5rem 0', fontFamily: 'Playfair Display, serif', fontSize: '1.4rem', color: 'var(--forest)' }}>Registration</h3>
                <div style={{ fontSize: '0.75rem', color: 'var(--mist)', marginBottom: '1.5rem' }}>{name || 'Tournament Title'}</div>

                <div style={{ borderTop: '1px solid rgba(0,0,0,0.05)', borderBottom: '1px solid rgba(0,0,0,0.05)', padding: '1.5rem 0', marginBottom: '1.5rem' }}>
                   <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', fontSize: '0.85rem' }}>
                      <span style={{ fontWeight: 600, color: 'var(--ink)' }}>Foursome Entry Fee</span>
                      <span style={{ fontWeight: 700, color: 'var(--ink)' }}>${entryFeeSubtotal.toFixed(2)}</span>
                   </div>
                   {addons.map((a, i) => (
                       <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', fontSize: '0.8rem' }}>
                          <span style={{ color: 'var(--mist)' }}>+ {a.name}</span>
                          <span style={{ fontWeight: 600, color: 'var(--mist)' }}>${a.price.toFixed(2)}</span>
                       </div>
                   ))}
                   {passFees && (
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', fontSize: '0.8rem' }}>
                         <span style={{ color: 'var(--mist)' }}>+ Platform & Tax</span>
                         <span style={{ fontWeight: 600, color: 'var(--mist)' }}>${(stripeFee * 4).toFixed(2)}</span>
                      </div>
                   )}
                   <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(0,0,0,0.05)' }}>
                      <span style={{ fontWeight: 800, color: 'var(--forest)', fontSize: '1.1rem' }}>Total Due</span>
                      <span style={{ fontWeight: 800, color: 'var(--forest)', fontSize: '1.1rem' }}>${totalDue.toFixed(2)}</span>
                   </div>
                   <div style={{ background: '#f4f7f5', padding: '0.8rem', borderRadius: '6px', marginTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--forest)' }}>💳 Universal Split Cart (BNPL / Team Link)</span>
                      <label className="toggle-switch" style={{ transform: 'scale(0.8)' }}>
                        <input type="checkbox" checked={false} readOnly />
                        <span className="toggle-slider"></span>
                      </label>
                   </div>
                   <div style={{ textAlign: 'right', fontSize: '0.7rem', color: 'var(--mist)', marginTop: '0.3rem', lineHeight: 1.4 }}>
                      Stripe Affirm/Klarna native percent splits.<br/>
                      Or generate a secure Link to text buddies!
                   </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                   <button style={{ width: '100%', padding: '0.9rem', background: '#000', color: '#fff', fontWeight: 700, border: 'none', borderRadius: '8px', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center' }}> Apple Pay</button>
                   <button style={{ width: '100%', padding: '0.9rem', background: '#0070ba', color: '#fff', fontWeight: 700, border: 'none', borderRadius: '8px', cursor: 'pointer' }}>PayPal</button>
                   <button style={{ width: '100%', padding: '0.9rem', background: '#fff', color: '#3399FF', fontWeight: 800, border: '2px solid #3399FF', borderRadius: '8px', cursor: 'pointer', fontStyle: 'italic' }}>venmo</button>
                   <button style={{ width: '100%', padding: '0.9rem', background: 'transparent', color: 'var(--forest)', fontWeight: 600, border: '1px solid rgba(0,0,0,0.1)', borderRadius: '8px', cursor: 'pointer', marginTop: '0.5rem', fontSize: '0.8rem' }}>Pay at Course (Cash/Check)</button>
                </div>
             </div>
          </div>
        );
     }
     
     if (activeTab === 'sponsorships') {
        const topSponsor = sponsors.length > 0 ? sponsors[0] : { tier: 'Title Sponsor', price: 5000, spots: 1, incentives: [] };
        const achFee = Math.min(topSponsor.price * 0.008, 5.00);

        return (
           <div style={{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch', position: 'relative', background: '#f8faf9', padding: '1.5rem' }}>
             <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.08)', boxShadow: '0 10px 40px rgba(0,0,0,0.05)', padding: '1.5rem' }}>
                <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--gold)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Secure Checkout</div>
                <h3 style={{ margin: '0 0 0.5rem 0', fontFamily: 'Playfair Display, serif', fontSize: '1.3rem', color: 'var(--forest)' }}>{topSponsor.tier}</h3>
                <div style={{ fontSize: '0.8rem', color: 'var(--mist)', marginBottom: '1.5rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                   <span>{topSponsor.spots} remaining</span>
                   {topSponsor.incentives && topSponsor.incentives.length > 0 && <span style={{ color: 'var(--forest)', background: 'rgba(46, 204, 113, 0.1)', padding: '0.1rem 0.4rem', borderRadius: '4px', fontSize: '0.65rem' }}>Includes Perks</span>}
                </div>

                <div style={{ borderTop: '1px solid rgba(0,0,0,0.05)', borderBottom: '1px solid rgba(0,0,0,0.05)', padding: '1.5rem 0', marginBottom: '1.5rem' }}>
                   <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', fontSize: '0.85rem' }}>
                      <span style={{ fontWeight: 600, color: 'var(--ink)' }}>Sponsorship Tier</span>
                      <span style={{ fontWeight: 700, color: 'var(--ink)' }}>${topSponsor.price.toFixed(2)}</span>
                   </div>
                   
                   <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', fontSize: '0.8rem' }}>
                      <span style={{ color: 'var(--mist)' }}>+ Bank Transfer (ACH - capped at $5)</span>
                      <span style={{ fontWeight: 600, color: 'var(--mist)' }}>${achFee.toFixed(2)}</span>
                   </div>
                   
                   <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(0,0,0,0.05)' }}>
                      <span style={{ fontWeight: 800, color: 'var(--forest)', fontSize: '1.05rem' }}>Total Due</span>
                      <span style={{ fontWeight: 800, color: 'var(--forest)', fontSize: '1.05rem' }}>${(topSponsor.price + achFee).toFixed(2)}</span>
                   </div>
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                   <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--ink)', marginBottom: '0.5rem' }}>Participant Intent</div>
                   <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      <button style={{ flex: 1, minWidth: '100px', padding: '0.5rem', border: '2px solid var(--forest)', background: 'var(--forest)', color: '#fff', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 600 }}>Sponsor Only</button>
                      <button style={{ flex: 1, minWidth: '100px', padding: '0.5rem', border: '1px solid rgba(0,0,0,0.1)', background: '#fff', color: 'var(--mist)', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 600 }}>Play & Sponsor</button>
                      <button style={{ flex: 1, minWidth: '100px', padding: '0.5rem', border: '1px solid rgba(0,0,0,0.1)', background: '#fff', color: 'var(--mist)', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 600 }}>Sponsor & Dinner</button>
                   </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                   <button style={{ width: '100%', padding: '0.8rem', background: '#e0ece0', color: 'var(--forest)', fontWeight: 700, border: 'none', borderRadius: '8px', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>Connect Bank (ACH)</button>
                   <button style={{ width: '100%', padding: '0.8rem', background: '#000', color: '#fff', fontWeight: 700, border: 'none', borderRadius: '8px', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>Pay With Credit Card</button>
                </div>
                
                <div style={{ textAlign: 'center', fontSize: '0.65rem', color: 'var(--mist)', marginTop: '1rem' }}>
                   Credit card incurs standard processing fee (${(topSponsor.price * 0.029 + 0.3).toFixed(2)}). ACH processing is recommended.
                </div>
             </div>
          </div>
        );
     }
     
     return null;
  };

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
       <div style={{ maxWidth: '1600px', margin: '2rem auto 0 auto', padding: '0 2rem', display: 'flex', flexWrap: 'wrap', gap: '3rem' }}>
          
          {/* EDITOR COLUMN (Left) */}
          <div style={{ flex: '1 1 600px', display: 'flex', flexDirection: 'column' }}>
             
             {/* 4-State Tab Nav */}
             <div style={{ display: 'flex', gap: '0.2rem', background: '#fff', padding: '0.3rem', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.05)', marginBottom: '2rem', boxShadow: '0 4px 15px rgba(0,0,0,0.02)' }}>
                <button 
                  onClick={() => setActiveTab('content')}
                  style={{ flex: 1, padding: '0.6rem 0.2rem', background: activeTab === 'content' ? 'var(--forest)' : 'transparent', color: activeTab === 'content' ? '#fff' : 'var(--mist)', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: '0.2s' }}>
                   1. Campaign Setup
                </button>
                <button 
                  onClick={() => setActiveTab('finance')}
                  style={{ flex: 1, padding: '0.6rem 0.2rem', background: activeTab === 'finance' ? 'var(--forest)' : 'transparent', color: activeTab === 'finance' ? '#fff' : 'var(--mist)', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: '0.2s' }}>
                   2. Financials
                </button>
                <button 
                  onClick={() => setActiveTab('sponsorships')}
                  style={{ flex: 1, padding: '0.6rem 0.2rem', background: activeTab === 'sponsorships' ? 'var(--forest)' : 'transparent', color: activeTab === 'sponsorships' ? '#fff' : 'var(--mist)', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: '0.2s' }}>
                   3. Sponsorships
                </button>
                <button 
                  onClick={() => setActiveTab('launch')}
                  style={{ flex: 1, padding: '0.6rem 0.2rem', background: activeTab === 'launch' ? 'var(--gold)' : 'transparent', color: activeTab === 'launch' ? '#000' : 'var(--mist)', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 700, fontSize: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: '0.2s' }}>
                   4. Launch & Stripe
                </button>
             </div>

             {/* Tab Render */}
             {activeTab === 'content' && renderContentTab()}
             {activeTab === 'finance' && renderFinanceTab()}
             {activeTab === 'sponsorships' && renderSponsorTab()}
             {activeTab === 'launch' && renderLaunchTab()}

          </div>

          {/* SIMULATOR COLUMN (Right) */}
          <div style={{ flex: '1 1 500px', display: 'flex', flexDirection: 'column' }}>
             
             {/* Sticky Wrapper */}
             <div style={{ position: 'sticky', top: '100px', width: '100%', height: 'calc(100vh - 120px)', overflowY: 'auto', paddingRight: '1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3rem', paddingBottom: '3rem' }}>
                
                {/* DESKTOP BROWSER ENVELOPE */}
                <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                   <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--mist)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Smartphone size={14} /> Desktop Browser Preview
                   </div>
                   <div style={{ width: '100%', background: '#fff', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.1)', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.08)' }}>
                      <div style={{ background: '#f4f7f5', borderBottom: '1px solid rgba(0,0,0,0.05)', padding: '0.6rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                         <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ff5f56' }} />
                         <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ffbd2e' }} />
                         <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#27c93f' }} />
                         <div style={{ marginLeft: '1rem', background: '#fff', padding: '0.2rem 1rem', borderRadius: '4px', fontSize: '0.7rem', color: 'var(--mist)', flex: 1, border: '1px solid rgba(0,0,0,0.05)' }}>demo.tourneylinks.com/tournaments/live</div>
                      </div>
                      
                      {/* Desktop Canvas */}
                      {renderDesktopSimulator()}
                   </div>
                </div>

                {/* iPhone Frame Envelope */}
                <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                   <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--mist)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Smartphone size={14} /> Mobile Simulator
                   </div>
                   <div style={{
                      width: '375px', // Fixed iPhone width
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
                      {renderMobileSimulator()}
                   </div>
                </div>

             </div>
          </div>

       </div>
    </div>
  );
}
