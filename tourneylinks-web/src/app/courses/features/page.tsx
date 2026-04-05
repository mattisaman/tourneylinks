import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Course Pro Features | TourneyLinks',
  description: 'Reclaim your facility\'s operational bandwidth. Centralize every hosted event into a single hub with deep dashboard insights and standardized tee-sheets.',
};

export default function CourseProFeatures() {
  const features = [
    {
      title: 'Real-Time Headcount Verification',
      description: 'Stop guessing on F&B and cart staging. Our live dashboards show you exactly how many players have paid and registered, down to the minute.',
      icon: '📊',
    },
    {
      title: 'Centralized Tournament Hub',
      description: 'Ditch the chaotic email threads. Every third-party tournament hosted at your course flows directly into a single, standardized command center.',
      icon: '🎯',
    },
    {
      title: 'Direct Organizer Messaging',
      description: 'Communicate cleanly and professionally with tournament hosts. No more hunting through texts for last-minute pairing changes.',
      icon: '💬',
    },
    {
      title: 'Attract High-Value Events',
      description: 'When you claim your profile on TourneyLinks, your facility becomes visible to thousands of organizers looking to book their next high-margin corporate event.',
      icon: '🚀',
    },
    {
      title: 'Standardized Leaderboards',
      description: 'TourneyLinks handles all the live-scoring and TV casting for the event. You just provide the TVs; we provide the cinematic PGA-style graphics.',
      icon: '📺',
    },
    {
      title: '100% Free Ecosystem',
      description: 'TourneyLinks is completely free for Golf Facilities to claim, manage, and utilize. We monetize the registration software, not the venue.',
      icon: '💎',
    },
  ];

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#05120c', color: '#f5f0e8', overflow: 'hidden', position: 'relative' }}>
      
      {/* Background FX - Aerial Course */}
      <div 
        style={{ 
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, 
          backgroundImage: 'url(/aerial-course.jpg)', 
          backgroundSize: 'cover', 
          backgroundPosition: 'center', 
          zIndex: 0,
          pointerEvents: 'none'
        }}
      />
      <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(8, 20, 15, 0.85)', zIndex: 1, pointerEvents: 'none' }}></div>
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at center, transparent 0%, rgba(5, 18, 12, 1) 100%)', zIndex: 2, pointerEvents: 'none' }}></div>
      <div style={{ position: 'absolute', inset: 0, opacity: 0.05, backgroundImage: 'radial-gradient(circle, rgba(212, 175, 55, 0.8) 1px, transparent 1px)', backgroundSize: '40px 40px', zIndex: 3, pointerEvents: 'none' }}></div>
      
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '8rem 1.5rem', position: 'relative', zIndex: 10 }}>
        
        {/* Header Section */}
        <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontFamily: 'var(--font-mono), "DM Mono", monospace', fontSize: '0.85rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '1.5rem', background: 'rgba(212, 175, 55, 0.1)', padding: '0.5rem 1.5rem', border: '1px solid rgba(212, 175, 55, 0.3)', borderRadius: '100px' }}>
            Course Facility Hub
          </div>
          <h1 style={{ fontFamily: 'var(--font-serif), "Playfair Display", serif', fontSize: 'clamp(3rem, 6vw, 5rem)', color: 'var(--cream)', fontWeight: 800, lineHeight: 1.1, marginBottom: '1.5rem', letterSpacing: '-0.02em', textShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
            Reclaim Your <br />
            <span style={{ color: 'var(--gold)' }}>Operational Bandwidth</span>
          </h1>
          <p style={{ fontSize: '1.15rem', color: 'rgba(245,240,232,0.8)', maxWidth: '650px', margin: '0 auto 2.5rem', lineHeight: 1.7 }}>
            No more 11th-hour cart scrambling or chaotic F&B headcounts. TourneyLinks centralizes every third-party event at your facility into one undeniable, real-time command dashboard.
          </p>
          <Link href="/courses" className="btn-hero" style={{ padding: '1.2rem 3rem', fontSize: '1.1rem', boxShadow: '0 8px 30px rgba(212, 175, 55, 0.4)' }}>
            Claim Your Course Profile →
          </Link>
        </div>

        {/* Feature Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem', paddingBottom: '4rem' }}>
          {features.map((feature, i) => (
            <div key={i} style={{
              background: 'linear-gradient(145deg, rgba(16, 36, 26, 0.65) 0%, rgba(8, 20, 15, 0.85) 100%)',
              border: '1px solid rgba(212, 175, 55, 0.25)',
              borderRadius: '24px',
              padding: '2.5rem',
              backdropFilter: 'blur(20px)',
              boxShadow: '0 16px 50px rgba(0,0,0,0.5), inset 0 1px 0 rgba(212, 175, 55, 0.2)',
              transition: 'transform 0.4s ease, border-color 0.4s ease',
              cursor: 'default'
            }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>{feature.icon}</div>
              <h3 style={{ fontFamily: 'var(--font-serif), "Playfair Display", serif', fontSize: '1.5rem', color: 'var(--cream)', marginBottom: '1rem', fontWeight: 700 }}>
                {feature.title}
              </h3>
              <p style={{ color: 'rgba(245,240,232,0.65)', lineHeight: 1.7, fontSize: '0.95rem' }}>
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Bottom CTA Block */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.15) 0%, rgba(212, 175, 55, 0.05) 100%)',
          border: '1px solid rgba(212, 175, 55, 0.4)',
          borderRadius: '32px',
          padding: '4rem 2rem',
          textAlign: 'center',
          backdropFilter: 'blur(30px)',
          boxShadow: '0 20px 60px rgba(0,0,0,0.4), inset 0 0 50px rgba(212,175,55,0.1)'
        }}>
          <h2 style={{ fontFamily: 'var(--font-serif), "Playfair Display", serif', fontSize: '2.5rem', color: 'var(--cream)', marginBottom: '1rem' }}>
            Ready to standardize your operations?
          </h2>
          <p style={{ color: 'rgba(245,240,232,0.7)', maxWidth: '500px', margin: '0 auto 2.5rem' }}>
            It takes exactly 60 seconds to claim your facility and immediately upgrade your tournament visibility. Did we mention it's completely free?
          </p>
          <Link href="/courses" className="btn-hero-outline" style={{ background: 'rgba(0,0,0,0.4)', borderColor: 'var(--gold)', color: 'var(--gold)' }}>
            Search for your facility
          </Link>
        </div>

      </div>
    </div>
  );
}
