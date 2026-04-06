with open("src/app/host/page.tsx", "r") as f:
    text = f.read()

bad = r"<label style={{ display: \'flex\', alignItems: \'flex-start\', gap: \'0.6rem\', cursor: \'pointer\' }}>"
good = r"<label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', cursor: 'pointer' }}>"

text = text.replace(bad, good)

with open("src/app/host/page.tsx", "w") as f:
    f.write(text)

