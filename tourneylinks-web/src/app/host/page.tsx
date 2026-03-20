'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import StripeOnboardButton from './onboarding/StripeOnboardButton';

export default function HostWizard() {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedFormat, setSelectedFormat] = useState('scramble');
  const [selectedVis, setSelectedVis] = useState('private');

  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [course, setCourse] = useState('');
  const [city, setCity] = useState('');
  const [desc, setDesc] = useState('');

  // Hydrate form from incoming Directory URL parameters
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
  const [price, setPrice] = useState(125);
  const [maxPlayers, setMaxPlayers] = useState(80);
  const [holes, setHoles] = useState('18 Holes');
  const [org, setOrg] = useState('');
  const [email, setEmail] = useState('');
  const [passFees, setPassFees] = useState(false);

  const [themeColor, setThemeColor] = useState('#c9a84c');
  const [secondaryThemeColor, setSecondaryThemeColor] = useState('#1a2e1a');

  const [rules, setRules] = useState([
    "All players must have a verified USGA Handicap Index.",
    "Each player must contribute at least 4 drives during the round."
  ]);

  const addRule = () => setRules([...rules, ""]);
  const updateRule = (index: number, val: string) => {
    const newRules = [...rules];
    newRules[index] = val;
    setRules(newRules);
  };
  const removeRule = (index: number) => {
    setRules(rules.filter((_, i) => i !== index));
  };

  const formatNames: Record<string, string> = {
    'scramble': '4-Man Scramble',
    '2scramble': '2-Man Scramble',
    'bestball': 'Best Ball',
    'stroke': 'Stroke Play',
    'match': 'Match Play',
    'stableford': 'Stableford'
  };

  const handleNext = () => setCurrentStep(prev => Math.min(prev + 1, 6));
  const handleBack = () => setCurrentStep(prev => Math.max(prev - 1, 1));
  const goToStep = (step: number) => setCurrentStep(step);

  const formatName = formatNames[selectedFormat] || selectedFormat;

  const fee = price || 0;
  const stripeFee = fee > 0 ? (fee * 0.029 + 0.30) : 0;
  
  let totalFee = fee;
  let organizerRevenue = fee - stripeFee;

  if (passFees) {
    totalFee = fee + stripeFee;
    organizerRevenue = fee;
  }

  const renderStepNav = () => (
    <div className="wizard-steps">
      {[1,2,3,4,5,6].map((step, index) => (
        <React.Fragment key={step}>
          <div className={`wstep ${currentStep === step ? 'active' : ''} ${currentStep > step ? 'done' : ''}`} onClick={() => goToStep(step)}>
            <div className="wstep-circle">{step}</div>
            <div className="wstep-label">
              {step === 1 && 'Basics'}
              {step === 2 && 'Format'}
              {step === 3 && 'Pricing'}
              {step === 4 && 'Branding'}
              {step === 5 && 'Visibility'}
              {step === 6 && 'Review'}
            </div>
          </div>
          {index < 5 && <div className={`wstep-line ${currentStep > step ? 'done' : ''}`}></div>}
        </React.Fragment>
      ))}
    </div>
  );

  return (
    <div className="page-wrapper" style={{ minHeight: '100vh', background: 'var(--white)', paddingBottom: '4rem' }}>
      <div className="wizard-wrap">
        <div className="wizard-header">
          <div className="section-eyebrow" style={{ justifyContent: 'center' }}>Tournament Setup Wizard</div>
          <div className="section-title">Create Your Tournament</div>
          <div style={{ fontSize: '0.95rem', color: 'var(--mist)', marginTop: '0.5rem' }}>
            Complete in 5 steps · Takes about 10 minutes
          </div>
        </div>

        {renderStepNav()}

        {/* STEP 1 */}
        <div className={`wizard-panel ${currentStep === 1 ? 'active' : ''}`}>
          <div className="wizard-card">
            <div className="wizard-card-title">Tournament Details</div>
            <div className="wizard-card-sub">Tell us the basics about your event</div>
            <div className="wform-grid">
              <div className="wfield wform-full">
                <label>Tournament Name *</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Oak Hill Classic Invitational" />
              </div>
              <div className="wfield">
                <label>Start Date *</label>
                <input type="date" value={date} onChange={e => setDate(e.target.value)} />
              </div>
              <div className="wfield">
                <label>End Date</label>
                <input type="date" />
              </div>
              <div className="wfield">
                <label>Shotgun / Tee Time Start</label>
                <input type="time" defaultValue="08:00" />
              </div>
              <div className="wfield">
                <label>Check-in Opens</label>
                <input type="time" defaultValue="07:00" />
              </div>
            </div>
          </div>

          <div className="wizard-card">
            <div className="wizard-card-title">Course Selection</div>
            <div className="wizard-card-sub">Choose from our database or enter a course manually</div>
            <div className="wform-grid">
              <div className="wfield">
                <label>Enter Course Name</label>
                <input type="text" value={course} onChange={e => setCourse(e.target.value)} placeholder="Full course name" />
              </div>
              <div className="wfield">
                <label>Course City & State</label>
                <input type="text" value={city} onChange={e => setCity(e.target.value)} placeholder="e.g. Victor, NY" />
              </div>
              <div className="wfield">
                <label>Number of Holes</label>
                <select value={holes} onChange={e => setHoles(e.target.value)}>
                  <option>18 Holes</option>
                  <option>36 Holes</option>
                  <option>9 Holes</option>
                </select>
              </div>
            </div>
          </div>

          <div className="wizard-card">
            <div className="wizard-card-title">Organizer Info</div>
            <div className="wizard-card-sub">Who is running this event?</div>
            <div className="wform-grid">
              <div className="wfield">
                <label>Organization / Club Name</label>
                <input type="text" value={org} onChange={e => setOrg(e.target.value)} placeholder="e.g. Victor Golf Club" />
              </div>
              <div className="wfield">
                <label>Contact Email</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@email.com" />
              </div>
              <div className="wfield wform-full">
                <label>Tournament Description</label>
                <textarea value={desc} onChange={e => setDesc(e.target.value)} placeholder="Tell players what makes this tournament special..."></textarea>
              </div>
            </div>
          </div>
          
          <div className="wizard-nav">
            <div className="wizard-progress-text">Step 1 of 6</div>
            <button className="btn-wnext" onClick={handleNext}>Format &amp; Rules →</button>
          </div>
        </div>

        {/* STEP 2 */}
        <div className={`wizard-panel ${currentStep === 2 ? 'active' : ''}`}>
          <div className="wizard-card">
            <div className="wizard-card-title">Tournament Format</div>
            <div className="wizard-card-sub">Choose the format that best fits your event</div>
            <div className="format-cards">
              {[
                { id: 'scramble', icon: '🤝', name: '4-Man Scramble', desc: 'Teams of 4, all hit then choose best ball.' },
                { id: 'bestball', icon: '⛳', name: 'Best Ball', desc: 'Lowest score on hole counts for team.' },
                { id: 'stroke', icon: '📊', name: 'Stroke Play', desc: 'Individual total strokes.' }
              ].map(f => (
                <div key={f.id} className={`format-card ${selectedFormat === f.id ? 'selected' : ''}`} onClick={() => setSelectedFormat(f.id)}>
                  <div className="format-card-icon">{f.icon}</div>
                  <div className="format-card-name">{f.name}</div>
                  <div className="format-card-desc">{f.desc}</div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="wizard-card">
            <div className="wizard-card-title">Tournament Rules</div>
            <div className="wizard-card-sub">Add your specific rules</div>
            <div className="rules-builder">
              {rules.map((rule, idx) => (
                <div className="rule-row" key={idx}>
                  <input type="text" value={rule} onChange={e => updateRule(idx, e.target.value)} placeholder="Enter a rule..." />
                  <button className="rule-del" onClick={() => removeRule(idx)}>✕</button>
                </div>
              ))}
            </div>
            <button className="btn-add-rule" onClick={addRule}>+ Add Rule</button>
          </div>

          <div className="wizard-nav">
            <button className="btn-wback" onClick={handleBack}>← Back</button>
            <div className="wizard-progress-text">Step 2 of 6</div>
            <button className="btn-wnext" onClick={handleNext}>Pricing &amp; Spots →</button>
          </div>
        </div>

        {/* STEP 3 */}
        <div className={`wizard-panel ${currentStep === 3 ? 'active' : ''}`}>
          <div className="wizard-card">
            <div className="wizard-card-title">Registration Pricing</div>
            <div className="wizard-card-sub">Set your entry fee and what's included</div>
            <div className="wform-grid">
              <div className="wfield">
                <label>Entry Fee (per player) *</label>
                <input type="number" value={price} onChange={e => setPrice(Number(e.target.value))} />
              </div>
              <div className="wfield">
                <label>Max Players / Field Size *</label>
                <input type="number" value={maxPlayers} onChange={e => setMaxPlayers(Number(e.target.value))} />
              </div>
            </div>
            <div className="pricing-box">
              <div className="pricing-row"><span className="pricing-row-label">Entry fee</span><span className="pricing-row-val">${fee.toFixed(2)}</span></div>
              <div className="pricing-row">
                <span className="pricing-row-label">Stripe processing (2.9% + 30¢) <br/><span style={{fontSize: '0.7rem', opacity: 0.7}}>{passFees ? '(Passed to Player)' : '(Absorbed by You)'}</span></span>
                <span className="pricing-row-val">{passFees ? '' : '-'}${stripeFee.toFixed(2)}</span>
              </div>
              
              <div className="notif-row" style={{ marginTop: '1.25rem', marginBottom: '1rem', padding: '0.75rem 1rem', background: '#fff' }}>
                <div>
                  <div className="notif-label">Pass Fees to Registrant</div>
                  <div className="notif-sub">If ON, the player pays the {2.9}% + 30¢.</div>
                </div>
                <label className="toggle-switch">
                  <input type="checkbox" checked={passFees} onChange={e => setPassFees(e.target.checked)} />
                  <span className="toggle-slider"></span>
                </label>
              </div>

              <div className="pricing-total">
                <span>Player pays</span>
                <span style={{ color: 'var(--forest)' }}>${totalFee.toFixed(2)}</span>
              </div>
              <div style={{ marginTop: '0.75rem', fontSize: '0.75rem', color: 'var(--mist)' }}>
                You receive <strong style={{ color: 'var(--grass)' }}>${organizerRevenue.toFixed(2)}</strong> per registration.
              </div>
            </div>
          </div>

          <div className="wizard-nav">
            <button className="btn-wback" onClick={handleBack}>← Back</button>
            <div className="wizard-progress-text">Step 3 of 6</div>
            <button className="btn-wnext" onClick={handleNext}>Branding &amp; Theming →</button>
          </div>
        </div>

        {/* STEP 4: BRANDING */}
        <div className={`wizard-panel ${currentStep === 4 ? 'active' : ''}`}>
          <div className="wizard-card" style={{ padding: '3.5rem' }}>
            <div className="wizard-card-title">Event Branding & Theming</div>
            <div className="wizard-card-sub" style={{ marginBottom: '2.5rem' }}>Customize the colors and imagery of your tournament page to match your brand.</div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', marginBottom: '3rem', paddingBottom: '3rem', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--mist)', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '1rem' }}>Primary Accent</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <input type="color" value={themeColor} onChange={e => setThemeColor(e.target.value)} style={{ width: '48px', height: '48px', padding: 0, border: 'none', borderRadius: '50%', cursor: 'pointer', overflow: 'hidden', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }} />
                  <span style={{ fontFamily: "'DM Mono', monospace", fontWeight: 600, fontSize: '1.1rem', color: 'var(--ink)' }}>{themeColor.toUpperCase()}</span>
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--mist)', marginTop: '0.8rem', lineHeight: 1.4 }}>Used for buttons, badges, and the primary gold-flare effects.</div>
              </div>
              
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--mist)', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '1rem' }}>Backdrop Tone</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <input type="color" value={secondaryThemeColor} onChange={e => setSecondaryThemeColor(e.target.value)} style={{ width: '48px', height: '48px', padding: 0, border: 'none', borderRadius: '50%', cursor: 'pointer', overflow: 'hidden', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }} />
                  <span style={{ fontFamily: "'DM Mono', monospace", fontWeight: 600, fontSize: '1.1rem', color: 'var(--ink)' }}>{secondaryThemeColor.toUpperCase()}</span>
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--mist)', marginTop: '0.8rem', lineHeight: 1.4 }}>Blends into the dark hero backdrop for a deep, 2-tone gradient.</div>
              </div>
            </div>

            <div style={{ marginTop: '1rem' }}>
              <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', fontSize: '0.9rem', fontWeight: 600, color: 'var(--forest)', marginBottom: '1rem' }}>
                <span>Tournament Hero Gallery</span>
                <span className="badge" style={{ background: 'rgba(212,175,55,0.1)', color: 'var(--gold)', fontSize: '0.75rem' }}>Up to 10 Images</span>
              </label>
              <div 
                style={{ border: '2px dashed rgba(212,175,55,0.4)', borderRadius: '16px', padding: '4rem 2rem', textAlign: 'center', background: '#f8faf9', cursor: 'pointer', transition: 'all 0.2s', boxShadow: 'inset 0 0 30px rgba(0,0,0,0.01)' }} 
                onClick={() => alert('Media Uploader Modal Triggered! (MVP)')}
              >
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📸</div>
                <div style={{ fontWeight: 700, color: 'var(--forest)', fontSize: '1.2rem', marginBottom: '0.5rem' }}>Drag & Drop high-res photos here</div>
                <div style={{ color: 'var(--mist)', fontSize: '0.95rem' }}>or click to browse from your device</div>
              </div>
            </div>

          </div>

          <div className="wizard-nav">
            <button className="btn-wback" onClick={handleBack}>← Back</button>
            <div className="wizard-progress-text">Step 4 of 6</div>
            <button className="btn-wnext" onClick={handleNext}>Visibility Settings →</button>
          </div>
        </div>

        {/* STEP 5 */}
        <div className={`wizard-panel ${currentStep === 5 ? 'active' : ''}`}>
          <div className="wizard-card">
            <div className="wizard-card-title">Visibility Settings</div>
            <div className="wizard-card-sub">Control who can see and register for your tournament</div>
            <div className="vis-cards">
              <div className={`vis-card ${selectedVis === 'private' ? 'selected' : ''}`} onClick={() => setSelectedVis('private')}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '1.3rem' }}>🔒</span>
                  <span className="badge badge-private" style={{ fontSize: '0.7rem' }}>Private</span>
                </div>
                <div className="vis-card-title">Private Pre-Launch</div>
                <div className="vis-card-desc">Only people with your private link can register.</div>
              </div>
              <div className={`vis-card ${selectedVis === 'public' ? 'selected' : ''}`} onClick={() => setSelectedVis('public')}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '1.3rem' }}>🌐</span>
                  <span className="badge badge-open" style={{ fontSize: '0.7rem' }}>Public</span>
                </div>
                <div className="vis-card-title">Public from Launch</div>
                <div className="vis-card-desc">Your tournament appears immediately in search results.</div>
              </div>
            </div>
          </div>

          <div className="wizard-nav">
            <button className="btn-wback" onClick={handleBack}>← Back</button>
            <div className="wizard-progress-text">Step 5 of 6</div>
            <button className="btn-wnext" onClick={handleNext}>Review &amp; Launch →</button>
          </div>
        </div>

        {/* STEP 6 */}
        <div className={`wizard-panel ${currentStep === 6 ? 'active' : ''}`}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '2rem', alignItems: 'start' }}>
            <div>
              <div className="wizard-card">
                <div className="wizard-card-title">✅ Review Your Tournament</div>
                <div className="wizard-card-sub">Here's a summary of your event before publishing</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {[
                    { label: 'Tournament Name', val: name || '—' },
                    { label: 'Date', val: date || '—' },
                    { label: 'Location', val: course ? `${course} ${city ? `· ${city}` : ''}` : 'Course TBD' },
                    { label: 'Format', val: formatName },
                    { label: 'Entry Fee', val: `$${price} per player` },
                    { label: 'Visibility', val: selectedVis === 'private' ? '🔒 Private' : '🌐 Public' },
                    { label: 'Organization', val: org || '—' }
                  ].map((f, i) => (
                     <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.6rem 0', borderBottom: '1px solid rgba(26,46,26,0.05)' }}>
                       <span style={{ fontSize: '0.8rem', color: 'var(--mist)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{f.label}</span>
                       <span style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--forest)' }}>{f.val}</span>
                     </div>
                  ))}
                </div>
              </div>
              
              <div style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.05)', borderRadius: 'var(--radius-lg)', padding: '2.5rem', marginTop: '1.5rem', boxShadow: '0 15px 40px rgba(0,0,0,0.02)' }}>
                <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--forest)', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>Monetization Ledger</span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--gold)', background: 'rgba(212,175,55,0.1)', padding: '0.4rem 0.8rem', borderRadius: '50px' }}>Powered by Stripe</span>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.95rem', color: 'var(--ink)', marginBottom: '1.5rem', background: '#f8faf9', padding: '1.5rem', borderRadius: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--mist)' }}>Entry Fee</span>
                    <strong>${fee.toFixed(2)}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--mist)' }}>Processing Fee (2.9% + 30¢)</span>
                    <strong style={{ color: passFees ? 'var(--mist)' : '#e74c3c' }}>{passFees ? '+' : '-'}${stripeFee.toFixed(2)}</strong>
                  </div>
                  <div style={{ width: '100%', height: '1px', background: 'rgba(0,0,0,0.05)', margin: '0.5rem 0' }}></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontWeight: 600 }}>Golfer Checkout Total</span>
                    <strong style={{ fontSize: '1.1rem' }}>${totalFee.toFixed(2)}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontWeight: 600, color: 'var(--grass)' }}>Your Direct Payout</span>
                    <strong style={{ fontSize: '1.1rem', color: 'var(--grass)' }}>${organizerRevenue.toFixed(2)}</strong>
                  </div>
                </div>

                <div style={{ fontSize: '0.85rem', color: 'var(--mist)', lineHeight: 1.6, marginBottom: '2rem' }}>
                  <strong>TourneyLinks takes 0% of your registration volume.</strong> To publish your event and activate secure Stripe Connect payouts directly to your bank, pay a single flat <strong style={{ color: 'var(--ink)' }}>$99.00 Platform Activation Fee</strong>.
                </div>

                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  <button className="btn-primary" style={{ flex: 1, padding: '1rem', background: 'var(--gold)', color: '#000', fontWeight: 700, border: 'none' }}>
                    Pay $99 &amp; Activate Launch 🚀
                  </button>
                  <button className="btn-hero-outline" onClick={handleBack} style={{ flex: 1, padding: '1rem' }}>
                    ← Review Edits
                  </button>
                </div>
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--gold)', marginBottom: '0.75rem', fontWeight: 600 }}>Live Preview</div>
              <div className="preview-tournament-card" style={{ borderColor: themeColor }}>
                <div className="preview-cover" style={{ background: `linear-gradient(135deg, ${secondaryThemeColor}, #112814)` }}>
                  <div className="preview-cover-overlay" style={{ background: `radial-gradient(circle at top right, ${themeColor} 0%, transparent 60%)`, opacity: 0.3 }}></div>
                  <div className="preview-cover-content">
                    <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '0.5rem' }}>
                      <span className="badge badge-format">{formatName}</span>
                      <span className={`badge ${selectedVis === 'private' ? 'badge-private' : 'badge-open'}`}>
                        {selectedVis === 'private' ? '🔒 Private' : '🌐 Public'}
                      </span>
                    </div>
                    <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.3rem', fontWeight: 800, color: 'var(--cream)', lineHeight: 1.1 }}>
                      {name || 'Your Tournament Name'}
                    </div>
                  </div>
                </div>
                <div className="preview-body">
                  <div style={{ fontSize: '0.78rem', color: 'var(--gold)', fontFamily: "'DM Mono', monospace", marginBottom: '0.3rem' }}>{date || 'Select a date'}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--mist)' }}>📍 {course ? `${course} ${city ? `· ${city}` : ''}` : 'Course TBD'}</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--mist)', marginTop: '0.5rem', lineHeight: 1.5 }}>
                     {desc ? desc.substring(0, 100) + (desc.length > 100 ? '…' : '') : ''}
                  </div>
                  <div className="preview-stat-row">
                    <div className="preview-stat"><div className="preview-stat-val">${price}</div><div className="preview-stat-lbl">Entry</div></div>
                    <div className="preview-stat"><div className="preview-stat-val">{maxPlayers}</div><div className="preview-stat-lbl">Spots</div></div>
                    <div className="preview-stat"><div className="preview-stat-val">{holes.replace(' Holes', '')}</div><div className="preview-stat-lbl">Holes</div></div>
                    <div className="preview-stat"><div className="preview-stat-val">28</div><div className="preview-stat-lbl">Max HCP</div></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
