with open("src/app/courses/[id]/claim/ClaimCourseClient.tsx", "w") as f:
    f.write("""\"use client\";

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

  const handleUploadSelection = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    if (isDemo) {
       setTimeout(() => {
         setPgaCardImageUrl('https://aws-s3-proxy-bucket/pga-card-mock-' + Date.now() + '.jpg');
         setLocked(true);
       }, 1500);
    } else {
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
       <div className="w-full bg-white border border-[rgba(0,0,0,0.06)] rounded-[2rem] shadow-[0_30px_80px_rgba(0,0,0,0.1)] relative z-20 flex flex-col items-center justify-center text-center p-16">
            <CheckCircle2 size={80} className="text-[#C9A84C] mb-8" />
            <h2 className="text-4xl font-serif font-bold text-[#053321] mb-6">Claim Pending AI Validation</h2>
            <p className="text-lg text-gray-500 max-w-xl mx-auto mb-10 leading-relaxed">
              Your credentials have been securely stored. Our team will visually verify your card details against your Professional Account. You will receive an email once the Node is unlocked.
            </p>
            <button onClick={() => router.push(`/courses/${courseId}`)} className="px-10 py-4 bg-[#FDFBF7] border border-[rgba(201,168,76,0.3)] text-[#C9A84C] font-bold uppercase tracking-widest text-sm rounded-[1rem] hover:bg-[rgba(201,168,76,0.1)] transition-colors">
               Return to Facility Profile
            </button>
       </div>
    );
  }

  return (
    <form onSubmit={submitClaim} className="w-full relative z-20">
       <div className="w-full bg-white border border-[rgba(0,0,0,0.06)] rounded-[2.5rem] shadow-[0_40px_100px_rgba(0,0,0,0.15)] relative overflow-hidden" style={{ minHeight: '650px' }}>
          
          <div className="flex flex-col lg:flex-row w-full h-full min-h-[650px]">
             
             {/* Left Column: Instructions */}
             <div className="w-full lg:w-[45%] flex flex-col items-center lg:items-start bg-white" style={{ padding: '5rem 4rem' }}>
                <h2 className="text-[#C9A84C] font-bold uppercase mb-6 flex items-center justify-center lg:justify-start gap-4" style={{ fontSize: '12px', letterSpacing: '0.25em' }}>
                  <ShieldCheck size={18} />
                  Security Protocol
                </h2>
                
                <h1 className="font-serif font-extrabold mb-12 text-center lg:text-left text-[#053321]" style={{ fontSize: '4.5rem', lineHeight: '1.1', letterSpacing: '-1.5px', textShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                  Identity<br/>Verification
                </h1>

                <div className="flex flex-col gap-10 p-10 rounded-[2.5rem] border border-[rgba(0,0,0,0.04)] w-full" style={{ background: 'linear-gradient(180deg, #FDFBF7 0%, #FAF8F2 100%)', boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.02)' }}>
                   <div className="flex items-start gap-6 group">
                      <div className="w-12 h-12 rounded-full bg-[rgba(201,168,76,0.1)] border border-[rgba(201,168,76,0.3)] flex items-center justify-center flex-shrink-0 text-[#C9A84C] text-lg font-bold font-serif shadow-sm group-hover:scale-110 group-hover:bg-[#C9A84C] group-hover:text-white transition-all">1</div>
                      <div className="pt-1">
                         <h4 className="text-xl font-serif font-bold text-[#053321] mb-2 tracking-tight">Upload Credentials</h4>
                         <p className="text-sm text-gray-500 tracking-wide leading-relaxed">Provide your PGA ID or valid Employer Business Card.</p>
                      </div>
                   </div>
                   <div className="flex items-start gap-6 group">
                      <div className="w-12 h-12 rounded-full bg-[rgba(201,168,76,0.1)] border border-[rgba(201,168,76,0.3)] flex items-center justify-center flex-shrink-0 text-[#C9A84C] text-lg font-bold font-serif shadow-sm group-hover:scale-110 group-hover:bg-[#C9A84C] group-hover:text-white transition-all">2</div>
                      <div className="pt-1">
                         <h4 className="text-xl font-serif font-bold text-[#053321] mb-2 tracking-tight">AI Match Extraction</h4>
                         <p className="text-sm text-gray-500 tracking-wide leading-relaxed">Our visual model parses the name, role, and facility precisely printed on the card.</p>
                      </div>
                   </div>
                   <div className="flex items-start gap-6 group">
                      <div className="w-12 h-12 rounded-full bg-[rgba(201,168,76,0.1)] border border-[rgba(201,168,76,0.3)] flex items-center justify-center flex-shrink-0 text-[#C9A84C] text-lg font-bold font-serif shadow-sm group-hover:scale-110 group-hover:bg-[#C9A84C] group-hover:text-white transition-all">3</div>
                      <div className="pt-1">
                         <h4 className="text-xl font-serif font-bold text-[#053321] mb-2 tracking-tight">Cross-Check & Activation</h4>
                         <p className="text-sm text-gray-500 tracking-wide leading-relaxed">TourneyLinks staff securely reviews the confident AI match to unlock access.</p>
                      </div>
                   </div>
                </div>
             </div>

             {/* Right Column: Inputs */}
             <div className="w-full lg:w-[55%] flex flex-col justify-center relative" style={{ padding: '5rem 5rem', borderLeft: '1px solid rgba(0,0,0,0.04)', background: '#FAF8F4' }}>
                
                {errorMsg && (
                  <div className="p-6 mb-8 bg-red-500/10 border border-red-500/20 text-red-500 text-sm rounded-2xl font-bold tracking-wide">
                    {errorMsg}
                  </div>
                )}

                <div className="flex flex-col w-full" style={{ gap: '3rem' }}>
                   
                   {/* Field 1: Primary Title */}
                   <div className="flex flex-col">
                     <label className="block text-[#053321] font-bold mb-4 opacity-80" style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.2em' }}>Primary Title / Role</label>
                     <input 
                       type="text" 
                       required
                       placeholder="e.g. Head Professional, Gen. Manager"
                       value={roleTitle}
                       onChange={(e) => setRoleTitle(e.target.value)}
                       className="w-full bg-white border border-[rgba(0,0,0,0.06)] rounded-[1.5rem] px-8 text-xl text-[#053321] shadow-sm focus:outline-none focus:border-[#C9A84C] focus:ring-[rgba(201,168,76,0.15)] focus:ring-[6px] transition-all placeholder:text-gray-400 font-medium"
                       style={{ height: '76px' }}
                     />
                   </div>

                   {/* Field 2: Delegated Access */}
                   <div className="flex flex-col">
                      <div className="flex items-center justify-between mb-4">
                          <label className="text-[#053321] font-bold flex items-center gap-3 opacity-80" style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.2em' }}>
                             Delegated Access <span className="text-gray-400 lowercase font-normal opacity-70">(Optional)</span>
                          </label>
                      </div>
                      
                      <div className="flex gap-4">
                         <input 
                           type="email" 
                           placeholder="Invite Co-Admin (e.g. foodandbev@club.com)"
                           value={courseAdminInput}
                           onChange={(e) => setCourseAdminInput(e.target.value)}
                           onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addAdminEmail())}
                           className="flex-grow bg-white border border-[rgba(0,0,0,0.06)] rounded-[1.5rem] px-8 text-xl text-[#053321] shadow-sm focus:outline-none focus:border-[#C9A84C] transition-all placeholder:text-gray-400 font-medium"
                           style={{ height: '76px' }}
                         />
                         <button type="button" onClick={addAdminEmail} className="bg-transparent hover:bg-[rgba(201,168,76,0.08)] border border-[rgba(0,0,0,0.08)] hover:border-[#C9A84C] text-[#053321] px-8 rounded-[1.5rem] shadow-sm transition-all flex items-center justify-center">
                           <Plus size={24} />
                         </button>
                      </div>
                      
                      {coAdminEmails.length > 0 && (
                         <div className="mt-6 flex flex-col gap-3">
                            {coAdminEmails.map((email, i) => (
                               <div key={i} className="flex flex-row items-center justify-between px-6 py-4 text-base text-[#053321] bg-white border border-[rgba(0,0,0,0.04)] shadow-sm rounded-[1rem] group transition-all">
                                  <span className="font-mono text-[13px] tracking-wide font-medium">{email}</span>
                                  <button type="button" onClick={() => removeAdminEmail(email)} className="text-gray-400 hover:text-red-500 transition-colors p-2 bg-[rgba(0,0,0,0.02)] rounded-full hover:bg-red-50">
                                    <X size={16} />
                                  </button>
                               </div>
                            ))}
                         </div>
                      )}
                   </div>

                   {/* Field 3: File Upload */}
                   <div className="flex flex-col">
                      <label className="block text-[#053321] font-bold mb-4 opacity-80" style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.2em' }}>
                        PGA Membership or Business Card
                      </label>
                      
                      <div className="relative border-[2px] rounded-[2rem] p-12 hover:border-[#C9A84C] hover:bg-[rgba(201,168,76,0.03)] transition-all flex flex-col items-center justify-center text-center group cursor-pointer bg-white shadow-sm" style={pgaCardImageUrl ? { borderStyle: 'solid', borderColor: '#C9A84C', background: 'rgba(201,168,76,0.05)', gap: '1.5rem' } : { borderStyle: 'dashed', borderColor: 'rgba(0,0,0,0.15)', gap: '1.5rem' }}>
                         
                         <input type="file" accept="image/*" onChange={handleUploadSelection} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20" disabled={locked || isUploading} />

                         {isUploading ? (
                            <div className="flex flex-col items-center justify-center gap-6 text-center">
                               <Loader2 className="animate-spin text-[#C9A84C]" size={48} />
                               <span className="text-[#053321] text-lg font-bold tracking-tight">Encrypting & Uploading...</span>
                            </div>
                         ) : pgaCardImageUrl ? (
                            <div className="flex flex-col items-center justify-center gap-5 text-center">
                               <div className="w-20 h-20 bg-[rgba(201,168,76,0.1)] rounded-full flex justify-center items-center">
                                 <CheckCircle2 className="text-[#C9A84C]" size={44} />
                               </div>
                               <div>
                                 <div className="text-[#053321] font-bold text-2xl tracking-tight mb-2">Credentials Secured</div>
                                 <div className="text-[rgba(201,168,76,0.8)] text-[11px] font-mono uppercase tracking-[0.2em] font-bold">Encrypted / S3 Blob Ready</div>
                               </div>
                            </div>
                         ) : (
                             <div className="flex flex-col items-center justify-center gap-5 text-center pointer-events-none">
                                 <div className="w-24 h-24 bg-white border border-[rgba(0,0,0,0.06)] rounded-full flex items-center justify-center mb-4 group-hover:scale-105 group-hover:shadow-[0_10px_30px_rgba(201,168,76,0.2)] group-hover:border-[rgba(201,168,76,0.4)] transition-all duration-500 shadow-sm">
                                    <Upload size={32} className="text-gray-400 group-hover:text-[#C9A84C] transition-colors duration-500" />
                                 </div>
                                 <div className="text-[#053321] text-[17px] font-bold leading-relaxed max-w-[280px]">
                                   Tap to upload picture from camera or system files
                                 </div>
                             </div>
                         )}
                      </div>
                   </div>

                   <div className="pt-6">
                      <button type="submit" disabled={isSubmitting || !pgaCardImageUrl} className={`w-full font-bold uppercase rounded-[1.5rem] transition-all flex items-center justify-center ${isSubmitting || !pgaCardImageUrl ? 'bg-[rgba(0,0,0,0.04)] text-gray-400 cursor-not-allowed border border-[rgba(0,0,0,0.04)] shadow-none' : 'text-[#050B08] hover:scale-[1.02] shadow-[0_10px_30px_rgba(201,168,76,0.4)] hover:text-black hover:shadow-[0_15px_40px_rgba(201,168,76,0.5)] border-none'}`} style={isSubmitting || !pgaCardImageUrl ? { fontSize: '15px', letterSpacing: '0.25em', height: '80px' } : { fontSize: '15px', letterSpacing: '0.25em', height: '80px', background: 'linear-gradient(135deg, #FFDF73 0%, #C9A84C 100%)' }}>
                        {isSubmitting ? 'Scanning & Authenticating...' : 'Submit Claim Request'}
                      </button>
                   </div>

                </div>
             </div>

          </div>
       </div>
    </form>
  );
}
""")
