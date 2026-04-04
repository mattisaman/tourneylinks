"use client";
import React, { useState } from 'react';
import { Upload, CheckCircle2, Loader2, Sparkles } from 'lucide-react';

export default function AIScorecardUploader({ courseId }: { courseId: number }) {
  const [teeBoxName, setTeeBoxName] = useState('Blue');
  const [isUploading, setIsUploading] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [scorecardUrl, setScorecardUrl] = useState('');
  const [resultHoles, setResultHoles] = useState<any[]>([]);

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
          teeBoxName,
          teeBoxColorHex: '#0000FF',
          scorecardImageUrl: scorecardUrl
        })
      });

      const data = await res.json();
      if (data.holes) {
        setResultHoles(data.holes);
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
         Upload a clean, flat photo of your physical clubhouse scorecard. The TourneyLinks AI Engine will automatically parse the matrix grid to extract all 18 pars, yardages, and handicaps into an interactive digital module.
       </p>

       {resultHoles.length > 0 ? (
          <div style={{ animation: 'fadeIn 0.5s' }}>
             <div style={{ background: 'rgba(46,125,50,0.1)', color: '#2e7d32', padding: '1rem', borderRadius: '8px', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}>
               <CheckCircle2 size={18} /> Matrix Extraction Complete
             </div>
             
             <div style={{ display: 'grid', gridTemplateColumns: 'repeat(18, 1fr)', gap: '2px', background: '#e0e0e0', border: '1px solid #ccc', borderRadius: '4px', overflowX: 'auto', fontSize: '10px', textAlign: 'center', fontWeight: 'bold' }}>
                <div style={{ background: '#333', color: '#fff', padding: '0.5rem 0' }}>Hole</div>
                {resultHoles.map(h => <div key={h.hole} style={{ background: '#333', color: '#fff', padding: '0.5rem 0' }}>{h.hole}</div>)}
                
                <div style={{ background: '#fff', padding: '0.5rem 0' }}>Yard</div>
                {resultHoles.map(h => <div key={h.hole} style={{ background: '#fff', padding: '0.5rem 0' }}>{h.yardage}</div>)}
                
                <div style={{ background: '#f5f5f5', padding: '0.5rem 0' }}>Par</div>
                {resultHoles.map(h => <div key={h.hole} style={{ background: '#f5f5f5', padding: '0.5rem 0' }}>{h.par}</div>)}
             </div>

             <button onClick={() => {setResultHoles([]); setScorecardUrl('');}} className="btn-hero-outline" style={{ marginTop: '1.5rem', fontSize: '0.8rem', padding: '0.5rem 1rem', borderColor: 'var(--mist)', color: '#333' }}>
               Digitize Another Tee Box
             </button>
          </div>
       ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem', alignItems: 'end' }}>
             <div>
                <label style={{ display: 'block', fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--mist)', fontWeight: 800, marginBottom: '0.5rem' }}>Tee Box Identifier</label>
                <input 
                  type="text" 
                  value={teeBoxName} 
                  onChange={e => setTeeBoxName(e.target.value)} 
                  placeholder="e.g. Blue Tees"
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #ddd', fontSize: '0.9rem' }} 
                />
             </div>
             <div>
                {!scorecardUrl ? (
                   <div style={{ position: 'relative', border: '2px dashed #ccc', borderRadius: '8px', padding: '1.5rem', textAlign: 'center', cursor: 'pointer', background: '#fefefe' }}>
                      <input type="file" onChange={handleSimulatedUpload} style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }} disabled={isUploading} />
                      {isUploading ? <Loader2 className="animate-spin" size={24} style={{ margin: '0 auto', color: 'var(--gold)' }} /> : (
                        <>
                          <Upload size={24} style={{ margin: '0 auto 0.5rem auto', color: 'var(--mist)' }} />
                          <div style={{ fontSize: '0.8rem', color: '#666' }}>Tap to upload scorecard photo</div>
                        </>
                      )}
                   </div>
                ) : (
                   <button 
                     onClick={runOcr} 
                     disabled={isScanning}
                     className="btn-primary" 
                     style={{ width: '100%', padding: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', background: 'var(--gold)', color: '#000', borderRadius: '8px' }}
                   >
                      {isScanning ? <Loader2 className="animate-spin" /> : <Sparkles size={18} />}
                      {isScanning ? 'Executing Vision OCR...' : 'Digitize Hologram'}
                   </button>
                )}
             </div>
          </div>
       )}
    </div>
  );
}
