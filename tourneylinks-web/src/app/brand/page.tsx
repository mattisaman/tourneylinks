import React from 'react';
import { Download, Palette } from 'lucide-react';
import Link from 'next/link';

export default function BrandGuidelines() {
  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', color: 'var(--admin-golf-white)', padding: '4rem 2rem', fontFamily: "'Inter', sans-serif" }}>
       
       <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '4rem', paddingBottom: '2rem', borderBottom: '1px solid var(--admin-bark-brown)' }}>
             <div>
                <Link href="/" style={{ color: 'var(--admin-gold-light)', textDecoration: 'none', fontWeight: 600, fontSize: '0.9rem', marginBottom: '1rem', display: 'inline-block' }}>
                   ← Return Home
                </Link>
                <h1 style={{ fontSize: '3.5rem', fontWeight: 900, margin: '0 0 0.5rem 0', letterSpacing: '-1px', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                   <Palette size={48} color="var(--admin-gold-light)" /> Brand Architecture
                </h1>
                <p style={{ color: 'var(--admin-sand)', opacity: 0.8, margin: 0, fontSize: '1.2rem', maxWidth: '600px' }}>
                   The official TourneyLinks visual identity system. Defining the intersection of premium sports technology and luxury aesthetics.
                </p>
             </div>
             
             <button style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem 2rem', background: 'var(--admin-gold-light)', color: '#000', border: 'none', borderRadius: '8px', fontWeight: 800, cursor: 'pointer', boxShadow: `0 4px 20px rgba(230,194,122,0.15)` }}>
                <Download size={20} /> Download PDF Guidelines
             </button>
          </div>

          {/* Core Palette */}
          <div>
             <h2 style={{ fontSize: '2rem', fontWeight: 800, margin: '0 0 2rem 0' }}>The Max Pro Palette</h2>
             
             <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                
                <ColorCard 
                   name="Gold Light" 
                   hex="#E6C27A" 
                   variable="--admin-gold-light" 
                   desc="Primary interaction state and luxury accent." 
                   darkText 
                />
                
                <ColorCard 
                   name="Green Soft" 
                   hex="#5B7B61" 
                   variable="--admin-green-soft" 
                   desc="Muted Augusta pine for success states and active elements." 
                />
                
                <ColorCard 
                   name="Forest Dark" 
                   hex="#032115" 
                   variable="--admin-forest-dark" 
                   desc="Deep Augusta green providing depth and contrast layering." 
                />
                
                <ColorCard 
                   name="Golf White" 
                   hex="#F7F9FA" 
                   variable="--admin-golf-white" 
                   desc="Matte off-white for primary data values and headings." 
                   darkText 
                />
                
                <ColorCard 
                   name="Parchment Sand" 
                   hex="#E2D7B4" 
                   variable="--admin-sand" 
                   desc="Premium bunker tone for secondary typography." 
                   darkText 
                />
                
                <ColorCard 
                   name="Pin Red" 
                   hex="#D13438" 
                   variable="--admin-pin-red" 
                   desc="Flagstick red for structural alerts and notifications." 
                />
                
                <ColorCard 
                   name="Bark Brown" 
                   hex="#4A3B2C" 
                   variable="--admin-bark-brown" 
                   desc="Deep wet-sand tone for structural borders and inactive states." 
                />

             </div>
          </div>

          <div style={{ marginTop: '5rem', padding: '3rem', background: '#111', border: '1px solid var(--admin-bark-brown)', borderRadius: '12px' }}>
             <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1rem', color: 'var(--admin-gold-light)' }}>Geometry & Constraints</h3>
             <p style={{ color: 'var(--admin-sand)', lineHeight: 1.6, maxWidth: '800px' }}>
                The TourneyLinks OS strictly prohibits the use of "pill" geometry (e.g. `border-radius: 50vw` or `100px`). All interactive UI components, tags, and data cards must snap to precise constraints: <strong>4px, 6px, 8px, or 12px radii</strong>. 
                <br /><br />
                This structural rigidity ensures the highest caliber B2B enterprise perception, mimicking the engineered precision of a milled putter or carbon-face driver.
             </p>
          </div>

       </div>
    </div>
  );
}

function ColorCard({ name, hex, variable, desc, darkText = false }: { name: string, hex: string, variable: string, desc: string, darkText?: boolean }) {
   return (
      <div style={{ background: '#111', border: '1px solid var(--admin-bark-brown)', borderRadius: '12px', overflow: 'hidden' }}>
         <div style={{ height: '160px', background: hex, display: 'flex', alignItems: 'flex-end', padding: '1.5rem' }}>
            <div style={{ color: darkText ? '#000' : '#fff', fontWeight: 800, fontSize: '1.5rem', opacity: 0.9 }}>{hex}</div>
         </div>
         <div style={{ padding: '1.5rem' }}>
            <h3 style={{ margin: '0 0 0.25rem 0', fontWeight: 700, fontSize: '1.2rem', color: 'var(--admin-golf-white)' }}>{name}</h3>
            <code style={{ color: 'var(--admin-sand)', fontSize: '0.85rem', display: 'block', marginBottom: '1rem', opacity: 0.7 }}>var({variable})</code>
            <p style={{ margin: 0, color: '#888', fontSize: '0.9rem', lineHeight: 1.5 }}>
               {desc}
            </p>
         </div>
      </div>
   );
}
