import sys
import re

with open("src/app/host/page.tsx", "r") as f:
    original = f.read()

content = original

# 1. Replace the header and background design
old_header = """    return (
      <div style={{ minHeight: '100vh', background: '#f4f7f5', paddingBottom: '5rem' }}>
         {/* Global Title Header */}
         <div style={{ background: '#fff', borderBottom: '1px solid rgba(0,0,0,0.05)', padding: '1.5rem 0' }}>
            <div style={{ maxWidth: '1600px', margin: '0 auto', padding: '0 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
               <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--gold)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.2rem' }}>Administration Hub</div>
                  <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '2rem', color: 'var(--forest)', margin: 0 }}>Live Campaign Builder</h1>
               </div>
               <div style={{ fontSize: '0.85rem', color: 'var(--mist)' }}>
                  Draft Auto-Saved at {new Date().toLocaleTimeString()}
               </div>
            </div>
         </div>"""
         
new_header = """    return (
      <div style={{ minHeight: '100vh', background: 'var(--stone)', paddingBottom: '5rem', position: 'relative', overflowX: 'hidden' }}>
         {/* Glassmorphic Background Elements */}
         <div style={{ position: 'absolute', top: '-10%', left: '-5%', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(212,175,55,0.15) 0%, rgba(212,175,55,0) 70%)', filter: 'blur(80px)', pointerEvents: 'none', zIndex: 0 }}></div>
         <div style={{ position: 'absolute', top: '20%', right: '-10%', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(34,74,44,0.1) 0%, rgba(34,74,44,0) 70%)', filter: 'blur(100px)', pointerEvents: 'none', zIndex: 0 }}></div>

         {/* Global Title Header */}
         <div style={{ background: 'rgba(255, 255, 255, 0.7)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.5)', padding: '1.5rem 0', position: 'sticky', top: 0, zIndex: 100, boxShadow: '0 4px 30px rgba(0,0,0,0.03)' }}>
            <div style={{ maxWidth: '1600px', margin: '0 auto', padding: '0 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
               <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'linear-gradient(135deg, var(--gold) 0%, #b8952a 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 10px rgba(212,175,55,0.3)' }}>
                     <span style={{ fontSize: '1.2rem' }}>✨</span>
                  </div>
                  <div>
                     <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--mist)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '0.2rem' }}>Administration Hub</div>
                     <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '2.2rem', color: 'var(--forest)', margin: 0, textShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>Live Campaign Builder</h1>
                  </div>
               </div>
               <div style={{ fontSize: '0.85rem', color: 'var(--mist)', display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(0,0,0,0.03)', padding: '0.5rem 1rem', borderRadius: '20px' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#2ecc71', boxShadow: '0 0 10px rgba(46,204,113,0.5)' }}></div>
                  Draft Auto-Saved at {new Date().toLocaleTimeString()}
               </div>
            </div>
         </div>"""

if old_header in content:
    content = content.replace(old_header, new_header)
else:
    print("WARNING: Could not find old_header")

# 2. Inject Setup Donations UI block into renderContentTab.
# Let's find:
#                 {/* Embedded Tile Preview */}
#                 <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--mist)', marginTop: '0.5rem' }}>Search Page Preview</div>
#                 <div style={{ width: '100%', borderRadius: '8px', overflow: 'hidden', border: '1px solid rgba(0,0,0,0.1)', background: '#fff' }}>
#                    <div style={{ height: '140px', background: tileImage ? `url(${tileImage}) ${tilePosition}/${tileZoom}% no-repeat` : '#fafaf5' }}></div>
#                    <div style={{ padding: '0.75rem' }}>
#                       <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--forest)' }}>{name || 'Tournament Title'}</div>
#                       <div style={{ fontSize: '0.7rem', color: 'var(--mist)' }}>{course ? `${course} · ${city}` : 'Course Location'}</div>
#                    </div>
#                 </div>
#              </div>
#           </div>
#         </div>
#      </div>
#   );
# We will inject the code right after }</div></div></div></div></div>

insertion_target = """                 <div style={{ width: '100%', borderRadius: '8px', overflow: 'hidden', border: '1px solid rgba(0,0,0,0.1)', background: '#fff' }}>
                   <div style={{ height: '140px', background: tileImage ? `url(${tileImage}) ${tilePosition}/${tileZoom}% no-repeat` : '#fafaf5' }}></div>
                   <div style={{ padding: '0.75rem' }}>
                      <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--forest)' }}>{name || 'Tournament Title'}</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--mist)' }}>{course ? `${course} · ${city}` : 'Course Location'}</div>
                   </div>
                </div>
             </div>
          </div>
        </div>"""
        
