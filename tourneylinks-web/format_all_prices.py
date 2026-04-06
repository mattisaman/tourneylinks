import re

with open("src/app/host/page.tsx", "r") as f:
    text = f.read()

# Fix sponsor price rendering
text = text.replace('<div style={{ fontSize: \'0.9rem\', fontWeight: 800, color: \'var(--grass)\' }}>${s.price}</div>', '<div style={{ fontSize: \'0.9rem\', fontWeight: 800, color: \'var(--grass)\' }}>${Number(s.price).toLocaleString()}</div>')
text = text.replace('<span style={{ fontSize: \'0.9rem\', fontWeight: 800, color: \'var(--grass)\' }}>${s.price}</span>', '<span style={{ fontSize: \'0.9rem\', fontWeight: 800, color: \'var(--grass)\' }}>${Number(s.price).toLocaleString()}</span>')

# Fix package price rendering inside the simulator summary
text = text.replace('<span style={{ fontWeight: 600, color: \'var(--ink)\' }}>${p.price}</span>', '<span style={{ fontWeight: 600, color: \'var(--ink)\' }}>${Number(p.price).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>')
text = text.replace('<span style={{ fontSize: \'0.9rem\', fontWeight: 800, color: \'var(--ink)\' }}>${p.price}</span>', '<span style={{ fontSize: \'0.9rem\', fontWeight: 800, color: \'var(--ink)\' }}>${Number(p.price).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>')

# Also fix the builder-side package price since it uses toFixed(2) but no commas.
# Line: `<span style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--grass)' }}>${typeof p.price === 'number' ? p.price.toFixed(2) : Number(p.price).toFixed(2)}</span>`
text = text.replace(
    "<span style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--grass)' }}>${typeof p.price === 'number' ? p.price.toFixed(2) : Number(p.price).toFixed(2)}</span>",
    "<span style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--grass)' }}>${Number(p.price).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>"
)

with open("src/app/host/page.tsx", "w") as f:
    f.write(text)
    
print("SUCCESS")
