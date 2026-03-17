'use client';

import React, { useState, useRef } from 'react';
import { Upload, CheckCircle2, AlertCircle, RefreshCcw } from 'lucide-react';

export default function HandicapVerification() {
  const [method, setMethod] = useState<'ghin' | 'screenshot' | 'manual'>('ghin');
  const [ghin, setGhin] = useState('1234567');
  const [lastName, setLastName] = useState('Smith');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  
  const [dragOver, setDragOver] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [ocrState, setOcrState] = useState<'idle' | 'processing' | 'done'>('idle');
  const fileRef = useRef<HTMLInputElement>(null);

  const handicapData = {
    index: '+1.2',
    name: 'Matthew Smith',
    club: 'Oak Hill Country Club',
    state: 'NY',
    lastRevision: 'Oct 15, 2024',
    recentScores: [72, 70, 74, 69, 71, 75, 73, 68, 70, 72]
  };

  const ocrResult = {
    confidence: 0.98,
    fieldsDetected: ['GHIN Number', 'Index', 'Name', 'Home Club'],
    ghinNumber: '9283741',
    index: '4.5',
    name: 'James Wilson',
    club: 'Monroe Golf Club'
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setTimeout(() => setStatus('success'), 1500);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    setUploadedFile(file);
    setOcrState('processing');
    setTimeout(() => setOcrState('done'), 2500);
  };

  return (
    <div className="bg-[var(--forest)] rounded-xl p-6 md:p-10 shadow-xl max-w-3xl mx-auto border border-[rgba(201,168,76,0.15)]">
      <div className="text-center mb-10">
        <h2 className="font-serif text-3xl font-extrabold text-[var(--cream)] mb-2">Primary Affiliation</h2>
        <p className="text-[var(--mist)] text-sm">Link your USGA Handicap to unlock competitive registration.</p>
      </div>

      <div className="flex bg-[rgba(255,255,255,0.03)] rounded-lg p-1.5 mb-8">
        <button 
          onClick={() => setMethod('ghin')}
          className={`flex-1 py-3 px-4 rounded-md text-sm font-medium transition-all ${method === 'ghin' ? 'bg-gradient-to-br from-[var(--pine)] to-[var(--fairway)] text-[var(--cream)] shadow-md' : 'text-[var(--mist)] hover:text-[var(--cream)]'}`}
        >
          GHIN Lookup (Recommended)
        </button>
        <button 
          onClick={() => setMethod('screenshot')}
          className={`flex-1 py-3 px-4 rounded-md text-sm font-medium transition-all ${method === 'screenshot' ? 'bg-gradient-to-br from-[var(--pine)] to-[var(--fairway)] text-[var(--cream)] shadow-md' : 'text-[var(--mist)] hover:text-[var(--cream)]'}`}
        >
          Upload Screenshot
        </button>
      </div>

      <div className="min-h-[300px]">
        {method === 'ghin' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {status !== 'success' ? (
              <form onSubmit={handleVerify} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-[var(--gold)] mb-2">GHIN Number</label>
                    <input 
                      type="text" 
                      value={ghin} 
                      onChange={e => setGhin(e.target.value)}
                      className="w-full bg-[rgba(255,255,255,0.05)] border border-[rgba(201,168,76,0.2)] rounded-md px-4 py-3 text-[var(--cream)] font-mono text-lg focus:border-[var(--gold)] outline-none transition-colors"
                      placeholder="e.g. 1234567"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-[var(--gold)] mb-2">Last Name</label>
                    <input 
                      type="text" 
                      value={lastName} 
                      onChange={e => setLastName(e.target.value)}
                      className="w-full bg-[rgba(255,255,255,0.05)] border border-[rgba(201,168,76,0.2)] rounded-md px-4 py-3 text-[var(--cream)] font-sans text-lg focus:border-[var(--gold)] outline-none transition-colors"
                      placeholder="e.g. Smith"
                    />
                  </div>
                </div>
                
                <button 
                  type="submit" 
                  disabled={status === 'loading'}
                  className="w-full bg-[var(--gold)] hover:bg-[var(--amber)] text-[var(--forest)] font-bold py-4 rounded-md transition-all flex justify-center items-center gap-2 mt-4"
                >
                  {status === 'loading' ? (
                    <><RefreshCcw className="animate-spin w-5 h-5" /> Verifying with USGA...</>
                  ) : (
                    'Verify Handicap'
                  )}
                </button>
              </form>
            ) : (
              <div className="animate-in zoom-in-95 duration-500">
                <div className="bg-[rgba(90,140,58,0.1)] border border-[var(--grass)] rounded-xl p-6 md:p-8 flex flex-col md:flex-row gap-8 items-center">
                  <div className="flex-shrink-0 relative">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[var(--gold)] to-[var(--amber)] flex items-center justify-center text-[var(--forest)] font-serif text-3xl font-bold shadow-lg">
                      {handicapData.index}
                    </div>
                    <div className="absolute -bottom-2 -right-2 bg-[var(--white)] rounded-full p-1 shadow-md">
                      <CheckCircle2 className="w-6 h-6 text-[var(--grass)]" />
                    </div>
                  </div>
                  
                  <div className="flex-1 w-full text-center md:text-left">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[rgba(90,140,58,0.2)] text-[var(--morning)] rounded-full text-xs font-bold uppercase tracking-wider mb-3">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Verified Active
                    </div>
                    <h3 className="font-serif text-2xl text-[var(--cream)] font-bold mb-1">{handicapData.name}</h3>
                    <p className="text-[var(--mist)] mb-4">{handicapData.club} · {handicapData.state}</p>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-[rgba(245,240,232,0.1)]">
                      <div>
                        <div className="text-[10px] uppercase tracking-widest text-[var(--mist)] mb-1">GHIN</div>
                        <div className="font-mono text-sm text-[var(--cream)]">{ghin}</div>
                      </div>
                      <div>
                        <div className="text-[10px] uppercase tracking-widest text-[var(--mist)] mb-1">Low H.I.</div>
                        <div className="font-bold text-sm text-[var(--cream)]">+1.4</div>
                      </div>
                      <div className="col-span-2">
                        <div className="text-[10px] uppercase tracking-widest text-[var(--mist)] mb-1">Last Revision</div>
                        <div className="font-mono text-sm text-[var(--cream)]">{handicapData.lastRevision}</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-6 flex justify-center">
                  <button onClick={() => setStatus('idle')} className="text-[var(--mist)] hover:text-[var(--gold)] text-sm font-medium transition-colors underline underline-offset-4">
                    Link a different account
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {method === 'screenshot' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <p className="text-[var(--mist)] text-sm mb-6 max-w-lg">
              Upload a screenshot of your GHIN app profile or handicap card. Our AI will extract your details automatically.
            </p>

            <div
              onDragOver={e => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileRef.current?.click()}
              className={`border-2 border-dashed rounded-xl transition-all cursor-pointer text-center ${dragOver ? 'border-[var(--gold)] bg-[rgba(201,168,76,0.05)] p-10' : 'border-[rgba(201,168,76,0.2)] bg-[rgba(255,255,255,0.02)] hover:border-[var(--gold)] p-10'} ${uploadedFile ? 'p-6' : ''}`}
            >
              <input ref={fileRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
              
              {!uploadedFile ? (
                <div className="flex flex-col items-center">
                  <Upload className="w-12 h-12 text-[var(--gold)] opacity-80 mb-4" />
                  <p className="text-[var(--cream)] font-semibold mb-2">Drop screenshot here or click to browse</p>
                  <p className="text-[var(--mist)] text-xs">Supports GHIN App, Golf Canada, or any official handicap card</p>
                </div>
              ) : (
                <div className="flex items-center gap-4 text-left">
                  <div className="w-16 h-16 rounded bg-gradient-to-br from-[var(--pine)] to-[var(--fairway)] flex items-center justify-center text-white">
                    <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='3' y='3' width='18' height='18' rx='2' ry='2'%3E%3C/rect%3E%3Ccircle cx='8.5' cy='8.5' r='1.5'%3E%3C/circle%3E%3Cpolyline points='21 15 16 10 5 21'%3E%3C/polyline%3E%3C/svg%3E" alt="image icon" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-[var(--cream)] font-medium text-sm truncate max-w-[200px]">{uploadedFile.name}</h4>
                    <p className="text-[var(--mist)] text-xs mt-1">{(uploadedFile.size / 1024).toFixed(0)} KB · {uploadedFile.type}</p>
                  </div>
                  {ocrState === 'processing' && (
                    <div className="flex items-center gap-2 bg-[rgba(201,168,76,0.1)] text-[var(--gold)] px-3 py-1.5 rounded-full text-xs font-bold">
                      <RefreshCcw className="w-3 h-3 animate-spin" /> Analyzing...
                    </div>
                  )}
                </div>
              )}
            </div>

            {ocrState === 'done' && (
              <div className="mt-8 border border-[rgba(90,140,58,0.3)] bg-[rgba(90,140,58,0.05)] rounded-xl overflow-hidden animate-in slide-in-from-bottom-4 duration-500">
                <div className="bg-[rgba(90,140,58,0.1)] px-5 py-3 flex justify-between items-center border-b border-[rgba(90,140,58,0.2)]">
                  <div className="flex items-center gap-2">
                    <span role="img" aria-label="bot">🤖</span>
                    <span className="text-[var(--cream)] font-semibold text-sm">AI Extraction Complete</span>
                  </div>
                  <div className="bg-[rgba(90,140,58,0.2)] text-[var(--grass)] text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1.5">
                    <CheckCircle2 className="w-3 h-3" /> {Math.round(ocrResult.confidence * 100)}% Match
                  </div>
                </div>
                
                <div className="p-5">
                  <div className="flex flex-wrap gap-2 mb-6">
                    {ocrResult.fieldsDetected.map((f, i) => (
                      <span key={i} className="text-[10px] font-bold uppercase tracking-wider bg-[rgba(255,255,255,0.05)] text-[var(--mist)] border border-[rgba(255,255,255,0.1)] px-2.5 py-1 rounded-full">
                        ✓ {f}
                      </span>
                    ))}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    {[
                      { label: 'GHIN #', value: ocrResult.ghinNumber, mono: true },
                      { label: 'Handicap Index', value: ocrResult.index, special: true },
                      { label: 'Player Name', value: ocrResult.name },
                      { label: 'Home Club', value: ocrResult.club },
                    ].map((item, i) => (
                      <div key={i} className="bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.05)] p-3 rounded-lg">
                        <div className="text-[10px] uppercase tracking-widest text-[var(--gold)] mb-1">{item.label}</div>
                        <div className={`text-[var(--cream)] ${item.mono ? 'font-mono' : 'font-sans'} ${item.special ? 'text-2xl font-bold text-[var(--morning)]' : 'text-base font-semibold'}`}>
                          {item.value}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <button className="w-full bg-[var(--grass)] hover:bg-[var(--fairway)] text-white font-bold py-3.5 rounded-md transition-colors shadow-lg">
                    Confirm & Save Profile
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
