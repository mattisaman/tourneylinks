import re

with open("src/app/host/page.tsx", "r") as f:
    text = f.read()

# 1. Update Main Layout Max-Width
layout_old = r"maxWidth: '1600px', margin: '2rem auto 0 auto', padding: '0 2rem', display: 'flex', flexWrap: 'wrap', gap: '3rem'"
layout_new = "maxWidth: '96%', margin: '2rem auto 0 auto', padding: '0 1rem', display: 'flex', flexWrap: 'wrap', gap: '3rem'"
text = text.replace(layout_old, layout_new)


# 2. Insert Pro Tip
tip_old = r"<div style=\{\{ fontWeight: 700, color: 'var\(--forest\)', marginBottom: '1rem', fontSize: '0\.9rem' \}\}>Create Custom Package</div>"
tip_new = """<div style={{ fontWeight: 700, color: 'var(--forest)', marginBottom: '1rem', fontSize: '0.9rem' }}>Create Custom Package</div>
                 <div style={{ background: 'rgba(212,175,55,0.1)', border: '1px dashed var(--gold)', padding: '0.6rem 0.8rem', borderRadius: '6px', fontSize: '0.75rem', color: 'var(--ink)', marginBottom: '1rem', display: 'flex', alignItems: 'flex-start', gap: '0.6rem', lineHeight: 1.4 }}>
                    <span style={{ fontSize: '1rem', filter: 'drop-shadow(0 2px 2px rgba(212,175,55,0.4))' }}>💡</span>
                    <div><strong style={{ color: 'var(--forest)' }}>PRO TIP:</strong> If you plan to "Absorb Fees" so registrants don't see extra charges at checkout, look at the active payout ledger below and raise your package price slightly to offset the fee! It's a great way to offer clean, round numbers.</div>
                 </div>"""
text = re.sub(tip_old, tip_new, text)


# 3. Update Badge Styles
desktop_badge_old = r"<div style=\{\{\s*background:\s*'var\(--forest\)',\s*color:\s*'#fff',\s*fontSize:\s*'0\.6rem',\s*padding:\s*'0\.2rem 0\.6rem',\s*borderRadius:\s*'12px',\s*fontWeight:\s*600,\s*letterSpacing:\s*'0\.05em'\s*\}\}>501\(c\)\(3\) Tax-Deductible</div>"
desktop_badge_new = "<div style={{ background: '#0a1a12', border: '1px solid var(--gold)', color: 'var(--gold)', fontSize: '0.65rem', padding: '0.4rem 1rem', borderRadius: '25px', fontWeight: 600, letterSpacing: '0.05em', boxShadow: 'inset 0 0 10px rgba(212,175,55,0.15)' }}>501(c)(3) Tax-Deductible</div>"
text = re.sub(desktop_badge_old, desktop_badge_new, text)

mobile_badge_old = r"<span style=\{\{\s*background:\s*'var\(--forest\)',\s*color:\s*'#fff',\s*fontSize:\s*'0\.55rem',\s*padding:\s*'0\.2rem 0\.5rem',\s*borderRadius:\s*'12px',\s*fontWeight:\s*600,\s*letterSpacing:\s*'0\.05em'\s*\}\}>501\(c\)\(3\) Tax-Deductible</span>"
mobile_badge_new = "<span style={{ background: '#0a1a12', border: '1px solid var(--gold)', color: 'var(--gold)', fontSize: '0.6rem', padding: '0.3rem 0.8rem', borderRadius: '25px', fontWeight: 600, letterSpacing: '0.05em', boxShadow: 'inset 0 0 10px rgba(212,175,55,0.15)' }}>501(c)(3) Tax-Deductible</span>"
text = re.sub(mobile_badge_old, mobile_badge_new, text)

with open("src/app/host/page.tsx", "w") as f:
    f.write(text)

