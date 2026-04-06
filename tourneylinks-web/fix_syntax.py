with open("src/app/host/page.tsx", "r") as f:
    text = f.read()

target = "color: charityType !== 'none' ? 'var(--forest)', fontWeight: 600"
replacement = "color: charityType !== 'none' ? 'var(--forest)' : 'var(--mist)', fontWeight: 600"

text = text.replace(target, replacement)

with open("src/app/host/page.tsx", "w") as f:
    f.write(text)