setup_donations = """
        {/* Setup Donations & 501(c)(3) Entity Block */}
        <div className="wizard-card" style={{ marginBottom: '2rem' }}>
           <div className="wizard-card-title">Setup Donations & 501(c)(3) Entity</div>
           
           <div style={{ marginTop: '0.5rem' }}>
              <div style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--ink)', marginBottom: '0.8rem' }}>501(c)(3) Status & Structure</div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', marginBottom: '1.5rem' }}>
                 <div style={{ background: 'rgba(46, 204, 113, 0.06)', border: '1px dashed rgba(46, 204, 113, 0.4)', borderRadius: '6px', padding: '1rem', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                    <div style={{ fontSize: '1.2rem' }}>💡</div>
                    <div>
                       <strong style={{ color: 'var(--forest)', fontSize: '0.85rem', display: 'block', marginBottom: '0.2rem' }}>Why 501(c)(3) Status Matters</strong>
                       <div style={{ color: 'var(--mist)', fontSize: '0.8rem', lineHeight: 1.5 }}>
                          Enabling tax-deductible receipts often unlocks <b>significantly larger contributions</b> from corporate sponsors and individual donors. It also unlocks discounted processing fees (2.2%) instead of standard (2.9%)!
                       </div>
                    </div>
                 </div>

                 <label style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', padding: '1rem', background: charityType === 'none' ? 'rgba(212,175,55,0.05)' : '#fff', borderRadius: '6px', border: charityType === 'none' ? '1px solid var(--gold)' : '1px solid rgba(0,0,0,0.1)', cursor: 'pointer', transition: '0.2s' }}>
                    <input type="radio" name="charityType" checked={charityType === 'none'} onChange={() => { setCharityType('none'); }} style={{ width: '1.2rem', height: '1.2rem', accentColor: 'var(--gold)' }} />
                    <div>
                       <div style={{ fontWeight: 600, color: 'var(--ink)' }}>No 501(c)(3) affiliation</div>
                       <div style={{ fontSize: '0.75rem', color: 'var(--mist)' }}>Funds are collected directly as non-tax-deductible gifts.</div>
                    </div>
                 </label>

                 <label style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', padding: '1rem', background: charityType === 'own' ? 'rgba(212,175,55,0.05)' : '#fff', borderRadius: '6px', border: charityType === 'own' ? '1px solid var(--gold)' : '1px solid rgba(0,0,0,0.1)', cursor: 'pointer', transition: '0.2s' }}>
                    <input type="radio" name="charityType" checked={charityType === 'own'} onChange={() => { setCharityType('own'); if(charityName === 'G.O.L.F. Foundation') setCharityName(''); }} style={{ width: '1.2rem', height: '1.2rem', accentColor: 'var(--gold)' }} />
                    <div>
                       <div style={{ fontWeight: 600, color: 'var(--ink)' }}>We have our own 501(c)(3)</div>
                       <div style={{ fontSize: '0.75rem', color: 'var(--mist)' }}>Provide your Tax ID instantly for donor receipts.</div>
                    </div>
                 </label>

                 <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.8rem', padding: '1rem', background: charityType === 'golf_sponsored' ? 'rgba(212,175,55,0.05)' : '#fff', borderRadius: '6px', border: charityType === 'golf_sponsored' ? '1px solid var(--gold)' : '1px solid rgba(0,0,0,0.1)', cursor: 'pointer', transition: '0.2s' }}>
                    <input type="radio" name="charityType" checked={charityType === 'golf_sponsored'} onChange={() => { setCharityType('golf_sponsored'); setCharityName('G.O.L.F. Foundation'); }} style={{ width: '1.2rem', height: '1.2rem', accentColor: 'var(--gold)', marginTop: '0.2rem' }} />
                    <div style={{ flex: 1 }}>
                       <div style={{ fontWeight: 600, color: 'var(--ink)' }}>Apply for Fiscal Sponsorship (G.O.L.F.)</div>
                       <div style={{ fontSize: '0.75rem', color: 'var(--mist)', marginBottom: charityType === 'golf_sponsored' ? '1rem' : 0 }}>Process donations tax-free through the Gateway Outreach Links Foundation.</div>
                       
                       {charityType === 'golf_sponsored' && (
                          <div style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '6px', padding: '1rem', marginTop: '0.5rem', animation: 'fadeIn 0.3s' }} onClick={e => e.preventDefault()}>
                             <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--forest)' }}>Describe your cause (required for board approval):</label>
                             <textarea value={golfApplicationCause} onChange={e => { e.stopPropagation(); setGolfApplicationCause(e.target.value); }} rows={3} style={{ width: '100%', padding: '0.6rem', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '4px', fontSize: '0.85rem', marginBottom: '0.8rem', resize: 'vertical' }} placeholder="E.g. We are raising funds for medical bills for a local high schooler..."></textarea>
                             
                             <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--forest)' }}>Preferred Disbursement Method:</label>
                             <div style={{ display: 'flex', gap: '1rem', marginBottom: '0.8rem' }}>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', cursor: 'pointer' }}>
                                   <input type="radio" checked={golfPayoutMethod === 'bank'} onChange={(e) => { e.stopPropagation(); setGolfPayoutMethod('bank'); }} style={{ accentColor: 'var(--forest)' }} /> Bank Transfer
                                </label>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', cursor: 'pointer' }}>
                                   <input type="radio" checked={golfPayoutMethod === 'check'} onChange={(e) => { e.stopPropagation(); setGolfPayoutMethod('check'); }} style={{ accentColor: 'var(--forest)' }} /> Mailed Check
                                </label>
                             </div>
                             
                             <input type="text" value={golfPayoutInfo} onChange={e => { e.stopPropagation(); setGolfPayoutInfo(e.target.value); }} placeholder={golfPayoutMethod === 'bank' ? "Enter Routing / Account Number or Zelle Email" : "Enter full mailing address"} style={{ width: '100%', padding: '0.6rem', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '4px', fontSize: '0.85rem', marginBottom: '1rem' }} />

                             <div style={{ background: '#f8faf9', padding: '1rem', borderRadius: '4px', border: '1px solid #e2e8f0', marginBottom: '1rem' }}>
                                <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', cursor: 'pointer' }}>
                                   <input type="checkbox" checked={golfAgreementChecked} onChange={(e) => { e.stopPropagation(); setGolfAgreementChecked(!golfAgreementChecked); }} style={{ marginTop: '0.2rem', accentColor: 'var(--forest)', width: '1rem', height: '1rem' }} />
                                   <span style={{ fontSize: '0.75rem', color: 'var(--ink)', lineHeight: 1.5 }}>
                                      <strong>Terms of Agreement:</strong> I acknowledge that by applying for fiscal sponsorship, all collected funds will be managed by the Gateway Outreach Links Foundation. Upon successful completion of the event, the Foundation will disburse all gross proceeds (minus standard Stripe processing fees of 2.2% + 30¢) directly to the tournament organizer using the method specified above.
                                   </span>
                                </label>
                             </div>
                             
                             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: golfApplicationStatus === 'pending' ? '#e6a100' : 'var(--mist)' }}>Status: {golfApplicationStatus === 'pending' ? 'Application Pending Review' : 'Draft'}</span>
                                <button 
                                   onClick={(e) => { 
                                      e.stopPropagation(); 
                                      e.preventDefault(); 
                                      if(!golfApplicationCause) return alert('Please enter a description of your cause.'); 
                                      if(!golfPayoutInfo) return alert('Please provide your disbursement information.');
                                      if(!golfAgreementChecked) return alert('You must agree to the Terms of Agreement to apply.');
                                      setGolfApplicationStatus('pending'); 
                                   }}
                                   style={{ padding: '0.4rem 0.8rem', background: golfApplicationStatus === 'pending' ? '#e0ece0' : 'var(--forest)', color: golfApplicationStatus === 'pending' ? 'var(--forest)' : '#fff', border: 'none', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', opacity: (!golfApplicationCause || !golfPayoutInfo || !golfAgreementChecked) ? 0.6 : 1, transition: '0.2s' }}
                                   disabled={golfApplicationStatus === 'pending'}
                                >
                                   {golfApplicationStatus === 'pending' ? 'Application Submitted' : 'Submit Application'}
                                </button>
                             </div>
                          </div>
                       )}
                    </div>
                 </label>
              </div>

              {charityType === 'own' && (
                 <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', animation: 'fadeIn 0.3s' }}>
                    <div className="wfield wform-full" style={{ flex: 2 }}>
                      <label>501(c)(3) Organization Name</label>
                      <input type="text" value={charityName} onChange={e => setCharityName(e.target.value)} placeholder="e.g. Jimmy Fund" />
                    </div>
                    <div className="wfield wform-full" style={{ flex: 1 }}>
                      <label>Tax ID (EIN)</label>
                      <input type="text" value={charityTaxId} onChange={e => setCharityTaxId(e.target.value)} placeholder="e.g. 12-3456789" />
                    </div>
                 </div>
              )}
           </div>
        </div>"""

if insertion_target in content:
    content = content.replace(insertion_target, insertion_target + setup_donations)
else:
    print("WARNING: Could not find insertion_target")

with open("src/app/host/page.tsx", "w") as f:
    f.write(content)

print("UI rewrite completed!")
