import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Compare TourneyLinks vs GolfGenius, EventCaddy & GolfPad',
  description: 'See why modern tournament organizers prefer the TourneyLinks $99 flat-fee model over expensive legacy software.',
};

export default function ComparePage() {
  const features = [
    {
      name: 'Organizer Pricing',
      tl: '$99 Flat Fee per Event',
      tlSub: '(First event just $49!)',
      gg: '$3,000+ Annual Contracts',
      ec: '$299 – $999 per Event',
      gp: 'Annual Subscription',
      eb: '7% + $1.50 per ticket',
    },
    {
      name: 'Player Fees',
      tl: '100% Free',
      gg: 'Free (If Course Pays)',
      ec: 'Hidden Convenience Fees',
      gp: 'Free',
      eb: 'High Ticketing Fees',
    },
    {
      name: 'Auto-Flighting Generation',
      tl: 'Yes (Instant)',
      gg: 'Yes',
      ec: 'Basic',
      gp: 'Yes',
      eb: 'No',
    },
    {
      name: 'WHS Handicap Sync',
      tl: 'Automated OCR',
      gg: 'Yes',
      ec: 'No',
      gp: 'Yes',
      eb: 'No',
    },
    {
      name: 'Live Leaderboards & GPS',
      tl: 'Yes (No App Required)',
      gg: 'Requires Native App',
      ec: 'Requires Native App',
      gp: 'Requires Native App',
      eb: 'No',
    },
    {
      name: 'Offline Scoring Sync',
      tl: 'Built-in',
      gg: 'No',
      ec: 'No',
      gp: 'Built-in',
      eb: 'No',
    },
    {
      name: 'Payout Automation',
      tl: 'Native Stripe Integration',
      gg: 'Complex Add-on',
      ec: 'Stripe/PayPal',
      gp: 'PayPal Only',
      eb: 'Native',
    },
    {
      name: 'Printable Scorecards & Signs',
      tl: 'Yes (Dynamic)',
      gg: 'Yes',
      ec: 'Printed',
      gp: 'Printed',
      eb: 'No',
    },
    {
      name: 'Live QR Code Onboarding',
      tl: 'Yes (Instant)',
      gg: 'No',
      ec: 'Manual',
      gp: 'Manual',
      eb: 'Tickets',
    },
    {
      name: 'Sponsor & Hole Integration',
      tl: 'Yes (Native Checkout)',
      gg: 'Yes',
      ec: 'Yes',
      gp: 'Yes',
      eb: 'Partial',
    },
    {
      name: 'Apple Watch & Wear OS',
      tl: 'Coming Soon',
      gg: 'Yes',
      ec: 'No',
      gp: 'Yes',
      eb: 'No',
    },
    {
      name: '30+ Scoring Formats',
      tl: 'Coming Soon',
      gg: 'Yes',
      ec: 'Basic',
      gp: 'Partial',
      eb: 'No',
    },
    {
      name: 'Multi-Round / Multi-Course',
      tl: 'Yes (PGA Rotations)',
      gg: 'Yes',
      ec: 'No',
      gp: 'Yes',
      eb: 'No',
    },
    {
      name: 'Detailed Statistical Analytics',
      tl: 'Coming Soon',
      gg: 'Yes',
      ec: 'Basic',
      gp: 'Yes',
      eb: 'No',
    },
    {
      name: 'Waitlists & Registration Caps',
      tl: 'Yes',
      gg: 'Yes',
      ec: 'Yes',
      gp: 'Basic',
      eb: 'Yes',
    },
    {
      name: 'Setup Time',
      tl: '< 5 Minutes',
      gg: 'Days of Training',
      ec: 'Hours',
      gp: 'Hours',
      eb: '10 Minutes',
    },
    {
      name: 'UI/UX Design',
      tl: 'Modern & Seamless',
      gg: 'Outdated / Clunky',
      ec: 'Standard',
      gp: 'Standard',
      eb: 'Generic (Not Golf)',
    },
  ];

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#05120c', color: '#f5f0e8', overflow: 'hidden', position: 'relative', paddingTop: '100px', paddingBottom: '100px' }}>
      
      {/* Background FX */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '60vh', background: 'radial-gradient(ellipse at top, rgba(78,201,160,0.15) 0%, transparent 70%)', pointerEvents: 'none' }}></div>
      <div style={{ position: 'absolute', inset: 0, opacity: 0.03, backgroundImage: 'radial-gradient(circle, rgba(201,168,76,0.5) 1px, transparent 1px)', backgroundSize: '30px 30px', pointerEvents: 'none' }}></div>
      
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 1.5rem', position: 'relative', zIndex: 10 }}>
        
        {/* Header Section */}
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontFamily: 'var(--font-mono), monospace', fontSize: '0.75rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#c9a84c', marginBottom: '1rem' }}>
            Platform Comparison
          </div>
          <h1 style={{ fontFamily: 'var(--font-serif), serif', fontSize: 'clamp(2.5rem, 5vw, 4rem)', color: '#f5f0e8', fontWeight: 700, lineHeight: 1.1, marginBottom: '1.5rem', letterSpacing: '-0.02em' }}>
            Stop Overpaying for <br />
            <span style={{ color: '#c9a84c' }}>Tournament Software</span>
          </h1>
          <p style={{ fontSize: '1.1rem', color: 'rgba(245,240,232,0.7)', maxWidth: '600px', margin: '0 auto 2rem', lineHeight: 1.6 }}>
            TourneyLinks was built specifically for modern golf events. We stripped away the clunky interfaces and massive enterprise contracts so you can launch a pro-tier event in minutes.
          </p>
        </div>

        {/* Matrix Table */}
        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '24px', overflow: 'hidden', backdropFilter: 'blur(20px)', boxShadow: '0 24px 60px rgba(0,0,0,0.4)' }}>
          <div style={{ overflowX: 'auto', paddingBottom: '1rem' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '1100px' }}>
              <thead>
                <tr>
                  <th style={{ padding: '2rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.08)', width: '20%' }}></th>
                  <th style={{ padding: '2rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.08)', width: '20%', background: 'rgba(78,201,160,0.05)', borderTop: '2px solid #4ec9a0' }}>
                    <div style={{ color: '#4ec9a0', fontSize: '1.25rem', fontWeight: 700, fontFamily: 'var(--font-serif), serif', marginBottom: '0.25rem' }}>TourneyLinks</div>
                    <div style={{ fontSize: '0.8rem', color: 'rgba(245,240,232,0.5)', fontWeight: 400 }}>Modern Ecosystem</div>
                  </th>
                  <th style={{ padding: '2rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.08)', width: '15%' }}>
                    <div style={{ color: '#f5f0e8', fontSize: '1.1rem', fontWeight: 600, fontFamily: 'var(--font-serif), serif', marginBottom: '0.25rem' }}>GolfGenius</div>
                    <div style={{ fontSize: '0.75rem', color: 'rgba(245,240,232,0.5)', fontWeight: 400 }}>Legacy Enterprise</div>
                  </th>
                  <th style={{ padding: '2rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.08)', width: '15%' }}>
                    <div style={{ color: '#f5f0e8', fontSize: '1.1rem', fontWeight: 600, fontFamily: 'var(--font-serif), serif', marginBottom: '0.25rem' }}>EventCaddy</div>
                    <div style={{ fontSize: '0.75rem', color: 'rgba(245,240,232,0.5)', fontWeight: 400 }}>Mid-Market</div>
                  </th>
                  <th style={{ padding: '2rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.08)', width: '15%' }}>
                    <div style={{ color: '#f5f0e8', fontSize: '1.1rem', fontWeight: 600, fontFamily: 'var(--font-serif), serif', marginBottom: '0.25rem' }}>GolfPad Events</div>
                    <div style={{ fontSize: '0.75rem', color: 'rgba(245,240,232,0.5)', fontWeight: 400 }}>App Ecosystem</div>
                  </th>
                  <th style={{ padding: '2rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.08)', width: '15%' }}>
                    <div style={{ color: '#f5f0e8', fontSize: '1.1rem', fontWeight: 600, fontFamily: 'var(--font-serif), serif', marginBottom: '0.25rem' }}>Eventbrite</div>
                    <div style={{ fontSize: '0.75rem', color: 'rgba(245,240,232,0.5)', fontWeight: 400 }}>Generic Ticketing</div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {features.map((feature, i) => (
                  <tr key={i} style={{ borderBottom: i === features.length - 1 ? 'none' : '1px solid rgba(255,255,255,0.04)' }}>
                    <td style={{ padding: '1.5rem', color: '#f5f0e8', fontWeight: 500, fontSize: '0.95rem' }}>
                      {feature.name}
                    </td>
                    <td style={{ padding: '1.5rem', background: 'rgba(78,201,160,0.03)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: feature.tl === 'Coming Soon' ? '#c9a84c' : '#4ec9a0', fontWeight: feature.tl === 'Coming Soon' ? 600 : 700, fontSize: '0.95rem' }}>
                        {feature.tl !== 'Coming Soon' && <span style={{ fontSize: '1.2rem' }}>✓</span>}
                        {feature.tl === 'Coming Soon' && <span style={{ fontSize: '1.2rem' }}>⏳</span>}
                        {feature.tl}
                      </div>
                      {feature.tlSub && <div style={{ color: '#c9a84c', fontSize: '0.75rem', marginTop: '0.25rem' }}>{feature.tlSub}</div>}
                    </td>
                    <td style={{ padding: '1.5rem', color: 'rgba(245,240,232,0.6)', fontSize: '0.9rem' }}>
                      {feature.gg}
                    </td>
                    <td style={{ padding: '1.5rem', color: 'rgba(245,240,232,0.6)', fontSize: '0.9rem' }}>
                      {feature.ec}
                    </td>
                    <td style={{ padding: '1.5rem', color: 'rgba(245,240,232,0.6)', fontSize: '0.9rem' }}>
                      {feature.gp}
                    </td>
                    <td style={{ padding: '1.5rem', color: 'rgba(245,240,232,0.6)', fontSize: '0.9rem' }}>
                      {feature.eb}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{ padding: '2rem', textAlign: 'center', background: 'rgba(0,0,0,0.3)', borderTop: '1px solid rgba(255,255,255,0.03)' }}>
            <Link href="/host/onboarding" style={{ display: 'inline-flex', background: '#4ec9a0', color: '#000', padding: '1rem 2rem', borderRadius: '8px', fontWeight: 600, textDecoration: 'none', transition: 'background 0.2s ease', }}>
              Start Hosting for $49 →
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
