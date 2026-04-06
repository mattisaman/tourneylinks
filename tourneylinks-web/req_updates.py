import re

with open("src/app/host/page.tsx", "r") as f:
    text = f.read()

# 1. Provide the descriptive copy for the Foursome/Team checkbox
foursome_old = r"<label style=\{\{\s*display:\s*'flex',\s*alignItems:\s*'center',\s*gap:\s*'0\.5rem',\s*cursor:\s*'pointer'\s*\}\}>\s*<input type=\"checkbox\" checked=\{\s*newPackage\.isTeam\s*\} onChange=\{e => setNewPackage\(\{...newPackage,\s*isTeam:\s*e\.target\.checked\}\)\} />\s*<span style=\{\{\s*fontSize:\s*'0\.8rem',\s*color:\s*'var\(--ink\)',\s*fontWeight:\s*600\s*\}\}>This is a Foursome/Team Package</span>\s*</label>"

foursome_new = """<label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', cursor: 'pointer' }}>
                       <input type="checkbox" checked={newPackage.isTeam} onChange={e => setNewPackage({...newPackage, isTeam: e.target.checked})} style={{ marginTop: '0.15rem' }} />
                       <div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--ink)', fontWeight: 600 }}>This is a Foursome/Team Package</div>
                          <div style={{ fontSize: '0.7rem', color: 'var(--mist)', marginTop: '0.1rem', lineHeight: 1.4 }}>When checked, the system will prompt the buyer to enter names & contact info for 4 registered players during checkout.</div>
                       </div>
                    </label>"""

text = re.sub(foursome_old, foursome_new, text)

# 2. Extract tax ID fields directly underneath the radio button
taxid_regex_old = r"\{charityType\s*===\s*'own'\s*&&\s*\(\s*<div style=\{\{ display:\s*'flex',\s*gap:\s*'1rem',\s*marginBottom:\s*'1rem',\s*animation:\s*'fadeIn 0\.3s'\s*\}\}>\s*<div className=\"wfield wform-full\" style=\{\{ flex:\s*2 \}\}>\s*<label>501\(c\)\(3\) Organization Name</label>\s*<input type=\"text\" value=\{charityName\} onChange=\{e => setCharityName\(e.target.value\)\} placeholder=\"e\.g\. Jimmy Fund\" />\s*</div>\s*<div className=\"wfield wform-full\" style=\{\{ flex:\s*1 \}\}>\s*<label>Tax ID \(EIN\)</label>\s*<input type=\"text\" value=\{charityTaxId\} onChange=\{e => setCharityTaxId\(e.target.value\)\} placeholder=\"e\.g\. 12-3456789\" />\s*</div>\s*</div>\s*\)\}"
text = re.sub(taxid_regex_old, "", text)

own_radio_old = r"<label style=\{\{\s*display:\s*'flex',\s*alignItems:\s*'center',\s*gap:\s*'0\.8rem',\s*padding:\s*'1rem',\s*background:\s*charityType\s*===\s*'own'\s*\?\s*'rgba\(212,175,55,0\.05\)'\s*:\s*'#fff',\s*borderRadius:\s*'6px',\s*border:\s*charityType\s*===\s*'own'\s*\?\s*'1px solid var\(--gold\)'\s*:\s*'1px solid rgba\(0,0,0,0\.1\)',\s*cursor:\s*'pointer',\s*transition:\s*'0\.2s'\s*\}\}>\s*<input type=\"radio\" name=\"charityType\" checked=\{charityType\s*===\s*'own'\} onChange=\{.*\s*style=\{\{\s*width:\s*'1\.2rem',\s*height:\s*'1\.2rem',\s*accentColor:\s*'var\(--gold\)'\s*\}\}\s*/>\s*<div>\s*<div style=\{\{\s*fontWeight:\s*600,\s*color:\s*'var\(--ink\)'\s*\}\}>We have our own 501\(c\)\(3\)</div>\s*<div style=\{\{\s*fontSize:\s*'0\.75rem',\s*color:\s*'var\(--mist\)'\s*\}\}>Provide your Tax ID instantly for donor receipts\.</div>\s*</div>\s*</label>"

