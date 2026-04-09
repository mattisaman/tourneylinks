import React from 'react';
import Link from 'next/link';
import { Building2, TrendingUp, ShieldCheck, Target, ChevronRight, BarChart4, Tv, SearchCheck } from 'lucide-react';

export default function SponsorsLandingPage() {
  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundImage: 'linear-gradient(to bottom, rgba(15,20,15,0.8), rgba(10,12,10,0.98)), url("/sponsor_bg.jpg")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed',
      color: '#fff', 
      paddingTop: '80px',
      paddingBottom: '100px',
      fontFamily: '"Inter", sans-serif',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }}>
      
      {/* 1. HERO SECTION */}
      <div style={{ padding: '6rem 2rem', width: '100%', maxWidth: '900px', textAlign: 'center', position: 'relative', zIndex: 10 }}>
        
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1.25rem', borderRadius: '100px', fontSize: '0.8rem', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '2rem', background: 'rgba(212,175,55,0.15)', color: 'var(--gold)', border: '1px solid rgba(212,175,55,0.3)' }}>
          <Building2 size={16} /> B2B Ad-Network Integration
        </div>
        
        <h1 style={{ fontSize: 'clamp(2.5rem, 4vw, 4rem)', fontWeight: 800, marginBottom: '1.5rem', lineHeight: 1.1, textShadow: '0 4px 20px rgba(0,0,0,0.8)' }}>
          Capture the Most Valuable Demographic in Your City.
        </h1>
        
        <p style={{ fontSize: '1.1rem', color: '#c4c8cc', fontWeight: 500, maxWidth: '750px', margin: '0 auto 3rem auto', lineHeight: 1.7, textShadow: '0 2px 10px rgba(0,0,0,0.8)' }}>
          Sponsor local charity golf tournaments and inject your brand directly onto digital leaderboards spanning your exact zip code, or beyond! Guaranteed 5-hour engagement loops with affluent decision makers.
        </p>

        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Link href="/sponsors/directory" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'linear-gradient(135deg, #d4af37, #aa8529)', color: '#000', padding: '1.1rem 2rem', borderRadius: '12px', fontSize: '1rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', boxShadow: '0 10px 30px rgba(212,175,55,0.3)', textDecoration: 'none' }}>
            Browse Event Inventory <ChevronRight size={18} />
          </Link>
        </div>
      </div>

      {/* 2. THE VALUE PROP TILES */}
      <div style={{ padding: '6rem 2rem', width: '100%', maxWidth: '1100px', position: 'relative', zIndex: 10 }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h2 style={{ fontSize: 'clamp(2rem, 3.5vw, 3rem)', fontWeight: 800, marginBottom: '1rem', textShadow: '0 4px 10px rgba(0,0,0,0.5)' }}>Why the Golf Course?</h2>
          <p style={{ fontSize: '1.05rem', color: '#aab0b5', maxWidth: '750px', margin: '0 auto', lineHeight: 1.6 }}>
            Social media advertising is saturated and frequently ignored. A corporate golf sponsorship provides a completely captive audience consisting exclusively of local business owners, executives, and high-net-worth consumers.
          </p>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', justifyContent: 'center' }}>
          
          {/* Tile 1 */}
          <div style={{ flex: '1 1 300px', minWidth: '280px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', boxShadow: '0 15px 35px rgba(0,0,0,0.5)', borderRadius: '20px', padding: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
              <div style={{ width: '48px', height: '48px', flexShrink: 0, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, rgba(212,175,55,0.2), rgba(212,175,55,0.05))', color: 'var(--gold)', border: '1px solid rgba(212,175,55,0.3)' }}>
                <Target size={24} />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#fff', margin: 0, lineHeight: 1.2 }}>Hyper-Local Geofencing</h3>
            </div>
            <p style={{ color: '#9ba1a6', fontSize: '0.95rem', lineHeight: 1.6, margin: 0 }}>
              Precision targeting. Our directory allows you to isolate and sponsor tournaments executing strictly within a 25-mile radius of your storefront, ensuring 100% of your Ad-Spend targets neighborhood relevance.
            </p>
          </div>

          {/* Tile 2 */}
          <div style={{ flex: '1 1 300px', minWidth: '280px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', boxShadow: '0 15px 35px rgba(0,0,0,0.5)', borderRadius: '20px', padding: '2rem' }}>
             <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
              <div style={{ width: '48px', height: '48px', flexShrink: 0, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, rgba(212,175,55,0.2), rgba(212,175,55,0.05))', color: 'var(--gold)', border: '1px solid rgba(212,175,55,0.3)' }}>
                <ShieldCheck size={24} />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#fff', margin: 0, lineHeight: 1.2 }}>501(c)(3) Tax Write-offs</h3>
            </div>
            <p style={{ color: '#9ba1a6', fontSize: '0.95rem', lineHeight: 1.6, margin: 0 }}>
              Bulletproof compliance. Our automated Stripe Connect pipeline routes your corporate sponsorship securely into the charitable foundation orchestrating the event, capturing your philanthropic tax-deduction instantly.
            </p>
          </div>

          {/* Tile 3 */}
          <div style={{ flex: '1 1 300px', minWidth: '280px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', boxShadow: '0 15px 35px rgba(0,0,0,0.5)', borderRadius: '20px', padding: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
              <div style={{ width: '48px', height: '48px', flexShrink: 0, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, rgba(212,175,55,0.2), rgba(212,175,55,0.05))', color: 'var(--gold)', border: '1px solid rgba(212,175,55,0.3)' }}>
                <TrendingUp size={24} />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#fff', margin: 0, lineHeight: 1.2 }}>Mobile App Presence</h3>
            </div>
            <p style={{ color: '#9ba1a6', fontSize: '0.95rem', lineHeight: 1.6, margin: 0 }}>
              Beyond physical signs. Your high-res digital logo is injected natively into the live iOS/Android Mobile Scorer App, automatically pushing direct, trackable click-through traffic to your website.
            </p>
          </div>

        </div>
      </div>

      {/* MID-PAGE BANNER: The Tech Backbone */}
      <div style={{ width: '100%', background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)', padding: '5rem 2rem', marginTop: '4rem', marginBottom: '4rem' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', gap: '4rem', alignItems: 'center', justifyContent: 'space-between' }}>
          
          <div style={{ flex: '1 1 450px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.4rem 1rem', borderRadius: '100px', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '1.5rem', background: 'rgba(255,255,255,0.1)', color: '#fff', letterSpacing: '1px' }}>
              <Tv size={14} /> Omni-Channel Delivery
            </div>
            <h2 style={{ fontSize: 'clamp(2rem, 3vw, 2.8rem)', fontWeight: 800, color: '#fff', marginBottom: '1.5rem', lineHeight: 1.2 }}>
              Your Brand, Distributed Everywhere.
            </h2>
            <p style={{ fontSize: '1.05rem', color: '#aab0b5', marginBottom: '2rem', lineHeight: 1.6 }}>
               TourneyLinks transforms traditional analog sponsorships into a synchronized AdTech loop. When you acquire a sponsorship package, your creative asset is automatically verified by AI and distributed across the entire venue ecosystem.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', fontSize: '1.05rem', color: '#e2e5e8', fontWeight: 500 }}>
               <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}><span style={{ color: 'var(--gold)', fontWeight: 800 }}>✓</span> Clubhouse TV Leaderboards</div>
               <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}><span style={{ color: 'var(--gold)', fontWeight: 800 }}>✓</span> Mobile Phone Live-Scorers</div>
               <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}><span style={{ color: 'var(--gold)', fontWeight: 800 }}>✓</span> Interactive Course Maps</div>
               <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}><span style={{ color: 'var(--gold)', fontWeight: 800 }}>✓</span> Post-Tournament Mass Emails</div>
            </div>
          </div>

          <div style={{ flex: '1 1 350px', position: 'relative', height: '320px', borderRadius: '24px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.02)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '2rem' }}>
             <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: '50%', background: 'linear-gradient(to top, rgba(212,175,55,0.15), transparent)' }} />
             <div style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
                <BarChart4 size={54} color="var(--gold)" style={{ opacity: 0.9 }} />
                <h3 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#fff' }}>Data-Driven Philanthropy</h3>
                <p style={{ color: '#9ba1a6', fontSize: '0.95rem', lineHeight: 1.5 }}>
                  Track clicks, monitor engagement, and measure the direct ROI of your charitable expenditure natively from your dashboard.
                </p>
             </div>
          </div>

        </div>
      </div>

      {/* 3. HOW IT WORKS (The Pipeline) */}
      <div style={{ padding: '4rem 2rem', width: '100%', maxWidth: '1000px', textAlign: 'center' }}>
         <div style={{ marginBottom: '5rem' }}>
           <h2 style={{ fontSize: 'clamp(2rem, 3.5vw, 3rem)', fontWeight: 800, color: '#fff', marginBottom: '1rem', textShadow: '0 4px 10px rgba(0,0,0,0.5)' }}>
             Zero-Friction Acquisitions.
           </h2>
           <p style={{ fontSize: '1.05rem', color: '#aab0b5', maxWidth: '700px', margin: '0 auto', lineHeight: 1.6 }}>
             Forget massive email chains, messy artwork attachments, and writing physical checks. Centralize your strategic ad-spend in exactly 3 clicks.
           </p>
         </div>
         
         <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3rem', position: 'relative', justifyContent: 'center' }}>
            
            <div style={{ flex: '1 1 250px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem', fontWeight: 900, marginBottom: '1.5rem', background: 'rgba(10,10,10,0.8)', border: '2px solid var(--gold)', color: 'var(--gold)', boxShadow: '0 0 25px rgba(212,175,55,0.2)' }}>
                01
              </div>
              <h4 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#fff', marginBottom: '0.8rem' }}>Browse</h4>
              <p style={{ color: '#9ba1a6', fontSize: '0.95rem', lineHeight: 1.5 }}>Use our map to discover upcoming elite charity scrambles in your operational market radius.</p>
            </div>

            <div style={{ flex: '1 1 250px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem', fontWeight: 900, marginBottom: '1.5rem', background: 'rgba(10,10,10,0.8)', border: '2px solid var(--gold)', color: 'var(--gold)', boxShadow: '0 0 25px rgba(212,175,55,0.2)' }}>
                02
              </div>
              <h4 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#fff', marginBottom: '0.8rem' }}>Upload</h4>
              <p style={{ color: '#9ba1a6', fontSize: '0.95rem', lineHeight: 1.5 }}>Drag and drop your company logo instantly. Our automated AI model clears your graphic for UBIT compliance.</p>
            </div>

            <div style={{ flex: '1 1 250px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem', fontWeight: 900, marginBottom: '1.5rem', background: 'rgba(10,10,10,0.8)', border: '2px solid var(--gold)', color: 'var(--gold)', boxShadow: '0 0 25px rgba(212,175,55,0.2)' }}>
                03
              </div>
              <h4 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#fff', marginBottom: '0.8rem' }}>Fund</h4>
              <p style={{ color: '#9ba1a6', fontSize: '0.95rem', lineHeight: 1.5 }}>Checkout seamlessly via Stripe or PayPal. Ad inventory is reserved instantly and capital is routed straight to the charity vault.</p>
            </div>

         </div>
      </div>

    </div>
  );
}
