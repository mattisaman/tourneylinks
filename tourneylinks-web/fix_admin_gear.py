import re

with open("src/app/host/page.tsx", "r") as f:
    text = f.read()

# Target the SVG container wrapper that used to hold the Administration Hub text
old_wrapper = r"<div style=\{\{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.3rem' \}\}>\s*<svg width=\"14\" height=\"14\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" strokeWidth=\"2.5\" strokeLinecap=\"round\" strokeLinejoin=\"round\" style=\{\{ color: 'var\(--gold\)', filter: 'drop-shadow\(0 0 4px rgba\(212,175,55,0.8\)\)' \}\}>\s*<path d=\"[^\"]*\"></path>\s*<circle cx=\"12\" cy=\"12\" r=\"3\"></circle>\s*</svg>\s*<div style=\{\{ fontSize: '0.8rem', fontWeight: 800, color: '#f3e5ab', letterSpacing: '0.15em', textTransform: 'uppercase', opacity: 0.9 \}\}></div>\s*</div>"

text = re.sub(old_wrapper, "", text)

with open("src/app/host/page.tsx", "w") as f:
    f.write(text)

