import sys

with open("src/app/courses/[id]/claim/ClaimCourseClient.tsx", "r") as f:
    content = f.read()

# Find the start of the return statement
return_start = content.find("return (\n    <form")
if return_start == -1:
    return_start = content.find("return (\n")

if return_start == -1:
    print("Could not find start of return block")
    sys.exit(1)

# Keep everything before the return block
top_half = content[:return_start]

new_return_block = """return (
    <form onSubmit={submitClaim} className="w-full">
       <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-20 mb-4">
          
          {/* Left Column: Instructions & Titles */}
          <div className="lg:col-span-5 flex flex-col lg:pt-4">
             <div className="mb-12 text-center lg:text-left">
                <h2 className="text-[var(--gold)] font-bold tracking-[0.2em] text-[12px] uppercase mb-4 flex justify-center lg:justify-start items-center gap-3">
                  <ShieldCheck size={18} />
                  Security Protocol
                </h2>
                
                <h1 className="text-[3rem] lg:text-[4rem] font-serif font-extrabold tracking-tight mb-8 leading-[1.15]" style={{ color: 'var(--admin-forest-dark)', letterSpacing: '-1px' }}>
                  Identity Verification
                </h1>

                {/* Vertical Process Steps */}
                <div className="flex flex-col gap-10 bg-[#FDFBF7] p-8 rounded-[2.5rem] border border-[rgba(0,0,0,0.03)] shadow-inner">
                   <div className="flex items-start gap-6">
                      <div className="w-12 h-12 rounded-full bg-[rgba(201,168,76,0.1)] border border-[rgba(201,168,76,0.3)] flex items-center justify-center flex-shrink-0 text-[var(--gold)] text-lg font-bold font-serif shadow-sm">1</div>
                      <div className="pt-1">
                         <h4 className="text-xl font-serif font-bold text-[var(--forest)] mb-2 tracking-tight">Upload Credentials</h4>
                         <p className="text-sm text-[var(--mist)] tracking-wide leading-relaxed">Provide your PGA ID or valid Employer Business Card.</p>
                      </div>
                   </div>
                   <div className="flex items-start gap-6">
                      <div className="w-12 h-12 rounded-full bg-[rgba(201,168,76,0.1)] border border-[rgba(201,168,76,0.3)] flex items-center justify-center flex-shrink-0 text-[var(--gold)] text-lg font-bold font-serif shadow-sm">2</div>
                      <div className="pt-1">
                         <h4 className="text-xl font-serif font-bold text-[var(--forest)] mb-2 tracking-tight">AI Match Extraction</h4>
                         <p className="text-sm text-[var(--mist)] tracking-wide leading-relaxed">Our visual model parses the name, role, and facility precisely printed on the card.</p>
                      </div>
                   </div>
                   <div className="flex items-start gap-6">
                      <div className="w-12 h-12 rounded-full bg-[rgba(201,168,76,0.1)] border border-[rgba(201,168,76,0.3)] flex items-center justify-center flex-shrink-0 text-[var(--gold)] text-lg font-bold font-serif shadow-sm">3</div>
                      <div className="pt-1">
                         <h4 className="text-xl font-serif font-bold text-[var(--forest)] mb-2 tracking-tight">Cross-Check & Activation</h4>
                         <p className="text-sm text-[var(--mist)] tracking-wide leading-relaxed">TourneyLinks staff securely reviews the confident AI match to unlock access.</p>
                      </div>
                   </div>
                </div>
             </div>
          </div>

          {/* Right Column: Form Inputs */}
          <div className="lg:col-span-7 flex flex-col justify-center">
             
             {errorMsg && (
               <div className="p-5 mb-8 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-2xl font-medium tracking-wide">
                 {errorMsg}
               </div>
             )}

             <div className="flex flex-col gap-14">
                
                {/* Field 1: Primary Title */}
                <div className="flex flex-col">
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

                {/* Field 2: Delegated Access */}
                <div className="flex flex-col pt-10 border-t border-[rgba(0,0,0,0.04)]">
                   <div className="flex items-center justify-between mb-4 pl-2">
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

                {/* Field 3: File Upload */}
                <div className="flex flex-col pt-10 border-t border-[rgba(0,0,0,0.04)]">
                   <label className="block text-[12px] uppercase tracking-[0.2em] text-[var(--forest)] font-bold mb-4 pl-2 opacity-80">
                     PGA Membership or Business Card
                   </label>
                   
                   <div className="relative border-[2px] rounded-[2.5rem] p-16 hover:border-[var(--gold)] hover:bg-[rgba(201,168,76,0.03)] transition-all flex flex-col items-center justify-center gap-6 text-center group cursor-pointer bg-[rgba(255,255,255,0.6)] shadow-sm" style={pgaCardImageUrl ? { borderStyle: 'solid', borderColor: 'var(--gold)', background: 'rgba(201,168,76,0.05)' } : { borderStyle: 'dashed', borderColor: 'rgba(0,0,0,0.08)' }}>
                      
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

                <div className="pt-6">
                   <button type="submit" disabled={isSubmitting || !pgaCardImageUrl} className={`w-full font-bold uppercase tracking-[0.25em] text-sm py-6 rounded-3xl transition-all ${isSubmitting || !pgaCardImageUrl ? 'bg-[rgba(0,0,0,0.04)] text-[var(--mist)] cursor-not-allowed border border-[rgba(0,0,0,0.04)] shadow-none' : 'bg-[var(--gold-foil)] text-[var(--ink)] hover:scale-[1.02] shadow-[var(--metallic-shadow)] hover:text-black border-none'}`}>
                     {isSubmitting ? 'Scanning & Authenticating...' : 'Submit Claim Request'}
                   </button>
                </div>

             </div>
          </div>

       </div>
    </form>
  );
}
"""

final_content = top_half + new_return_block

with open("src/app/courses/[id]/claim/ClaimCourseClient.tsx", "w") as f:
    f.write(final_content)

print("SUCCESS")
