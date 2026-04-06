with open("src/app/host/page.tsx", "r") as f:
    text = f.read()

import re

# Fix 1: packages.map missing closing parenthesis in the Registration summary (line 1592-1601)
text = text.replace("""                                 <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem', fontSize: '0.75rem' }}>
                                    <span style={{ color: 'var(--mist)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100px' }}>{p.name}</span>
                                    <span style={{ fontWeight: 600, color: 'var(--ink)' }}>${p.price}</span>
                                 </div>
                           </div>""", """                                 <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem', fontSize: '0.75rem' }}>
                                    <span style={{ color: 'var(--mist)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100px' }}>{p.name}</span>
                                    <span style={{ fontWeight: 600, color: 'var(--ink)' }}>${p.price}</span>
                                 </div>
                              ))}
                           </div>""")


# Fix 2: activeTab === 'finance'
finance_old = """      if (activeTab === 'finance') {
         const entryFeeSubtotal = fee;
         const totalAddon = addons.reduce((acc, a) => acc + a.price, 0);
         const totalProcessing = passFees ? (stripeFee * 4) : 0;
         const totalDue = entryFeeSubtotal + totalAddon + totalProcessing;

         return (
            <div style={{ height: '450px', overflowY: 'auto', background: '#f8faf9', display: 'flex', justifyContent: 'center', alignItems: 'flex-start', padding: '3rem 2rem' }}>
              <div style={{ width: '100%', maxWidth: '400px', background: '#fff', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.08)', boxShadow: '0 10px 40px rgba(0,0,0,0.05)', padding: '2rem' }}>
                 <h3 style={{ margin: '0 0 0.5rem 0', fontFamily: 'Playfair Display, serif', fontSize: '1.5rem', color: 'var(--forest)' }}>Registration</h3>
                 <div style={{ fontSize: '0.8rem', color: 'var(--mist)', marginBottom: '1.5rem' }}>{name || 'Tournament Title'}</div>

                 <div style={{ borderTop: '1px solid rgba(0,0,0,0.05)', borderBottom: '1px solid rgba(0,0,0,0.05)', padding: '1.5rem 0', marginBottom: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', fontSize: '0.9rem' }}>
                       <span style={{ fontWeight: 600, color: 'var(--ink)' }}>Primary Package</span>
                       <span style={{ fontWeight: 700, color: 'var(--ink)' }}>${entryFeeSubtotal.toFixed(2)}</span>
                    </div>
                    {addons.map((a, i) => (
                        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', fontSize: '0.85rem' }}>
                           <span style={{ color: 'var(--mist)' }}>+ {a.name}</span>
                           <span style={{ fontWeight: 600, color: 'var(--mist)' }}>${a.price.toFixed(2)}</span>
                        </div>
                    {passFees && (
                       <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', fontSize: '0.85rem' }}>
                          <span style={{ color: 'var(--mist)' }}>+ Platform & Tax</span>
                          <span style={{ fontWeight: 600, color: 'var(--mist)' }}>${(stripeFee * 4).toFixed(2)}</span>
                       </div>
                    )}
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(0,0,0,0.05)' }}>
                       <span style={{ fontWeight: 800, color: 'var(--forest)', fontSize: '1.1rem' }}>Total Due</span>
                       <span style={{ fontWeight: 800, color: 'var(--forest)', fontSize: '1.1rem' }}>${totalDue.toFixed(2)}</span>
                    </div>
                    <div style={{ background: '#f4f7f5', padding: '1rem', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.05)', marginTop: '1.5rem' }}>
                       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--forest)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>💳 Split Payment at Checkout</span>
                          <label className="toggle-switch" style={{ transform: 'scale(0.8)' }}>
                            <input type="checkbox" checked={false} readOnly />
                            <span className="toggle-slider"></span>
                          </label>
                       </div>
                       <div style={{ fontSize: '0.75rem', color: 'var(--mist)', lineHeight: 1.5 }}>
                          <b>How it works:</b> The registering player controls the ledger. They can split it entirely using <b>Affirm/Klarna</b> natively, OR pay their fraction and generate a <b>Secure Team Link</b> to text their 3 buddies to collect the remaining fractions! Your Tournament gets paid in full instantly.
                       </div>
                    </div>
                 </div>
                 <button style={{ width: '100%', padding: '0.8rem', background: `linear-gradient(135deg, ${activeSecondaryColor}, ${themeColor})`, color: '#fff', fontWeight: 700, border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem', transition: '0.2s', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}>Credit / Debit Checkout</button>"""

