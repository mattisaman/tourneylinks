import sys

with open("src/app/host/page.tsx", "r") as f:
    text = f.read()

# 1. State changes
text = text.replace("  const [passFees, setPassFees] = useState(false);\n", "")

text = text.replace("""  const [packages, setPackages] = useState<{name: string, price: number, isTeam: boolean}[]>([
     { name: 'Foursome', price: 500, isTeam: true },
     { name: 'Individual Golfer', price: 125, isTeam: false },
     { name: 'Dinner Ticket Only', price: 50, isTeam: false }
  ]);
  const [showPackageForm, setShowPackageForm] = useState(false);
  const [newPackage, setNewPackage] = useState<{name: string, price: number | string, isTeam: boolean}>({ name: '', price: '', isTeam: false });""", """  const [packages, setPackages] = useState<{name: string, price: number, isTeam: boolean, passFees: boolean}[]>([
     { name: 'Foursome', price: 500, isTeam: true, passFees: false },
     { name: 'Individual Golfer', price: 125, isTeam: false, passFees: false },
     { name: 'Dinner Ticket Only', price: 50, isTeam: false, passFees: false }
  ]);
  const [showPackageForm, setShowPackageForm] = useState(false);
  const [newPackage, setNewPackage] = useState<{name: string, price: number | string, isTeam: boolean, passFees: boolean}>({ name: '', price: '', isTeam: false, passFees: false });""")

text = text.replace("""  const [addons, setAddons] = useState<{name: string, price: number, type: 'per_player'|'per_team'|'flat', maxQuantity?: number}[]>([
     { name: 'Mulligan', price: 20, type: 'per_player', maxQuantity: 2 }
  ]);
  const [showAddonForm, setShowAddonForm] = useState(false);
  const [newAddon, setNewAddon] = useState<{name: string, price: number | string, type: 'per_player'|'per_team'|'flat', maxQuantity?: number}>({ name: '', price: '', type: 'per_player' });""", """  const [addons, setAddons] = useState<{name: string, price: number, type: 'per_player'|'per_team'|'flat', maxQuantity?: number, passFees: boolean}[]>([
     { name: 'Mulligan', price: 20, type: 'per_player', maxQuantity: 2, passFees: false }
  ]);
  const [showAddonForm, setShowAddonForm] = useState(false);
  const [newAddon, setNewAddon] = useState<{name: string, price: number | string, type: 'per_player'|'per_team'|'flat', maxQuantity?: number, passFees: boolean}>({ name: '', price: '', type: 'per_player', passFees: false });""")

text = text.replace("""  const [sponsors, setSponsors] = useState<{tier: string, price: number, spots: number, incentives: string[], includesIntent: boolean, includesDinner: boolean, rotatesOnTv?: boolean}[]>([
     { tier: 'Title Sponsor', price: 5000, spots: 1, incentives: ['Primary Logo on all Hero branding', 'Foursome included', 'Speaking opportunity at dinner'], includesIntent: true, includesDinner: true, rotatesOnTv: true },
     { tier: 'Beverage Cart', price: 1500, spots: 2, incentives: ['Logo on beverage cart', 'Custom branded napkins'], includesIntent: false, includesDinner: false, rotatesOnTv: true }
  ]);
  const [showSponsorForm, setShowSponsorForm] = useState(false);
  const [editingSponsorIdx, setEditingSponsorIdx] = useState<number | null>(null);
  const [newSponsor, setNewSponsor] = useState<{tier: string, price: number | string, spots: number, incentivesText: string, includesIntent: boolean, includesDinner: boolean, rotatesOnTv: boolean}>({ tier: '', price: '', spots: 1, incentivesText: '', includesIntent: false, includesDinner: false, rotatesOnTv: false });""", """  const [sponsors, setSponsors] = useState<{tier: string, price: number, spots: number, incentives: string[], includesIntent: boolean, includesDinner: boolean, rotatesOnTv?: boolean, passFees: boolean}[]>([
     { tier: 'Title Sponsor', price: 5000, spots: 1, incentives: ['Primary Logo on all Hero branding', 'Foursome included', 'Speaking opportunity at dinner'], includesIntent: true, includesDinner: true, rotatesOnTv: true, passFees: false },
     { tier: 'Beverage Cart', price: 1500, spots: 2, incentives: ['Logo on beverage cart', 'Custom branded napkins'], includesIntent: false, includesDinner: false, rotatesOnTv: true, passFees: false }
  ]);
  const [showSponsorForm, setShowSponsorForm] = useState(false);
  const [editingSponsorIdx, setEditingSponsorIdx] = useState<number | null>(null);
  const [newSponsor, setNewSponsor] = useState<{tier: string, price: number | string, spots: number, incentivesText: string, includesIntent: boolean, includesDinner: boolean, rotatesOnTv: boolean, passFees: boolean}>({ tier: '', price: '', spots: 1, incentivesText: '', includesIntent: false, includesDinner: false, rotatesOnTv: false, passFees: false });""")


