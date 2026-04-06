import re

with open("src/app/host/page.tsx", "r") as f:
    text = f.read()

target = r"(\)\}\n*)\s*<button\s*onClick=\{\(\) => \{\s*if \(newPackage\.name && newPackage\.price"

replacement = r"""\1
                     {/* Live Ledger Preview inside Form */}
                     {(() => {
                        const pPrice = Number(newPackage.price) || 0;
                        const standardFee = pPrice > 0 ? pPrice * 0.029 + 0.30 : 0;
                        const charityFee = pPrice > 0 ? pPrice * 0.022 + 0.30 : 0;
                        const payoutStandard = newPackage.passFees ? pPrice : pPrice - standardFee;
                        const payoutCharity = newPackage.passFees ? pPrice : pPrice - charityFee;

                        if (pPrice === 0) return null;

                        return (
                           <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginTop: '1.2rem', marginBottom: '1.5rem', padding: '1rem', background: '#fff', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.1)' }}>
                              <div style={{ width: '100%', fontSize: '0.8rem', fontWeight: 700, color: 'var(--ink)' }}>Live Payout Preview</div>
                              <div style={{ flex: 1, background: charityType === 'none' ? 'rgba(0,0,0,0.03)' : 'transparent', padding: '0.6rem 0.8rem', borderRadius: '4px', border: charityType === 'none' ? '1px solid rgba(0,0,0,0.1)' : '1px dashed rgba(0,0,0,0.1)', opacity: charityType === 'none' ? 1 : 0.5 }}>
                                 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.2rem' }}>
                                    <div style={{ fontSize: '0.65rem', color: 'var(--mist)', fontWeight: 600 }}>STANDARD PAYOUT</div>
                                    {charityType === 'none' && <div style={{ fontSize: '0.55rem', background: '#e0e0e0', color: '#555', padding: '0.1rem 0.3rem', borderRadius: '4px', fontWeight: 700 }}>ACTIVE</div>}
                                 </div>
                                 <div style={{ fontSize: '1rem', color: 'var(--ink)', fontWeight: 700 }}>${payoutStandard.toFixed(2)}</div>
                              </div>
                              <div style={{ flex: 1, background: charityType !== 'none' ? 'rgba(212,175,55,0.05)' : 'transparent', padding: '0.6rem 0.8rem', borderRadius: '4px', border: charityType !== 'none' ? '1px solid rgba(212,175,55,0.2)' : '1px dashed rgba(0,0,0,0.1)', opacity: charityType !== 'none' ? 1 : 0.5 }}>
                                 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.2rem' }}>
                                    <div style={{ fontSize: '0.65rem', color: charityType !== 'none' ? 'var(--forest)' : 'var(--mist)', fontWeight: 600 }}>★ 501(C)(3) PAYOUT</div>
                                    {charityType !== 'none' && <div style={{ fontSize: '0.55rem', background: 'var(--gold)', color: '#fff', padding: '0.1rem 0.3rem', borderRadius: '4px', fontWeight: 700 }}>ACTIVE</div>}
                                 </div>
                                 <div style={{ fontSize: '1rem', color: charityType !== 'none' ? 'var(--grass)' : 'var(--mist)', fontWeight: 700 }}>${payoutCharity.toFixed(2)}</div>
                              </div>
                           </div>
                        );
                     })()}

                     <button 
                        onClick={() => {
                           if (newPackage.name && newPackage.price"""

text = re.sub(target, replacement, text)

with open("src/app/host/page.tsx", "w") as f:
    f.write(text)

