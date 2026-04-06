import re

with open("src/app/host/page.tsx", "r") as f:
    text = f.read()

# Replace host dashboard string
text = text.replace(
    "{a.maxQuantity ? <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--mist)', marginLeft: '0.5rem' }}>(Max {a.maxQuantity})</span> : null}",
    "{a.maxQuantity ? <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--mist)', marginLeft: '0.5rem' }}>(Max {a.maxQuantity}{a.type === 'per_player' ? ' per player' : a.type === 'per_team' ? ' per team' : ' total'})</span> : null}"
)

# Replace checkout preview simulator string - there are two instances (desktop and mobile)
# The string is `                          <span style={{ color: 'var(--mist)' }}>+ {a.name}</span>`
target_html = "<span style={{ color: 'var(--mist)' }}>+ {a.name}</span>"
replacement_html = "<span style={{ color: 'var(--mist)' }}>+ {a.name}{a.maxQuantity ? <span style={{ fontSize: '0.7rem', color: '#999', marginLeft: '0.4rem', fontWeight: 500 }}>(Max {a.maxQuantity}{a.type === 'per_player' ? ' per player' : a.type === 'per_team' ? ' per team' : ' total'})</span> : null}</span>"

text = text.replace(target_html, replacement_html)

with open("src/app/host/page.tsx", "w") as f:
    f.write(text)