# 2. Package Editor Update
package_old = """                    <button 
                       onClick={() => {
                          if (newPackage.name && newPackage.price !== '' && Number(newPackage.price) >= 0) {
                             setPackages([...packages, { ...newPackage, price: Number(newPackage.price) }]);
                             setNewPackage({ name: '', price: '', isTeam: false });
                             setShowPackageForm(false);
                             setAiSuggestionPanel(null);
                          }
                       }}
                       style={{ padding: '0.8rem', background: 'var(--forest)', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 700, cursor: 'pointer' }}>
                       Save Package to Registration
                    </button>
                 </div>
              </div>
           )}

           {!showPackageForm && packages.length === 0 && (
              <div style={{ color: 'var(--mist)', fontSize: '0.8rem', marginBottom: '1.5rem', lineHeight: 1.5 }}>
                 Mint packages for users to purchase (e.g. Foursome, Individual Golfer, Dinner Only ticket).
              </div>
           )}
           
           <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {packages.map((p, i) => (
                 <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', border: '1px solid rgba(0,0,0,0.05)', borderRadius: '8px', background: '#f8faf9' }}>
                    <div>
                       <div style={{ fontWeight: 600, color: 'var(--forest)', fontSize: '0.95rem' }}>{p.name}</div>
                       <div style={{ fontSize: '0.75rem', color: 'var(--mist)', marginTop: '0.2rem' }}>
                          {p.isTeam ? 'Foursome / Team Registration' : 'Individual Registration'}
                       </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                       <span style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--grass)' }}>${p.price.toFixed(2)}</span>
                       <button onClick={() => {
                          setNewPackage(p);
                          setPackages(packages.filter((_, idx) => idx !== i));
                          setShowPackageForm(true);
                       }} style={{ background: 'none', border: 'none', color: 'var(--forest)', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600 }}>Edit</button>
                       <button onClick={() => setPackages(packages.filter((_, idx) => idx !== i))} style={{ background: 'none', border: 'none', color: '#e74c3c', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600 }}>Remove</button>
                    </div>
                 </div>
              ))}
           </div>
           
           {/* Revenue Tracker tied to the primary top-level package */}
           {packages.length > 0 && (() => {
             const standardFee = fee > 0 ? (fee * 0.029 + 0.30) : 0;
             const charityFee = fee > 0 ? (fee * 0.022 + 0.30) : 0;
             const registrantPaysStandard = passFees ? fee + standardFee : fee;
             const registrantPaysCharity = passFees ? fee + charityFee : fee;
             const youReceiveStandard = passFees ? fee : fee - standardFee;
             const youReceiveCharity = passFees ? fee : fee - charityFee;

             return (
             <div className="pricing-box" style={{ background: '#f8faf9', padding: '1.25rem', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.05)', marginTop: '1.5rem' }}>
                <div className="pricing-row" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.2rem', fontSize: '0.9rem', paddingBottom: '0.5rem', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                   <span style={{ color: 'var(--ink)', fontWeight: 600 }}>Primary Package ({packages[0].name})</span>
                   <strong>${fee.toFixed(2)}</strong>
                </div>

                <div className="pricing-row" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.8rem', fontSize: '0.85rem' }}>
                  <span style={{ color: 'var(--mist)' }}>
                     Standard Processing Fee (2.9% + 30¢) <br/>
                     <span style={{ fontSize: '0.75rem' }}>{passFees ? '(Paid by Registrant)' : '(Deducted from Payout)'}</span>
                  </span>
                  <strong style={{ color: passFees ? 'var(--mist)' : '#e74c3c' }}>{passFees ? '' : '-'}${standardFee.toFixed(2)}</strong>
                </div>

                <div className="pricing-row" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', fontSize: '0.85rem', background: 'rgba(212,175,55,0.05)', border: '1px solid var(--gold)', borderRadius: '6px', padding: '0.5rem' }}>
                  <span style={{ color: 'var(--forest)', fontWeight: 600 }}>
                     ★ 501(c)(3) Sponsored Fee (2.2% + 30¢) <br/>
                     <span style={{ fontSize: '0.75rem', fontWeight: 400 }}>{passFees ? '(Paid by Registrant)' : '(Deducted from Payout)'}</span>
                  </span>
                  <strong style={{ color: passFees ? 'var(--mist)' : 'var(--grass)' }}>{passFees ? '' : '-'}${charityFee.toFixed(2)}</strong>
                </div>
                
                <div className="notif-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '1rem 0', padding: '1rem', background: '#fff', borderRadius: '6px', border: '1px solid rgba(0,0,0,0.1)' }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--ink)' }}>Pass Fees to Registrant</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--mist)' }}>Automatically append standard CC processor costs to checkout.</div>
                  </div>
                  <label className="toggle-switch">
                    <input type="checkbox" checked={passFees} onChange={e => setPassFees(e.target.checked)} />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
    
                <div style={{ height: '1px', background: 'rgba(0,0,0,0.1)', margin: '1rem 0' }}></div>
    
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <span style={{ fontWeight: 600, color: 'var(--mist)', fontSize: '0.9rem' }}>Registrant Pays (Standard)</span>
                  <span style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--mist)' }}>${registrantPaysStandard.toFixed(2)}</span>
                </div>
                {passFees && (
                   <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem', paddingBottom: '1rem', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                     <span style={{ fontWeight: 600, color: 'var(--forest)', fontSize: '0.9rem' }}>★ Registrant Pays (501c3)</span>
                     <span style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--forest)' }}>${registrantPaysCharity.toFixed(2)}</span>
                   </div>
                )}
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                   <span style={{ fontWeight: 700, color: 'var(--ink)' }}>You Receive (Standard)</span>
                   <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--ink)' }}>${youReceiveStandard.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem', background: 'var(--forest)', padding: '0.8rem', borderRadius: '8px', color: '#fff', border: '1px solid var(--gold)' }}>
                   <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>★ You Receive (501c3)</span>
                   <span style={{ fontSize: '1.3rem', fontWeight: 900, color: 'var(--gold)' }}>${youReceiveCharity.toFixed(2)}</span>
                </div>
             </div>
           ); })()}
        </div>"""

