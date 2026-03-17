'use client';

import React, { useState, useRef, useCallback } from 'react';

const TEAL = { 
  900: '#050f0a', 800: '#0c1f17', 700: '#0d3d2e', 600: '#0d5e4f', 
  500: '#18a085', 400: '#4ec9a0', 300: '#8ae4c8', 200: '#c0f0e0', 100: '#e8faf4' 
};
const GOLD = { 500: '#c9a84c', 400: '#dfc06a', 300: '#f0d88a', 200: '#f5e8b8' };

export default function HandicapVerificationPage() {
  return (
    <div style={{ minHeight: 'calc(100vh - 80px)', background: `linear-gradient(160deg, #050f0a 0%, ${TEAL[800]} 40%, #0a1a2e 100%)`, padding: '4rem 1.5rem', display: 'flex', justifyContent: 'center' }}>
      <div style={{ maxWidth: '640px', width: '100%' }}>
        <HandicapVerification />
      </div>
    </div>
  );
}

function HandicapVerification() {
  const [method, setMethod] = useState('ghin');
  const [ghinNumber, setGhinNumber] = useState('');
  const [lastName, setLastName] = useState('');
  const [verifyState, setVerifyState] = useState('idle'); // idle | loading | success | error
  const [handicapData, setHandicapData] = useState<any>(null);
  const [dragOver, setDragOver] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<any>(null);
  const [ocrState, setOcrState] = useState('idle'); // idle | processing | done | error
  const [ocrResult, setOcrResult] = useState<any>(null);
  const fileRef = useRef<HTMLInputElement>(null);

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
  const processScreenshot = useCallback((file: any) => {
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

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer?.files[0];
    if (file && file.type.startsWith('image/')) processScreenshot(file);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
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
      <div style={{ display: 'flex', padding: '0 32px', background: TEAL[800], overflowX: 'auto' }}>
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
              display: 'flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap'
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
                      {handicapData.recentScores.map((score: number, i: number) => {
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
                    {ocrResult.fieldsDetected.map((f: string, i: number) => (
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
