"use client";
import React, { useState } from 'react';
import { Upload, CheckCircle2, Loader2, Sparkles } from 'lucide-react';

export default function AIScorecardUploader({ courseId, initialScorecards }: { courseId: number, initialScorecards?: any[] }) {
  const [isUploading, setIsUploading] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [scorecardUrl, setScorecardUrl] = useState('');
  const [resultCount, setResultCount] = useState(initialScorecards?.length || 0);
  const [resultPayload, setResultPayload] = useState<any[]>(initialScorecards || []);

  const handleSimulatedUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setIsUploading(true);
    setTimeout(() => {
      setScorecardUrl('https://aws-s3-proxy-bucket/scorecard-mock-' + Date.now() + '.jpg');
      setIsUploading(false);
    }, 1500);
  };

  const runOcr = async () => {
    if (!scorecardUrl) return;
    setIsScanning(true);
    
    try {
      const res = await fetch('/api/pro-hub/scorecard-ocr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courseId,
          scorecardImageUrl: scorecardUrl
        })
      });

      const data = await res.json();
      if (data.success) {
        setResultCount(data.count || 1);
        if (data.payload) setResultPayload(data.payload);
      }
    } catch(e) {
      console.error(e);
    }
    setIsScanning(false);
  };

  return (
    <div style={{ background: '#fafaf5', padding: '1.5rem', borderRadius: '4px', border: '1px solid rgba(0,0,0,0.05)' }}>
       <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: '#05120c' }}>
          <Sparkles size={18} color="var(--gold)" />
          <h4 style={{ fontWeight: 800, fontSize: '1.1rem' }}>AI Vision Scorecard Digitizer</h4>
       </div>
       <p style={{ color: 'var(--mist)', fontSize: '0.85rem', marginBottom: '2rem', lineHeight: 1.5 }}>
         Upload a clean, flat photo of your physical clubhouse scorecard. The TourneyLinks AI Engine will automatically identify all Tee Boxes (Blue, White, Gold, etc) and extract all 18 pars, yardages, and handicaps into an interactive digital module natively attached to your venue.
       </p>

       {resultCount > 0 ? (
          <div style={{ animation: 'fadeIn 0.5s' }}>
             <div style={{ background: 'rgba(46,125,50,0.1)', color: '#2e7d32', padding: '1.5rem', borderRadius: '8px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', fontWeight: 600 }}>
               <CheckCircle2 size={32} /> 
               <div>
                  <div>Matrix Extraction Complete</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--mist)' }}>{resultCount} full tee box configurations loaded successfully. Check your public page.</div>
               </div>
             </div>

             {resultPayload.map((box, idx) => (
                <div key={idx} style={{ marginBottom: '1rem' }}>
                   <div style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.5rem', color: '#333' }}>{box.teeBoxName} Tees</div>
                   <div style={{ display: 'grid', gridTemplateColumns: 'repeat(19, 1fr)', gap: '1px', background: '#e0e0e0', border: '1px solid #ccc', borderRadius: '4px', overflowX: 'auto', fontSize: '9px', textAlign: 'center', fontWeight: 'bold' }}>
                      <div style={{ background: '#333', color: '#fff', padding: '0.5rem 0' }}>Hole</div>
                      {box.holes.map((h:any) => <div key={h.hole} style={{ background: '#333', color: '#fff', padding: '0.5rem 0' }}>{h.hole}</div>)}
                      
                      <div style={{ background: '#fff', padding: '0.5rem 0' }}>Yard</div>
                      {box.holes.map((h:any) => <div key={h.hole} style={{ background: '#fff', padding: '0.5rem 0' }}>{h.yardage}</div>)}
                      
                      <div style={{ background: '#f5f5f5', padding: '0.5rem 0' }}>Par</div>
                      {box.holes.map((h:any) => <div key={h.hole} style={{ background: '#f5f5f5', padding: '0.5rem 0' }}>{h.par}</div>)}
                   </div>
                </div>
             ))}

             <button onClick={() => {setResultCount(0); setResultPayload([]); setScorecardUrl('');}} className="btn-hero-outline" style={{ marginTop: '1.5rem', fontSize: '0.8rem', padding: '0.5rem 1rem', borderColor: 'var(--mist)', color: '#333' }}>
               Process Another Asset
             </button>
          </div>
       ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
             {!scorecardUrl ? (
                <div style={{ position: 'relative', border: '2px dashed #ccc', borderRadius: '8px', padding: '2.5rem', textAlign: 'center', cursor: 'pointer', background: '#fefefe' }}>
                   <input type="file" onChange={handleSimulatedUpload} style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }} disabled={isUploading} />
                   {isUploading ? <Loader2 className="animate-spin" size={32} style={{ margin: '0 auto', color: 'var(--gold)' }} /> : (
                     <>
                       <Upload size={32} style={{ margin: '0 auto 1rem auto', color: 'var(--mist)' }} />
                       <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#333', marginBottom: '0.2rem' }}>Drag & drop your scorecard photo</div>
                       <div style={{ fontSize: '0.8rem', color: '#666' }}>Supports .JPG, .PNG up to 10MB</div>
                     </>
                   )}
                </div>
             ) : (
                <button 
                  onClick={runOcr} 
                  disabled={isScanning}
                  className="btn-primary" 
                  style={{ width: '100%', padding: '1.25rem', display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'center', gap: '0.5rem', background: 'var(--gold)', color: '#000', borderRadius: '8px', fontWeight: 800, fontSize: '1.1rem' }}
                >
                   {isScanning ? <Loader2 className="animate-spin" /> : <Sparkles size={20} />}
                   {isScanning ? 'Executing Vision OCR...' : 'Digitize Full Scorecard Matrix'}
                </button>
             )}
          </div>
       )}
    </div>
  );
}
