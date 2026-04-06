import re

with open("src/app/host/page.tsx", "r") as f:
    text = f.read()

# Clean out the last remaining passFees block in mobile simulator
old_fee_ui2 = r"\{passFees && \([\s\n]*<div style=\{\{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', fontSize: '0.8rem' \}\}>[\s\n]*<span style=\{\{ color: 'var\(--mist\)' \}\}>\+ Platform & Tax</span>[\s\n]*<span style=\{\{ fontWeight: 600, color: 'var\(--mist\)' \}\}>\$\{\(stripeFee \* 4\)\.toFixed\(2\)\}</span>[\s\n]*</div>[\s\n]*\)\}"
new_fee_ui2 = """{totalProcessing > 0 && (
                       <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', fontSize: '0.8rem' }}>
                          <div style={{ display: 'flex', flexDirection: 'column' }}>
                             <span style={{ color: 'var(--mist)', fontWeight: 600 }}>Standard Credit Card Processing Entity Fee</span>
                             <span style={{ color: '#aaa', fontSize: '0.65rem' }}>TourneyLinks charges exactly $0 platform & convenience fees.</span>
                          </div>
                          <span style={{ fontWeight: 600, color: 'var(--mist)' }}>${totalProcessing.toFixed(2)}</span>
                       </div>
                    )}"""

text = re.sub(old_fee_ui2, new_fee_ui2, text)


with open("src/app/host/page.tsx", "w") as f:
    f.write(text)

