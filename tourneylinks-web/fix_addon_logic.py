import re

with open("src/app/host/page.tsx", "r") as f:
    text = f.read()

# Locate the exact gap and insert the dynamic subtext block!
target = r"""                     <div style=\{\{ display: 'flex', gap: '1rem' \}\}>
                        <div style=\{\{ flex: 2 \}\}>
                           <label style=\{\{ fontSize: '0.75rem', fontWeight: 600, color: 'var\(--mist\)', marginBottom: '0.3rem', display: 'block' \}\}>Application Logic</label>
                           <select value=\{newAddon.type\} onChange=\{e => setNewAddon\(\{\.\.\.newAddon, type: e.target.value as any\}\)\} style=\{\{ width: '100%', padding: '0.6rem', borderRadius: '4px', border: '1px solid rgba\(0,0,0,0.1\)' \}\}>
                              <option value="per_player">Per Player \(Scales with roster size\)</option>
                              <option value="per_team">Per Foursome Team \(Flat team addition\)</option>
                              <option value="flat">Flat Purchase \(e.g. 50/50 Raffle Tickets\)</option>
                           </select>
                        </div>
                        <div style=\{\{ flex: 1 \}\}>
                           <label style=\{\{ fontSize: '0.75rem', fontWeight: 600, color: 'var\(--mist\)', marginBottom: '0.3rem', display: 'block' \}\}>Max Qty \(Optional\)</label>
                           <input type="number" value=\{newAddon.maxQuantity \|\| ''\} onChange=\{e => setNewAddon\(\{\.\.\.newAddon, maxQuantity: e.target.value \? Number\(e.target.value\) : undefined\}\)\} placeholder="e.g. 2" style=\{\{ width: '100%', padding: '0.6rem', borderRadius: '4px', border: '1px solid rgba\(0,0,0,0.1\)' \}\} />
                        </div>
                     </div>"""

replacement = """                     <div style={{ display: 'flex', gap: '1rem' }}>
                        <div style={{ flex: 2 }}>
                           <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--mist)', marginBottom: '0.3rem', display: 'block' }}>Application Logic</label>
                           <select value={newAddon.type} onChange={e => setNewAddon({...newAddon, type: e.target.value as any})} style={{ width: '100%', padding: '0.6rem', borderRadius: '4px', border: '1px solid rgba(0,0,0,0.1)' }}>
                              <option value="per_player">Per Player (Scales with roster size)</option>
                              <option value="per_team">Per Foursome Team (Flat team addition)</option>
                              <option value="flat">Flat Purchase (e.g. 50/50 Raffle Tickets)</option>
                           </select>
                        </div>
                        <div style={{ flex: 1 }}>
                           <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--mist)', marginBottom: '0.3rem', display: 'block' }}>Max Qty (Optional)</label>
                           <input type="number" value={newAddon.maxQuantity || ''} onChange={e => setNewAddon({...newAddon, maxQuantity: e.target.value ? Number(e.target.value) : undefined})} placeholder="e.g. 2" style={{ width: '100%', padding: '0.6rem', borderRadius: '4px', border: '1px solid rgba(0,0,0,0.1)' }} />
                        </div>
                     </div>

                     {/* Dynamic Add-on Logic Explainer */}
                     <div style={{ fontSize: '0.75rem', color: 'var(--mist)', padding: '0.8rem', background: 'rgba(0,0,0,0.02)', borderRadius: '6px', border: '1px dashed rgba(0,0,0,0.06)' }}>
                        {newAddon.type === 'per_player' && (
                           newAddon.maxQuantity ? 
                           <span><strong>Per-Player Scaling Logic:</strong> At ${newAddon.price || 0}/unit, a solo player can purchase up to <strong>{newAddon.maxQuantity}</strong> (${((Number(newAddon.price) || 0) * newAddon.maxQuantity).toFixed(2)} limit). A 4-person team checking out together can purchase up to <strong>{newAddon.maxQuantity * 4}</strong> (${((Number(newAddon.price) || 0) * newAddon.maxQuantity * 4).toFixed(2)} limit in cart).</span>
                           : <span><strong>Per-Player Logic:</strong> Buyers will be charged ${newAddon.price || 0}/unit. They can add an unlimited amount to their checkout cart. Add a <i>Max Qty</i> above to restrict hoarding.</span>
                        )}
                        {newAddon.type === 'per_team' && (
                           newAddon.maxQuantity ? 
                           <span><strong>Flat Team Constraint:</strong> A Foursome team checking out together is strictly constrained to a maximum of <strong>{newAddon.maxQuantity}</strong> unit(s) total for their group (${((Number(newAddon.price) || 0) * newAddon.maxQuantity).toFixed(2)} maximum cart payload).</span>
                           : <span><strong>Team Logic:</strong> A Foursome team can add an unlimited amount of this Add-on to their cart during checkout.</span>
                        )}
                        {newAddon.type === 'flat' && (
                           newAddon.maxQuantity ? 
                           <span><strong>Absolute Checkout Constraint:</strong> Regardless of team size, any checkout session is physically hard-capped at a maximum of <strong>{newAddon.maxQuantity}</strong> units (${((Number(newAddon.price) || 0) * newAddon.maxQuantity).toFixed(2)} maximum cart payload).</span>
                           : <span><strong>Flat Logic:</strong> A standard purchase item. Any buyer can checkout with an unlimited quantity.</span>
                        )}
                     </div>"""

if re.search(target, text):
    text = re.sub(target, replacement, text)
    with open("src/app/host/page.tsx", "w") as f:
        f.write(text)
    print("REPLACED")
else:
    print("NO MATCH")

