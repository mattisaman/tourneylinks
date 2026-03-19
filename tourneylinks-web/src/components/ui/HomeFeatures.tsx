import React from 'react';

export default function HomeFeatures() {
  return (
    <>
      {/* FEATURES */}
      <div className="features-section">
        <div className="features-inner">
          <div className="features-eyebrow">Everything You Need</div>
          <div className="features-title">Built for the Fairway,<br/>Designed for Everyone</div>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">📍</div>
              <div className="feature-title">Location-Based Discovery</div>
              <div className="feature-desc">Find tournaments within any radius of your location. Filter by format, handicap, date, and entry fee to find your perfect fit.</div>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💳</div>
              <div className="feature-title">Stripe-Powered Payments</div>
              <div className="feature-desc">Instant, secure payment processing. Organizers receive funds directly. Players get automatic receipts and confirmation emails.</div>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔔</div>
              <div className="feature-title">Smart Notifications</div>
              <div className="feature-desc">Stay informed via email, SMS, or WhatsApp. Get reminders, rule sheets, location details, tee time assignments, and results.</div>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🏌️</div>
              <div className="feature-title">Handicap Integration</div>
              <div className="feature-desc">Full handicap management with USGA-compliant index tracking. Automatic net scoring, flight assignments, and adjustments.</div>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔒</div>
              <div className="feature-title">Private Pre-Launch</div>
              <div className="feature-desc">Share your tournament with loyal golfers before going public. Password-protected early access links with full registration capability.</div>
            </div>
            <div className="feature-card">
              <div className="feature-icon">⛳</div>
              <div className="feature-title">Course Database</div>
              <div className="feature-desc">16,000+ golf courses nationwide. Direct communication tools to coordinate scheduling, tee times, and logistics with course staff.</div>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🖼️</div>
              <div className="feature-title">Custom Branding</div>
              <div className="feature-desc">Upload your logo and cover images to create a fully branded tournament page. Share on social media to maximize registrations.</div>
            </div>
            <div className="feature-card">
              <div className="feature-icon">⭐</div>
              <div className="feature-title">Reviews & Ratings</div>
              <div className="feature-desc">Post-tournament review system. Build your reputation as an organizer. Players can rate courses, organization, and overall experience.</div>
            </div>
            <div className="feature-card">
              <div className="feature-icon">👥</div>
              <div className="feature-title">Team Registration</div>
              <div className="feature-desc">Share a unique team link with your foursome. Track who's registered and paid. Group notifications keep everyone informed.</div>
            </div>
          </div>
        </div>
      </div>

      {/* HOW IT WORKS */}
      <div className="hiw-section">
        <div className="hiw-inner">
          <div className="section-eyebrow">How It Works</div>
          <div className="section-title" style={{ marginBottom: '3rem' }}>Two Sides of the Fairway</div>
          <div className="hiw-grid">
            <div className="hiw-panel">
              <div className="hiw-panel-title">🏌️ For Players</div>
              <div className="hiw-step">
                <div className="hiw-step-num">1</div>
                <div>
                  <div className="hiw-step-title">Search & Discover</div>
                  <div className="hiw-step-desc">Enter your location and preferred radius. Browse upcoming tournaments filtered by format, handicap, and date.</div>
                </div>
              </div>
              <div className="hiw-step">
                <div className="hiw-step-num">2</div>
                <div>
                  <div className="hiw-step-title">Review & Register</div>
                  <div className="hiw-step-desc">Read full tournament details — rules, format, schedule, course info, and handicap requirements. Register and pay securely with Stripe.</div>
                </div>
              </div>
              <div className="hiw-step">
                <div className="hiw-step-num">3</div>
                <div>
                  <div className="hiw-step-title">Invite Your Team</div>
                  <div className="hiw-step-desc">Share a unique team link with your playing partners. Everyone registers individually but you're linked as a group.</div>
                </div>
              </div>
              <div className="hiw-step">
                <div className="hiw-step-num">4</div>
                <div>
                  <div className="hiw-step-title">Play & Get Notified</div>
                  <div className="hiw-step-desc">Receive tee times, rule sheets, and course directions. Get real-time updates via email, SMS, or WhatsApp. See results as they happen.</div>
                </div>
              </div>
            </div>

            <div className="hiw-panel">
              <div className="hiw-panel-title">🏆 For Organizers</div>
              <div className="hiw-step">
                <div className="hiw-step-num">1</div>
                <div>
                  <div className="hiw-step-title">Create Your Event Page</div>
                  <div className="hiw-step-desc">Upload your logo, cover image, and tournament details. Set format, rules, handicap requirements, and pricing. Choose private or public launch.</div>
                </div>
              </div>
              <div className="hiw-step">
                <div className="hiw-step-num">2</div>
                <div>
                  <div className="hiw-step-title">Pre-Launch to Loyals</div>
                  <div className="hiw-step-desc">Share a private link with your loyal golfers before going public. Give them first-mover advantage with early registration.</div>
                </div>
              </div>
              <div className="hiw-step">
                <div className="hiw-step-num">3</div>
                <div>
                  <div className="hiw-step-title">Go Public & Promote</div>
                  <div className="hiw-step-desc">Publish to the TourneyLinks marketplace. Share your tournament link on social media. Course database integration helps coordinate logistics.</div>
                </div>
              </div>
              <div className="hiw-step">
                <div className="hiw-step-num">4</div>
                <div>
                  <div className="hiw-step-title">Manage & Communicate</div>
                  <div className="hiw-step-desc">Dashboard shows registrations, payments, handicaps, and flights. Send bulk notifications with rules, tee times, and results instantly.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* NOTIFY CTA */}
      <div className="notify-section">
        <div className="notify-inner">
          <div className="notify-title">Never Miss a Tournament</div>
          <div className="notify-desc">
            Opt in to get notified when new tournaments are posted within your radius. 
            Choose email, SMS, or WhatsApp — we'll only send what matters.
          </div>
          <div className="notify-form">
            <input className="notify-input" type="email" placeholder="your@email.com" />
            <button className="notify-btn">Notify Me →</button>
          </div>
          <div style={{ marginTop: '1rem', fontSize: '0.78rem', color: 'rgba(245,240,232,0.35)' }}>
            No spam. Unsubscribe anytime. Also available via SMS & WhatsApp.
          </div>
        </div>
      </div>

      {/* REVIEWS */}
      <section className="section-wrapper">
        <div className="section-eyebrow">Player Reviews</div>
        <div className="section-header">
          <div>
            <div className="section-title">What Golfers Are Saying</div>
          </div>
        </div>
        <div className="reviews-grid">
          <div className="review-card">
            <div className="review-stars">★★★★★</div>
            <div className="review-text">"Found a scramble 30 minutes from me that I never would have known about. Registered in 2 minutes, got my tee time via text the morning of. Absolutely seamless."</div>
            <div className="review-author">
              <div className="review-avatar">MR</div>
              <div>
                <div className="review-name">Mike Reynolds</div>
                <div className="review-meta">Handicap 14 · Chicago, IL</div>
              </div>
            </div>
          </div>
          <div className="review-card">
            <div className="review-stars">★★★★★</div>
            <div className="review-text">"As an organizer, the dashboard is incredible. Seeing who's paid, their handicaps, building flights automatically — this replaced 3 spreadsheets and a group chat."</div>
            <div className="review-author">
              <div className="review-avatar">TH</div>
              <div>
                <div className="review-name">Tom Harrington</div>
                <div className="review-meta">Tournament Organizer · Austin, TX</div>
              </div>
            </div>
          </div>
          <div className="review-card">
            <div className="review-stars">★★★★☆</div>
            <div className="review-text">"The pre-launch private link is a game changer. I sent it to my regulars 2 weeks early, they filled 60% of spots before we even went public. Loyal players love feeling first."</div>
            <div className="review-author">
              <div className="review-avatar">PL</div>
              <div>
                <div className="review-name">Patricia Lee</div>
                <div className="review-meta">Club Events Director · Scottsdale, AZ</div>
              </div>
            </div>
          </div>
        </div>
      </section>

    </>
  );
}
