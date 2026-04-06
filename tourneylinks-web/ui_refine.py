with open("src/app/host/page.tsx", "r") as f:
    text = f.read()

# 1. Remove Administration Hub text in the icon header
admin_hub_old = """                     <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.3rem' }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--gold)', filter: 'drop-shadow(0 0 4px rgba(212,175,55,0.8))' }}><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                        <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#f3e5ab', letterSpacing: '0.15em', textTransform: 'uppercase', opacity: 0.9 }}>Administration Hub</div>
                     </div>"""
text = text.replace(admin_hub_old, "")


# 2. Inject toggle for packages
packages_old = """                       <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                          <span style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--grass)' }}>${typeof p.price === 'number' ? p.price.toFixed(2) : Number(p.price).toFixed(2)}</span>
                          <button onClick={() => {"""
packages_new = """                       <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                          <label className="toggle-switch" style={{ transform: 'scale(0.8)', margin: '0 0.5rem' }}>
                             <input type="checkbox" checked={p.passFees} onChange={(e) => {
                                const clone = [...packages];
                                clone[i].passFees = e.target.checked;
                                setPackages(clone);
                             }} />
                             <span className="toggle-slider"></span>
                          </label>
                          <span style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--grass)' }}>${typeof p.price === 'number' ? p.price.toFixed(2) : Number(p.price).toFixed(2)}</span>
                          <button onClick={() => {"""
text = text.replace(packages_old, packages_new)

# 3. Inject toggle for addons
addons_old = """                       <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                          <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--ink)' }}>${a.price.toFixed(2)}</div>
                          <button onClick={() => {"""
addons_new = """                       <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                          <label className="toggle-switch" style={{ transform: 'scale(0.8)', margin: '0 0.5rem' }}>
                             <input type="checkbox" checked={a.passFees} onChange={(e) => {
                                const clone = [...addons];
                                clone[i].passFees = e.target.checked;
                                setAddons(clone);
                             }} />
                             <span className="toggle-slider"></span>
                          </label>
                          <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--ink)' }}>${a.price.toFixed(2)}</div>
                          <button onClick={() => {"""
text = text.replace(addons_old, addons_new)

# 4. Inject toggle for sponsors
sponsors_old = """                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                           <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--grass)' }}>${s.price.toLocaleString()}</div>
                           <div style={{ display: 'flex', gap: '0.5rem' }}>
                              <button onClick={() => {"""
sponsors_new = """                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                          <label className="toggle-switch" style={{ transform: 'scale(0.8)', margin: '0 0.5rem' }}>
                             <input type="checkbox" checked={s.passFees} onChange={(e) => {
                                const clone = [...sponsors];
                                clone[i].passFees = e.target.checked;
                                setSponsors(clone);
                             }} />
                             <span className="toggle-slider"></span>
                          </label>
                           <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--grass)' }}>${s.price.toLocaleString()}</div>
                           <div style={{ display: 'flex', gap: '0.5rem' }}>
                              <button onClick={() => {"""
text = text.replace(sponsors_old, sponsors_new)

with open("src/app/host/page.tsx", "w") as f:
    f.write(text)

print("done")
