import re

with open("src/app/host/page.tsx", "r") as f:
    text = f.read()

# 1. Remove it from inside the package form
target_inner = """                 <div style={{ fontWeight: 700, color: 'var(--forest)', marginBottom: '1rem', fontSize: '0.9rem' }}>Create Custom Package</div>
                 <div style={{ background: 'rgba(212,175,55,0.1)', border: '1px dashed var(--gold)', padding: '0.6rem 0.8rem', borderRadius: '6px', fontSize: '0.75rem', color: 'var(--ink)', marginBottom: '1rem', display: 'flex', alignItems: 'flex-start', gap: '0.6rem', lineHeight: 1.4 }}>
                    <span style={{ fontSize: '1rem', filter: 'drop-shadow(0 2px 2px rgba(212,175,55,0.4))' }}>💡</span>
                    <div><strong style={{ color: 'var(--forest)' }}>PRO TIP:</strong> If you plan to "Absorb Fees" so registrants don't see Stripe processing fees at checkout, look at the active payout ledger below and raise your package price slightly to offset the fee! It's a great way to offer clean, round numbers.</div>
                 </div>"""

replacement_inner = """                 <div style={{ fontWeight: 700, color: 'var(--forest)', marginBottom: '1rem', fontSize: '0.9rem' }}>Create Custom Package</div>"""

text = text.replace(target_inner, replacement_inner)

# 2. Add it outside the package form, under the header.
target_outer = """           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div className="wizard-card-title" style={{ marginBottom: 0 }}>Registration Packages</div>
              <button onClick={() => setShowPackageForm(!showPackageForm)} className="btn-hero-outline" style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                 {showPackageForm ? 'Cancel' : <><Plus size={14} /> Mint Package</>}
              </button>
           </div>"""

replacement_outer = """           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div className="wizard-card-title" style={{ marginBottom: 0 }}>Registration Packages</div>
              <button onClick={() => setShowPackageForm(!showPackageForm)} className="btn-hero-outline" style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                 {showPackageForm ? 'Cancel' : <><Plus size={14} /> Mint Package</>}
              </button>
           </div>
           
           <div style={{ background: 'rgba(212,175,55,0.1)', border: '1px dashed var(--gold)', padding: '0.6rem 0.8rem', borderRadius: '6px', fontSize: '0.75rem', color: 'var(--ink)', marginBottom: '1.5rem', display: 'flex', alignItems: 'flex-start', gap: '0.6rem', lineHeight: 1.4 }}>
              <span style={{ fontSize: '1rem', filter: 'drop-shadow(0 2px 2px rgba(212,175,55,0.4))' }}>��</span>
              <div><strong style={{ color: 'var(--forest)' }}>PRO TIP:</strong> If you plan to "Absorb Fees" so registrants don't see Stripe processing fees at checkout, look at the active payout ledger below and raise your package price slightly to offset the fee! It's a great way to offer clean, round numbers.</div>
           </div>"""

text = text.replace(target_outer, replacement_outer)

with open("src/app/host/page.tsx", "w") as f:
    f.write(text)