finance_new = """      if (activeTab === 'finance') {
         const entryFeeSubtotal = packages.length > 0 ? Number(packages[0].price) : 0;
         const entryFeePassed = packages.length > 0 && packages[0].passFees;
         
         const totalAddon = addons.reduce((acc, a) => acc + Number(a.price), 0);
         const passedAddons = addons.filter(a => a.passFees).reduce((acc, a) => acc + Number(a.price), 0);
         
         const baseFeeRate = charityType === 'golf_sponsored' ? 0.022 : 0.029;
         
         const entryProcessing = entryFeePassed ? (entryFeeSubtotal * baseFeeRate + 0.30) : 0;
         const addonProcessing = passedAddons > 0 ? (passedAddons * baseFeeRate + 0.30) : 0;
         const totalProcessing = entryProcessing + addonProcessing;
         
         const totalDue = entryFeeSubtotal + totalAddon + totalProcessing;

         return (
            <div style={{ height: '450px', overflowY: 'auto', background: '#f8faf9', display: 'flex', justifyContent: 'center', alignItems: 'flex-start', padding: '3rem 2rem' }}>
              <div style={{ width: '100%', maxWidth: '400px', background: '#fff', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.08)', boxShadow: '0 10px 40px rgba(0,0,0,0.05)', padding: '2rem' }}>
                 <h3 style={{ margin: '0 0 0.5rem 0', fontFamily: 'Playfair Display, serif', fontSize: '1.5rem', color: 'var(--forest)' }}>Registration</h3>
                 <div style={{ fontSize: '0.8rem', color: 'var(--mist)', marginBottom: '1.5rem' }}>{name || 'Tournament Title'}</div>

                 <div style={{ borderTop: '1px solid rgba(0,0,0,0.05)', borderBottom: '1px solid rgba(0,0,0,0.05)', padding: '1.5rem 0', marginBottom: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', fontSize: '0.9rem' }}>
                       <span style={{ fontWeight: 600, color: 'var(--ink)' }}>{packages.length > 0 ? packages[0].name : 'Primary Package'}</span>
                       <span style={{ fontWeight: 700, color: 'var(--ink)' }}>${entryFeeSubtotal.toFixed(2)}</span>
                    </div>
                    {addons.map((a, i) => (
                        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', fontSize: '0.85rem' }}>
                           <span style={{ color: 'var(--mist)' }}>+ {a.name}</span>
                           <span style={{ fontWeight: 600, color: 'var(--mist)' }}>${Number(a.price).toFixed(2)}</span>
                        </div>
                    ))}
                    {totalProcessing > 0 && (
                       <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', fontSize: '0.85rem' }}>
                          <div style={{ display: 'flex', flexDirection: 'column' }}>
                             <span style={{ color: 'var(--mist)', fontWeight: 600 }}>Standard Credit Card Processing Entity Fee</span>
                             <span style={{ color: '#aaa', fontSize: '0.65rem' }}>TourneyLinks charges exactly $0 platform & convenience fees.</span>
                          </div>
                          <span style={{ fontWeight: 600, color: 'var(--mist)' }}>${totalProcessing.toFixed(2)}</span>
                       </div>
                    )}
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(0,0,0,0.05)' }}>
                       <span style={{ fontWeight: 800, color: 'var(--forest)', fontSize: '1.1rem' }}>Total Due</span>
                       <span style={{ fontWeight: 800, color: 'var(--forest)', fontSize: '1.1rem' }}>${totalDue.toFixed(2)}</span>
                    </div>
                    <div style={{ background: '#f4f7f5', padding: '1rem', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.05)', marginTop: '1.5rem' }}>
                       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--forest)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>💳 Split Payment at Checkout</span>
                          <label className="toggle-switch" style={{ transform: 'scale(0.8)' }}>
                            <input type="checkbox" checked={false} readOnly />
                            <span className="toggle-slider"></span>
                          </label>
                       </div>
                       <div style={{ fontSize: '0.75rem', color: 'var(--mist)', lineHeight: 1.5 }}>
                          <b>How it works:</b> The registering player controls the ledger. They can split it entirely using <b>Affirm/Klarna</b> natively, OR pay their fraction and generate a <b>Secure Team Link</b> to text their buddies to collect the remaining fractions! Your Tournament gets paid in full instantly.
                       </div>
                    </div>
                 </div>
                 <button style={{ width: '100%', padding: '0.8rem', background: `linear-gradient(135deg, ${activeSecondaryColor}, ${themeColor})`, color: '#fff', fontWeight: 700, border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem', transition: '0.2s', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}>Credit / Debit Checkout</button>"""

