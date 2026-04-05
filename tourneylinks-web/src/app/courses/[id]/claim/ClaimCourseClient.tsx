"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Upload, CheckCircle2, ShieldCheck, Loader2 } from 'lucide-react';

export default function ClaimCourseClient({ courseId, courseName }: { courseId: number, courseName: string }) {
  const router = useRouter();
  const [roleTitle, setRoleTitle] = useState('');
  const [pgaCardImageUrl, setPgaCardImageUrl] = useState('');
  const [locked, setLocked] = useState(false);
  
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Mock S3 Uploader (similar to campaign builder)
  const handleSimulatedUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setIsUploading(true);
    
    // Simulate S3 AWS Upload Delay
    setTimeout(() => {
      // In production, this would be the actual AWS S3 Object URL returned from the proxy
      setPgaCardImageUrl('https://aws-s3-proxy-bucket/pga-card-mock-' + Date.now() + '.jpg');
      setLocked(true);
      setIsUploading(false);
    }, 1500);
  };

  const submitClaim = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pgaCardImageUrl) {
       setErrorMsg("You must upload a photo of your PGA Membership Card or Clubhouse Business Card.");
       return;
    }
    setErrorMsg('');
    setIsSubmitting(true);

    try {
      const res = await fetch(`/api/courses/${courseId}/claim`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roleTitle, directPhone: '', pgaCardImageUrl })
      });

      if (!res.ok) {
        throw new Error("Failed to submit claim request.");
      }
      
      setSuccess(true);
      
    } catch (err: any) {
      setErrorMsg(err.message);
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="w-full max-w-md animate-in slide-in-from-bottom-4 duration-500 text-center">
         <div className="mx-auto w-16 h-16 bg-[rgba(201,168,76,0.1)] border border-[rgba(201,168,76,0.3)] rounded-full flex items-center justify-center mb-6">
            <CheckCircle2 color="var(--gold)" size={32} />
         </div>
         <h2 className="text-3xl font-serif text-white font-bold mb-4">Request Sent to Admin</h2>
         <p className="text-white/60 mb-8 leading-relaxed">
           Your PGA identification has been securely routed through our AI OCR pipeline and is pending final administrator approval. You will receive an email once your dashboard is unlocked.
         </p>
         <button onClick={() => router.push(`/courses/${courseId}`)} className="bg-white text-black font-bold px-8 py-3 rounded-full hover:bg-[var(--gold)] transition-colors w-full">
            Return to Venue
         </button>
      </div>
    );
  }

  return (
    <form onSubmit={submitClaim} className="w-full max-w-md">
       <div className="mb-10 text-center lg:text-left">
          <h2 className="text-[var(--gold)] font-bold tracking-widest text-xs uppercase mb-3 flex items-center justify-center lg:justify-start gap-2">
            <ShieldCheck size={14} /> Security Protocol
          </h2>
          <h3 className="text-3xl text-white font-serif mb-2">Identify Yourself</h3>
          <p className="text-white/50 text-sm">TourneyLinks actively prevents unauthorized course manipulation. Please provide verifiable credentials to claim {courseName}.</p>
       </div>

       {errorMsg && (
         <div className="p-4 mb-6 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-xl">
           {errorMsg}
         </div>
       )}

       <div className="space-y-5 mb-8">
          <div>
            <label className="block text-[11px] uppercase tracking-widest text-white/50 font-bold mb-2">Professional Title / Role</label>
            <input 
              type="text" 
              required
              placeholder="e.g. Head Professional, Gen. Manager"
              value={roleTitle}
              onChange={(e) => setRoleTitle(e.target.value)}
              className="w-full bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.1)] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[var(--gold)] transition-colors"
            />
          </div>
          <div className="bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.1)] rounded-xl px-4 py-4 mt-4">
             <label className="block text-[11px] uppercase tracking-widest text-white/50 font-bold mb-1 flex items-center justify-between">
                Authenticated Communication <ShieldCheck size={14} className="text-[var(--gold)]" />
             </label>
             <p className="text-white/60 text-sm mt-3 font-mono leading-relaxed">
                Your secure authenticated email address will be safely attached to this claim request and serve as the primary route for administrative status updates.
             </p>
          </div>
       </div>

       <div className="mb-10">
          <label className="block text-[11px] uppercase tracking-widest text-white/50 font-bold mb-3">
            PGA Membership or Business Card
          </label>
          
          <div className="relative border-2 border-dashed border-white/10 rounded-2xl p-8 hover:border-[var(--gold)] hover:bg-[rgba(201,168,76,0.02)] transition-all flex flex-col items-center justify-center gap-4 text-center group cursor-pointer" style={pgaCardImageUrl ? { borderStyle: 'solid', borderColor: 'rgba(201,168,76,0.3)', background: 'rgba(0,0,0,0.5)' } : {}}>
             <input type="file" accept="image/*" onChange={handleSimulatedUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20" disabled={locked || isUploading} />
             
             {isUploading ? (
                <>
                  <Loader2 className="animate-spin text-[var(--gold)]" size={32} />
                  <span className="text-white/60 text-sm">Encrypting & Uploading to Protocol...</span>
                </>
             ) : pgaCardImageUrl ? (
                <>
                  <CheckCircle2 className="text-[var(--gold)]" size={32} />
                  <div>
                    <div className="text-white font-bold text-sm">Credentials Secured</div>
                    <div className="text-white/40 text-xs mt-1 font-mono">ENCRYPTED_S3_BLOB_READY</div>
                  </div>
                </>
             ) : (
                <>
                  <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                     <Upload size={20} className="text-white/70 group-hover:text-[var(--gold)]" />
                  </div>
                  <div className="text-white/60 text-sm max-w-[200px]">
                    Tap to upload ID picture from camera or files
                  </div>
                </>
             )}
          </div>
       </div>

       <button type="submit" disabled={isSubmitting || !pgaCardImageUrl} className={`w-full font-bold uppercase tracking-widest text-sm py-4 rounded-xl transition-all ${isSubmitting || !pgaCardImageUrl ? 'bg-white/5 text-white/30 cursor-not-allowed' : 'bg-[var(--gold)] text-black hover:bg-white'}`}>
         {isSubmitting ? 'Scanning & Authenticating...' : 'Submit Claim Request'}
       </button>

    </form>
  );
}
