with open("src/app/host/page.tsx", "r") as f:
    lines = f.readlines()

new_lines = []
for idx, line in enumerate(lines):
    if "              ))} " in line or "              ))}" in line:
        pass
    else:
        new_lines.append(line)

sponsor_map_code = """               {sponsors.map((s, i) => {
                  const standardFee = s.price > 0 ? s.price * 0.029 + 0.30 : 0;
                  const charityFee = s.price > 0 ? s.price * 0.022 + 0.30 : 0;
                  const payoutStandard = s.passFees ? s.price : s.price - standardFee;
                  const payoutCharity = s.passFees ? s.price : s.price - charityFee;
                  return (
                  <div key={i} style={{ display: 'flex', flexDirection: 'column', padding: '1rem', border: '1px solid rgba(0,0,0,0.05)', borderRadius: '8px', background: '#f8faf9', transition: '0.2s', ...(editingSponsorIdx === i ? { opacity: 0.5, pointerEvents: 'none' } : {}) }}>
                     <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: s.incentives && s.incentives.length > 0 ? '1px solid rgba(0,0,0,0.05)' : 'none', paddingBottom: s.incentives && s.incentives.length > 0 ? '0.75rem' : 0, marginBottom: s.incentives && s.incentives.length > 0 ? '0.75rem' : 0 }}>
                        <div>
                           <div style={{ fontWeight: 700, color: 'var(--forest)', fontSize: '0.95rem' }}>{s.tier} <span style={{ fontSize: '0.7rem', color: 'var(--mist)', fontWeight: 400, marginLeft: '0.5rem' }}>({s.spots} {s.spots === 1 ? 'spot' : 'spots'})</span></div>
                           <div style={{ fontSize: '0.75rem', color: 'var(--mist)', marginTop: '0.2rem' }}>
                              {s.passFees ? 'Reg. Pays Fees' : 'You Absorb Fees'}
                           </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                           <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--grass)' }}>${s.price.toLocaleString()}</div>
                           <div style={{ display: 'flex', gap: '0.5rem' }}>
                              <button onClick={() => {
                                 setEditingSponsorIdx(i);
                                 setNewSponsor({ tier: s.tier, price: s.price, spots: s.spots, incentivesText: (s.incentives || []).join('\\n'), includesIntent: s.includesIntent || false, includesDinner: s.includesDinner || false, rotatesOnTv: s.rotatesOnTv || false, passFees: s.passFees || false });
                                 setShowSponsorForm(true);
                              }} style={{ background: 'none', border: 'none', color: '#3399FF', fontSize: '0.75rem', cursor: 'pointer', fontWeight: 600 }}>Edit</button>
                              <button onClick={() => setSponsors(sponsors.filter((_, idx) => idx !== i))} style={{ background: 'none', border: 'none', color: '#ff5f56', fontSize: '0.75rem', cursor: 'pointer', fontWeight: '600' }}>Remove</button>
                           </div>
                        </div>
                     </div>
                     <div style={{ display: 'flex', gap: '1rem', marginTop: s.incentives && s.incentives.length > 0 ? '0' : '1rem', paddingTop: s.incentives && s.incentives.length > 0 ? '0' : '0.8rem', borderTop: s.incentives && s.incentives.length > 0 ? 'none' : '1px solid rgba(0,0,0,0.05)' }}>
                        <div style={{ flex: 1 }}>
                           <div style={{ fontSize: '0.65rem', color: 'var(--mist)', fontWeight: 600, marginBottom: '0.2rem' }}>STANDARD PAYOUT</div>
                           <div style={{ fontSize: '0.85rem', color: 'var(--ink)', fontWeight: 700 }}>${payoutStandard.toFixed(2)}</div>
                        </div>
                        <div style={{ flex: 1, background: 'rgba(212,175,55,0.05)', padding: '0.4rem 0.6rem', borderRadius: '4px', border: '1px solid rgba(212,175,55,0.2)' }}>
                           <div style={{ fontSize: '0.65rem', color: 'var(--forest)', fontWeight: 600, marginBottom: '0.2rem' }}>★ 501(C)(3) PAYOUT</div>
                           <div style={{ fontSize: '0.85rem', color: 'var(--grass)', fontWeight: 700 }}>${payoutCharity.toFixed(2)}</div>
                        </div>
                     </div>
                     {s.incentives && s.incentives.length > 0 && (
                        <div style={{ paddingLeft: '0.5rem', marginTop: '0.8rem', paddingTop: '0.8rem', borderTop: '1px solid rgba(0,0,0,0.05)' }}>
                           {s.incentives.map((inc, incIdx) => (
                              <div key={incIdx} style={{ fontSize: '0.75rem', color: 'var(--mist)', display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.4rem' }}>
                                 <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'var(--gold)' }}></div>
                                 {inc}
                              </div>
                           ))}
                        </div>
                     )}
                  </div>
               )})}
"""

for idx, line in enumerate(new_lines):
    if "            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>" in line and '))} ' not in line:
        if "sponsors" in new_lines[min(idx-1, 0)] or "sponsors" in new_lines[min(idx-5, 0)] or "sponsors" in new_lines[min(idx-8, 0)]:
            # We found the Sponsors div
            insert_idx = idx + 1
            new_lines.insert(insert_idx, sponsor_map_code)
            break

with open("src/app/host/page.tsx", "w") as f:
    f.writelines(new_lines)
