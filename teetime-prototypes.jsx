import { useState, useEffect, useRef, useCallback } from "react";

// ============================================================
// TEETIME PROTOTYPES: Handicap Verification + Tournament Agent
// ============================================================

const TEAL = { 
  900: '#050f0a', 800: '#0c1f17', 700: '#0d3d2e', 600: '#0d5e4f', 
  500: '#18a085', 400: '#4ec9a0', 300: '#8ae4c8', 200: '#c0f0e0', 100: '#e8faf4' 
};
const GOLD = { 500: '#c9a84c', 400: '#dfc06a', 300: '#f0d88a', 200: '#f5e8b8' };
const NAVY = { 800: '#0a1a2e', 700: '#0f2a4a', 600: '#1a4a6a' };

// ============================================================
// HANDICAP VERIFICATION COMPONENT
// ============================================================
function HandicapVerification() {
  const [method, setMethod] = useState('ghin');
  const [ghinNumber, setGhinNumber] = useState('');
  const [lastName, setLastName] = useState('');
  const [verifyState, setVerifyState] = useState('idle'); // idle | loading | success | error
  const [handicapData, setHandicapData] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [ocrState, setOcrState] = useState('idle'); // idle | processing | done | error
  const [ocrResult, setOcrResult] = useState(null);
  const fileRef = useRef(null);

  // Simulate GHIN lookup
  const lookupGHIN = useCallback(() => {
    if (!ghinNumber || ghinNumber.length < 7) return;
    setVerifyState('loading');
    setTimeout(() => {
      // Simulated response
      const found = ghinNumber.length >= 7;
      if (found) {
        setHandicapData({
          ghinNumber: ghinNumber,
          name: lastName ? `${lastName.charAt(0).toUpperCase() + lastName.slice(1)}, Michael` : 'Reynolds, Michael',
          index: '14.2',
          trend: 'down',
          lowIndex: '12.8',
          club: 'Ravenwood Golf Club',
          city: 'Victor, NY',
          lastRevision: 'Mar 1, 2025',
          lastRound: 'Feb 22, 2025',
          recentScores: [82, 85, 79, 88, 84, 81, 86, 80, 83, 87],
          status: 'Active',
          association: 'NYSGA'
        });
        setVerifyState('success');
      } else {
        setVerifyState('error');
      }
    }, 1800);
  }, [ghinNumber, lastName]);

  // Simulate OCR processing
  const processScreenshot = useCallback((file) => {
    setUploadedFile(file);
    setOcrState('processing');
    setTimeout(() => {
      setOcrResult({
        ghinNumber: '2847193',
        name: 'Reynolds, Michael',
        index: '14.2',
        club: 'Ravenwood Golf Club',
        confidence: 0.94,
        fieldsDetected: ['GHIN Number', 'Handicap Index', 'Player Name', 'Home Club', 'Revision Date']
      });
      setOcrState('done');
    }, 2500);
  }, []);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer?.files[0];
    if (file && file.type.startsWith('image/')) processScreenshot(file);
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) processScreenshot(file);
  };

  const applyOcrToGhin = () => {
    if (ocrResult) {
      setGhinNumber(ocrResult.ghinNumber);
      setLastName(ocrResult.name.split(',')[0]);
      setMethod('ghin');
      setTimeout(() => lookupGHIN(), 300);
    }
  };

  return (
    <div style={{ background: TEAL[800], borderRadius: 20, overflow: 'hidden', border: `1px solid ${TEAL[700]}` }}>
      {/* Header */}
      <div style={{ 
        padding: '28px 32px 20px', 
        background: `linear-gradient(135deg, ${TEAL[800]}, ${TEAL[700]})`,
        borderBottom: `1px solid ${TEAL[700]}`
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
          <div style={{ 
            width: 40, height: 40, borderRadius: 12, 
            background: `linear-gradient(135deg, ${GOLD[500]}, ${GOLD[300]})`,
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 
          }}>✓</div>
          <div>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700, color: '#f5f2ed' }}>
              Handicap Verification
            </div>
            <div style={{ fontSize: 13, color: 'rgba(245,242,237,0.5)', marginTop: 2 }}>
              Verify your USGA Handicap Index instantly
            </div>
          </div>
        </div>
      </div>

      {/* Method Tabs */}
      <div style={{ display: 'flex', padding: '0 32px', background: TEAL[800] }}>
        {[
          { id: 'ghin', label: 'GHIN Lookup', icon: '🔍' },
          { id: 'screenshot', label: 'Screenshot Upload', icon: '📸' },
          { id: 'manual', label: 'Self-Report', icon: '✏️' }
        ].map(tab => (
          <button key={tab.id} onClick={() => { setMethod(tab.id); setVerifyState('idle'); }}
            style={{
              padding: '14px 20px', background: 'none', border: 'none',
              color: method === tab.id ? GOLD[400] : 'rgba(245,242,237,0.4)',
              fontSize: 13, fontWeight: method === tab.id ? 600 : 400, cursor: 'pointer',
              borderBottom: `2px solid ${method === tab.id ? GOLD[500] : 'transparent'}`,
              fontFamily: "'DM Sans', sans-serif", transition: 'all 0.25s',
              display: 'flex', alignItems: 'center', gap: 6
            }}>
            <span>{tab.icon}</span> {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ padding: '24px 32px 32px' }}>
        
        {/* GHIN Lookup */}
        {method === 'ghin' && (
          <div style={{ animation: 'fadeIn 0.3s ease' }}>
            <div style={{ fontSize: 13, color: 'rgba(245,242,237,0.6)', marginBottom: 16, lineHeight: 1.6 }}>
              Enter your 7-digit GHIN number for instant verification against the USGA database. Your handicap, home club, and recent scores will be pulled automatically.
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em', color: GOLD[500], marginBottom: 6, fontWeight: 600 }}>
                  GHIN Number
                </label>
                <input value={ghinNumber} onChange={e => setGhinNumber(e.target.value.replace(/\D/g, '').slice(0, 7))}
                  placeholder="e.g. 2847193" maxLength={7}
                  style={{
                    width: '100%', padding: '12px 14px', background: 'rgba(255,255,255,0.05)',
                    border: `1px solid ${verifyState === 'error' ? '#c0392b' : 'rgba(78,201,160,0.15)'}`,
                    borderRadius: 10, color: '#f5f2ed', fontSize: 15, outline: 'none',
                    fontFamily: "'DM Mono', monospace", letterSpacing: '0.15em',
                    transition: 'border-color 0.2s'
                  }}
                  onFocus={e => e.target.style.borderColor = GOLD[500]}
                  onBlur={e => e.target.style.borderColor = 'rgba(78,201,160,0.15)'}
                />
                <div style={{ fontSize: 11, color: 'rgba(245,242,237,0.3)', marginTop: 4 }}>
                  {ghinNumber.length}/7 digits
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em', color: GOLD[500], marginBottom: 6, fontWeight: 600 }}>
                  Last Name (optional)
                </label>
                <input value={lastName} onChange={e => setLastName(e.target.value)}
                  placeholder="For confirmation"
                  style={{
                    width: '100%', padding: '12px 14px', background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(78,201,160,0.15)', borderRadius: 10,
                    color: '#f5f2ed', fontSize: 14, outline: 'none', fontFamily: "'DM Sans', sans-serif",
                    transition: 'border-color 0.2s'
                  }}
                  onFocus={e => e.target.style.borderColor = GOLD[500]}
                  onBlur={e => e.target.style.borderColor = 'rgba(78,201,160,0.15)'}
                />
              </div>
            </div>
            <button onClick={lookupGHIN} disabled={ghinNumber.length < 7 || verifyState === 'loading'}
              style={{
                width: '100%', padding: '14px', border: 'none', borderRadius: 12,
                background: ghinNumber.length >= 7 
                  ? `linear-gradient(135deg, ${GOLD[500]}, ${GOLD[300]})` 
                  : 'rgba(255,255,255,0.06)',
                color: ghinNumber.length >= 7 ? TEAL[800] : 'rgba(245,242,237,0.3)',
                fontSize: 14, fontWeight: 600, cursor: ghinNumber.length >= 7 ? 'pointer' : 'default',
                fontFamily: "'DM Sans', sans-serif", transition: 'all 0.3s',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8
              }}>
              {verifyState === 'loading' ? (
                <><span style={{ animation: 'spin 1s linear infinite', display: 'inline-block' }}>⟳</span> Verifying against GHIN database...</>
              ) : 'Verify Handicap →'}
            </button>

            {verifyState === 'error' && (
              <div style={{ 
                marginTop: 14, padding: '12px 16px', borderRadius: 10,
                background: 'rgba(192,57,43,0.12)', border: '1px solid rgba(192,57,43,0.25)',
                color: '#e85a4f', fontSize: 13
              }}>
                ⚠️ GHIN number not found. Please check your number and try again, or use screenshot upload.
              </div>
            )}

            {/* Success Result Card */}
            {verifyState === 'success' && handicapData && (
              <div style={{ 
                marginTop: 20, borderRadius: 16, overflow: 'hidden',
                border: `1px solid ${TEAL[600]}`, animation: 'slideUp 0.4s ease'
              }}>
                {/* Verified Header */}
                <div style={{ 
                  padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  background: `linear-gradient(135deg, ${TEAL[700]}, ${TEAL[600]})`
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ 
                      width: 32, height: 32, borderRadius: '50%',
                      background: `linear-gradient(135deg, #2ecc71, #27ae60)`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 16, color: 'white'
                    }}>✓</div>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: '#f5f2ed' }}>Handicap Verified</div>
                      <div style={{ fontSize: 11, color: 'rgba(245,242,237,0.5)' }}>GHIN #{handicapData.ghinNumber} · {handicapData.association}</div>
                    </div>
                  </div>
                  <div style={{ 
                    padding: '4px 12px', borderRadius: 20, fontSize: 11, fontWeight: 600,
                    background: 'rgba(46,204,113,0.15)', color: '#2ecc71', letterSpacing: '0.05em'
                  }}>
                    {handicapData.status.toUpperCase()}
                  </div>
                </div>
                
                {/* Player Info */}
                <div style={{ padding: '20px', background: 'rgba(255,255,255,0.02)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                    <div>
                      <div style={{ fontSize: 18, fontWeight: 700, color: '#f5f2ed', fontFamily: "'Playfair Display', serif" }}>
                        {handicapData.name}
                      </div>
                      <div style={{ fontSize: 13, color: 'rgba(245,242,237,0.5)', marginTop: 2 }}>
                        {handicapData.club} · {handicapData.city}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 36, fontWeight: 800, color: GOLD[400], fontFamily: "'Playfair Display', serif", lineHeight: 1 }}>
                        {handicapData.index}
                      </div>
                      <div style={{ fontSize: 11, color: 'rgba(245,242,237,0.4)', marginTop: 2 }}>
                        HANDICAP INDEX {handicapData.trend === 'down' ? '↓' : '↑'}
                      </div>
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 16 }}>
                    {[
                      { label: 'Low Index', value: handicapData.lowIndex },
                      { label: 'Last Revision', value: handicapData.lastRevision },
                      { label: 'Last Round', value: handicapData.lastRound }
                    ].map((s, i) => (
                      <div key={i} style={{ 
                        padding: '10px 12px', borderRadius: 10, 
                        background: 'rgba(78,201,160,0.06)', border: '1px solid rgba(78,201,160,0.08)'
                      }}>
                        <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(245,242,237,0.4)', marginBottom: 3 }}>{s.label}</div>
                        <div style={{ fontSize: 14, fontWeight: 600, color: '#f5f2ed' }}>{s.value}</div>
                      </div>
                    ))}
                  </div>

                  {/* Recent Scores Mini Chart */}
                  <div style={{ marginBottom: 12 }}>
                    <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(245,242,237,0.35)', marginBottom: 8 }}>
                      Recent 10 Scores
                    </div>
                    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, height: 50 }}>
                      {handicapData.recentScores.map((score, i) => {
                        const min = Math.min(...handicapData.recentScores);
                        const max = Math.max(...handicapData.recentScores);
                        const h = 15 + ((score - min) / (max - min || 1)) * 35;
                        return (
                          <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                            <div style={{ fontSize: 9, color: 'rgba(245,242,237,0.35)' }}>{score}</div>
                            <div style={{ 
                              width: '100%', height: h, borderRadius: 4,
                              background: score <= min + 2 
                                ? `linear-gradient(180deg, ${GOLD[400]}, ${GOLD[500]})` 
                                : `linear-gradient(180deg, ${TEAL[400]}, ${TEAL[500]})`,
                              opacity: 0.7 + (i * 0.03),
                              transition: 'height 0.5s ease'
                            }}/>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Screenshot Upload */}
        {method === 'screenshot' && (
          <div style={{ animation: 'fadeIn 0.3s ease' }}>
            <div style={{ fontSize: 13, color: 'rgba(245,242,237,0.6)', marginBottom: 16, lineHeight: 1.6 }}>
              Upload a screenshot of your GHIN app profile or handicap card. Our AI will extract your GHIN number, handicap index, and player details automatically.
            </div>

            {/* Drop Zone */}
            <div
              onDragOver={e => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileRef.current?.click()}
              style={{
                padding: uploadedFile ? '16px' : '40px 20px',
                borderRadius: 16, cursor: 'pointer',
                border: `2px dashed ${dragOver ? GOLD[500] : 'rgba(78,201,160,0.15)'}`,
                background: dragOver ? 'rgba(201,168,76,0.05)' : 'rgba(255,255,255,0.02)',
                textAlign: 'center', transition: 'all 0.3s',
              }}>
              <input ref={fileRef} type="file" accept="image/*" onChange={handleFileSelect} style={{ display: 'none' }} />
              {!uploadedFile ? (
                <>
                  <div style={{ fontSize: 36, marginBottom: 10, opacity: 0.6 }}>📸</div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#f5f2ed', marginBottom: 4 }}>
                    Drop screenshot here or click to browse
                  </div>
                  <div style={{ fontSize: 12, color: 'rgba(245,242,237,0.35)' }}>
                    Supports GHIN App, Golf Canada, or any handicap card photo
                  </div>
                </>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <div style={{ 
                    width: 80, height: 60, borderRadius: 10, 
                    background: `linear-gradient(135deg, ${TEAL[600]}, ${TEAL[500]})`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24,
                    flexShrink: 0
                  }}>📄</div>
                  <div style={{ textAlign: 'left', flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#f5f2ed' }}>{uploadedFile.name}</div>
                    <div style={{ fontSize: 11, color: 'rgba(245,242,237,0.4)' }}>
                      {(uploadedFile.size / 1024).toFixed(0)} KB · {uploadedFile.type}
                    </div>
                  </div>
                  {ocrState === 'processing' && (
                    <div style={{ 
                      padding: '6px 14px', borderRadius: 20, fontSize: 11, fontWeight: 600,
                      background: 'rgba(78,201,160,0.1)', color: TEAL[400]
                    }}>
                      <span style={{ animation: 'spin 1s linear infinite', display: 'inline-block', marginRight: 6 }}>⟳</span>
                      Analyzing...
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* OCR Results */}
            {ocrState === 'done' && ocrResult && (
              <div style={{ 
                marginTop: 16, borderRadius: 14, overflow: 'hidden',
                border: `1px solid rgba(78,201,160,0.15)`, animation: 'slideUp 0.4s ease'
              }}>
                <div style={{ 
                  padding: '14px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  background: 'rgba(78,201,160,0.06)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 16 }}>🤖</span>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#f5f2ed' }}>AI Extraction Complete</div>
                  </div>
                  <div style={{ 
                    padding: '3px 10px', borderRadius: 12, fontSize: 11,
                    background: 'rgba(46,204,113,0.12)', color: '#2ecc71', fontWeight: 600
                  }}>
                    {Math.round(ocrResult.confidence * 100)}% confident
                  </div>
                </div>
                <div style={{ padding: '16px 18px' }}>
                  <div style={{ fontSize: 11, color: 'rgba(245,242,237,0.35)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    Fields Detected
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 16 }}>
                    {ocrResult.fieldsDetected.map((f, i) => (
                      <span key={i} style={{
                        padding: '4px 10px', borderRadius: 20, fontSize: 11, fontWeight: 500,
                        background: 'rgba(78,201,160,0.08)', color: TEAL[400],
                        border: '1px solid rgba(78,201,160,0.12)'
                      }}>✓ {f}</span>
                    ))}
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
                    {[
                      { label: 'GHIN #', value: ocrResult.ghinNumber },
                      { label: 'Handicap Index', value: ocrResult.index },
                      { label: 'Player Name', value: ocrResult.name },
                      { label: 'Home Club', value: ocrResult.club },
                    ].map((item, i) => (
                      <div key={i} style={{ 
                        padding: '10px 12px', borderRadius: 8,
                        background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(78,201,160,0.06)'
                      }}>
                        <div style={{ fontSize: 10, color: GOLD[500], textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 3 }}>{item.label}</div>
                        <div style={{ fontSize: 14, fontWeight: 600, color: '#f5f2ed', fontFamily: item.label === 'GHIN #' ? "'DM Mono', monospace" : 'inherit' }}>{item.value}</div>
                      </div>
                    ))}
                  </div>
                  <button onClick={applyOcrToGhin}
                    style={{
                      width: '100%', padding: '12px', border: 'none', borderRadius: 10,
                      background: `linear-gradient(135deg, ${GOLD[500]}, ${GOLD[300]})`,
                      color: TEAL[800], fontSize: 13, fontWeight: 600, cursor: 'pointer',
                      fontFamily: "'DM Sans', sans-serif"
                    }}>
                    Apply & Verify via GHIN →
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Self-Report */}
        {method === 'manual' && (
          <div style={{ animation: 'fadeIn 0.3s ease' }}>
            <div style={{ 
              padding: '14px 16px', borderRadius: 12, marginBottom: 16,
              background: 'rgba(232,168,75,0.06)', border: '1px solid rgba(232,168,75,0.12)',
              fontSize: 13, color: GOLD[400], lineHeight: 1.6
            }}>
              ⚠️ Self-reported handicaps are subject to organizer review. Some tournaments require verified GHIN numbers. Your reported index will be displayed as <strong>"unverified"</strong> to organizers.
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label style={{ display: 'block', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em', color: GOLD[500], marginBottom: 6, fontWeight: 600 }}>
                  Handicap Index
                </label>
                <input placeholder="e.g. 14.2" style={{
                  width: '100%', padding: '12px 14px', background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(78,201,160,0.15)', borderRadius: 10,
                  color: '#f5f2ed', fontSize: 15, outline: 'none', fontFamily: "'DM Mono', monospace"
                }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em', color: GOLD[500], marginBottom: 6, fontWeight: 600 }}>
                  Home Club (optional)
                </label>
                <input placeholder="Club name" style={{
                  width: '100%', padding: '12px 14px', background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(78,201,160,0.15)', borderRadius: 10,
                  color: '#f5f2ed', fontSize: 14, outline: 'none', fontFamily: "'DM Sans', sans-serif"
                }} />
              </div>
            </div>
            <button style={{
              width: '100%', padding: '14px', border: 'none', borderRadius: 12, marginTop: 16,
              background: 'rgba(255,255,255,0.06)', color: 'rgba(245,242,237,0.6)',
              fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif"
            }}>
              Submit (Unverified) →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================
// TOURNAMENT SCRAPING AGENT DASHBOARD
// ============================================================
function TournamentAgent() {
  const [isRunning, setIsRunning] = useState(false);
  const [logs, setLogs] = useState([]);
  const [stats, setStats] = useState({ discovered: 0, extracted: 0, new: 0, updated: 0, failed: 0 });
  const [sources, setSources] = useState([
    { name: 'Golf Genius', type: 'Platform', status: 'ready', icon: '🏆', urls: 2840, lastRun: '2 hrs ago', newFound: 0 },
    { name: 'BlueGolf', type: 'Platform', status: 'ready', icon: '🔵', urls: 1560, lastRun: '4 hrs ago', newFound: 0 },
    { name: 'USGA/GHIN Events', type: 'Federation', status: 'ready', icon: '🇺🇸', urls: 890, lastRun: '6 hrs ago', newFound: 0 },
    { name: 'State Golf Assoc.', type: 'Federation', status: 'ready', icon: '🏛️', urls: 3200, lastRun: '1 day ago', newFound: 0 },
    { name: 'Club Websites', type: 'Web Crawl', status: 'ready', icon: '⛳', urls: 12400, lastRun: '12 hrs ago', newFound: 0 },
    { name: 'Facebook Events', type: 'Social', status: 'ready', icon: '📘', urls: 4800, lastRun: '3 hrs ago', newFound: 0 },
    { name: 'Eventbrite Golf', type: 'Marketplace', status: 'ready', icon: '🎫', urls: 1100, lastRun: '8 hrs ago', newFound: 0 },
    { name: 'Google Search', type: 'Discovery', status: 'ready', icon: '🔍', urls: 0, lastRun: '1 hr ago', newFound: 0 },
  ]);
  const [recentFinds, setRecentFinds] = useState([]);
  const logRef = useRef(null);
  const intervalRef = useRef(null);

  const sampleLogs = [
    { type: 'info', msg: 'Agent initialized. Loading source configurations...' },
    { type: 'info', msg: 'Starting crawl cycle #4,281 — targeting 8 source categories' },
    { type: 'crawl', msg: 'Crawling Golf Genius public event pages (batch 1/12)...' },
    { type: 'success', msg: 'Found: "2025 Rochester Open" — Oak Hill CC, Rochester NY — June 14' },
    { type: 'success', msg: 'Found: "Finger Lakes Charity Classic" — Bristol Harbour, Canandaigua NY — July 4' },
    { type: 'crawl', msg: 'Crawling BlueGolf tournament listings...' },
    { type: 'success', msg: 'Found: "Midwest Amateur Championship" — Medinah CC, IL — Aug 2-3' },
    { type: 'extract', msg: 'LLM extraction: parsing tournament details from 23 pages...' },
    { type: 'info', msg: 'Deduplication check: 2 duplicates found, merging data...' },
    { type: 'crawl', msg: 'Scanning Facebook Groups: "Golf Tournaments Near Me", "Chicago Golf Outings"...' },
    { type: 'success', msg: 'Found: "Firefighter Memorial Scramble" — Cog Hill, Lemont IL — Sept 6' },
    { type: 'success', msg: 'Found: "PGA Junior League Regional" — Highland Park GC, IL — July 19' },
    { type: 'crawl', msg: 'Google Discovery: searching "golf tournament registration 2025 New York"...' },
    { type: 'success', msg: 'Found: "Saratoga Invitational" — Saratoga National GC, NY — Aug 16' },
    { type: 'extract', msg: 'LLM extraction: normalizing dates, prices, formats for 6 new events...' },
    { type: 'warn', msg: 'Rate limit hit on golfgenius.com — backing off 30s...' },
    { type: 'crawl', msg: 'Crawling State Golf Association calendars (NYSGA, IGA, MGA)...' },
    { type: 'success', msg: 'Found: "NYSGA Mid-Am Qualifier" — Turning Stone, Verona NY — July 22' },
    { type: 'success', msg: 'Found: "IGA Women\'s State Am" — Stonebridge CC, Aurora IL — Aug 8-10' },
    { type: 'info', msg: 'Geocoding 8 new tournament locations via Google Maps API...' },
    { type: 'success', msg: 'Cycle complete: 8 new tournaments, 3 updates, 0 failures' },
  ];

  const sampleFinds = [
    { name: '2025 Rochester Open', course: 'Oak Hill CC', city: 'Rochester, NY', date: 'Jun 14', format: 'Stroke Play', price: '$200', source: 'Golf Genius', confidence: 97 },
    { name: 'Finger Lakes Charity Classic', course: 'Bristol Harbour', city: 'Canandaigua, NY', date: 'Jul 4', format: '4-Man Scramble', price: '$150', source: 'BlueGolf', confidence: 94 },
    { name: 'Midwest Amateur Championship', course: 'Medinah CC', city: 'Medinah, IL', date: 'Aug 2-3', format: 'Stroke Play', price: '$350', source: 'BlueGolf', confidence: 98 },
    { name: 'Firefighter Memorial Scramble', course: 'Cog Hill Golf', city: 'Lemont, IL', date: 'Sep 6', format: 'Charity Scramble', price: '$125', source: 'Facebook', confidence: 88 },
    { name: 'Saratoga Invitational', course: 'Saratoga National', city: 'Saratoga, NY', date: 'Aug 16', format: 'Best Ball', price: '$175', source: 'Google', confidence: 91 },
    { name: 'NYSGA Mid-Am Qualifier', course: 'Turning Stone', city: 'Verona, NY', date: 'Jul 22', format: 'Stroke Play', price: '$125', source: 'State Assoc.', confidence: 99 },
  ];

  const startAgent = () => {
    setIsRunning(true);
    setLogs([]);
    setRecentFinds([]);
    setStats({ discovered: 0, extracted: 0, new: 0, updated: 0, failed: 0 });
    
    let logIdx = 0;
    let findIdx = 0;
    
    intervalRef.current = setInterval(() => {
      if (logIdx < sampleLogs.length) {
        setLogs(prev => [...prev, { ...sampleLogs[logIdx], time: new Date().toLocaleTimeString() }]);
        
        if (sampleLogs[logIdx].type === 'success') {
          setStats(prev => ({ ...prev, discovered: prev.discovered + 1, new: prev.new + 1 }));
          if (findIdx < sampleFinds.length) {
            setRecentFinds(prev => [sampleFinds[findIdx], ...prev]);
            findIdx++;
          }
        }
        if (sampleLogs[logIdx].type === 'extract') {
          setStats(prev => ({ ...prev, extracted: prev.extracted + Math.floor(Math.random() * 10) + 5 }));
        }
        if (sampleLogs[logIdx].type === 'crawl') {
          // Update source status
          const sourceName = sampleLogs[logIdx].msg;
          setSources(prev => prev.map(s => {
            if (sourceName.toLowerCase().includes(s.name.toLowerCase().split(' ')[0].toLowerCase())) {
              return { ...s, status: 'crawling' };
            }
            return { ...s, status: s.status === 'crawling' ? 'done' : s.status };
          }));
        }
        
        logIdx++;
      } else {
        clearInterval(intervalRef.current);
        setIsRunning(false);
        setSources(prev => prev.map(s => ({ ...s, status: 'done', lastRun: 'Just now', newFound: Math.floor(Math.random() * 5) + 1 })));
        setStats(prev => ({ ...prev, updated: 3 }));
      }
    }, 800);
  };

  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [logs]);

  useEffect(() => () => clearInterval(intervalRef.current), []);

  const getLogColor = (type) => {
    switch(type) {
      case 'success': return '#2ecc71';
      case 'warn': return '#f39c12';
      case 'error': return '#e74c3c';
      case 'crawl': return TEAL[400];
      case 'extract': return '#8b7fd4';
      default: return 'rgba(245,242,237,0.5)';
    }
  };

  return (
    <div style={{ background: TEAL[800], borderRadius: 20, overflow: 'hidden', border: `1px solid ${TEAL[700]}` }}>
      {/* Header */}
      <div style={{ 
        padding: '24px 28px 18px',
        background: `linear-gradient(135deg, ${TEAL[800]}, ${NAVY[800]})`,
        borderBottom: `1px solid ${TEAL[700]}`
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ 
              width: 40, height: 40, borderRadius: 12,
              background: `linear-gradient(135deg, ${TEAL[500]}, ${TEAL[400]})`,
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18
            }}>🤖</div>
            <div>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 700, color: '#f5f2ed' }}>
                Tournament Discovery Agent
              </div>
              <div style={{ fontSize: 12, color: 'rgba(245,242,237,0.4)', marginTop: 1 }}>
                Nationwide automated tournament scraping & extraction
              </div>
            </div>
          </div>
          <button onClick={isRunning ? () => { clearInterval(intervalRef.current); setIsRunning(false); } : startAgent}
            style={{
              padding: '10px 22px', border: 'none', borderRadius: 30, cursor: 'pointer',
              background: isRunning 
                ? 'rgba(231,76,60,0.15)' 
                : `linear-gradient(135deg, ${TEAL[500]}, ${TEAL[400]})`,
              color: isRunning ? '#e74c3c' : TEAL[900],
              fontSize: 13, fontWeight: 600, fontFamily: "'DM Sans', sans-serif",
              display: 'flex', alignItems: 'center', gap: 8, transition: 'all 0.3s'
            }}>
            {isRunning ? (
              <><span style={{ width: 8, height: 8, borderRadius: 2, background: '#e74c3c', display: 'inline-block' }}/> Stop Agent</>
            ) : (
              <>▶ Run Discovery Cycle</>
            )}
          </button>
        </div>
      </div>

      {/* Stats Bar */}
      <div style={{ 
        display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)',
        borderBottom: `1px solid ${TEAL[700]}`
      }}>
        {[
          { label: 'Pages Crawled', value: stats.extracted, color: TEAL[400] },
          { label: 'Tournaments Found', value: stats.discovered, color: '#2ecc71' },
          { label: 'New Listings', value: stats.new, color: GOLD[400] },
          { label: 'Updated', value: stats.updated, color: '#8b7fd4' },
          { label: 'Failed', value: stats.failed, color: '#e74c3c' }
        ].map((s, i) => (
          <div key={i} style={{ 
            padding: '14px 16px', textAlign: 'center',
            borderRight: i < 4 ? `1px solid ${TEAL[700]}` : 'none'
          }}>
            <div style={{ fontSize: 22, fontWeight: 800, color: s.color, fontFamily: "'Playfair Display', serif" }}>
              {s.value.toLocaleString()}
            </div>
            <div style={{ fontSize: 10, color: 'rgba(245,242,237,0.35)', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: 2 }}>
              {s.label}
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', minHeight: 380 }}>
        {/* Sources Panel */}
        <div style={{ borderRight: `1px solid ${TEAL[700]}`, padding: '16px', overflowY: 'auto' }}>
          <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em', color: GOLD[500], fontWeight: 600, marginBottom: 12 }}>
            Data Sources ({sources.length})
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {sources.map((s, i) => (
              <div key={i} style={{ 
                padding: '10px 12px', borderRadius: 10,
                background: s.status === 'crawling' ? 'rgba(78,201,160,0.06)' : 'rgba(255,255,255,0.02)',
                border: `1px solid ${s.status === 'crawling' ? 'rgba(78,201,160,0.15)' : 'rgba(255,255,255,0.03)'}`,
                transition: 'all 0.3s'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 14 }}>{s.icon}</span>
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 600, color: '#f5f2ed' }}>{s.name}</div>
                      <div style={{ fontSize: 10, color: 'rgba(245,242,237,0.3)' }}>{s.urls.toLocaleString()} URLs · {s.lastRun}</div>
                    </div>
                  </div>
                  <div style={{
                    width: 8, height: 8, borderRadius: '50%',
                    background: s.status === 'crawling' ? TEAL[400] : s.status === 'done' ? '#2ecc71' : 'rgba(245,242,237,0.2)',
                    animation: s.status === 'crawling' ? 'pulse 1.5s infinite' : 'none',
                    boxShadow: s.status === 'crawling' ? `0 0 8px ${TEAL[400]}` : 'none'
                  }}/>
                </div>
                {s.status === 'done' && s.newFound > 0 && (
                  <div style={{ 
                    marginTop: 6, fontSize: 10, color: '#2ecc71', fontWeight: 600,
                    padding: '2px 8px', background: 'rgba(46,204,113,0.08)', borderRadius: 8, display: 'inline-block'
                  }}>
                    +{s.newFound} new tournaments
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Main Panel */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {/* Live Log */}
          <div ref={logRef} style={{ 
            flex: 1, padding: '12px 16px', overflowY: 'auto', maxHeight: 200,
            fontFamily: "'DM Mono', monospace", fontSize: 11, lineHeight: 1.8,
            background: 'rgba(0,0,0,0.15)'
          }}>
            {logs.length === 0 && (
              <div style={{ color: 'rgba(245,242,237,0.2)', textAlign: 'center', padding: '40px 0' }}>
                Click "Run Discovery Cycle" to start the agent
              </div>
            )}
            {logs.map((log, i) => (
              <div key={i} style={{ display: 'flex', gap: 10 }}>
                <span style={{ color: 'rgba(245,242,237,0.2)', minWidth: 70, flexShrink: 0 }}>{log.time}</span>
                <span style={{ color: getLogColor(log.type) }}>{log.msg}</span>
              </div>
            ))}
            {isRunning && (
              <div style={{ color: TEAL[400] }}>
                <span style={{ animation: 'blink 1s infinite' }}>█</span>
              </div>
            )}
          </div>

          {/* Recent Finds */}
          {recentFinds.length > 0 && (
            <div style={{ borderTop: `1px solid ${TEAL[700]}`, padding: '12px 16px', maxHeight: 200, overflowY: 'auto' }}>
              <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em', color: GOLD[500], fontWeight: 600, marginBottom: 10 }}>
                Recently Discovered ({recentFinds.length})
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {recentFinds.map((t, i) => (
                  <div key={i} style={{ 
                    padding: '10px 14px', borderRadius: 10,
                    background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(78,201,160,0.06)',
                    display: 'grid', gridTemplateColumns: '1fr auto', gap: 12, alignItems: 'center',
                    animation: 'slideIn 0.3s ease'
                  }}>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: '#f5f2ed' }}>{t.name}</div>
                      <div style={{ fontSize: 11, color: 'rgba(245,242,237,0.4)', marginTop: 2 }}>
                        📍 {t.course}, {t.city} · 📅 {t.date} · {t.format} · {t.price}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <div style={{ 
                        padding: '3px 8px', borderRadius: 8, fontSize: 10, fontWeight: 600,
                        background: t.confidence >= 95 ? 'rgba(46,204,113,0.1)' : t.confidence >= 90 ? 'rgba(241,196,15,0.1)' : 'rgba(231,76,60,0.1)',
                        color: t.confidence >= 95 ? '#2ecc71' : t.confidence >= 90 ? '#f1c40f' : '#e74c3c',
                        marginBottom: 3
                      }}>
                        {t.confidence}% match
                      </div>
                      <div style={{ fontSize: 10, color: 'rgba(245,242,237,0.3)' }}>via {t.source}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// MAIN APP
// ============================================================
export default function App() {
  const [activeTab, setActiveTab] = useState('handicap');

  return (
    <div style={{ 
      minHeight: '100vh', padding: '24px',
      background: `linear-gradient(160deg, #050f0a 0%, ${TEAL[800]} 40%, ${NAVY[800]} 100%)`,
      fontFamily: "'DM Sans', sans-serif"
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700;800&family=DM+Sans:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&display=swap');
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideIn { from { opacity: 0; transform: translateX(-10px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        input:focus { outline: none; }
        button { font-family: 'DM Sans', sans-serif; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(78,201,160,0.15); border-radius: 3px; }
      `}</style>

      {/* Header */}
      <div style={{ maxWidth: 820, margin: '0 auto 24px', textAlign: 'center' }}>
        <div style={{ 
          fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 800,
          color: '#f5f2ed', marginBottom: 6
        }}>
          Tee<span style={{ color: GOLD[400] }}>Time</span> <span style={{ fontSize: 16, fontWeight: 400, color: 'rgba(245,242,237,0.4)' }}>Prototypes</span>
        </div>
        <div style={{ fontSize: 14, color: 'rgba(245,242,237,0.4)' }}>
          Production architecture for handicap verification & nationwide tournament discovery
        </div>
      </div>

      {/* Tabs */}
      <div style={{ 
        maxWidth: 820, margin: '0 auto 20px',
        display: 'flex', justifyContent: 'center', gap: 4,
        background: 'rgba(255,255,255,0.03)', borderRadius: 14, padding: 4
      }}>
        {[
          { id: 'handicap', label: 'Handicap Verification', icon: '✓' },
          { id: 'agent', label: 'Tournament Agent', icon: '🤖' }
        ].map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            style={{
              flex: 1, padding: '12px', border: 'none', borderRadius: 11, cursor: 'pointer',
              background: activeTab === tab.id 
                ? `linear-gradient(135deg, ${TEAL[700]}, ${TEAL[600]})` 
                : 'transparent',
              color: activeTab === tab.id ? '#f5f2ed' : 'rgba(245,242,237,0.4)',
              fontSize: 13, fontWeight: activeTab === tab.id ? 600 : 400,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              transition: 'all 0.25s', fontFamily: "'DM Sans', sans-serif"
            }}>
            <span>{tab.icon}</span> {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ maxWidth: 820, margin: '0 auto' }}>
        {activeTab === 'handicap' && <HandicapVerification />}
        {activeTab === 'agent' && <TournamentAgent />}
      </div>

      {/* Architecture Notes */}
      <div style={{ maxWidth: 820, margin: '32px auto 0' }}>
        <div style={{ 
          padding: '24px 28px', borderRadius: 16,
          background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(78,201,160,0.06)'
        }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: GOLD[400], marginBottom: 12, fontFamily: "'Playfair Display', serif" }}>
            {activeTab === 'handicap' ? '🏗️ Handicap Verification Architecture' : '🏗️ Agent Architecture'}
          </div>
          {activeTab === 'handicap' ? (
            <div style={{ fontSize: 12, color: 'rgba(245,242,237,0.5)', lineHeight: 1.8 }}>
              <strong style={{ color: '#f5f2ed' }}>Tier 1 — GHIN API</strong> (requires USGA partnership): Real-time lookup via REST API. Returns verified index, club, revision history, and scoring record. Apply through your regional Allied Golf Association.<br/>
              <strong style={{ color: '#f5f2ed' }}>Tier 2 — Public GHIN Scraper</strong>: Query ghin.com's public lookup (name + state search). Parse response with headless browser. Cache results with 24hr TTL. Respect rate limits (2 req/sec).<br/>
              <strong style={{ color: '#f5f2ed' }}>Tier 3 — OCR Upload</strong>: Accept GHIN app screenshots. Process with Claude Vision API (claude-sonnet-4-20250514 with image input). Extract GHIN #, index, name, club. Store original as audit trail. Confidence scoring via field-level extraction.<br/>
              <strong style={{ color: '#f5f2ed' }}>Tier 4 — Self-Report</strong>: Fallback for players without GHIN. Flagged as "unverified" to organizers. Organizer can override or require re-verification.
            </div>
          ) : (
            <div style={{ fontSize: 12, color: 'rgba(245,242,237,0.5)', lineHeight: 1.8 }}>
              <strong style={{ color: '#f5f2ed' }}>Discovery Layer</strong>: Rotating Google searches by metro area + date ("golf tournament 2025 [city]"). Seed list of 15,000+ club/org domains. Facebook Graph API for event discovery. Eventbrite API (golf category).<br/>
              <strong style={{ color: '#f5f2ed' }}>Extraction Layer</strong>: Playwright headless browser pool for JS-rendered pages. Claude API (claude-sonnet-4-20250514) for structured extraction — name, date, course, format, price, field size, reg URL. Handles inconsistent formatting across thousands of source sites.<br/>
              <strong style={{ color: '#f5f2ed' }}>Normalization</strong>: Fuzzy deduplication (name + date + course similarity). Google Maps Geocoding for lat/lng. Format standardization into TeeTime schema. Confidence scoring per extraction.<br/>
              <strong style={{ color: '#f5f2ed' }}>Orchestration</strong>: BullMQ job queue, 50-100K pages/month budget. Re-crawl known tournaments every 48hrs for updates. Estimated cost: ~$200-400/month for LLM extraction at scale.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
