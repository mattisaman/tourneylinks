import re

with open("src/app/host/page.tsx", "r") as f:
    text = f.read()

# 1. Revert the mistaken change on line 490 for the 501c3 Golf Agreement label
bad_agreement_label = r'<label style=\{\{ display: \'flex\', alignItems: \'flex-start\', gap: \'0\.6rem\', cursor: \'pointer\', paddingBottom: \'0\.5rem\', borderBottom: \'1px solid rgba\(0,0,0,0\.05\)\' \}\}>\s*<input type="checkbox" checked=\{golfAgreementChecked\}'

fixed_agreement_label = r'<label style={{ display: \'flex\', alignItems: \'flex-start\', gap: \'0.6rem\', cursor: \'pointer\' }}>\n                                   <input type="checkbox" checked={golfAgreementChecked}'

text = re.sub(bad_agreement_label, fixed_agreement_label, text)

# 2. Add AI Suggest subtext
target_ai_block = r"(<button onClick=\{[^>]+\}\s*disabled=\{isSuggestingPrice\}\s*title=\"Auto-calculate the perfect price using venue intelligence\"\s*style=\{\{[^\}]+\}\}\s*>\s*\{isSuggestingPrice \? 'Calculating\.\.\.' : '✨ AI Suggest'\}\s*</button>\s*</div>)"

replacement_ai_block = r"\1\n                           <div style={{ fontSize: '0.65rem', color: 'var(--mist)', lineHeight: 1.3, marginTop: '0.4rem' }}>Analyzes venue reputation & regional wealth data</div>"

text = re.sub(target_ai_block, replacement_ai_block, text)

# 3. Add Pass Fees toggle after Foursome label
target_foursome = r"(<label style=\{\{ display: 'flex', alignItems: 'flex-start', gap: '0\.6rem', cursor: 'pointer' \}\}>\s*<input type=\"checkbox\" checked=\{newPackage\.isTeam\}[^>]+>\s*<div>\s*<div[^>]+>This is a Foursome/Team Package</div>\s*<div[^>]+>When checked[^<]+</div>\s*</div>\s*</label>)"

replacement_foursome = r"""\1
                     <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#fff', padding: '1rem', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.1)' }}>
                        <div>
                           <div style={{ fontSize: '0.8rem', color: 'var(--ink)', fontWeight: 600 }}>Pass Fees to Registrant</div>
                           <div style={{ fontSize: '0.7rem', color: 'var(--mist)', marginTop: '0.1rem', lineHeight: 1.4 }}>When toggled on, the buyer pays the processing fee. When off, the tournament absorbs it.</div>
                        </div>
                        <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', position: 'relative', marginLeft: '1rem', flexShrink: 0 }}>
                           <input type="checkbox" checked={newPackage.passFees} onChange={e => setNewPackage({...newPackage, passFees: e.target.checked})} style={{ opacity: 0, position: 'absolute', width: '100%', height: '100%', cursor: 'pointer' }} />
                           <div style={{ width: '40px', height: '20px', background: newPackage.passFees ? 'var(--gold)' : '#e2e8f0', borderRadius: '10px', position: 'relative', transition: '0.3s', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)' }}>
                              <div style={{ position: 'absolute', left: newPackage.passFees ? '22px' : '2px', top: '2px', width: '16px', height: '16px', background: '#fff', borderRadius: '50%', transition: '0.3s', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }}></div>
                           </div>
                        </label>
                     </div>"""

text = re.sub(target_foursome, replacement_foursome, text)

# For safety, let's make sure the passFees toggle inside the Foursome/Team label got some margin if it's next to it! Wait, I wrap them as siblings, but gave it a background so it stands out. I should give it a marginTop.
text = text.replace(
    "<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#fff', padding: '1rem', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.1)' }}>",
    "<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#fff', padding: '1rem', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.1)', marginTop: '0.8rem' }}>"
)

with open("src/app/host/page.tsx", "w") as f:
    f.write(text)

