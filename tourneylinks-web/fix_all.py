import re

with open("src/app/host/page.tsx", "r") as f:
    text = f.read()

# Fix 1: The finance variables
old_vars = r"const entryFeeSubtotal = fee;[\s\n]*const totalAddon = addons\.reduce\(\(acc, a\) => acc \+ a\.price, 0\);[\s\n]*const totalProcessing = passFees \? \(stripeFee \* 4\) : 0;[\s\n]*const totalDue = entryFeeSubtotal \+ totalAddon \+ totalProcessing;"
new_vars = """const entryFeeSubtotal = packages.length > 0 ? Number(packages[0].price) : 0;
         const entryFeePassed = packages.length > 0 && packages[0].passFees;
         
         const totalAddon = addons.reduce((acc, a) => acc + Number(a.price), 0);
         const passedAddons = addons.filter(a => a.passFees).reduce((acc, a) => acc + Number(a.price), 0);
         
         const baseFeeRate = charityType === 'golf_sponsored' ? 0.022 : 0.029;
         
         const entryProcessing = entryFeePassed ? (entryFeeSubtotal * baseFeeRate + 0.30) : 0;
         const addonProcessing = passedAddons > 0 ? (passedAddons * baseFeeRate + 0.30) : 0;
         const totalProcessing = entryProcessing + addonProcessing;
         
         const totalDue = entryFeeSubtotal + totalAddon + totalProcessing;"""

text = re.sub(old_vars, new_vars, text)


# Fix 2: The finance processing fee display (happens in two places)
old_fee_ui = r"\{passFees && \([\s\n]*<div style=\{\{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', fontSize: '0.85rem' \}\}>[\s\n]*<span style=\{\{ color: 'var\(--mist\)' \}\}>\+ Platform & Tax</span>[\s\n]*<span style=\{\{ fontWeight: 600, color: 'var\(--mist\)' \}\}>\$\{\(stripeFee \* 4\)\.toFixed\(2\)\}</span>[\s\n]*</div>[\s\n]*\)\}"
new_fee_ui = """{totalProcessing > 0 && (
                       <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', fontSize: '0.85rem' }}>
                          <div style={{ display: 'flex', flexDirection: 'column' }}>
                             <span style={{ color: 'var(--mist)', fontWeight: 600 }}>Standard Credit Card Processing Entity Fee</span>
                             <span style={{ color: '#aaa', fontSize: '0.65rem' }}>TourneyLinks charges exactly $0 platform & convenience fees.</span>
                          </div>
                          <span style={{ fontWeight: 600, color: 'var(--mist)' }}>${totalProcessing.toFixed(2)}</span>
                       </div>
                    )}"""

text = re.sub(old_fee_ui, new_fee_ui, text)


# Fix 3: Remove global passFees `if (passFees)` inside some function that modifies prices somewhere?
text = re.sub(r"if \(passFees\) \{[\s\S]*?\}\n", "", text)


with open("src/app/host/page.tsx", "w") as f:
    f.write(text)

print("regex edits deployed")
