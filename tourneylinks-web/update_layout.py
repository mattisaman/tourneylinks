import sys

with open("src/app/courses/[id]/claim/page.tsx", "r") as f:
    page_content = f.read()

page_content = page_content.replace(
    '<div className="w-full max-w-5xl mb-12 text-center md:text-left" style={{ marginTop: \'150px\' }}>',
    '<div className="w-full max-w-7xl mb-12 text-center md:text-left" style={{ marginTop: \'150px\' }}>'
)
page_content = page_content.replace(
    '<div className="w-full max-w-5xl relative z-20">',
    '<div className="w-full max-w-7xl relative z-20">'
)

with open("src/app/courses/[id]/claim/page.tsx", "w") as f:
    f.write(page_content)



with open("src/app/courses/[id]/claim/ClaimCourseClient.tsx", "r") as f:
    client_content = f.read()

return_start = client_content.find("  return (\\n    <form")
if return_start == -1:
    return_start = client_content.find("  return (\\n")

top_half = client_content[:return_start]

new_return = """  return (
    <form onSubmit={submitClaim} className="w-full relative z-20">
       <div className="w-full bg-white border border-[rgba(0,0,0,0.06)] rounded-[2.5rem] shadow-[0_40px_100px_rgba(0,0,0,0.15)] overflow-hidden">
          
          <div className="flex flex-col lg:flex-row w-full h-full min-h-[600px]">
             
             {/* Left Column: Instructions */}
             <div className="w-full lg:w-[40%] flex flex-col p-10 lg:p-16 bg-white relative">
                
                <h2 className="text-[#C9A84C] font-bold uppercase mb-4 flex items-center justify-center lg:justify-start gap-4 text-xs tracking-[0.25em]">
                  <ShieldCheck size={18} />
                  Security Protocol
                </h2>
                
                <h1 className="font-serif font-extrabold mb-10 text-center lg:text-left text-[#053321] text-4xl lg:text-5xl leading-tight tracking-tight">
                  Identity Verification
                </h1>

                <p className="text-[#053321]/60 text-lg mb-10 text-center lg:text-left max-w-sm">
                  Complete the verification protocol below to securely bind your PGA Membership credentials.
                </p>

                <div className="flex flex-col gap-8 w-full mt-auto">
                   <div className="flex items-start gap-5 group">
                      <div className="w-10 h-10 rounded-full bg-[rgba(201,168,76,0.1)] border border-[rgba(201,168,76,0.3)] flex items-center justify-center flex-shrink-0 text-[#C9A84C] font-bold font-serif shadow-sm group-hover:scale-110 group-hover:bg-[#C9A84C] group-hover:text-white transition-all">1</div>
                      <div className="pt-1">
                         <h4 className="text-lg font-serif font-bold text-[#053321] mb-1 tracking-tight">Upload Credentials</h4>
                         <p className="text-sm text-gray-500 tracking-wide leading-relaxed">Provide your PGA ID or valid Employer Business Card.</p>
                      </div>
                   </div>
                   <div className="flex items-start gap-5 group">
                      <div className="w-10 h-10 rounded-full bg-[rgba(201,168,76,0.1)] border border-[rgba(201,168,76,0.3)] flex items-center justify-center flex-shrink-0 text-[#C9A84C] font-bold font-serif shadow-sm group-hover:scale-110 group-hover:bg-[#C9A84C] group-hover:text-white transition-all">2</div>
                      <div className="pt-1">
                         <h4 className="text-lg font-serif font-bold text-[#053321] mb-1 tracking-tight">AI Match Extraction</h4>
                         <p className="text-sm text-gray-500 tracking-wide leading-relaxed">Our visual model parses the name, role, and facility printed on the card.</p>
                      </div>
                   </div>
                   <div className="flex items-start gap-5 group">
                      <div className="w-10 h-10 rounded-full bg-[rgba(201,168,76,0.1)] border border-[rgba(201,168,76,0.3)] flex items-center justify-center flex-shrink-0 text-[#C9A84C] font-bold font-serif shadow-sm group-hover:scale-110 group-hover:bg-[#C9A84C] group-hover:text-white transition-all">3</div>
                      <div className="pt-1">
                         <h4 className="text-lg font-serif font-bold text-[#053321] mb-1 tracking-tight">Cross-Check & Activation</h4>
                         <p className="text-sm text-gray-500 tracking-wide leading-relaxed">TourneyLinks staff securely reviews the confident AI match to unlock access.</p>
                      </div>
                   </div>
                </div>
             </div>

             {/* Right Column: Inputs */}
             <div className="w-full lg:w-[60%] flex flex-col justify-center p-10 lg:p-16 border-l border-[rgba(0,0,0,0.04)] bg-[#FAF8F4]">
                
                {errorMsg && (
                  <div className="p-5 mb-8 bg-red-500/10 border border-red-500/20 text-red-500 text-sm rounded-xl font-bold tracking-wide">
                    {errorMsg}
                  </div>
                )}

                <div className="flex flex-col gap-10 w-full max-w-2xl mx-auto">
                   
                   {/* Field 1: Primary Title */}
                   <div className="flex flex-col">
                     <label className="block text-[#053321] font-bold mb-3 opacity-80 text-xs uppercase tracking-[0.2em]">Primary Title / Role</label>
                     <input 
                       type="text" 
                       required
                       placeholder="e.g. Head Professional, Gen. Manager"
                       value={roleTitle}
                       onChange={(e) => setRoleTitle(e.target.value)}
                       className="w-full bg-white border border-[rgba(0,0,0,0.06)] rounded-2xl px-6 py-5 text-lg text-[#053321] shadow-sm focus:outline-none focus:border-[#C9A84C] focus:ring-[4px] focus:ring-[rgba(201,168,76,0.15)] transition-all placeholder:text-gray-400 font-medium"
                     />
                   </div>

                   {/* Field 2: Delegated Access */}
                   <div className="flex flex-col">
                      <div className="flex items-center justify-between mb-3">
                          <label className="text-[#053321] font-bold flex items-center gap-3 opacity-80 text-xs uppercase tracking-[0.2em]">
                             Delegated Access <span className="text-gray-400 lowercase font-normal opacity-70">(Optional)</span>
                          </label>
                      </div>
                      
                      <div className="flex gap-3">
                         <input 
                           type="email" 
                           placeholder="Invite Co-Admin (e.g. foodandbev@club.com)"
                           value={courseAdminInput}
                           onChange={(e) => setCourseAdminInput(e.target.value)}
                           onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addAdminEmail())}
                           className="flex-grow bg-white border border-[rgba(0,0,0,0.06)] rounded-2xl px-6 py-5 text-lg text-[#053321] shadow-sm focus:outline-none focus:border-[#C9A84C] focus:ring-[4px] focus:ring-[rgba(201,168,76,0.15)] transition-all placeholder:text-gray-400 font-medium"
                         />
                         <button type="button" onClick={addAdminEmail} className="bg-transparent hover:bg-[rgba(201,168,76,0.08)] border border-[rgba(0,0,0,0.08)] hover:border-[#C9A84C] text-[#053321] px-6 rounded-2xl shadow-sm transition-all flex items-center justify-center">
                           <Plus size={24} />
                         </button>
                      </div>
                      
                      {coAdminEmails.length > 0 && (
                         <div className="mt-4 flex flex-col gap-2">
                            {coAdminEmails.map((email, i) => (
                               <div key={i} className="flex flex-row items-center justify-between px-5 py-3 text-base text-[#053321] bg-white border border-[rgba(0,0,0,0.04)] shadow-sm rounded-xl group transition-all">
                                  <span className="font-mono text-xs tracking-wide font-medium">{email}</span>
                                  <button type="button" onClick={() => removeAdminEmail(email)} className="text-gray-400 hover:text-red-500 transition-colors p-1.5 bg-[rgba(0,0,0,0.02)] rounded-full hover:bg-red-50">
                                    <X size={14} />
                                  </button>
                               </div>
                            ))}
                         </div>
                      )}
                   </div>

                   {/* Field 3: File Upload */}
                   <div className="flex flex-col">
                      <label className="block text-[#053321] font-bold mb-3 opacity-80 text-xs uppercase tracking-[0.2em]">
                        PGA Membership or Business Card
                      </label>
                      
                      <div className="relative border-[2px] rounded-3xl p-10 hover:border-[#C9A84C] hover:bg-[rgba(201,168,76,0.03)] transition-all flex flex-col items-center justify-center text-center group cursor-pointer bg-white shadow-sm gap-5" style={pgaCardImageUrl ? { borderStyle: 'solid', borderColor: '#C9A84C', background: 'rgba(201,168,76,0.05)' } : { borderStyle: 'dashed', borderColor: 'rgba(0,0,0,0.15)' }}>
                         
                         <input type="file" accept="image/*" onChange={handleUploadSelection} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20" disabled={locked || isUploading} />

                         {isUploading ? (
                            <div className="flex flex-col items-center justify-center gap-5 text-center">
                               <Loader2 className="animate-spin text-[#C9A84C]" size={42} />
                               <span className="text-[#053321] text-base font-bold tracking-tight">Encrypting & Uploading...</span>
                            </div>
                         ) : pgaCardImageUrl ? (
                            <div className="flex flex-col items-center justify-center gap-4 text-center">
                               <div className="w-16 h-16 bg-[rgba(201,168,76,0.1)] rounded-full flex justify-center items-center">
                                 <CheckCircle2 className="text-[#C9A84C]" size={36} />
                               </div>
                               <div>
                                 <div className="text-[#053321] font-bold text-xl tracking-tight mb-1">Credentials Secured</div>
                                 <div className="text-[rgba(201,168,76,0.8)] text-[10px] font-mono uppercase tracking-[0.2em] font-bold">Encrypted / Ready</div>
                               </div>
                            </div>
                         ) : (
                             <div className="flex flex-col items-center justify-center gap-4 text-center pointer-events-none">
                                 <div className="w-16 h-16 bg-white border border-[rgba(0,0,0,0.06)] rounded-full flex items-center justify-center group-hover:scale-105 group-hover:shadow-[0_10px_30px_rgba(201,168,76,0.2)] group-hover:border-[rgba(201,168,76,0.4)] transition-all duration-500 shadow-sm">
                                    <Upload size={24} className="text-gray-400 group-hover:text-[#C9A84C] transition-colors duration-500" />
                                 </div>
                                 <div className="text-[#053321] text-sm font-bold leading-relaxed max-w-[220px]">
                                   Tap to upload picture from camera or system files
                                 </div>
                             </div>
                         )}
                      </div>
                   </div>

                   <div className="pt-4">
                      <button type="submit" disabled={isSubmitting || !pgaCardImageUrl} className={`w-full font-bold uppercase rounded-2xl transition-all flex items-center justify-center text-sm tracking-[0.25em] py-5 ${isSubmitting || !pgaCardImageUrl ? 'bg-[rgba(0,0,0,0.04)] text-gray-400 cursor-not-allowed shadow-none' : 'text-[#050B08] hover:scale-[1.02] shadow-[0_10px_30px_rgba(201,168,76,0.3)] hover:text-black border-none bg-gradient-to-br from-[#FFDF73] to-[#C9A84C]'}`}>
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
