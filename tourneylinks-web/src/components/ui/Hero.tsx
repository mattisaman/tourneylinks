import React from 'react';
import Link from 'next/link';

export default function Hero() {
  return (
    <section className="hero" style={{ padding: 0, maxWidth: "none" }}>
      <div className="hero-bg"></div>
      <div className="hero-grid"></div>
      <div className="hero-dots"></div>
      <div className="hero-content">
        {/* Centered Top Block */}
        <div style={{ maxWidth: '1200px', display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '6rem' }}>
          <div className="hero-eyebrow" style={{ 
              justifyContent: 'center', 
              background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.25) 0%, rgba(212, 175, 55, 0.05) 100%)', 
              border: '1px solid rgba(212, 175, 55, 0.6)', 
              padding: '0.7rem 2rem', 
              borderRadius: '100px', 
              color: '#FBF0C0', 
              fontWeight: 800, 
              fontSize: '0.85rem',
              letterSpacing: '0.3em',
              boxShadow: '0 8px 30px rgba(212,175,55,0.3)',
              backdropFilter: 'blur(16px)',
              textShadow: '0 0 20px rgba(251, 240, 192, 0.5)'
          }}>The Complete Golf Ecosystem</div>
          <h1 className="hero-headline" style={{ maxWidth: 'none', textAlign: 'center' }}>
            The Engine Behind Every <em>Great</em> Local Tournament
          </h1>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: '1rem', fontSize: '0.95rem', color: 'rgba(245,240,232,0.8)', marginTop: '0.5rem', fontFamily: 'var(--font-sans), sans-serif' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}><span style={{ color: 'var(--gold)' }}>✓</span> 100% Free for Players</span>
            <span style={{ opacity: 0.3 }} className="hidden md:inline">|</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}><span style={{ color: 'var(--gold)' }}>✓</span> Free for Course Pros</span>
            <span style={{ opacity: 0.3 }} className="hidden md:inline">|</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}><span style={{ color: 'var(--teal)' }}>✓</span> <b>$99/Event</b> for Organizers (Introductory Offer $49)</span>
          </div>
        </div>

        {/* 3 Pillar Dashboard */}
        <div className="hero-pillars-grid">
          
          {/* LEFT PILLAR: Organizers */}
          <div className="hero-pillar-card">
            <h3 style={{ color: 'var(--gold)', fontSize: '0.85rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', margin: '0 0 0.5rem' }}>For Organizers</h3>
            <h2 style={{ color: 'var(--cream)', fontSize: '2rem', fontFamily: 'var(--font-serif), serif', margin: '0 0 1rem', lineHeight: 1.1 }}>Host Your <br/>Event</h2>
            <p style={{ color: 'rgba(245,240,232,0.65)', fontSize: '0.95rem', lineHeight: 1.6, margin: '0 0 1rem' }}>
              Stop chasing checks. Launch tournaments, auto-generate flights, and collect payments natively through Stripe with zero friction.
            </p>
            <ul style={{ color: 'rgba(245,240,232,0.8)', fontSize: '0.85rem', lineHeight: 1.8, margin: '0 0 1.5rem', padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <li>✧ Live-scoring leaderboards</li>
              <li>✧ Automated digital payouts</li>
              <li>✧ Custom sponsor ad slots</li>
            </ul>
            <div style={{ marginTop: 'auto' }}>
              <Link href="/admin" className="btn-hero-outline" style={{ display: 'flex', justifyContent: 'center', width: '100%', padding: '1rem', marginBottom: '1rem' }}>
                Host an Event →
              </Link>
              <div style={{ textAlign: 'center' }}>
                <Link href="/compare" style={{ color: 'var(--gold)', fontSize: '0.85rem', textDecoration: 'none', fontWeight: 600 }}>
                  See how we compare →
                </Link>
              </div>
            </div>
          </div>

          {/* MIDDLE PILLAR: Players (The Form) */}
          <div className="hero-search-wrapper" style={{ height: '100%' }}>
            <div className="hero-search-panel" style={{ height: '100%', margin: 0, width: '100%', display: 'flex', flexDirection: 'column' }}>
              <div style={{ color: 'var(--gold)', fontSize: '0.85rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>For Golfers</div>
              <div className="search-panel-title">Find a Tournament</div>
              <div className="search-panel-sub">Search near your location or by course</div>
              
              <div className="search-field">
                <label>📍 Your Location</label>
                <input type="text" placeholder="City, State or ZIP code" />
              </div>
              <div className="search-row">
                <div className="search-field">
                  <label>Radius</label>
                  <select defaultValue="100 miles">
                    <option>25 miles</option>
                    <option>50 miles</option>
                    <option value="100 miles">100 miles</option>
                    <option>250 miles</option>
                    <option>Nationwide</option>
                  </select>
                </div>
                <div className="search-field">
                  <label>Date Range</label>
                  <input type="date" />
                </div>
              </div>
              
              <div style={{ marginTop: 'auto', paddingTop: '1rem' }}>
                <Link href="/tournaments" className="btn-hero" style={{ width: "100%", justifyContent: "center" }}>
                  Search Tournaments →
                </Link>
                <div style={{ textAlign: "center", margin: "1rem 0 0 0" }}>
                  <Link href="/profile" style={{ color: "rgba(245,240,232,0.4)", fontSize: "0.78rem", textDecoration: "none" }}>
                    🔔 Get alerts for new tournaments
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT PILLAR: Course Pros */}
          <div className="hero-pillar-card">
            <h3 style={{ color: 'var(--gold)', fontSize: '0.85rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', margin: '0 0 0.5rem' }}>For Course Pros</h3>
            <h2 style={{ color: 'var(--cream)', fontSize: '2rem', fontFamily: 'var(--font-serif), serif', margin: '0 0 1rem', lineHeight: 1.1 }}>Manage <br/>Your Course</h2>
            <p style={{ color: 'rgba(245,240,232,0.65)', fontSize: '0.95rem', lineHeight: 1.6, margin: '0 0 1rem' }}>
              Take control of your facility. Claim your course to centralize logistics, download tee sheets, and message hosts directly.
            </p>
            <ul style={{ color: 'rgba(245,240,232,0.8)', fontSize: '0.85rem', lineHeight: 1.8, margin: '0 0 1.5rem', padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <li>✧ Direct messaging portal</li>
              <li>✧ Real-time tee sheet sync</li>
              <li>✧ Unified facility calendar</li>
            </ul>
            <div style={{ marginTop: 'auto' }}>
              <Link href="/courses" className="btn-hero-outline" style={{ display: 'flex', justifyContent: 'center', width: '100%', padding: '1rem' }}>
                Claim Your Course →
              </Link>
            </div>
          </div>

        </div>
        
        {/* Global Stats - Moved Below Pillars */}
        <div style={{ maxWidth: '1200px', display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '3rem auto 0 auto' }}>
          <div className="hero-stats" style={{ justifyContent: 'center', gap: '4rem' }}>
            <div>
              <div className="hero-stat-num">4,200+</div>
              <div className="hero-stat-label">Tournaments Hosted</div>
            </div>
            <div>
              <div className="hero-stat-num">87K</div>
              <div className="hero-stat-label">Registered Players</div>
            </div>
            <div>
              <div className="hero-stat-num">16,000+</div>
              <div className="hero-stat-label">Courses Nationwide</div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