package_new = """                     <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fff', padding: '0.8rem 1rem', borderRadius: '6px', border: '1px solid rgba(0,0,0,0.05)', marginTop: '0.5rem' }}>
                        <div>
                           <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--forest)' }}>Pass Fees to Registrant?</div>
                           <div style={{ fontSize: '0.65rem', color: 'var(--mist)' }}>Automatically append processing costs to checkout.</div>
                        </div>
                        <label className="toggle-switch">
                           <input type="checkbox" checked={newPackage.passFees} onChange={e => setNewPackage({...newPackage, passFees: e.target.checked})} />
                           <span className="toggle-slider"></span>
                        </label>
                     </div>

                    <button 
                       onClick={() => {
                          if (newPackage.name && newPackage.price !== '' && Number(newPackage.price) >= 0) {
                             setPackages([...packages, { ...newPackage, price: Number(newPackage.price) }]);
                             setNewPackage({ name: '', price: '', isTeam: false, passFees: false });
                             setShowPackageForm(false);
                             setAiSuggestionPanel(null);
                          }
                       }}
                       style={{ padding: '0.8rem', background: 'var(--forest)', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 700, cursor: 'pointer', marginTop: '0.5rem' }}>
                       Save Package to Registration
                    </button>
                 </div>
              </div>
           )}

           {!showPackageForm && packages.length === 0 && (
              <div style={{ color: 'var(--mist)', fontSize: '0.8rem', marginBottom: '1.5rem', lineHeight: 1.5 }}>
                 Mint packages for users to purchase (e.g. Foursome, Individual Golfer, Dinner Only ticket).
              </div>
           )}
           
           <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {packages.map((p, i) => {
                 const standardFee = p.price > 0 ? p.price * 0.029 + 0.30 : 0;
                 const charityFee = p.price > 0 ? p.price * 0.022 + 0.30 : 0;
                 const payoutStandard = p.passFees ? p.price : p.price - standardFee;
                 const payoutCharity = p.passFees ? p.price : p.price - charityFee;
                 return (
                 <div key={i} style={{ display: 'flex', flexDirection: 'column', padding: '1rem', border: '1px solid rgba(0,0,0,0.05)', borderRadius: '8px', background: '#f8faf9' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                       <div>
                          <div style={{ fontWeight: 600, color: 'var(--forest)', fontSize: '0.95rem' }}>{p.name}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--mist)', marginTop: '0.2rem' }}>
                             {p.isTeam ? 'Foursome' : 'Individual'}
                             {p.passFees ? ' • Reg. Pays Fees' : ' • You Absorb Fees'}
                          </div>
                       </div>
                       <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                          <span style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--grass)' }}>${typeof p.price === 'number' ? p.price.toFixed(2) : Number(p.price).toFixed(2)}</span>
                          <button onClick={() => {
                             setNewPackage(p);
                             setPackages(packages.filter((_, idx) => idx !== i));
                             setShowPackageForm(true);
                          }} style={{ background: 'none', border: 'none', color: 'var(--forest)', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600 }}>Edit</button>
                          <button onClick={() => setPackages(packages.filter((_, idx) => idx !== i))} style={{ background: 'none', border: 'none', color: '#e74c3c', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600 }}>Remove</button>
                       </div>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', paddingTop: '0.8rem', borderTop: '1px solid rgba(0,0,0,0.05)' }}>
                       <div style={{ flex: 1 }}>
                          <div style={{ fontSize: '0.65rem', color: 'var(--mist)', fontWeight: 600, marginBottom: '0.2rem' }}>STANDARD PAYOUT</div>
                          <div style={{ fontSize: '0.85rem', color: 'var(--ink)', fontWeight: 700 }}>${payoutStandard.toFixed(2)}</div>
                       </div>
                       <div style={{ flex: 1, background: 'rgba(212,175,55,0.05)', padding: '0.4rem 0.6rem', borderRadius: '4px', border: '1px solid rgba(212,175,55,0.2)' }}>
                          <div style={{ fontSize: '0.65rem', color: 'var(--forest)', fontWeight: 600, marginBottom: '0.2rem' }}>★ 501(C)(3) PAYOUT</div>
                          <div style={{ fontSize: '0.85rem', color: 'var(--grass)', fontWeight: 700 }}>${payoutCharity.toFixed(2)}</div>
                       </div>
                    </div>
                 </div>
              )})}
           </div>
        </div>"""

