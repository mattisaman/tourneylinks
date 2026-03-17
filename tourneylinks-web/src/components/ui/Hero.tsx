import React from 'react';
import Link from 'next/link';

export default function Hero() {
  return (
    <section className="hero" style={{ padding: 0, maxWidth: "none" }}>
      <div className="hero-bg"></div>
      <div className="hero-grid"></div>
      <div className="hero-dots"></div>
      <div className="hero-content">
        <div>
          <div className="hero-eyebrow">The Golf Tournament Platform</div>
          <h1 className="hero-headline">
            Where <em>Great</em><br />Rounds Begin
          </h1>
          <p className="hero-sub">
            Discover, register, and compete in golf tournaments near you. 
            For organizers: launch your event, manage registrations, and collect payments — all in one beautiful platform.
          </p>
          <div className="hero-actions">
            <Link href="/tournaments" className="btn-hero">
              ⛳ Find Tournaments
            </Link>
            <Link href="/admin" className="btn-hero-outline">
              Host an Event →
            </Link>
          </div>
          <div className="hero-stats">
            <div>
              <div className="hero-stat-num">4,200+</div>
              <div className="hero-stat-label">Tournaments Hosted</div>
            </div>
            <div>
              <div className="hero-stat-num">87K</div>
              <div className="hero-stat-label">Registered Players</div>
            </div>
            <div>
              <div className="hero-stat-num">2,800+</div>
              <div className="hero-stat-label">Courses Nationwide</div>
            </div>
          </div>
        </div>

        {/* Search Panel */}
        <div className="hero-search-panel">
          <div className="search-panel-title">Find a Tournament</div>
          <div className="search-panel-sub">Search near your location or by course</div>
          <div className="toggle-group">
            <button className="toggle-btn active">Players</button>
            <button className="toggle-btn">Organizers</button>
            <button className="toggle-btn">Both</button>
          </div>
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
              <label>Format</label>
              <select>
                <option>Any Format</option>
                <option>Stroke Play</option>
                <option>Match Play</option>
                <option>Scramble</option>
                <option>Stableford</option>
                <option>Best Ball</option>
              </select>
            </div>
          </div>
          <div className="search-row">
            <div className="search-field">
              <label>Date Range</label>
              <input type="date" />
            </div>
            <div className="search-field">
              <label>Handicap Max</label>
              <select>
                <option>Any</option>
                <option>0–5</option>
                <option>6–10</option>
                <option>11–18</option>
                <option>19–36</option>
              </select>
            </div>
          </div>
          <Link href="/tournaments" className="btn-hero" style={{ width: "100%", justifyContent: "center" }}>
            Search Tournaments →
          </Link>
          <div style={{ textAlign: "center", marginTop: "1rem" }}>
            <a href="#" style={{ color: "rgba(245,240,232,0.4)", fontSize: "0.78rem", textDecoration: "none" }}>
              🔔 Get alerts for new tournaments in my area
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
