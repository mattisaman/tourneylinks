import re

with open("src/app/host/page.tsx", "r") as f:
    text = f.read()

# Helper block for the exact UI we want to render for any ledger!
# We will inject the math setup directly before it for each context!

def get_ledger_ui(is_live=False):
    title = "<div style={{ width: '100%', fontSize: '0.8rem', fontWeight: 700, color: 'var(--ink)' }}>Live Payout Preview</div>" if is_live else ""
    # We will assume variables exist in scope: golferPaysStandard, payoutStandard, golferPaysCharity, payoutCharity
    return f"""                              {title}
                              <div style={{{{ flex: 1, background: charityType === 'none' ? 'rgba(0,0,0,0.03)' : 'transparent', padding: '0.8rem', borderRadius: '6px', border: charityType === 'none' ? '1px solid rgba(0,0,0,0.1)' : '1px dashed rgba(0,0,0,0.1)', opacity: charityType === 'none' ? 1 : 0.5 }}}}>
                                 <div style={{{{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}}}>
                                    <div style={{{{ fontSize: '0.65rem', color: 'var(--mist)', fontWeight: 800, letterSpacing: '0.5px' }}}}>STANDARD (2.9% + 30¢)</div>
                                    {{charityType === 'none' && <div style={{{{ fontSize: '0.55rem', background: '#e0e0e0', color: '#555', padding: '0.1rem 0.3rem', borderRadius: '4px', fontWeight: 700 }}}}>ACTIVE</div>}}
                                 </div>
                                 <div style={{{{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px dotted rgba(0,0,0,0.1)', paddingBottom: '0.4rem', marginBottom: '0.4rem' }}}}>
                                    <div style={{{{ fontSize: '0.75rem', color: 'var(--mist)' }}}}>Golfer Pays:</div>
                                    <div style={{{{ fontSize: '0.85rem', color: 'var(--ink)', fontWeight: 600 }}}}>${{golferPaysStandard.toFixed(2)}}</div>
                                 </div>
                                 <div style={{{{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}}}>
                                    <div style={{{{ fontSize: '0.85rem', color: 'var(--ink)', fontWeight: 600 }}}}>You Keep:</div>
                                    <div style={{{{ fontSize: '1.2rem', color: 'var(--ink)', fontWeight: 800 }}}}>${{payoutStandard.toFixed(2)}}</div>
                                 </div>
                              </div>
                              <div style={{{{ flex: 1, background: charityType !== 'none' ? 'rgba(212,175,55,0.05)' : 'transparent', padding: '0.8rem', borderRadius: '6px', border: charityType !== 'none' ? '1px solid rgba(212,175,55,0.3)' : '1px dashed rgba(0,0,0,0.1)', opacity: charityType !== 'none' ? 1 : 0.5 }}}}>
                                 <div style={{{{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}}}>
                                    <div style={{{{ fontSize: '0.65rem', color: charityType !== 'none' ? 'var(--forest)' : 'var(--mist)', fontWeight: 800, letterSpacing: '0.5px' }}}}>★ 501C3 (2.2% + 30¢)</div>
                                    {{charityType !== 'none' && <div style={{{{ fontSize: '0.55rem', background: 'var(--gold)', color: '#fff', padding: '0.1rem 0.3rem', borderRadius: '4px', fontWeight: 700 }}}}>ACTIVE</div>}}
                                 </div>
                                 <div style={{{{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px dotted rgba(212,175,55,0.3)', paddingBottom: '0.4rem', marginBottom: '0.4rem' }}}}>
                                    <div style={{{{ fontSize: '0.75rem', color: charityType !== 'none' ? 'var(--forest)' : 'var(--mist)' }}}}>Golfer Pays:</div>
                                    <div style={{{{ fontSize: '0.85rem', color: charityType !== 'none' ? 'var(--forest)' : 'var(--mist)', fontWeight: 600 }}}}>${{golferPaysCharity.toFixed(2)}}</div>
                                 </div>
                                 <div style={{{{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}}}>
                                    <div style={{{{ fontSize: '0.85rem', color: charityType !== 'none' ? 'var(--grass)' : 'var(--mist)', fontWeight: 600 }}}}>You Keep:</div>
                                    <div style={{{{ fontSize: '1.2rem', color: charityType !== 'none' ? 'var(--grass)' : 'var(--mist)', fontWeight: 800 }}}}>${{payoutCharity.toFixed(2)}}</div>
                                 </div>
                              </div>"""

