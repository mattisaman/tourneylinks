'use client';

import React from 'react';

export default function ExplainerVideo() {
  return (
    <section className="section-wrapper" style={{ padding: '4rem 3rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div className="section-eyebrow">Discover TourneyLinks</div>
      <h2 className="section-title" style={{ textAlign: 'center', marginBottom: '3rem' }}>
        Built for Everyone on the Fairway
      </h2>
      
      {/* Video Placeholder Box */}
      <div 
        style={{
          width: '100%',
          maxWidth: '1000px',
          aspectRatio: '16/9',
          background: 'radial-gradient(ellipse at center, rgba(12, 31, 23, 0.95) 0%, rgba(7, 21, 16, 1) 100%)',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid rgba(201,168,76,0.15)',
          boxShadow: 'var(--shadow-lg), 0 0 40px rgba(0,0,0,0.5)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden'
        }}
        className="animated-gold-border"
      >
        <div style={{
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, var(--gold) 0%, var(--amber) 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: '0 8px 32px rgba(201,168,76,0.4)',
          transition: 'transform 0.3s ease',
          marginBottom: '1rem'
        }}
        onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
        onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          {/* Play Icon */}
          <div style={{ 
            width: 0, 
            height: 0, 
            borderTop: '12px solid transparent', 
            borderBottom: '12px solid transparent', 
            borderLeft: '20px solid var(--forest)',
            marginLeft: '6px'
          }} />
        </div>
        
        <p style={{ color: 'var(--gold-light)', fontFamily: 'var(--font-sans)', fontSize: '0.9rem', letterSpacing: '0.05em' }}>
          Watch the 90-Second Explainer
        </p>

        {/* This is where you would ultimately embed a <video> or <iframe> tag 
            such as:
            <iframe src="https://www.youtube.com/embed/XXXXX" frameBorder="0" allowFullScreen />
        */}
      </div>
    </section>
  );
}