own_radio_new = """<label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.8rem', padding: '1rem', background: charityType === 'own' ? 'rgba(212,175,55,0.05)' : '#fff', borderRadius: '6px', border: charityType === 'own' ? '1px solid var(--gold)' : '1px solid rgba(0,0,0,0.1)', cursor: 'pointer', transition: '0.2s' }}>
                    <input type="radio" name="charityType" checked={charityType === 'own'} onChange={() => { setCharityType('own'); if(charityName === 'G.O.L.F. Foundation') setCharityName(''); }} style={{ width: '1.2rem', height: '1.2rem', accentColor: 'var(--gold)', marginTop: '0.2rem' }} />
                    <div style={{ flex: 1 }}>
                       <div style={{ fontWeight: 600, color: 'var(--ink)' }}>We have our own 501(c)(3)</div>
                       <div style={{ fontSize: '0.75rem', color: 'var(--mist)' }}>Provide your Tax ID instantly for donor receipts.</div>
                       {charityType === 'own' && (
                          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', padding: '1rem', borderTop: '1px solid rgba(0,0,0,0.05)', background: '#fff', borderRadius: '6px' }} onClick={e => e.preventDefault()}>
                             <div className="wfield" style={{ flex: 2, marginBottom: 0 }}>
                                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, marginBottom: '0.3rem', color: 'var(--forest)' }}>501(c)(3) Organization Name</label>
                                <input type="text" value={charityName} onChange={e => setCharityName(e.target.value)} placeholder="e.g. Jimmy Fund" style={{ padding: '0.5rem', width: '100%', borderRadius: '4px', border: '1px solid rgba(0,0,0,0.1)' }} />
                             </div>
                             <div className="wfield" style={{ flex: 1, marginBottom: 0 }}>
                                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, marginBottom: '0.3rem', color: 'var(--forest)' }}>Tax ID (EIN)</label>
                                <input type="text" value={charityTaxId} onChange={e => setCharityTaxId(e.target.value)} placeholder="e.g. 12-3456789" style={{ padding: '0.5rem', width: '100%', borderRadius: '4px', border: '1px solid rgba(0,0,0,0.1)' }} />
                             </div>
                          </div>
                       )}
                    </div>
                 </label>"""

text = re.sub(own_radio_old, own_radio_new, text)

# 3. Position the badges directly IN BETWEEN the header sections

desktop_dons_old = r"<div style=\{\{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.5rem' \}\}>\s*<div style=\{\{ fontSize: '0.8rem', fontWeight: 700, color: 'var\(--gold\)', letterSpacing: '0.1em', textTransform: 'uppercase' \}\}>Support the Cause</div>\s*\{charityType !== 'none' && <div style=\{\{ background: 'var\(--forest\)', color: '#fff', fontSize: '0.6rem', padding: '0.2rem 0.6rem', borderRadius: '12px', fontWeight: 600, letterSpacing: '0.05em' \}\}>501\(c\)\(3\) Tax-Deductible</div>\}\s*</div>\s*<h2 style=\{\{ fontFamily: 'Playfair Display, serif', fontSize: '2rem', color: 'var\(--forest\)', margin: 0 \}\}>Every Contribution Helps</h2>"
desktop_dons_new = """<div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--gold)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Support the Cause</div>
                    {charityType !== 'none' && <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.5rem' }}><div style={{ background: 'var(--forest)', color: '#fff', fontSize: '0.6rem', padding: '0.2rem 0.6rem', borderRadius: '12px', fontWeight: 600, letterSpacing: '0.05em' }}>501(c)(3) Tax-Deductible</div></div>}
                    <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '2rem', color: 'var(--forest)', margin: 0 }}>Every Contribution Helps</h2>"""
text = text.replace(desktop_dons_old, desktop_dons_new)


