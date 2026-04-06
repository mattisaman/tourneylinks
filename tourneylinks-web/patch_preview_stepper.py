import re

with open("src/app/host/page.tsx", "r") as f:
    text = f.read()

# Replace checkout preview simulator string - there are two instances (desktop and mobile)
# The old string is: `<span style={{ color: 'var(--mist)' }}>+ {a.name}{a.maxQuantity ? <span style={{ fontSize: '0.7rem', color: '#999', marginLeft: '0.4rem', fontWeight: 500 }}>(Max {a.maxQuantity}{a.type === 'per_player' ? ' per player' : a.type === 'per_team' ? ' per team' : ' total'})</span> : null}</span>`

target_html = "<span style={{ color: 'var(--mist)' }}>+ {a.name}{a.maxQuantity ? <span style={{ fontSize: '0.7rem', color: '#999', marginLeft: '0.4rem', fontWeight: 500 }}>(Max {a.maxQuantity}{a.type === 'per_player' ? ' per player' : a.type === 'per_team' ? ' per team' : ' total'})</span> : null}</span>"

replacement_html = """<span style={{ color: 'var(--mist)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                             <div style={{ display: 'flex', alignItems: 'center', background: '#f4f7f5', borderRadius: '4px', padding: '0.1rem 0.4rem', gap: '0.5rem', border: '1px solid rgba(0,0,0,0.06)' }}>
                                <span style={{ fontSize: '0.9rem', color: '#ccc', cursor: 'not-allowed' }}>-</span>
                                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--ink)' }}>1</span>
                                <span style={{ fontSize: '0.9rem', color: 'var(--forest)', cursor: 'default' }}>+</span>
                             </div>
                             {a.name}
                             {a.maxQuantity ? <span style={{ fontSize: '0.7rem', color: '#999', fontWeight: 500 }}>(Max {a.maxQuantity}{a.type === 'per_player' ? ' per player' : a.type === 'per_team' ? ' per team' : ' total'})</span> : null}
                          </span>"""

text = text.replace(target_html, replacement_html)

with open("src/app/host/page.tsx", "w") as f:
    f.write(text)