text = text.replace(package_old, package_new)


# 3. Addon Editor Update
addon_old = """                    <button 
                       onClick={() => {
                          if (newAddon.name && newAddon.price !== '' && Number(newAddon.price) >= 0) {
                             setAddons([...addons, { ...newAddon, price: Number(newAddon.price) }]);
                             setNewAddon({ name: '', price: '', type: 'per_player', maxQuantity: undefined });
                             setShowAddonForm(false);
                          }
                       }}
                       style={{ padding: '0.8rem', background: 'var(--forest)', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 700, cursor: 'pointer' }}>
                       Save Add-on to Cart
                    </button>
                 </div>
              </div>
           )}

           {!showAddonForm && addons.length === 0 && (
              <div style={{ color: 'var(--mist)', fontSize: '0.8rem', marginBottom: '1.5rem', lineHeight: 1.5 }}>
                 Configure optional purchases (e.g., Mulligans, Skins, Raffle Tickets) that players can seamlessly add to their cart during checkout.
              </div>
           )}
           
           <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {addons.map((a, i) => (
                 <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', border: '1px solid rgba(0,0,0,0.05)', borderRadius: '8px', background: '#f8faf9' }}>
                    <div>
                       <div style={{ fontWeight: 600, color: 'var(--forest)', fontSize: '0.95rem' }}>
                          {a.name}
                          {a.maxQuantity ? <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--mist)', marginLeft: '0.5rem' }}>(Max {a.maxQuantity})</span> : null}
                       </div>
                       <div style={{ fontSize: '0.75rem', color: 'var(--mist)', marginTop: '0.2rem' }}>
                          {a.type === 'per_player' ? 'Applied Per Player' : a.type === 'per_team' ? 'Applied Per Team' : 'Flat Purchase Item'}
                       </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                       <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--ink)' }}>${a.price.toFixed(2)}</div>
                       <button onClick={() => {
                          setNewAddon(a);
                          setAddons(addons.filter((_, idx) => idx !== i));
                          setShowAddonForm(true);
                       }} style={{ background: 'none', border: 'none', color: 'var(--forest)', fontSize: '0.8rem', cursor: 'pointer', fontWeight: 600 }}>Edit</button>
                       <button onClick={() => setAddons(addons.filter((_, idx) => idx !== i))} style={{ background: 'none', border: 'none', color: '#ff5f56', fontSize: '0.8rem', cursor: 'pointer', fontWeight: 600 }}>Remove</button>
                    </div>
                 </div>
              ))}
           </div>"""