mobile_dons_old = r"<div style=\{\{ fontSize: '0.65rem', fontWeight: 700, color: 'var\(--gold\)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.3rem' \}\}>Support the Cause</div>\s*<h2 style=\{\{ fontFamily: 'Playfair Display, serif', fontSize: '1.6rem', color: 'var\(--forest\)', margin: 0, lineHeight: 1.1 \}\}>Every Contribution Helps</h2>"
mobile_dons_new = """<div style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--gold)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.3rem' }}>Support the Cause</div>
                    {charityType !== 'none' && <div style={{ marginBottom: '0.2rem' }}><span style={{ background: 'var(--forest)', color: '#fff', fontSize: '0.55rem', padding: '0.2rem 0.5rem', borderRadius: '12px', fontWeight: 600, letterSpacing: '0.05em' }}>501(c)(3) Tax-Deductible</span></div>}
                    <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.6rem', color: 'var(--forest)', margin: 0, lineHeight: 1.1 }}>Every Contribution Helps</h2>"""
text = re.sub(mobile_dons_old, mobile_dons_new, text)

desktop_spons_old = r"<div style=\{\{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.5rem' \}\}>\s*<div style=\{\{ fontSize: '0.8rem', fontWeight: 700, color: 'var\(--gold\)', letterSpacing: '0.1em', textTransform: 'uppercase' \}\}>Partnership Opportunities</div>\s*\{charityType !== 'none' && <div style=\{\{ background: 'var\(--forest\)', color: '#fff', fontSize: '0.6rem', padding: '0.2rem 0.6rem', borderRadius: '12px', fontWeight: 600, letterSpacing: '0.05em' \}\}>501\(c\)\(3\) Tax-Deductible</div>\}\s*</div>\s*<h2 style=\{\{ fontFamily: 'Playfair Display, serif', fontSize: '2rem', color: 'var\(--forest\)', margin: 0 \}\}>Support Our Mission</h2>"
desktop_spons_new = """<div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--gold)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Partnership Opportunities</div>
                    {charityType !== 'none' && <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.5rem' }}><div style={{ background: 'var(--forest)', color: '#fff', fontSize: '0.6rem', padding: '0.2rem 0.6rem', borderRadius: '12px', fontWeight: 600, letterSpacing: '0.05em' }}>501(c)(3) Tax-Deductible</div></div>}
                    <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '2rem', color: 'var(--forest)', margin: 0 }}>Support Our Mission</h2>"""
text = re.sub(desktop_spons_old, desktop_spons_new, text)

mobile_spons_old = r"<div style=\{\{ fontSize: '0.65rem', fontWeight: 700, color: 'var\(--gold\)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.3rem' \}\}>Partnership Opportunities</div>\s*<h2 style=\{\{ fontFamily: 'Playfair Display, serif', fontSize: '1.6rem', color: 'var\(--forest\)', margin: 0, lineHeight: 1.1 \}\}>Support Our Mission</h2>"
mobile_spons_new = """<div style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--gold)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.3rem' }}>Partnership Opportunities</div>
                    {charityType !== 'none' && <div style={{ marginBottom: '0.2rem' }}><span style={{ background: 'var(--forest)', color: '#fff', fontSize: '0.55rem', padding: '0.2rem 0.5rem', borderRadius: '12px', fontWeight: 600, letterSpacing: '0.05em' }}>501(c)(3) Tax-Deductible</span></div>}
                    <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.6rem', color: 'var(--forest)', margin: 0, lineHeight: 1.1 }}>Support Our Mission</h2>"""
text = re.sub(mobile_spons_old, mobile_spons_new, text)


# Make sure the "Support the Cause" the user complained about also gets the old version replaced JUST IN CASE the first replace missed
# if it was formatted differently!
fallback_don_old = r"<div style=\{\{ fontSize: '0.8rem', fontWeight: 700, color: 'var\(--gold\)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.5rem' \}\}>Support the Cause</div>\s*<h2 style=\{\{ fontFamily: 'Playfair Display, serif', fontSize: '2rem', color: 'var\(--forest\)', margin: 0 \}\}>Every Contribution Helps</h2>"
text = re.sub(fallback_don_old, desktop_dons_new, text)

with open("src/app/host/page.tsx", "w") as f:
    f.write(text)