# 1. LIVE PREVIEW BLOCK
live_target = r"const pPrice = Number\(newPackage\.price\) \|\| 0;\n\s*const standardFee = .*\n\s*const charityFee = .*\n\s*const payoutStandard = .*\n\s*const payoutCharity = .*\n\n\s*if \(pPrice === 0\) return null;\n\n\s*return \(\n\s*<div style=\{\{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginTop: '1\.2rem', marginBottom: '1\.5rem', padding: '1rem', background: '#fff', borderRadius: '8px', border: '1px solid rgba\(0,0,0,0\.1\)' \}\}>\n\s*<div style=\{\{ width: '100%', fontSize: '0\.8rem', fontWeight: 700, color: 'var\(--ink\)' \}\}>Live Payout Preview</div>\n\s*<div style=\{\{ flex: 1, background: charityType === 'none' \? 'rgba\(0,0,0,0\.03\)' : 'transparent', padding: '0\.6rem 0\.8rem', borderRadius: '4px', border: charityType === 'none' \? '1px solid rgba\(0,0,0,0\.1\)' : '1px dashed rgba\(0,0,0,0\.1\)', opacity: charityType === 'none' \? 1 : 0\.5 \}\}>\n.*?</div>\n\s*</div>\n\s*\);\n\s*\}\)\(\)\}"

live_replacement = """const pPrice = Number(newPackage.price) || 0;
                        const pFees = newPackage.passFees;
                        
                        const standardTotalIfPassed = pPrice > 0 ? (pPrice + 0.30) / 0.971 : 0;
                        const standardFeeIfAbsorbed = pPrice > 0 ? (pPrice * 0.029) + 0.30 : 0;
                        const golferPaysStandard = pFees ? standardTotalIfPassed : pPrice;
                        const payoutStandard = pFees ? pPrice : (pPrice - standardFeeIfAbsorbed);

                        const charityTotalIfPassed = pPrice > 0 ? (pPrice + 0.30) / 0.978 : 0;
                        const charityFeeIfAbsorbed = pPrice > 0 ? (pPrice * 0.022) + 0.30 : 0;
                        const golferPaysCharity = pFees ? charityTotalIfPassed : pPrice;
                        const payoutCharity = pFees ? pPrice : (pPrice - charityFeeIfAbsorbed);

                        if (pPrice === 0) return null;

                        return (
                           <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginTop: '1.2rem', marginBottom: '1.5rem', padding: '1rem', background: '#fff', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.1)' }}>
""" + get_ledger_ui(True) + """
                           </div>
                        );
                     })()}"""

text = re.sub(live_target, live_replacement, text, flags=re.DOTALL)

# 2. SAVED PACKAGE BLOCK
saved_target = r"const standardFee = p\.price > 0 \? p\.price \* 0\.029 \+ 0\.30 : 0;\n\s*const charityFee = p\.price > 0 \? p\.price \* 0\.022 \+ 0\.30 : 0;\n\s*const payoutStandard = p\.passFees \? p\.price : p\.price - standardFee;\n\s*const payoutCharity = p\.passFees \? p\.price : p\.price - charityFee;\n\s*return \(\n\s*<div key=\{i\} style=\{\{ display: 'flex', flexDirection: 'column', padding: '1rem', border: '1px solid rgba\(0,0,0,0\.05\)', borderRadius: '8px', background: '#f8faf9' \}\}>\n\s*<div style=\{\{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' \}\}>\n(.*?)\n\s*</div>\n\s*<div style=\{\{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginTop: '1rem', paddingTop: '0\.8rem', borderTop: '1px solid rgba\(0,0,0,0\.05\)' \}\}>\n.*?</div>\n\s*</div>\n\s*\)\}\)"

saved_replacement = r"""const pPrice = Number(p.price) || 0;
                  const pFees = p.passFees;
                  
                  const standardTotalIfPassed = pPrice > 0 ? (pPrice + 0.30) / 0.971 : 0;
                  const standardFeeIfAbsorbed = pPrice > 0 ? (pPrice * 0.029) + 0.30 : 0;
                  const golferPaysStandard = pFees ? standardTotalIfPassed : pPrice;
                  const payoutStandard = pFees ? pPrice : (pPrice - standardFeeIfAbsorbed);

                  const charityTotalIfPassed = pPrice > 0 ? (pPrice + 0.30) / 0.978 : 0;
                  const charityFeeIfAbsorbed = pPrice > 0 ? (pPrice * 0.022) + 0.30 : 0;
                  const golferPaysCharity = pFees ? charityTotalIfPassed : pPrice;
                  const payoutCharity = pFees ? pPrice : (pPrice - charityFeeIfAbsorbed);

                  return (
                  <div key={i} style={{ display: 'flex', flexDirection: 'column', padding: '1rem', border: '1px solid rgba(0,0,0,0.05)', borderRadius: '8px', background: '#f8faf9' }}>
                     <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
\1
                     </div>
                     <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginTop: '1rem', paddingTop: '0.8rem', borderTop: '1px solid rgba(0,0,0,0.05)' }}>
""" + get_ledger_ui(False) + r"""
                     </div>
                  </div>
               )})"""

text = re.sub(saved_target, saved_replacement, text, flags=re.DOTALL)

with open("src/app/host/page.tsx", "w") as f:
    f.write(text)