addon_new = """                     <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fff', padding: '0.8rem 1rem', borderRadius: '6px', border: '1px solid rgba(0,0,0,0.05)', marginTop: '0.5rem' }}>
                        <div>
                           <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--forest)' }}>Pass Fees to Registrant?</div>
                           <div style={{ fontSize: '0.65rem', color: 'var(--mist)' }}>Automatically append processing costs to checkout.</div>
                        </div>
                        <label className="toggle-switch">
                           <input type="checkbox" checked={newAddon.passFees} onChange={e => setNewAddon({...newAddon, passFees: e.target.checked})} />
                           <span className="toggle-slider"></span>
                        </label>
                     </div>
                     <button 
                       onClick={() => {
                          if (newAddon.name && newAddon.price !== '' && Number(newAddon.price) >= 0) {
                             setAddons([...addons, { ...newAddon, price: Number(newAddon.price) }]);
                             setNewAddon({ name: '', price: '', type: 'per_player', maxQuantity: undefined, passFees: false });
                             setShowAddonForm(false);
                          }
                       }}
                       style={{ padding: '0.8rem', background: 'var(--forest)', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 700, cursor: 'pointer', marginTop: '0.5rem' }}>
                       Save Add-on to Cart
                    </button>
                 </div>
              </div>
           )}

           {!showAddonForm && addons.length === 0 && (
              <div style={{ color: 'var(--mist)', fontSize: '0.8rem', marginBottom: '1.5rem', lineHeight: 1.5 }}>
                 Configure optional purchases (e.g., Mulligans, Skins, Raffle Tickets) that players can seamlessly add to their cart during checkout.
              </div>
           )}
           
           <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {addons.map((a, i) => {
                 const standardFee = a.price > 0 ? a.price * 0.029 + 0.30 : 0;
                 const charityFee = a.price > 0 ? a.price * 0.022 + 0.30 : 0;
                 const payoutStandard = a.passFees ? a.price : a.price - standardFee;
                 const payoutCharity = a.passFees ? a.price : a.price - charityFee;
                 return (
                 <div key={i} style={{ display: 'flex', flexDirection: 'column', padding: '1rem', border: '1px solid rgba(0,0,0,0.05)', borderRadius: '8px', background: '#f8faf9' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                       <div>
                          <div style={{ fontWeight: 600, color: 'var(--forest)', fontSize: '0.95rem' }}>
                             {a.name}
                             {a.maxQuantity ? <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--mist)', marginLeft: '0.5rem' }}>(Max {a.maxQuantity})</span> : null}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--mist)', marginTop: '0.2rem' }}>
                             {a.type === 'per_player' ? 'Per Player' : a.type === 'per_team' ? 'Per Team' : 'Flat Purchase'}
                             {a.passFees ? ' • Reg. Pays Fees' : ' • You Absorb Fees'}
                          </div>
                       </div>
                       <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                          <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--ink)' }}>${a.price.toFixed(2)}</div>
                          <button onClick={() => {
                             setNewAddon(a);
                             setAddons(addons.filter((_, idx) => idx !== i));
                             setShowAddonForm(true);
                          }} style={{ background: 'none', border: 'none', color: 'var(--forest)', fontSize: '0.8rem', cursor: 'pointer', fontWeight: 600 }}>Edit</button>
                          <button onClick={() => setAddons(addons.filter((_, idx) => idx !== i))} style={{ background: 'none', border: 'none', color: '#ff5f56', fontSize: '0.8rem', cursor: 'pointer', fontWeight: 600 }}>Remove</button>
                       </div>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', paddingTop: '0.8rem', borderTop: '1px solid rgba(0,0,0,0.05)' }}>
                       <div style={{ flex: 1 }}>
                          <div style={{ fontSize: '0.65rem', color: 'var(--mist)', fontWeight: 600, marginBottom: '0.2rem' }}>STANDARD PAYOUT</div>
                          <div style={{ fontSize: '0.85rem', color: 'var(--ink)', fontWeight: 700 }}>${payoutStandard.toFixed(2)}</div>
                       </div>
                       <div style={{ flex: 1, background: 'rgba(212,175,55,0.05)', padding: '0.4rem 0.6rem', borderRadius: '4px', border: '1px solid rgba(212,175,55,0.2)' }}>
                          <div style={{ fontSize: '0.65rem', color: 'var(--forest)', fontWeight: 600, marginBottom: '0.2rem' }}>★ 501(C)(3) PAYOUT</div>
                          <div style={{ fontSize: '0.85rem', color: 'var(--grass)', fontWeight: 700 }}>${payoutCharity.toFixed(2)}</div>
                       </div>
                    </div>
                 </div>
              )})}
           </div>"""

text = text.replace(addon_old, addon_new)


# 4. Sponsor Editor Update
sponsor_old = """                     <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                        <button 
                           onClick={() => {
                              if (!newSponsor.tier || newSponsor.price === '' || Number(newSponsor.price) < 0) return;
                              const incArray = newSponsor.incentivesText.split('\\n').map(i => i.trim()).filter(i => i !== '');
                              const sponsorObj = { tier: newSponsor.tier, price: Number(newSponsor.price), spots: newSponsor.spots, incentives: incArray, includesIntent: newSponsor.includesIntent, includesDinner: newSponsor.includesDinner, rotatesOnTv: newSponsor.rotatesOnTv };
                              
                              if (editingSponsorIdx !== null) {
                                 const clone = [...sponsors];
                                 clone[editingSponsorIdx] = sponsorObj;
                                 setSponsors(clone);
                              } else {
                                 setSponsors([...sponsors, sponsorObj]);
                              }
                              setNewSponsor({ tier: '', price: '', spots: 1, incentivesText: '', includesIntent: false, includesDinner: false, rotatesOnTv: false });
                              setShowSponsorForm(false);
                              setEditingSponsorIdx(null);
                           }}
                           style={{ flex: 1, padding: '0.8rem', background: 'var(--forest)', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 700, cursor: 'pointer' }}>
                           {editingSponsorIdx !== null ? 'Save Changes' : 'Mint Tier'}
                        </button>
                     </div>
                  </div>
               </div>
            )}

            {!showSponsorForm && sponsors.length === 0 && (
               <div style={{ color: 'var(--mist)', fontSize: '0.8rem', marginBottom: '1.5rem', lineHeight: 1.5 }}>
                  Clearly list what each sponsor tier includes. Incentives like "Foursome Included" or "Logo on Signage" help drive higher commitment.
               </div>
            )}
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
               {sponsors.map((s, i) => (
                  <div key={i} style={{ display: 'flex', flexDirection: 'column', padding: '1rem', border: '1px solid rgba(0,0,0,0.05)', borderRadius: '8px', background: '#f8faf9', transition: '0.2s', ...(editingSponsorIdx === i ? { opacity: 0.5, pointerEvents: 'none' } : {}) }}>
                     <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: s.incentives && s.incentives.length > 0 ? '1px solid rgba(0,0,0,0.05)' : 'none', paddingBottom: s.incentives && s.incentives.length > 0 ? '0.75rem' : 0, marginBottom: s.incentives && s.incentives.length > 0 ? '0.75rem' : 0 }}>
                        <div>
                           <div style={{ fontWeight: 700, color: 'var(--forest)', fontSize: '0.95rem' }}>{s.tier} <span style={{ fontSize: '0.7rem', color: 'var(--mist)', fontWeight: 400, marginLeft: '0.5rem' }}>({s.spots} {s.spots === 1 ? 'spot' : 'spots'})</span></div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                           <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--grass)' }}>${s.price.toLocaleString()}</div>
                           <div style={{ display: 'flex', gap: '0.5rem' }}>
                              <button onClick={() => {
                                 setEditingSponsorIdx(i);
                                 setNewSponsor({ tier: s.tier, price: s.price, spots: s.spots, incentivesText: (s.incentives || []).join('\\n'), includesIntent: s.includesIntent || false, includesDinner: s.includesDinner || false, rotatesOnTv: s.rotatesOnTv || false });
                                 setShowSponsorForm(true);
                              }} style={{ background: 'none', border: 'none', color: '#3399FF', fontSize: '0.75rem', cursor: 'pointer', fontWeight: 600 }}>Edit</button>
                              <button onClick={() => setSponsors(sponsors.filter((_, idx) => idx !== i))} style={{ background: 'none', border: 'none', color: '#ff5f56', fontSize: '0.75rem', cursor: 'pointer', fontWeight: '600' }}>Remove</button>
                           </div>
                        </div>
                     </div>
                     {s.incentives && s.incentives.length > 0 && (
                        <div style={{ paddingLeft: '0.5rem' }}>
                           {s.incentives.map((inc, incIdx) => (
                              <div key={incIdx} style={{ fontSize: '0.75rem', color: 'var(--mist)', display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.4rem' }}>
                                 <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'var(--gold)' }}></div>
                                 {inc}
                              </div>
                           ))}
                        </div>
                     )}
                  </div>
               ))}
            </div>"""

