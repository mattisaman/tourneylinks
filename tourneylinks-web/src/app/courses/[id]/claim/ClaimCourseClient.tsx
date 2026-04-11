"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Upload, CheckCircle2, ShieldCheck, Loader2, Plus, X, Info } from 'lucide-react';
import { useUploadThing } from '@/lib/uploadthing';

export default function ClaimCourseClient({ courseId, courseName }: { courseId: number, courseName: string }) {
  const router = useRouter();
  const [roleTitle, setRoleTitle] = useState('');
  const [pgaCardImageUrl, setPgaCardImageUrl] = useState('');
  const [courseAdminInput, setCourseAdminInput] = useState('');
  const [coAdminEmails, setCoAdminEmails] = useState<string[]>([]);
  const [locked, setLocked] = useState(false);
  const [isDemo, setIsDemo] = useState(false);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // 1. Hook up the custom UploadThing function
  const { startUpload, isUploading } = useUploadThing("pgaCardImageUploader", {
    onClientUploadComplete: (res) => {
      if (res && res.length > 0) {
        setPgaCardImageUrl(res[0].url);
        setLocked(true);
      }
    },
    onUploadError: (error: Error) => {
      setErrorMsg(`Upload failed: ${error.message}`);
    },
  });

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsDemo(window.location.hostname.includes('demo'));
    }
  }, []);

  const addAdminEmail = () => {
    if (courseAdminInput.includes('@') && !coAdminEmails.includes(courseAdminInput)) {
      setCoAdminEmails([...coAdminEmails, courseAdminInput]);
      setCourseAdminInput('');
    }
  };

  const removeAdminEmail = (emailToRemove: string) => {
    setCoAdminEmails(coAdminEmails.filter(e => e !== emailToRemove));
  };

  // File Uploader Switcher (Demo Simulator vs Live Upload)
  const handleUploadSelection = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    if (isDemo) {
       // Simulate Mock Upload
       setTimeout(() => {
         setPgaCardImageUrl('https://aws-s3-proxy-bucket/pga-card-mock-' + Date.now() + '.jpg');
         setLocked(true);
       }, 1500);
    } else {
       // Trigger true custom UploadThing pipeline without replacing our beautiful UI
       const files = Array.from(e.target.files);
       await startUpload(files);
    }
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
        body: JSON.stringify({ roleTitle, directPhone: '', pgaCardImageUrl, coAdminEmails })
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
         <div className="mx-auto w-20 h-20 bg-[rgba(201,168,76,0.1)] border border-[rgba(201,168,76,0.3)] rounded-full flex items-center justify-center mb-6 shadow-[0_0_40px_rgba(201,168,76,0.2)]">
            <CheckCircle2 color="var(--gold)" size={40} />
         </div>
         <h2 className="text-3xl font-serif text-[var(--forest)] font-bold mb-4 tracking-tight">Transmission Secured</h2>
         <p className="text-[var(--mist)] mb-10 leading-relaxed">
           Your PGA identification has been securely routed through our Verification pipeline and is pending final administrative approval. You will receive an email once your dashboard is unlocked.
         </p>
         <button onClick={() => router.push(`/courses/${courseId}`)} className="bg-[var(--gold-foil)] text-[var(--ink)] shadow-[var(--metallic-shadow)] font-bold px-8 py-4 rounded-2xl hover:scale-105 transition-all w-full tracking-widest uppercase text-xs">
            Return to Directory
         </button>
      </div>
    );
  }

  return (
    <form onSubmit={submitClaim} className="w-full max-w-3xl mx-auto">
       <div className="mb-20 text-center md:text-left">
          <h2 className="text-[var(--gold)] font-bold tracking-[0.2em] text-[12px] uppercase mb-4 flex justify-center md:justify-start items-center gap-3">
            <ShieldCheck size={18} /> Security Protocol
          </h2>
          <h3 className="text-5xl md:text-6xl text-[var(--forest)] font-serif mb-6 tracking-tight leading-tight">Identity Verification</h3>
          <p className="text-[var(--mist)] text-lg leading-relaxed max-w-2xl mx-auto md:mx-0 mb-16">
             Protecting this course roster is our top priority. We utilize strict identity algorithms to ensure unauthorized personnel cannot manipulate golf facilities.
          </p>

          <div className="flex flex-col space-y-12">
             <div className="flex items-start gap-8">
                <div className="w-14 h-14 rounded-full bg-[rgba(201,168,76,0.1)] border border-[rgba(201,168,76,0.3)] flex items-center justify-center flex-shrink-0 text-[var(--gold)] text-xl font-bold font-serif shadow-sm">1</div>
                <div className="pt-2">
                   <h4 className="text-2xl font-serif font-bold text-[var(--forest)] mb-2 tracking-tight">Upload Official Credentials</h4>
                   <p className="text-base text-[var(--mist)] tracking-wide leading-relaxed">Provide your official PGA ID card or a valid Employer Business Card to confirm your status.</p>
                </div>
             </div>
             <div className="flex items-start gap-8">
                <div className="w-14 h-14 rounded-full bg-[rgba(201,168,76,0.1)] border border-[rgba(201,168,76,0.3)] flex items-center justify-center flex-shrink-0 text-[var(--gold)] text-xl font-bold font-serif shadow-sm">2</div>
                <div className="pt-2">
                   <h4 className="text-2xl font-serif font-bold text-[var(--forest)] mb-2 tracking-tight">AI Match Extraction</h4>
                   <p className="text-base text-[var(--mist)] tracking-wide leading-relaxed">Our cutting-edge visual model parses the name, role, and facility precisely printed on the card.</p>
                </div>
             </div>
             <div className="flex items-start gap-8">
                <div className="w-14 h-14 rounded-full bg-[rgba(201,168,76,0.1)] border border-[rgba(201,168,76,0.3)] flex items-center justify-center flex-shrink-0 text-[var(--gold)] text-xl font-bold font-serif shadow-sm">3</div>
                <div className="pt-2">
                   <h4 className="text-2xl font-serif font-bold text-[var(--forest)] mb-2 tracking-tight">Cross-Check & Activation</h4>
                   <p className="text-base text-[var(--mist)] tracking-wide leading-relaxed">TourneyLinks staff securely reviews the confident AI match to unlock global administration access.</p>
                </div>
             </div>
          </div>
       </div>

       {errorMsg && (
         <div className="p-4 mb-6 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-xl">
           {errorMsg}
         </div>
       )}

       <div className="space-y-14 mb-16">
          <div>
            <label className="block text-[12px] uppercase tracking-[0.2em] text-[var(--forest)] font-bold mb-4 pl-2 opacity-80">Primary Title / Role</label>
            <input 
              type="text" 
              required
              placeholder="e.g. Head Professional, Gen. Manager"
              value={roleTitle}
              onChange={(e) => setRoleTitle(e.target.value)}
              className="w-full bg-[rgba(255,255,255,0.8)] border border-[rgba(0,0,0,0.06)] rounded-3xl px-8 py-6 text-xl text-[var(--forest)] shadow-sm focus:outline-none focus:border-[var(--gold)] focus:ring-[rgba(201,168,76,0.15)] focus:ring-4 transition-all placeholder:text-[var(--mist)] font-medium"
            />
          </div>

          <div className="pt-4 border-t border-[rgba(0,0,0,0.04)]">
             <div className="flex items-center justify-between mb-4 pl-2 mt-6">
                 <label className="text-[12px] uppercase tracking-[0.2em] text-[var(--forest)] font-bold flex items-center gap-3 opacity-80">
                    Delegated Access <span className="text-[var(--mist)] lowercase font-normal opacity-70">(Optional)</span>
                 </label>
             </div>
             
             <div className="flex gap-4">
                <input 
                  type="email" 
                  placeholder="Invite Co-Admin (e.g. foodandbev@club.com)"
                  value={courseAdminInput}
                  onChange={(e) => setCourseAdminInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addAdminEmail())}
                  className="flex-grow bg-[rgba(255,255,255,0.8)] border border-[rgba(0,0,0,0.06)] rounded-3xl px-8 py-6 text-xl text-[var(--forest)] shadow-sm focus:outline-none focus:border-[var(--gold)] transition-all placeholder:text-[var(--mist)] font-medium"
                />
                <button type="button" onClick={addAdminEmail} className="bg-transparent hover:bg-[rgba(201,168,76,0.1)] border border-[rgba(0,0,0,0.08)] hover:border-[var(--gold)] text-[var(--forest)] px-8 rounded-3xl shadow-sm transition-all flex items-center justify-center">
                  <Plus size={24} />
                </button>
             </div>
             
             {coAdminEmails.length > 0 && (
                <div className="mt-6 flex flex-col gap-3">
                   {coAdminEmails.map((email, i) => (
                      <div key={i} className="flex flex-row items-center justify-between px-6 py-4 text-base text-[var(--forest)] bg-[#FDFBF7] border border-[rgba(0,0,0,0.04)] rounded-2xl group transition-all">
                         <span className="font-mono text-sm tracking-wide font-medium">{email}</span>
                         <button type="button" onClick={() => removeAdminEmail(email)} className="text-[var(--mist)] hover:text-red-500 transition-colors p-2 bg-white rounded-full shadow-sm hover:shadow-md">
                           <X size={18} />
                         </button>
                      </div>
                   ))}
                </div>
             )}
          </div>
       </div>

       <div className="mb-14">
          <label className="block text-[12px] uppercase tracking-[0.2em] text-[var(--forest)] font-bold mb-5 pl-2 opacity-80">
            PGA Membership or Business Card
          </label>
          
          <div className="relative border-[2px] rounded-[2.5rem] p-16 hover:border-[var(--gold)] hover:bg-[rgba(201,168,76,0.03)] transition-all flex flex-col items-center justify-center gap-6 text-center group cursor-pointer bg-[rgba(255,255,255,0.6)] shadow-sm" style={pgaCardImageUrl ? { borderStyle: 'solid', borderColor: 'var(--gold)', background: 'rgba(201,168,76,0.05)' } : { borderStyle: 'dashed', borderColor: 'rgba(0,0,0,0.08)' }}>
             
             {/* The hidden native input utilizing UploadThing's trigger dynamically or the mock simulator */}
             <input type="file" accept="image/*" onChange={handleUploadSelection} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20" disabled={locked || isUploading} />

             {isUploading ? (
                <div className="flex flex-col items-center justify-center gap-6 text-center">
                   <Loader2 className="animate-spin text-[var(--gold)]" size={48} />
                   <span className="text-[var(--forest)] text-lg font-bold tracking-tight">Encrypting & Uploading...</span>
                </div>
             ) : pgaCardImageUrl ? (
                <div className="flex flex-col items-center justify-center gap-5 text-center">
                   <div className="w-20 h-20 bg-[rgba(201,168,76,0.1)] rounded-full flex justify-center items-center">
                     <CheckCircle2 className="text-[var(--gold)]" size={44} />
                   </div>
                   <div>
                     <div className="text-[var(--forest)] font-bold text-2xl tracking-tight mb-2">Credentials Secured</div>
                     <div className="text-[rgba(201,168,76,0.8)] text-xs font-mono uppercase tracking-[0.2em] font-bold">Encrypted / S3 Blob Ready</div>
                   </div>
                </div>
             ) : (
                 <div className="flex flex-col items-center justify-center gap-6 text-center pointer-events-none">
                     <div className="w-24 h-24 bg-white border border-[rgba(0,0,0,0.04)] rounded-full flex items-center justify-center mb-2 group-hover:scale-105 group-hover:shadow-[0_10px_30px_rgba(201,168,76,0.2)] group-hover:border-[rgba(201,168,76,0.4)] transition-all duration-500 shadow-sm">
                        <Upload size={32} className="text-[var(--mist)] group-hover:text-[var(--gold)] transition-colors duration-500" />
                     </div>
                     <div className="text-[var(--forest)] text-lg font-bold leading-relaxed max-w-[280px]">
                       Tap to upload picture from camera or system files
                     </div>
                 </div>
             )}
          </div>
       </div>

       <button type="submit" disabled={isSubmitting || !pgaCardImageUrl} className={`w-full font-bold uppercase tracking-[0.25em] text-sm py-6 rounded-3xl transition-all ${isSubmitting || !pgaCardImageUrl ? 'bg-[rgba(0,0,0,0.04)] text-[var(--mist)] cursor-not-allowed border border-[rgba(0,0,0,0.04)] shadow-none' : 'bg-[var(--gold-foil)] text-[var(--ink)] hover:scale-[1.02] shadow-[var(--metallic-shadow)] hover:text-black border-none'}`}>
         {isSubmitting ? 'Scanning & Authenticating...' : 'Submit Claim Request'}
       </button>

    </form>
  );
}
