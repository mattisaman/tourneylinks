import re

with open("src/app/host/page.tsx", "r") as f:
    text = f.read()

# 1. Ledgers Highlighting
# We need to replace the two `div`s representing the side-by-side ledger payouts.
# This code currently looks like:
#                        <div style={{ flex: 1 }}>
#                           <div style={{ fontSize: '0.65rem', color: 'var(--mist)', fontWeight: 600, marginBottom: '0.2rem' }}>STANDARD PAYOUT</div>
#                           <div style={{ fontSize: '0.85rem', color: 'var(--ink)', fontWeight: 700 }}>${payoutStandard.toFixed(2)}</div>
#                        </div>
#                        <div style={{ flex: 1, background: 'rgba(212,175,55,0.05)', padding: '0.4rem 0.6rem', borderRadius: '4px', border: '1px solid rgba(212,175,55,0.2)' }}>
#                           <div style={{ fontSize: '0.65rem', color: 'var(--forest)', fontWeight: 600, marginBottom: '0.2rem' }}>★ 501(C)(3) PAYOUT</div>
#                           <div style={{ fontSize: '0.85rem', color: 'var(--grass)', fontWeight: 700 }}>${payoutCharity.toFixed(2)}</div>
#                        </div>

old_ledgers_regex = r"<div style=\{\{\s*flex:\s*1\s*\}\}>\s*<div style=\{\{\s*fontSize:\s*'0\.65rem',\s*color:\s*'var\(--mist\)',\s*fontWeight:\s*600,\s*marginBottom:\s*'0\.2rem'\s*\}\}>STANDARD PAYOUT</div>\s*<div style=\{\{\s*fontSize:\s*'0\.85rem',\s*color:\s*'var\(--ink\)',\s*fontWeight:\s*700\s*\}\}>\$\{payoutStandard\.toFixed\(2\)\}</div>\s*</div>\s*<div style=\{\{\s*flex:\s*1,\s*background:\s*'rgba\(212,175,55,0\.05\)',\s*padding:\s*'0\.4rem 0\.6rem',\s*borderRadius:\s*'4px',\s*border:\s*'1px solid rgba\(212,175,55,0\.2\)'\s*\}\}>\s*<div style=\{\{\s*fontSize:\s*'0\.65rem',\s*color:\s*'var\(--forest\)',\s*fontWeight:\s*600,\s*marginBottom:\s*'0\.2rem'\s*\}\}>★ 501\(C\)\(3\) PAYOUT</div>\s*<div style=\{\{\s*fontSize:\s*'0\.85rem',\s*color:\s*'var\(--grass\)',\s*fontWeight:\s*700\s*\}\}>\$\{payoutCharity\.toFixed\(2\)\}</div>\s*</div>"

new_ledgers_str = """<div style={{ flex: 1, background: charityType === 'none' ? 'rgba(0,0,0,0.03)' : 'transparent', padding: '0.4rem 0.6rem', borderRadius: '4px', border: charityType === 'none' ? '1px solid rgba(0,0,0,0.1)' : '1px dashed rgba(0,0,0,0.1)', opacity: charityType === 'none' ? 1 : 0.5 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.2rem' }}>
                             <div style={{ fontSize: '0.65rem', color: 'var(--mist)', fontWeight: 600 }}>STANDARD PAYOUT</div>
                             {charityType === 'none' && <div style={{ fontSize: '0.55rem', background: '#e0e0e0', color: '#555', padding: '0.1rem 0.3rem', borderRadius: '4px', fontWeight: 700 }}>ACTIVE</div>}
                          </div>
                          <div style={{ fontSize: '0.85rem', color: 'var(--ink)', fontWeight: 700 }}>${payoutStandard.toFixed(2)}</div>
                       </div>
                       <div style={{ flex: 1, background: charityType !== 'none' ? 'rgba(212,175,55,0.05)' : 'transparent', padding: '0.4rem 0.6rem', borderRadius: '4px', border: charityType !== 'none' ? '1px solid rgba(212,175,55,0.2)' : '1px dashed rgba(0,0,0,0.1)', opacity: charityType !== 'none' ? 1 : 0.5 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.2rem' }}>
                             <div style={{ fontSize: '0.65rem', color: charityType !== 'none' ? 'var(--forest)' : 'var(--mist)', fontWeight: 600 }}>★ 501(C)(3) PAYOUT</div>
                             {charityType !== 'none' && <div style={{ fontSize: '0.55rem', background: 'var(--gold)', color: '#fff', padding: '0.1rem 0.3rem', borderRadius: '4px', fontWeight: 700 }}>ACTIVE</div>}
                          </div>
                          <div style={{ fontSize: '0.85rem', color: charityType !== 'none' ? 'var(--grass)' : 'var(--mist)', fontWeight: 700 }}>${payoutCharity.toFixed(2)}</div>
                       </div>"""