sponsor_new = """                     <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fff', padding: '0.8rem 1rem', borderRadius: '6px', border: '1px solid rgba(0,0,0,0.05)', marginTop: '0.5rem' }}>
                        <div>
                           <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--forest)' }}>Pass Fees to Registrant?</div>
                           <div style={{ fontSize: '0.65rem', color: 'var(--mist)' }}>Automatically append processing costs to checkout.</div>
                        </div>
                        <label className="toggle-switch">
                           <input type="checkbox" checked={newSponsor.passFees} onChange={e => setNewSponsor({...newSponsor, passFees: e.target.checked})} />
                           <span className="toggle-slider"></span>
                        </label>
                     </div>
                     <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                        <button 
                           onClick={() => {
                              if (!newSponsor.tier || newSponsor.price === '' || Number(newSponsor.price) < 0) return;
                              const incArray = newSponsor.incentivesText.split('\\n').map(i => i.trim()).filter(i => i !== '');
                              const sponsorObj = { tier: newSponsor.tier, price: Number(newSponsor.price), spots: newSponsor.spots, incentives: incArray, includesIntent: newSponsor.includesIntent, includesDinner: newSponsor.includesDinner, rotatesOnTv: newSponsor.rotatesOnTv, passFees: newSponsor.passFees };
                              
                              if (editingSponsorIdx !== null) {
                                 const clone = [...sponsors];
                                 clone[editingSponsorIdx] = sponsorObj;
                                 setSponsors(clone);
                              } else {
                                 setSponsors([...sponsors, sponsorObj]);
                              }
                              setNewSponsor({ tier: '', price: '', spots: 1, incentivesText: '', includesIntent: false, includesDinner: false, rotatesOnTv: false, passFees: false });
                              setShowSponsorForm(false);
                              setEditingSponsorIdx(null);
                           }}
                           style={{ flex: 1, padding: '0.8rem', background: 'var(--forest)', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 700, cursor: 'pointer' }}>
                           {editingSponsorIdx !== null ? 'Save Changes' : 'Mint Tier'}
                        </button>
                     </div>
                  </div>
               </div>
            )}

            {!showSponsorForm && sponsors.length === 0 && (
               <div style={{ color: 'var(--mist)', fontSize: '0.8rem', marginBottom: '1.5rem', lineHeight: 1.5 }}>
                  Clearly list what each sponsor tier includes. Incentives like "Foursome Included" or "Logo on Signage" help drive higher commitment.
               </div>
            )}
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
               {sponsors.map((s, i) => {
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
            </div>"""

text = text.replace(sponsor_old, sponsor_new)

