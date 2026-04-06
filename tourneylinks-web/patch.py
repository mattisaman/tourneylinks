import re

with open("src/app/host/page.tsx", "r") as f:
    text = f.read()

target = r"(<input type=\"number\" value=\{newAddon\.maxQuantity \|\| ''}.*?</div>\s*</div>)"

replacement = r"""\1

                     {/* Dynamic Add-on Logic Explainer */}
                     <div style={{ fontSize: '0.75rem', color: 'var(--mist)', padding: '0.8rem', background: 'rgba(0,0,0,0.02)', borderRadius: '6px', border: '1px dashed rgba(0,0,0,0.06)' }}>
                        {newAddon.type === 'per_player' && (
                           newAddon.maxQuantity ? 
                           <span><strong>Per-Player Scaling Logic:</strong> At ${newAddon.price || 0}/unit, a solo player can purchase up to <strong>{newAddon.maxQuantity}</strong> (${((Number(newAddon.price) || 0) * newAddon.maxQuantity).toFixed(2)} limit). A 4-person team checking out together can purchase up to <strong>{newAddon.maxQuantity * 4}</strong> (${((Number(newAddon.price) || 0) * newAddon.maxQuantity * 4).toFixed(2)} limit in cart).</span>
                           : <span><strong>Per-Player Logic:</strong> Buyers will be charged ${newAddon.price || 0}/unit. They can add an unlimited amount to their checkout cart. Add a <i>Max Qty</i> above to restrict hoarding.</span>
                        )}
                        {newAddon.type === 'per_team' && (
                           newAddon.maxQuantity ? 
                           <span><strong>Flat Team Constraint:</strong> A Foursome team checking out together is strictly constrained to a maximum of <strong>{newAddon.maxQuantity}</strong> unit(s) total for their group (${((Number(newAddon.price) || 0) * newAddon.maxQuantity).toFixed(2)} max payload).</span>
                           : <span><strong>Team Logic:</strong> A Foursome team can add an unlimited amount of this Add-on to their cart during checkout.</span>
                        )}
                        {newAddon.type === 'flat' && (
                           newAddon.maxQuantity ? 
                           <span><strong>Absolute Checkout Constraint:</strong> Regardless of team size, any checkout session is physically hard-capped at a maximum of <strong>{newAddon.maxQuantity}</strong> units (${((Number(newAddon.price) || 0) * newAddon.maxQuantity).toFixed(2)} maximum payload).</span>
                           : <span><strong>Flat Logic:</strong> A standard purchase item. Any buyer can checkout with an unlimited quantity.</span>
                        )}
                     </div>"""

if re.search(target, text, flags=re.DOTALL):
    text = re.sub(target, replacement, text, flags=re.DOTALL)
    with open("src/app/host/page.tsx", "w") as f:
        f.write(text)
    print("PATCHED")
else:
    print("FAILED")