text = re.sub(old_ledgers_regex, new_ledgers_str, text)

# Add flexWrap: 'wrap' to the container of those boxes
# <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', paddingTop: '0.8rem', borderTop: '1px solid rgba(0,0,0,0.05)' }}>
text = text.replace("<div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', paddingTop: '0.8rem', borderTop: '1px solid rgba(0,0,0,0.05)' }}>", "<div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginTop: '1rem', paddingTop: '0.8rem', borderTop: '1px solid rgba(0,0,0,0.05)' }}>")
text = text.replace("<div style={{ display: 'flex', gap: '1rem', marginTop: s.incentives && s.incentives.length > 0 ? '0' : '1rem', paddingTop: s.incentives && s.incentives.length > 0 ? '0' : '0.8rem', borderTop: s.incentives && s.incentives.length > 0 ? 'none' : '1px solid rgba(0,0,0,0.05)' }}>", "<div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginTop: s.incentives && s.incentives.length > 0 ? '0' : '1rem', paddingTop: s.incentives && s.incentives.length > 0 ? '0' : '0.8rem', borderTop: s.incentives && s.incentives.length > 0 ? 'none' : '1px solid rgba(0,0,0,0.05)' }}>")


# 2. Add 501c3 Badging to the sponsor and donation preview headers
sponsors_header_regex = r"<div style=\{\{\s*fontSize:\s*'0\.8rem',\s*fontWeight:\s*700,\s*color:\s*'var\(--gold\)',\s*letterSpacing:\s*'0\.1em',\s*textTransform:\s*'uppercase',\s*marginBottom:\s*'0\.5rem'\s*\}\}>Partnership Opportunities</div>"
new_sponsors_header = """<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                        <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--gold)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Partnership Opportunities</div>
                        {charityType !== 'none' && <div style={{ background: 'var(--forest)', color: '#fff', fontSize: '0.6rem', padding: '0.2rem 0.6rem', borderRadius: '12px', fontWeight: 600, letterSpacing: '0.05em' }}>501(c)(3) Tax-Deductible</div>}
                     </div>"""

donations_header_regex = r"<div style=\{\{\s*fontSize:\s*'0\.8rem',\s*fontWeight:\s*700,\s*color:\s*'var\(--gold\)',\s*letterSpacing:\s*'0\.1em',\s*textTransform:\s*'uppercase',\s*marginBottom:\s*'0\.5rem'\s*\}\}>Support The Cause</div>"
new_donations_header = """<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                        <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--gold)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Support The Cause</div>
                        {charityType !== 'none' && <div style={{ background: 'var(--forest)', color: '#fff', fontSize: '0.6rem', padding: '0.2rem 0.6rem', borderRadius: '12px', fontWeight: 600, letterSpacing: '0.05em' }}>501(c)(3) Tax-Deductible</div>}
                     </div>"""

text = re.sub(sponsors_header_regex, new_sponsors_header, text)
text = re.sub(donations_header_regex, new_donations_header, text)

# Just in case there's another donations header string format:
# Often it's <h2 ...>Support Our Mission</h2>
# Oh wait, we should just check the actual donations header.


with open("src/app/host/page.tsx", "w") as f:
    f.write(text)

