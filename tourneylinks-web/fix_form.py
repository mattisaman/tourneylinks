import sys

with open("src/app/courses/[id]/claim/page.tsx", "r") as f:
    page_content = f.read()

# I will move the white styling INSIDE the Client Component
page_content = page_content.replace(
    'className="w-full max-w-6xl bg-white border border-[rgba(0,0,0,0.04)] rounded-[2.5rem] p-10 md:p-16 shadow-[0_30px_80px_rgba(0,0,0,0.15)] relative z-20"',
    'className="w-full max-w-7xl relative z-20"'
)

with open("src/app/courses/[id]/claim/page.tsx", "w") as f:
    f.write(page_content)

with open("src/app/courses/[id]/claim/ClaimCourseClient.tsx", "r") as f:
    client_content = f.read()

return_start = client_content.find("return (")
top_half = client_content[:return_start]

new_return = """return (
    <form onSubmit={submitClaim} className="w-full">
       <div className="w-full bg-white border border-[rgba(0,0,0,0.06)] rounded-[2rem] shadow-[0_30px_80px_rgba(0,0,0,0.1)] relative z-20 overflow-hidden" style={{ minHeight: '600px' }}>
          
          <div className="grid grid-cols-1 lg:grid-cols-12" style={{ width: '100%' }}>
             
             {/* Left Column: Instructions */}
             <div className="lg:col-span-5 flex flex-col items-center lg:items-start" style={{ padding: '4rem 3rem' }}>
                <h2 className="text-[#C9A84C] font-bold uppercase mb-6 flex items-center justify-center lg:justify-start gap-3" style={{ fontSize: '13px', letterSpacing: '0.2em' }}>
                  <ShieldCheck size={20} />
                  Security Protocol
                </h2>
                
                <h1 className="font-serif font-extrabold mb-10 text-center lg:text-left text-[#053321]" style={{ fontSize: '4.5rem', lineHeight: '1.2', letterSpacing: '-1px' }}>
                  Identity Verification
                </h1>

                <div className="flex flex-col gap-10 bg-[#FDFBF7] p-10 rounded-[2rem] border border-[rgba(0,0,0,0.04)] shadow-inner w-full">
                   <div className="flex items-start gap-6">
                      <div className="w-12 h-12 rounded-full bg-[rgba(201,168,76,0.1)] border border-[rgba(201,168,76,0.3)] flex items-center justify-center flex-shrink-0 text-[#C9A84C] text-lg font-bold font-serif shadow-sm">1</div>
                      <div className="pt-1">
                         <h4 className="text-xl font-serif font-bold text-[#053321] mb-2 tracking-tight">Upload Credentials</h4>
                         <p className="text-sm text-gray-500 tracking-wide leading-relaxed">Provide your PGA ID or valid Employer Business Card.</p>
                      </div>
                   </div>
                   <div className="flex items-start gap-6">
                      <div className="w-12 h-12 rounded-full bg-[rgba(201,168,76,0.1)] border border-[rgba(201,168,76,0.3)] flex items-center justify-center flex-shrink-0 text-[#C9A84C] text-lg font-bold font-serif shadow-sm">2</div>
                      <div className="pt-1">
                         <h4 className="text-xl font-serif font-bold text-[#053321] mb-2 tracking-tight">AI Match Extraction</h4>
                         <p className="text-sm text-gray-500 tracking-wide leading-relaxed">Our visual model parses the name, role, and facility precisely printed on the card.</p>
                      </div>
                   </div>
                   <div className="flex items-start gap-6">
                      <div className="w-12 h-12 rounded-full bg-[rgba(201,168,76,0.1)] border border-[rgba(201,168,76,0.3)] flex items-center justify-center flex-shrink-0 text-[#C9A84C] text-lg font-bold font-serif shadow-sm">3</div>
                      <div className="pt-1">
                         <h4 className="text-xl font-serif font-bold text-[#053321] mb-2 tracking-tight">Cross-Check & Activation</h4>
                         <p className="text-sm text-gray-500 tracking-wide leading-relaxed">TourneyLinks staff securely reviews the confident AI match to unlock access.</p>
                      </div>
                   </div>
                </div>
             </div>

             {/* Right Column: Inputs */}
             <div className="lg:col-span-7 flex flex-col justify-center bg-[#faf9f5]" style={{ padding: '4rem 4rem', borderLeft: '1px solid rgba(0,0,0,0.03)' }}>
                
                {errorMsg && (
                  <div className="p-5 mb-8 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-2xl font-medium tracking-wide">
                    {errorMsg}
                  </div>
                )}

                <div className="flex flex-col gap-14 w-full">
                   
                   {/* Field 1: Primary Title */}
                   <div className="flex flex-col">
                     <label className="block text-[#053321] font-bold mb-4 opacity-80" style={{ fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.2em' }}>Primary Title / Role</label>
                     <input 
                       type="text" 
                       required
                       placeholder="e.g. Head Professional, Gen. Manager"
                       value={roleTitle}
                       onChange={(e) => setRoleTitle(e.target.value)}
                       className="w-full bg-white border border-[rgba(0,0,0,0.08)] rounded-[1.5rem] px-8 py-5 text-xl text-[#053321] shadow-sm focus:outline-none focus:border-[#C9A84C] focus:ring-[rgba(201,168,76,0.15)] focus:ring-4 transition-all placeholder:text-gray-400 font-medium"
                     />
                   </div>

                   {/* Field 2: Delegated Access */}
                   <div className="flex flex-col">
                      <div className="flex items-center justify-between mb-4">
                          <label className="text-[#053321] font-bold flex items-center gap-3 opacity-80" style={{ fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.2em' }}>
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
                           className="flex-grow bg-white border border-[rgba(0,0,0,0.08)] rounded-[1.5rem] px-8 py-5 text-xl text-[#053321] shadow-sm focus:outline-none focus:border-[#C9A84C] transition-all placeholder:text-gray-400 font-medium"
                         />
                         <button type="button" onClick={addAdminEmail} className="bg-transparent hover:bg-[rgba(201,168,76,0.1)] border border-[rgba(0,0,0,0.1)] hover:border-[#C9A84C] text-[#053321] px-8 rounded-[1.5rem] shadow-sm transition-all flex items-center justify-center">
                           <Plus size={24} />
                         </button>
                      </div>
                      
                      {coAdminEmails.length > 0 && (
                         <div className="mt-5 flex flex-col gap-3">
                            {coAdminEmails.map((email, i) => (
                               <div key={i} className="flex flex-row items-center justify-between px-6 py-4 text-base text-[#053321] bg-white border border-[rgba(0,0,0,0.06)] rounded-2xl group transition-all">
                                  <span className="font-mono text-sm tracking-wide font-medium">{email}</span>
                                  <button type="button" onClick={() => removeAdminEmail(email)} className="text-gray-400 hover:text-red-500 transition-colors p-2 bg-white rounded-full shadow-sm hover:shadow-md">
                                    <X size={18} />
                                  </button>
                               </div>
                            ))}
                         </div>
                      )}
                   </div>

                   {/* Field 3: File Upload */}
                   <div className="flex flex-col">
                      <label className="block text-[#053321] font-bold mb-4 opacity-80" style={{ fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.2em' }}>
                        PGA Membership or Business Card
                      </label>
                      
                      <div className="relative border-[2px] rounded-[1.5rem] p-12 hover:border-[#C9A84C] hover:bg-[rgba(201,168,76,0.03)] transition-all flex flex-col items-center justify-center gap-6 text-center group cursor-pointer bg-white shadow-sm" style={pgaCardImageUrl ? { borderStyle: 'solid', borderColor: '#C9A84C', background: 'rgba(201,168,76,0.05)' } : { borderStyle: 'dashed', borderColor: 'rgba(0,0,0,0.15)' }}>
                         
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
                                 <div className="text-[rgba(201,168,76,0.8)] text-xs font-mono uppercase tracking-[0.2em] font-bold">Encrypted / S3 Blob Ready</div>
                               </div>
                            </div>
                         ) : (
                             <div className="flex flex-col items-center justify-center gap-5 text-center pointer-events-none">
                                 <div className="w-20 h-20 bg-white border border-[rgba(0,0,0,0.06)] rounded-full flex items-center justify-center mb-2 group-hover:scale-105 group-hover:shadow-[0_10px_30px_rgba(201,168,76,0.2)] group-hover:border-[rgba(201,168,76,0.4)] transition-all duration-500 shadow-sm">
                                    <Upload size={32} className="text-gray-400 group-hover:text-[#C9A84C] transition-colors duration-500" />
                                 </div>
                                 <div className="text-[#053321] text-base font-bold leading-relaxed max-w-[280px]">
                                   Tap to upload picture from camera or system files
                                 </div>
                             </div>
                         )}
                      </div>
                   </div>

                   <div className="pt-6">
                      <button type="submit" disabled={isSubmitting || !pgaCardImageUrl} className={`w-full font-bold uppercase py-6 rounded-[1.5rem] transition-all ${isSubmitting || !pgaCardImageUrl ? 'bg-[rgba(0,0,0,0.04)] text-gray-400 cursor-not-allowed border border-[rgba(0,0,0,0.04)] shadow-none' : 'text-[#050B08] hover:scale-[1.02] shadow-[0_4px_15px_rgba(201,168,76,0.4)] hover:text-black border-none'}`} style={isSubmitting || !pgaCardImageUrl ? { fontSize: '14px', letterSpacing: '0.25em' } : { fontSize: '14px', letterSpacing: '0.25em', background: 'linear-gradient(135deg, #FFDF73 0%, #C9A84C 100%)' }}>
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
"""

with open("src/app/courses/[id]/claim/ClaimCourseClient.tsx", "w") as f:
    f.write(top_half + new_return)

print("SUCCESS")