# 5. Finance Output Simulation Update
finance_old = """      if (activeTab === 'finance') {
         const entryFeeSubtotal = fee;
         const totalAddon = addons.reduce((acc, a) => acc + a.price, 0);
         const totalProcessing = passFees ? (stripeFee * 4) : 0;
         const totalDue = entryFeeSubtotal + totalAddon + totalProcessing;

         return (
            <div style={{ height: '450px', overflowY: 'auto', background: '#f8faf9', display: 'flex', justifyContent: 'center', alignItems: 'flex-start', padding: '3rem 2rem' }}>
              <div style={{ width: '100%', maxWidth: '400px', background: '#fff', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.08)', boxShadow: '0 10px 40px rgba(0,0,0,0.05)', padding: '2rem' }}>
                 <h3 style={{ margin: '0 0 0.5rem 0', fontFamily: 'Playfair Display, serif', fontSize: '1.5rem', color: 'var(--forest)' }}>Registration</h3>
                 <div style={{ fontSize: '0.8rem', color: 'var(--mist)', marginBottom: '1.5rem' }}>{name || 'Tournament Title'}</div>

                 <div style={{ borderTop: '1px solid rgba(0,0,0,0.05)', borderBottom: '1px solid rgba(0,0,0,0.05)', padding: '1.5rem 0', marginBottom: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', fontSize: '0.9rem' }}>
                       <span style={{ fontWeight: 600, color: 'var(--ink)' }}>Primary Package</span>
                       <span style={{ fontWeight: 700, color: 'var(--ink)' }}>${entryFeeSubtotal.toFixed(2)}</span>
                    </div>
                    {addons.map((a, i) => (
                        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', fontSize: '0.85rem' }}>
                           <span style={{ color: 'var(--mist)' }}>+ {a.name}</span>
                           <span style={{ fontWeight: 600, color: 'var(--mist)' }}>${a.price.toFixed(2)}</span>
                        </div>
                    ))}
                    {passFees && (
                       <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', fontSize: '0.85rem' }}>
                          <span style={{ color: 'var(--mist)' }}>+ Platform & Tax</span>
                          <span style={{ fontWeight: 600, color: 'var(--mist)' }}>${(stripeFee * 4).toFixed(2)}</span>
                       </div>
                    )}
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(0,0,0,0.05)' }}>
                       <span style={{ fontWeight: 800, color: 'var(--forest)', fontSize: '1.1rem' }}>Total Due</span>
                       <span style={{ fontWeight: 800, color: 'var(--forest)', fontSize: '1.1rem' }}>${totalDue.toFixed(2)}</span>
                    </div>
                    <div style={{ background: '#f4f7f5', padding: '1rem', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.05)', marginTop: '1.5rem' }}>
                       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--forest)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>💳 Split Payment at Checkout</span>
                          <label className="toggle-switch" style={{ transform: 'scale(0.8)' }}>
                            <input type="checkbox" checked={false} readOnly />
                            <span className="toggle-slider"></span>
                          </label>
                       </div>
                       <div style={{ fontSize: '0.75rem', color: 'var(--mist)', lineHeight: 1.5 }}>
                          <b>How it works:</b> The registering player controls the ledger. They can split it entirely using <b>Affirm/Klarna</b> natively, OR pay their fraction and generate a <b>Secure Team Link</b> to text their 3 buddies to collect the remaining fractions! Your Tournament gets paid in full instantly.
                       </div>
                    </div>
                 </div>
                 <button style={{ width: '100%', padding: '0.8rem', background: `linear-gradient(135deg, ${activeSecondaryColor}, ${themeColor})`, color: '#fff', fontWeight: 700, border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem', transition: '0.2s', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}>Credit / Debit Checkout</button>
              </div>"""

