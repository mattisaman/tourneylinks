import sys

def main():
    with open("src/app/host/page.tsx", "r") as f:
        content = f.read()

    # Find the end of Activity & Logistics / Format & Branding (end of renderContentTab)
    # the end is:
    #                 </div>
    #              </div>
    #           </div>
    #         </div>
    #
    #      </div>
    #   );
    #
    #   const renderFinanceTab = () => (

    import re
    # We will look for "const renderFinanceTab = () => (" and inject the new wizard-card right above the "</div>\n  );"
    target_pattern = r"(      \</div\>\n   \);\n\n   const renderFinanceTab = \(\) \=\> \()"

    setup_donations_ui = """
        {/* Setup Donations & 501(c)(3) Entity Block - Moved to bottom of Campaign Setup */}
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

                 <label style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', padding: '1rem', background: charityType === 'none' ? 'rgba(212,175,55,0.05)' : '#fff', borderRadius: '6px', border: charityType === 'none' ? '1px solid var(--gold)' : '1px solid rgba(0,0,0,0.1)', cursor: 'pointer' }}>
                    <input type="radio" name="charityType" checked={charityType === 'none'} onChange={() => { setCharityType('none'); }} style={{ width: '1.2rem', height: '1.2rem', accentColor: 'var(--gold)' }} />
                    <div>
                       <div style={{ fontWeight: 600, color: 'var(--ink)' }}>No 501(c)(3) affiliation</div>
                       <div style={{ fontSize: '0.75rem', color: 'var(--mist)' }}>Funds are collected directly as non-tax-deductible gifts.</div>
                    </div>
                 </label>

                 <label style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', padding: '1rem', background: charityType === 'own' ? 'rgba(212,175,55,0.05)' : '#fff', borderRadius: '6px', border: charityType === 'own' ? '1px solid var(--gold)' : '1px solid rgba(0,0,0,0.1)', cursor: 'pointer' }}>
                    <input type="radio" name="charityType" checked={charityType === 'own'} onChange={() => { setCharityType('own'); if(charityName === 'G.O.L.F. Foundation') setCharityName(''); }} style={{ width: '1.2rem', height: '1.2rem', accentColor: 'var(--gold)' }} />
                    <div>
                       <div style={{ fontWeight: 600, color: 'var(--ink)' }}>We have our own 501(c)(3)</div>
                       <div style={{ fontSize: '0.75rem', color: 'var(--mist)' }}>Provide your Tax ID instantly for donor receipts.</div>
                    </div>
                 </label>

                 <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.8rem', padding: '1rem', background: charityType === 'golf_sponsored' ? 'rgba(212,175,55,0.05)' : '#fff', borderRadius: '6px', border: charityType === 'golf_sponsored' ? '1px solid var(--gold)' : '1px solid rgba(0,0,0,0.1)', cursor: 'pointer' }}>
                    <input type="radio" name="charityType" checked={charityType === 'golf_sponsored'} onChange={() => { setCharityType('golf_sponsored'); setCharityName('G.O.L.F. Foundation'); }} style={{ width: '1.2rem', height: '1.2rem', accentColor: 'var(--gold)', marginTop: '0.2rem' }} />
                    <div style={{ flex: 1 }}>
                       <div style={{ fontWeight: 600, color: 'var(--ink)' }}>Apply for Fiscal Sponsorship (G.O.L.F.)</div>
                       <div style={{ fontSize: '0.75rem', color: 'var(--mist)', marginBottom: charityType === 'golf_sponsored' ? '1rem' : 0 }}>Process donations tax-free through the Gateway Outreach Links Foundation.</div>
                       
                       {charityType === 'golf_sponsored' && (
                          <div style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '6px', padding: '1rem' }} onClick={e => e.preventDefault()}>
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
                                   style={{ padding: '0.4rem 0.8rem', background: golfApplicationStatus === 'pending' ? '#e0ece0' : 'var(--forest)', color: golfApplicationStatus === 'pending' ? 'var(--forest)' : '#fff', border: 'none', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', opacity: (!golfApplicationCause || !golfPayoutInfo || !golfAgreementChecked) ? 0.6 : 1 }}
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
                 <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
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
        </div>\n"""
        
    replacement = setup_donations_ui + r"\1"
    content = re.sub(target_pattern, replacement, content)

    # Now, find Payouts & Treasury in renderLaunchTab
    payouts_target = """           <div style={{ color: 'var(--mist)', fontSize: '0.85rem', marginBottom: '1.5rem', lineHeight: 1.5 }}>
              Connect a validated Stripe account to enable automated payouts. Player entry fees and sponsor revenue will bypass TourneyLinks and flow directly into your connected treasury account.
           </div>
           
           <div style={{ background: '#f8faf9', padding: '1.5rem', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
             <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <DollarSign color="var(--forest)" size={24} />
                <div>
                   <div style={{ fontWeight: 700, color: 'var(--forest)' }}>Stripe Connect Identity</div>
                   <div style={{ fontSize: '0.75rem', color: 'var(--mist)' }}>Awaiting Boarding...</div>
                </div>
             </div>
             <StripeOnboardButton />
           </div>"""
           
    payouts_new = """           {charityType === 'golf_sponsored' ? (
              <div style={{ background: 'rgba(212,175,55,0.05)', border: '1px solid var(--gold)', borderRadius: '8px', padding: '1.5rem', display: 'flex', gap: '1rem' }}>
                 <div style={{ fontSize: '1.5rem' }}>⏳</div>
                 <div>
                    <strong style={{ color: 'var(--ink)', display: 'block', marginBottom: '0.4rem' }}>Gateway Links Foundation Treasury</strong>
                    <div style={{ color: 'var(--mist)', fontSize: '0.85rem', lineHeight: 1.5 }}>
                       Your application for Fiscal Sponsorship is currently <strong>Under Review</strong>. <br/><br/>
                       You do not need to connect a Stripe account. All transactions will be securely routed directly through the Foundation's audited accounts. You will be cleared for launch within 24 hours.
                    </div>
                 </div>
              </div>
           ) : (
              <>
                 <div style={{ color: 'var(--mist)', fontSize: '0.85rem', marginBottom: '1.5rem', lineHeight: 1.5 }}>
                    Connect a validated Stripe account to enable automated payouts. Player entry fees and sponsor revenue will bypass TourneyLinks and flow directly into your connected treasury account.
                 </div>
                 
                 <div style={{ background: '#f8faf9', padding: '1.5rem', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <DollarSign color="var(--forest)" size={24} />
                      <div>
                         <div style={{ fontWeight: 700, color: 'var(--forest)' }}>Stripe Connect Identity</div>
                         <div style={{ fontSize: '0.75rem', color: 'var(--mist)' }}>Awaiting Boarding...</div>
                      </div>
                   </div>
                   <StripeOnboardButton />
                 </div>
              </>
           )}"""
    content = content.replace(payouts_target, payouts_new)
    
    # Finally, dynamic fee calc if it exists.
    # Where is processingRate? We will search for 'const processingRate = 0.029;'
    fee_target = "const processingRate = 0.029;"
    fee_new = "const processingRate = isCharity ? 0.022 : 0.029;"
    content = content.replace(fee_target, fee_new)
        
    with open("src/app/host/page.tsx", "w") as f:
        f.write(content)
main()
