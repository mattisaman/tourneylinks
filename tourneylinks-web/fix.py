with open("src/app/host/page.tsx", "r") as f:
    text = f.read()

# Fix Donations (revert that mistake!)
wrong = r"<div style={{ height: '600px', width: '100%', display: 'flex', justifyContent: 'flex-start', alignItems: 'flex-start', padding: '2rem', textAlign: 'center', background: '#f8faf9' }}>"
right = r"<div style={{ height: '600px', width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '2rem', textAlign: 'center', background: '#f8faf9' }}>"
text = text.replace(wrong, right)

# Fix Finance!
finance_wrong = r'<div className="no-scrollbar" style={{ padding: \'3rem 2rem\', background: \'#f8faf9\', display: \'flex\', flexDirection: \'column\', alignItems: \'center\', height: \'600px\', overflowY: \'auto\', width: \'100%\' }}>\n              <div style={{ width: \'100%\', maxWidth: \'400px\', background: \'#fff\', borderRadius: \'12px\', border: \'1px solid rgba(0,0,0,0.08)\', boxShadow: \'0 10px 40px rgba(0,0,0,0.05)\', padding: \'2rem\' }}>'

finance_right = r'<div className="no-scrollbar" style={{ height: \'600px\', overflowY: \'auto\', background: \'#f8faf9\', display: \'flex\', justifyContent: \'center\', alignItems: \'flex-start\', padding: \'3rem 2rem\', width: \'100%\' }}>\n              <div style={{ width: \'100%\', maxWidth: \'400px\', background: \'#fff\', borderRadius: \'12px\', border: \'1px solid rgba(0,0,0,0.08)\', boxShadow: \'0 10px 40px rgba(0,0,0,0.05)\', padding: \'2rem\' }}>'

text = text.replace(finance_wrong, finance_right)

with open("src/app/host/page.tsx", "w") as f:
    f.write(text)

