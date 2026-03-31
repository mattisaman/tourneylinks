'use client';

import React, { useState } from 'react';

export default function ScorecardVisionScanner({ courseId }: { courseId: number }) {
  const [file, setFile] = useState<File | null>(null);
  const [scanning, setScanning] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  
  const handleScan = async () => {
     if (!file) return;
     setScanning(true);
     setStatus('idle');

     try {
       const formData = new FormData();
       formData.append('file', file);
       formData.append('courseId', courseId.toString());

       const res = await fetch('/api/admin/vision/scorecard', {
         method: 'POST',
         body: formData
       });
       
       if (!res.ok) throw new Error("AI failed to extract telemetry");
       
       const data = await res.json();
       if (data.success) {
           setStatus('success');
       } else {
           setStatus('error');
       }
     } catch (err) {
       setStatus('error');
       console.error(err);
     } finally {
       setScanning(false);
     }
  };

  return (
    <div className="dash-card">
       <div className="dash-card-header">
         <div className="dash-card-title">🤖 AI Course Architecture Mapper</div>
         <span className={status === 'success' ? 'status-pill status-paid' : 'status-pill status-pending'} style={{ fontSize: '0.75rem' }}>
            {status === 'success' ? 'Mapped 18 Holes' : 'Pending Upload'}
         </span>
       </div>
       <div style={{ padding: '1.5rem' }}>
         <p style={{ fontSize: '0.875rem', color: 'var(--mist)', marginBottom: '1.5rem', lineHeight: '1.5' }}>
            Rather than manually typing Pars and Yardages for all 18 holes, upload a clear photo of the physical course scorecard. Google Gemini Vision OCR will autonomously parse the entire sequence and construct the database layout for you natively!
         </p>
         
         <div style={{ display: 'flex', gap: '1rem', flexDirection: 'column' }}>
            <div style={{ position: 'relative', border: '2px dashed rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.2)', padding: '2rem', borderRadius: '8px', textAlign: 'center' }}>
               <input 
                 type="file" 
                 accept="image/*" 
                 onChange={(e) => setFile(e.target.files?.[0] || null)}
                 style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }} 
                 disabled={scanning}
               />
               <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📷</div>
               <div style={{ fontWeight: 600, color: file ? 'white' : 'var(--mist)' }}>
                 {file ? file.name : 'Tap to upload a Scorecard Photo (JPEG/PNG)'}
               </div>
            </div>

            {file && (
               <button 
                  onClick={handleScan} 
                  disabled={scanning}
                  style={{ 
                     background: status === 'success' ? '#4CAF50' : 'var(--gold)', 
                     color: '#05120c', 
                     fontWeight: 800, 
                     border: 'none', 
                     padding: '1rem', 
                     borderRadius: '4px', 
                     cursor: scanning ? 'wait' : 'pointer',
                     display: 'flex',
                     justifyContent: 'center',
                     alignItems: 'center',
                     gap: '0.5rem',
                     opacity: scanning ? 0.7 : 1
                  }}
               >
                  {scanning ? (
                    <>
                       <span style={{ display: 'inline-block', width: '16px', height: '16px', border: '2px solid rgba(0,0,0,0.1)', borderTop: '2px solid #05120c', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></span>
                       Gemini Extracting Array...
                    </>
                  ) : status === 'success' ? 'Tees Mapped Successfully! ✅' : 'Analyze & Map Course ➔'}
               </button>
            )}
         </div>
       </div>

       <style dangerouslySetInnerHTML={{ __html: `
          @keyframes spin { 100% { transform: rotate(360deg); } }
       `}} />
    </div>
  );
}