if finance_old in text:
    text = text.replace(finance_old, finance_new)
    print("Injected finance new successfully")
else:
    print("Did NOT find finance wrapper")
    
# Third syntax error: Sponsor Preview mapping has `passFees`
sponsors_preview_old = """      if (activeTab === 'sponsorships') {
         // Mock total processing if a user purchased one of each mapped item
         const totalProcessing = passFees ? sponsors.reduce((acc, s) => acc + (s.price * 0.029 + 0.30), 0) : 0;
         const subtotal = sponsors.reduce((acc, s) => acc + s.price, 0);"""
sponsors_preview_new = """      if (activeTab === 'sponsorships') {
         // Mock total processing if a user purchased one of each mapped item
         const baseFeeRate = charityType === 'golf_sponsored' ? 0.022 : 0.029;
         const totalProcessing = sponsors.filter(s => s.passFees).reduce((acc, s) => acc + (s.price * baseFeeRate + 0.30), 0);
         const subtotal = sponsors.reduce((acc, s) => acc + s.price, 0);"""
         
if sponsors_preview_old in text:
    text = text.replace(sponsors_preview_old, sponsors_preview_new)
    print("Injected sponsors preview old successfully")
else:
    print("Could not find sponsors_preview_old")

sponsors_checkout_old = """                          <span style={{ color: 'var(--mist)' }}>+ {(stripeFee * 4).toFixed(2)} Platform & Processing</span>"""
sponsors_checkout_new = """                          <div style={{ display: 'flex', flexDirection: 'column' }}>
                             <span style={{ color: 'var(--mist)', fontWeight: 600 }}>Standard Credit Card Processing Entity Fee</span>
                             <span style={{ color: '#aaa', fontSize: '0.65rem' }}>TourneyLinks charges exactly $0 platform & convenience fees.</span>
                          </div>
                          <span style={{ fontWeight: 600, color: 'var(--mist)' }}>${totalProcessing.toFixed(2)}</span>"""
if sponsors_checkout_old in text:
    text = text.replace(sponsors_checkout_old, sponsors_checkout_new)
    text = text.replace("""                    {passFees && (
                       <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', fontSize: '0.85rem' }}>
                          <div style={{ display: 'flex', flexDirection: 'column' }}>
                             <span style={{ color: 'var(--mist)', fontWeight: 600 }}>Standard Credit Card Processing Entity Fee</span>
                             <span style={{ color: '#aaa', fontSize: '0.65rem' }}>TourneyLinks charges exactly $0 platform & convenience fees.</span>
                          </div>
                          <span style={{ fontWeight: 600, color: 'var(--mist)' }}>${totalProcessing.toFixed(2)}</span>
                       </div>
                    )}""", """                    {totalProcessing > 0 && (
                       <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', fontSize: '0.85rem' }}>
                          <div style={{ display: 'flex', flexDirection: 'column' }}>
                             <span style={{ color: 'var(--mist)', fontWeight: 600 }}>Standard Credit Card Processing Entity Fee</span>
                             <span style={{ color: '#aaa', fontSize: '0.65rem' }}>TourneyLinks charges exactly $0 platform & convenience fees.</span>
                          </div>
                          <span style={{ fontWeight: 600, color: 'var(--mist)' }}>${totalProcessing.toFixed(2)}</span>
                       </div>
                    )}""")
    print("Injected sponsors checkout verbiage successfully")

with open("src/app/host/page.tsx", "w") as f:
    f.write(text)
