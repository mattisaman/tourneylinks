'use client';

import React, { useState } from 'react';
import { useAuth } from '@clerk/nextjs';
import { UploadCloud, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

export default function VerifyHandicapPage() {
  const { isLoaded, userId } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<any>(null);
  const [scanError, setScanError] = useState<string | null>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (file: File) => {
    setScanError(null);
    setScanResult(null);
    if (!file.type.startsWith('image/')) {
      setScanError('Please upload a valid image file (PNG, JPG, JPEG).');
      return;
    }
    setFile(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const initiateAIVerification = async () => {
    if (!preview) return;
    
    setIsScanning(true);
    setScanError(null);
    
    try {
      const response = await fetch('/api/verify/ocr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ base64Image: preview })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Verification failed. Please try again.');
      }
      
      setScanResult(data);
    } catch (err: any) {
      setScanError(err.message);
    } finally {
      setIsScanning(false);
    }
  };

  if (!isLoaded) return <div className="min-h-screen bg-[var(--ink)] flex items-center justify-center"><Loader2 className="animate-spin text-[var(--gold)]" size={48} /></div>;

  if (!userId) {
    return (
      <div className="min-h-screen bg-[var(--ink)] flex flex-col pt-32 items-center">
        <h1 className="text-3xl text-[var(--cream)] mb-4" style={{ fontFamily: 'var(--font-serif), serif'}}>Secure Authorization Required</h1>
        <p className="text-[var(--mist)] mb-8">You must be logged into TourneyLinks to verify an official USGA Handicap.</p>
        <a href="/system/login" className="btn-hero-outline">Log in with Clerk</a>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen flex flex-col items-center pt-32 pb-24 px-4 relative overflow-hidden" style={{ backgroundColor: '#071510' }}>
         <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[var(--gold)] opacity-[0.03] rounded-full blur-3xl pointer-events-none"></div>

         <div className="w-full max-w-[40rem] flex items-center justify-between mb-8 relative z-10">
           <div>
             <h1 className="text-3xl md:text-4xl text-[var(--gold)] font-bold tracking-tight mb-2" style={{ fontFamily: 'var(--font-serif), serif'}}>
                GHIN AI Authentication
             </h1>
             <p className="text-[var(--mist)] text-sm md:text-base">Upload a screenshot of your Official USGA GHIN App to instantly pull your scoring telemetry.</p>
           </div>
           <a href="/profile" className="btn-ghost text-sm px-6 py-2 tracking-widest uppercase hidden md:flex">
              Back to Profile
           </a>
         </div>

         <div className="w-full max-w-[40rem] relative z-10">
            {scanResult ? (
              <div className="bg-[rgba(76,222,128,0.05)] border border-[#4ade80] rounded-2xl p-8 text-center shadow-[0_0_30px_rgba(76,222,128,0.1)]">
                 <div className="w-20 h-20 bg-[#4ade80] rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_20px_rgba(76,222,128,0.4)]">
                    <CheckCircle2 color="#071510" size={40} />
                 </div>
                 <h2 className="text-3xl font-bold text-[#4ade80] mb-2 font-serif">Verification Complete</h2>
                 <p className="text-[var(--mist)] mb-8">The Gemini Multimodal Engine successfully extracted and cryptographically logged your GHIN telemetry.</p>
                 
                 <div className="grid grid-cols-2 gap-4 mb-8 text-left">
                    <div className="bg-[rgba(0,0,0,0.4)] border border-[rgba(255,255,255,0.05)] p-4 rounded-xl">
                       <span className="text-[10px] text-[var(--mist)] uppercase tracking-widest block mb-1">GHIN Number</span>
                       <span className="text-xl text-[var(--cream)] font-mono">{scanResult.ghin}</span>
                    </div>
                    <div className="bg-[rgba(0,0,0,0.4)] border border-[rgba(255,255,255,0.05)] p-4 rounded-xl">
                       <span className="text-[10px] text-[var(--mist)] uppercase tracking-widest block mb-1">Handicap Index</span>
                       <span className="text-xl text-[var(--gold)] font-bold">{scanResult.handicapIndex}</span>
                    </div>
                 </div>

                 <a href="/profile" className="btn-hero w-full justify-center">Return to Global Dashboard</a>
              </div>
            ) : (
              <div className="bg-[#0a1e17] border border-[rgba(201,168,76,0.2)] shadow-2xl rounded-2xl p-8">
                
                {scanError && (
                  <div className="bg-[rgba(244,67,54,0.1)] border border-[#f44336] text-[#f44336] p-4 rounded-lg mb-6 flex items-start gap-3">
                     <AlertCircle size={20} className="shrink-0 mt-0.5" />
                     <span className="text-sm leading-relaxed">{scanError}</span>
                  </div>
                )}

                {!preview ? (
                  <div 
                    className="border-2 border-dashed border-[rgba(201,168,76,0.3)] rounded-xl h-64 flex flex-col items-center justify-center cursor-pointer hover:border-[var(--gold)] hover:bg-[rgba(255,255,255,0.02)] transition-all group"
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    onClick={() => document.getElementById('ghin-upload')?.click()}
                  >
                     <UploadCloud size={48} className="text-[var(--gold)] mb-4 opacity-50 group-hover:opacity-100 transition-opacity" />
                     <p className="text-[var(--mist)] font-medium mb-1 group-hover:text-[var(--cream)] transition-colors">Drag and drop your GHIN screenshot here</p>
                     <p className="text-xs text-[var(--mist)] opacity-50">or click to browse your device files (PNG, JPG)</p>
                     <input type="file" id="ghin-upload" className="hidden" accept="image/*" onChange={handleFileInput} />
                  </div>
                ) : (
                  <div className="flex flex-col">
                    <div className="relative rounded-xl overflow-hidden border border-[rgba(255,255,255,0.1)] mb-6 bg-black flex justify-center">
                       <img src={preview} alt="GHIN Screenshot Preview" className="max-h-[300px] object-contain" />
                       <button onClick={() => setPreview(null)} className="absolute top-2 right-2 bg-black/60 hover:bg-black p-2 rounded-full text-white backdrop-blur-md transition-all">
                          ✕
                       </button>
                    </div>

                    <button 
                      onClick={initiateAIVerification} 
                      disabled={isScanning}
                      className="btn-hero w-full justify-center disabled:opacity-50 disabled:cursor-not-allowed font-bold tracking-widest uppercase flex items-center gap-3"
                    >
                      {isScanning ? (
                        <><Loader2 className="animate-spin" size={20} /> Deploying AI Vision Engine...</>
                      ) : (
                        '+ Analyze Screenshot with Gemini AI'
                      )}
                    </button>
                  </div>
                )}
                
              </div>
            )}
         </div>
      </div>
    </>
  );
}
