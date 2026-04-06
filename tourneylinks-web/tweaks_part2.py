import re

with open("src/app/host/page.tsx", "r") as f:
    text = f.read()

# 1. Update Campaign & Finance to exactly match Donations/Sponsorships outer desktop wrapper
campaign_old = r'<div className="no-scrollbar" style=\{\{\s*height:\s*\'600px\',\s*overflowY:\s*\'auto\',\s*background:\s*\'#f8faf9\',\s*display:\s*\'flex\',\s*flexDirection:\s*\'column\',\s*width:\s*\'100%\'\s*\}\}>'
# NOTE: The user requested the exact same wrapper as donations/sponsorships!
uniform_wrapper = '<div className="no-scrollbar" style={{ padding: \'3rem 2rem\', background: \'#f8faf9\', display: \'flex\', flexDirection: \'column\', alignItems: \'center\', height: \'600px\', overflowY: \'auto\', width: \'100%\' }}>'
text = re.sub(campaign_old, uniform_wrapper, text)

finance_old = r'<div className="no-scrollbar" style=\{\{\s*height:\s*\'600px\',\s*overflowY:\s*\'auto\',\s*background:\s*\'#f8faf9\',\s*display:\s*\'flex\',\s*justifyContent:\s*\'center\',\s*alignItems:\s*\'flex-start\',\s*padding:\s*\'3rem 2rem\',\s*width:\s*\'100%\'\s*\}\}>'
text = re.sub(finance_old, uniform_wrapper, text)


# 2. Add the Form toggle for "Pass Fees" inline in "Create Custom Package" component
# Let's locate the Foursome/Team Package block
target_foursome = """                     <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', cursor: 'pointer' }}>
                       <input type="checkbox" checked={newPackage.isTeam} onChange={e => setNewPackage({...newPackage, isTeam: e.target.checked})} style={{ marginTop: '0.15rem' }} />
                       <div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--ink)', fontWeight: 600 }}>This is a Foursome/Team Package</div>
                          <div style={{ fontSize: '0.7rem', color: 'var(--mist)', marginTop: '0.1rem', lineHeight: 1.4 }}>When checked, the system will prompt the buyer to enter names & contact info for 4 registered players during checkout.</div>
                       </div>
                    </label>"""

new_toggle_html = """                     <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#fff', padding: '1rem', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.1)', marginTop: '0.5rem' }}>
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

# Replace combining them
combo = target_foursome + "\n" + new_toggle_html
text = text.replace(target_foursome, combo)

with open("src/app/host/page.tsx", "w") as f:
    f.write(text)
