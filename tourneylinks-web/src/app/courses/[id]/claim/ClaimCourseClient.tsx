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
          <p className="text-white/50 text-sm leading-relaxed mb-6">
             Protecting this leaderboard and course roster is our top priority. We utilize strict identity algorithms to ensure unauthorized personnel cannot manipulate golf facilities.
          </p>

          <div className="bg-[rgba(201,168,76,0.05)] border border-[rgba(201,168,76,0.2)] rounded-lg p-5 mb-8">
             <div className="flex items-start gap-3">
                <Info className="text-[var(--gold)] mt-0.5" size={16} />
                <div>
                   <h4 className="text-[11px] font-bold tracking-widest uppercase text-[var(--gold)] mb-1">How Verification Works</h4>
                   <ul className="text-white/60 text-xs space-y-2 mt-2 font-mono">
                      <li>1. Upload your Official PGA ID or valid Employer Business Card.</li>
                      <li>2. Our AI Vision model parses the name and facility printed on the card.</li>
                      <li>3. If the names match, the claim is instantly staged.</li>
                      <li>4. TourneyLinks staff performs a final physical cross-check before unlocking the course dashboard.</li>
                   </ul>
                </div>
             </div>
          </div>
       </div>

       {errorMsg && (
         <div className="p-4 mb-6 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-xl">
           {errorMsg}
         </div>
       )}

       <div className="space-y-6 mb-8">
          <div>
            <label className="block text-[11px] uppercase tracking-widest text-white/50 font-bold mb-2">Primary Professional Title / Role</label>
            <input 
              type="text" 
              required
              placeholder="e.g. Head Professional, Gen. Manager"
              value={roleTitle}
              onChange={(e) => setRoleTitle(e.target.value)}
              className="w-full bg-[rgba(255,255,255,0.03)] border-b border-[rgba(255,255,255,0.1)] rounded-t-lg px-4 py-3 text-white focus:outline-none focus:border-[var(--gold)] focus:bg-[rgba(255,255,255,0.05)] transition-all placeholder:text-white/20"
            />
          </div>
           <div className="mt-8 pt-6 border-t border-white/5">
             <label className="block text-[11px] uppercase tracking-widest text-white/50 font-bold mb-2 flex items-center gap-2">
                 <ShieldCheck size={14} className="text-[var(--gold)]" /> Verified Account Binding
             </label>
             <p className="text-white/40 text-xs mt-1 font-mono leading-relaxed mb-6">
                Your authenticated session email will permanently bind to this claim request, serving as the master key for this venue.
             </p>

             {/* Co-Admin Email Sharing */}
             <label className="block text-[11px] uppercase tracking-widest text-white/60 font-bold mb-3">Invite Co-Administrators <span className="text-white/30 font-normal lowercase">(Optional)</span></label>
             <div className="flex gap-2">
                <input 
                  type="email" 
                  placeholder="e.g. foodandbev@club.com"
                  value={courseAdminInput}
                  onChange={(e) => setCourseAdminInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addAdminEmail())}
                  className="flex-grow bg-[rgba(255,255,255,0.02)] border-b border-[rgba(255,255,255,0.1)] rounded-t-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-[var(--gold)] transition-all placeholder:text-white/20"
                />
                <button type="button" onClick={addAdminEmail} className="bg-white/5 hover:bg-white/10 border-b border-white/10 text-white px-4 py-2 transition-all">
                  <Plus size={18} />
                </button>
             </div>
             
             {coAdminEmails.length > 0 && (
                <div className="mt-4 space-y-1 bg-black/20 rounded-lg p-2 border border-white/5">
                   {coAdminEmails.map((email, i) => (
                      <div key={i} className="flex flex-row items-center justify-between px-3 py-2 text-xs text-white/70 hover:text-white hover:bg-white/5 rounded-md transition-colors group">
                         <span className="font-mono">{email}</span>
                         <button type="button" onClick={() => removeAdminEmail(email)} className="text-white/30 group-hover:text-red-400 transition-colors">
                           <X size={14} />
                         </button>
                      </div>
                   ))}
                </div>
             )}
          </div>
       </div>

       <div className="mb-10">
          <label className="block text-[11px] uppercase tracking-widest text-white/50 font-bold mb-3">
            PGA Membership or Business Card
          </label>
          
          <div className="relative border-2 border-dashed border-white/10 rounded-2xl p-8 hover:border-[var(--gold)] hover:bg-[rgba(201,168,76,0.02)] transition-all flex flex-col items-center justify-center gap-4 text-center group cursor-pointer" style={pgaCardImageUrl ? { borderStyle: 'solid', borderColor: 'rgba(201,168,76,0.3)', background: 'rgba(0,0,0,0.5)' } : {}}>
             
             {/* The hidden native input utilizing UploadThing's trigger dynamically or the mock simulator */}
             <input type="file" accept="image/*" onChange={handleUploadSelection} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20" disabled={locked || isUploading} />

             {isUploading ? (
                <div className="flex flex-col items-center justify-center gap-4 text-center">
                   <Loader2 className="animate-spin text-[var(--gold)]" size={32} />
                   <span className="text-white/60 text-sm">Encrypting & Uploading to Protocol...</span>
                </div>
             ) : pgaCardImageUrl ? (
                <div className="flex flex-col items-center justify-center gap-4 text-center">
                   <CheckCircle2 className="text-[var(--gold)]" size={32} />
                   <div>
                     <div className="text-[var(--gold)] font-bold text-sm tracking-wide">Credentials Secured</div>
                     <div className="text-white/40 text-[10px] mt-1 font-mono uppercase">Encrypted_S3_Blob_Ready</div>
                   </div>
                </div>
             ) : (
                 <div className="flex flex-col items-center justify-center gap-4 text-center">
                     <div className="w-14 h-14 bg-white/5 rounded-full flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
                        <Upload size={22} className="text-white/40 group-hover:text-[var(--gold)] transition-colors" />
                     </div>
                     <div className="text-white/50 text-sm max-w-[200px]">
                       Tap to upload ID picture from camera or files
                     </div>
                 </div>
             )}
          </div>
       </div>

       <button type="submit" disabled={isSubmitting || !pgaCardImageUrl} className={`w-full font-bold uppercase tracking-widest text-sm py-4 rounded-xl transition-all ${isSubmitting || !pgaCardImageUrl ? 'bg-white/5 text-white/30 cursor-not-allowed' : 'bg-[var(--gold)] text-black hover:bg-white'}`}>
         {isSubmitting ? 'Scanning & Authenticating...' : 'Submit Claim Request'}
       </button>

    </form>
  );
}
