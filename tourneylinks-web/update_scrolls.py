import re

with open("src/app/host/page.tsx", "r") as f:
    text = f.read()

# 1. Provide uniform height & scrolling to ALL desktop simulator views

desktop_gen_old = r"<div style=\{\{\s*height:\s*'450px',\s*overflowY:\s*'auto',\s*background:\s*'#f8faf9',\s*display:\s*'flex',\s*flexDirection:\s*'column'\s*\}\}>"
desktop_gen_new = "<div className=\"no-scrollbar\" style={{ height: '600px', overflowY: 'auto', background: '#f8faf9', display: 'flex', flexDirection: 'column', width: '100%' }}>"
text = re.sub(desktop_gen_old, desktop_gen_new, text)

# For sponsorships and donations, they share the exact same outer desktop wrapper string:
desktop_donor_spons_old = r"<div style=\{\{\s*padding:\s*'3rem 2rem',\s*background:\s*'#f8faf9',\s*display:\s*'flex',\s*flexDirection:\s*'column',\s*alignItems:\s*'center'\s*\}\}>"
desktop_donor_spons_new = "<div className=\"no-scrollbar\" style={{ padding: '3rem 2rem', background: '#f8faf9', display: 'flex', flexDirection: 'column', alignItems: 'center', height: '600px', overflowY: 'auto', width: '100%' }}>"

# Replace BOTH occurrences (Sponsorships & Donations loops)
text = text.replace(
    "<div style={{ padding: '3rem 2rem', background: '#f8faf9', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>",
    desktop_donor_spons_new
)

# Wait, there's another case where donations might be disabled:
# <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '2rem', textAlign: 'center', background: '#f8faf9' }}>
desktop_donations_disabled_old = r"<div style=\{\{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '2rem', textAlign: 'center', background: '#f8faf9' \}\}>"
desktop_donations_disabled_new = "<div style={{ height: '600px', width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '2rem', textAlign: 'center', background: '#f8faf9' }}>"
text = re.sub(desktop_donations_disabled_old, desktop_donations_disabled_new, text)


# 2. Update Pro Tip Wording
tip_old = 'If you plan to "Absorb Fees" so registrants don\'t see extra charges at checkout, look at the active payout ledger below and raise your package price slightly to offset the fee! It\'s a great way to offer clean, round numbers.'
tip_new = 'If you plan to "Absorb Fees" so registrants don\'t see Stripe processing fees at checkout, look at the active payout ledger below and raise your package price slightly to offset the fee! It\'s a great way to offer clean, round numbers.'

text = text.replace(tip_old, tip_new)


with open("src/app/host/page.tsx", "w") as f:
    f.write(text)

