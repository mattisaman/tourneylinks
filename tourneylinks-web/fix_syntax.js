const fs = require('fs');
const path = './src/app/host/page.tsx';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(
`                                 </div>
                             </div>
                         </div>
                      
                      ) : activeTab === 'finance' ? (`,
`                                 </div>
                             </div>
                         </div>
                      </div>
                      ) : activeTab === 'finance' ? (`
);

content = content.replace(
`                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '2rem' }}>
                               {sponsors.map((s, idx) => (
                                  <div key={idx} style={{ padding: '1rem', background: '#f8faf9', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                     <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--forest)' }}>{s.tier}</span>
                                     <span style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--grass)' }}>\${s.price}</span>
                                  </div>
                               ))}
                            </div>
                         </div>

                         {/* Sticky Bottom Action Mobile */}
                         <div style={{ position: 'sticky', bottom: 0, background: '#fff', padding: '1rem', borderTop: '1px solid rgba(0,0,0,0.05)', display: 'flex', justifyContent: 'center', zIndex: 50 }}>
                            <button style={{ width: '100%', padding: '0.9rem', background: \`linear-gradient(135deg, \${themeColor}, \${secondaryThemeColor})\`, color: '#fff', fontWeight: 700, border: \`1px solid \${secondaryThemeColor}40\`, borderRadius: '12px', boxShadow: \`0 8px 20px \${themeColor}40\` }}>
                               Register Now
                            </button>
                         </div>
                      
                      ) : activeTab === 'finance' ? (`,
`                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '2rem' }}>
                               {sponsors.map((s, idx) => (
                                  <div key={idx} style={{ padding: '1rem', background: '#f8faf9', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                     <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--forest)' }}>{s.tier}</span>
                                     <span style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--grass)' }}>\${s.price}</span>
                                  </div>
                               ))}
                            </div>
                         </div>

                         {/* Sticky Bottom Action Mobile */}
                         <div style={{ position: 'sticky', bottom: 0, background: '#fff', padding: '1rem', borderTop: '1px solid rgba(0,0,0,0.05)', display: 'flex', justifyContent: 'center', zIndex: 50 }}>
                            <button style={{ width: '100%', padding: '0.9rem', background: \`linear-gradient(135deg, \${themeColor}, \${secondaryThemeColor})\`, color: '#fff', fontWeight: 700, border: \`1px solid \${secondaryThemeColor}40\`, borderRadius: '12px', boxShadow: \`0 8px 20px \${themeColor}40\` }}>
                               Register Now
                            </button>
                         </div>
                      </div>
                      ) : activeTab === 'finance' ? (`
);

fs.writeFileSync(path, content, 'utf8');
console.log('Fixed syntax!');
