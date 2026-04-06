import re

with open("src/app/host/page.tsx", "r") as f:
    text = f.read()

mobile_spons_old = r"<div style=\{\{\s*fontSize:\s*'0\.65rem',\s*fontWeight:\s*700,\s*color:\s*'var\(--gold\)',\s*letterSpacing:\s*'0\.1em',\s*textTransform:\s*'uppercase',\s*marginBottom:\s*'0\.3rem'\s*\}\}>Partnerships</div>\s*<h2 style=\{\{\s*fontFamily:\s*'Playfair Display, serif',\s*fontSize:\s*'1\.6rem',\s*color:\s*'var\(--forest\)',\s*margin:\s*0,\s*lineHeight:\s*1\.1\s*\}\}>Sponsorship Opportunities</h2>"

mobile_spons_new = """<div style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--gold)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.3rem' }}>Partnerships</div>
                    {charityType !== 'none' && <div style={{ marginBottom: '0.2rem' }}><span style={{ background: 'var(--forest)', color: '#fff', fontSize: '0.55rem', padding: '0.2rem 0.5rem', borderRadius: '12px', fontWeight: 600, letterSpacing: '0.05em' }}>501(c)(3) Tax-Deductible</span></div>}
                    <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.6rem', color: 'var(--forest)', margin: 0, lineHeight: 1.1 }}>Sponsorship Opportunities</h2>"""
text = re.sub(mobile_spons_old, mobile_spons_new, text)

with open("src/app/host/page.tsx", "w") as f:
    f.write(text)