finance_new = """      if (activeTab === 'finance') {
         const entryFeeSubtotal = packages.length > 0 ? Number(packages[0].price) : 0;
         const entryFeePassed = packages.length > 0 && packages[0].passFees;
         
         const totalAddon = addons.reduce((acc, a) => acc + Number(a.price), 0);
         const passedAddons = addons.filter(a => a.passFees).reduce((acc, a) => acc + Number(a.price), 0);
         
         const baseFeeRate = charityType === 'golf_sponsored' ? 0.022 : 0.029;
         
         const entryProcessing = entryFeePassed ? (entryFeeSubtotal * baseFeeRate + 0.30) : 0;
         const addonProcessing = passedAddons > 0 ? (passedAddons * baseFeeRate + 0.30) : 0;
         const totalProcessing = entryProcessing + addonProcessing;
         
         const totalDue = entryFeeSubtotal + totalAddon + totalProcessing;

         return (
            <div style={{ height: '450px', overflowY: 'auto', background: '#f8faf9', display: 'flex', justifyContent: 'center', alignItems: 'flex-start', padding: '3rem 2rem' }}>
              <div style={{ width: '100%', maxWidth: '400px', background: '#fff', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.08)', boxShadow: '0 10px 40px rgba(0,0,0,0.05)', padding: '2rem' }}>
                 <h3 style={{ margin: '0 0 0.5rem 0', fontFamily: 'Playfair Display, serif', fontSize: '1.5rem', color: 'var(--forest)' }}>Registration</h3>
                 <div style={{ fontSize: '0.8rem', color: 'var(--mist)', marginBottom: '1.5rem' }}>{name || 'Tournament Title'}</div>

                 <div style={{ borderTop: '1px solid rgba(0,0,0,0.05)', borderBottom: '1px solid rgba(0,0,0,0.05)', padding: '1.5rem 0', marginBottom: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', fontSize: '0.9rem' }}>
                       <span style={{ fontWeight: 600, color: 'var(--ink)' }}>{packages.length > 0 ? packages[0].name : 'Primary Package'}</span>
                       <span style={{ fontWeight: 700, color: 'var(--ink)' }}>${entryFeeSubtotal.toFixed(2)}</span>
                    </div>
                    {addons.map((a, i) => (
                        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', fontSize: '0.85rem' }}>
                           <span style={{ color: 'var(--mist)' }}>+ {a.name}</span>
                           <span style={{ fontWeight: 600, color: 'var(--mist)' }}>${Number(a.price).toFixed(2)}</span>
                        </div>
                    ))}
                    {totalProcessing > 0 && (
                       <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', fontSize: '0.85rem' }}>
                          <div style={{ display: 'flex', flexDirection: 'column' }}>
                             <span style={{ color: 'var(--mist)', fontWeight: 600 }}>Standard Credit Card Processing Entity Fee</span>
                             <span style={{ color: '#aaa', fontSize: '0.65rem' }}>TourneyLinks charges exactly $0 platform & convenience fees.</span>
                          </div>
                          <span style={{ fontWeight: 600, color: 'var(--mist)' }}>${totalProcessing.toFixed(2)}</span>
                       </div>
                    )}
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(0,0,0,0.05)' }}>
                       <span style={{ fontWeight: 800, color: 'var(--forest)', fontSize: '1.1rem' }}>Total Due</span>
                       <span style={{ fontWeight: 800, color: 'var(--forest)', fontSize: '1.1rem' }}>${totalDue.toFixed(2)}</span>
                    </div>
                    <div style={{ background: '#f4f7f5', padding: '1rem', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.05)', marginTop: '1.5rem' }}>
                       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--forest)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>💳 Split Payment at Checkout</span>
                          <label className="toggle-switch" style={{ transform: 'scale(0.8)' }}>
                            <input type="checkbox" checked={false} readOnly />
                            <span className="toggle-slider"></span>
                          </label>
                       </div>
                       <div style={{ fontSize: '0.75rem', color: 'var(--mist)', lineHeight: 1.5 }}>
                          <b>How it works:</b> The registering player controls the ledger. They can split it entirely using <b>Affirm/Klarna</b> natively, OR pay their fraction and generate a <b>Secure Team Link</b> to text their buddies to collect the remaining fractions! Your Tournament gets paid in full instantly.
                       </div>
                    </div>
                 </div>
                 <button style={{ width: '100%', padding: '0.8rem', background: `linear-gradient(135deg, ${activeSecondaryColor}, ${themeColor})`, color: '#fff', fontWeight: 700, border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem', transition: '0.2s', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}>Credit / Debit Checkout</button>
              </div>"""

text = text.replace(finance_old, finance_new)

# 6. Sponsor Preview
sponsors_preview_old = """      if (activeTab === 'sponsorships') {
         // Mock total processing if a user purchased one of each mapped item
         const totalProcessing = passFees ? sponsors.reduce((acc, s) => acc + (s.price * 0.029 + 0.30), 0) : 0;
         const subtotal = sponsors.reduce((acc, s) => acc + s.price, 0);"""
sponsors_preview_new = """      if (activeTab === 'sponsorships') {
         // Mock total processing if a user purchased one of each mapped item
         const baseFeeRate = charityType === 'golf_sponsored' ? 0.022 : 0.029;
         const totalProcessing = sponsors.filter(s => s.passFees).reduce((acc, s) => acc + (s.price * baseFeeRate + 0.30), 0);
         const subtotal = sponsors.reduce((acc, s) => acc + s.price, 0);"""
text = text.replace(sponsors_preview_old, sponsors_preview_new)

sponsors_checkout_old = """                          <span style={{ color: 'var(--mist)' }}>+ ${(stripeFee * 4).toFixed(2)} Platform & Processing</span>"""
sponsors_checkout_new = """                          <div style={{ display: 'flex', flexDirection: 'column' }}>
                             <span style={{ color: 'var(--mist)', fontWeight: 600 }}>Standard Credit Card Processing Entity Fee</span>
                             <span style={{ color: '#aaa', fontSize: '0.65rem' }}>TourneyLinks charges exactly $0 platform & convenience fees.</span>
                          </div>
                          <span style={{ fontWeight: 600, color: 'var(--mist)' }}>${totalProcessing.toFixed(2)}</span>"""

# Only replace the one in activeTab === 'sponsorships'
if sponsors_checkout_old in text:
    text = text.replace(sponsors_checkout_old, sponsors_checkout_new)


with open("src/app/host/page.tsx", "w") as f:
    f.write(text)

