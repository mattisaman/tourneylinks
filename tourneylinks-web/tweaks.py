import re

with open("src/app/host/page.tsx", "r") as f:
    text = f.read()

# 1. Update Financials height
fin_old = r"<div style=\{\{\s*height:\s*'450px',\s*overflowY:\s*'auto',\s*background:\s*'#f8faf9',\s*display:\s*'flex',\s*justifyContent:\s*'center',\s*alignItems:\s*'flex-start',\s*padding:\s*'3rem 2rem'\s*\}\}>"
fin_new = "<div className=\"no-scrollbar\" style={{ height: '600px', overflowY: 'auto', background: '#f8faf9', display: 'flex', justifyContent: 'center', alignItems: 'flex-start', padding: '3rem 2rem', width: '100%' }}>"
text = re.sub(fin_old, fin_new, text)

# 2. Update Pro Tip for Sponsorships
spon_tip_old = "Pre-selling automated digital sponsorship real estate can cover the entire cost of the tournament before a single golfer registers."
spon_tip_new = """Pre-selling automated digital sponsorship real estate can cover the entire cost of the tournament before a single golfer registers. <br/><br/>
                 <strong>Did you know?</strong> Empty holes default to TourneyLinks branding! You can reach out to local golf product companies, offer them a discounted "Product Placement" tier, and they automatically get their ads blasted across our <strong>Mobile Scorer & TV Liveboards</strong>!"""
text = text.replace(spon_tip_old, spon_tip_new)


# 3. Make desktop badges bigger
ds_badge_old = r"<div style=\{\{ background: '#0a1a12', border: '1px solid var\(--gold\)', color: 'var\(--gold\)', fontSize: '0.65rem', padding: '0.4rem 1rem', borderRadius: '25px', fontWeight: 600, letterSpacing: '0.05em', boxShadow: 'inset 0 0 10px rgba\(212,175,55,0.15\)' \}\}>501\(c\)\(3\) Tax-Deductible</div>"
ds_badge_new = "<div style={{ background: '#0a1a12', border: '1px solid var(--gold)', color: 'var(--gold)', fontSize: '0.85rem', padding: '0.5rem 1.2rem', borderRadius: '30px', fontWeight: 700, letterSpacing: '0.05em', boxShadow: 'inset 0 0 10px rgba(212,175,55,0.15)' }}>501(c)(3) Tax-Deductible</div>"
text = text.replace(ds_badge_old, ds_badge_new)
# Fallback standard match via re inline case:
# Wait, my regexes in Python can be finicky with whitespace, simple replace is safer. Let's do regex anyway just in case spaces shifted.
text = re.sub(r"<div style=\{\{\s*background:\s*'#0a1a12',\s*border:\s*'1px solid var\(--gold\)',\s*color:\s*'var\(--gold\)',\s*fontSize:\s*'0\.65rem',\s*padding:\s*'0\.4rem 1rem',\s*borderRadius:\s*'25px',\s*fontWeight:\s*600,\s*letterSpacing:\s*'0\.05em',\s*boxShadow:\s*'inset 0 0 10px rgba\(212,175,55,0\.15\)'\s*\}\}>501\(c\)\(3\) Tax-Deductible</div>", ds_badge_new, text)

# 4. Make mobile badges bigger
mob_badge_old = r"<span style=\{\{ background: '#0a1a12', border: '1px solid var\(--gold\)', color: 'var\(--gold\)', fontSize: '0.6rem', padding: '0.3rem 0.8rem', borderRadius: '25px', fontWeight: 600, letterSpacing: '0.05em', boxShadow: 'inset 0 0 10px rgba\(212,175,55,0.15\)' \}\}>501\(c\)\(3\) Tax-Deductible</span>"
mob_badge_new = "<span style={{ background: '#0a1a12', border: '1px solid var(--gold)', color: 'var(--gold)', fontSize: '0.75rem', padding: '0.4rem 0.9rem', borderRadius: '30px', fontWeight: 700, letterSpacing: '0.05em', boxShadow: 'inset 0 0 10px rgba(212,175,55,0.15)' }}>501(c)(3) Tax-Deductible</span>"
text = text.replace(mob_badge_old, mob_badge_new)
text = re.sub(r"<span style=\{\{\s*background:\s*'#0a1a12',\s*border:\s*'1px solid var\(--gold\)',\s*color:\s*'var\(--gold\)',\s*fontSize:\s*'0\.6rem',\s*padding:\s*'0\.3rem 0\.8rem',\s*borderRadius:\s*'25px',\s*fontWeight:\s*600,\s*letterSpacing:\s*'0\.05em',\s*boxShadow:\s*'inset 0 0 10px rgba\(212,175,55,0\.15\)'\s*\}\}>501\(c\)\(3\) Tax-Deductible</span>", mob_badge_new, text)


with open("src/app/host/page.tsx", "w") as f:
    f.write(text)
