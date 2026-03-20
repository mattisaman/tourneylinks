'use client';

import React, { useState, useEffect } from 'react';

interface HeroCarouselProps {
  tournament: any;
  heroImages: string[];
  themeColor?: string | null;
  secondaryThemeColor?: string | null;
}

export default function HeroCarousel({ tournament, heroImages, themeColor, secondaryThemeColor }: HeroCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // If no valid images provided by Host, fallback to a great default golf shot
  const images = heroImages && heroImages.length > 0
    ? heroImages
    : ['https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?auto=format&fit=crop&q=80'];

  // Automatically cycle through images every 6 seconds
  useEffect(() => {
    if (images.length <= 1) return;

    const intervalId = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 6000);

    return () => clearInterval(intervalId);
  }, [images.length]);

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "TBD";
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' });
  };

  // Safe fallback for HEX. Default is Gold (rgb 201, 168, 76)
  const hexToRgb = (hex: string) => {
    const defaultRgb = '201,168,76'; // Gold
    if (!hex) return defaultRgb;
    const cleanHex = hex.replace('#', '');
    if (cleanHex.length !== 6) return defaultRgb;
    const r = parseInt(cleanHex.substring(0, 2), 16);
    const g = parseInt(cleanHex.substring(2, 4), 16);
    const b = parseInt(cleanHex.substring(4, 6), 16);
    return `${r},${g},${b}`;
  };

  const themeRgb = hexToRgb(themeColor || '');
  const secondaryThemeRgb = hexToRgb(secondaryThemeColor || '#0a1f0d'); // Fallback to Dark Forest
  const isCustomTheme = !!themeColor;

  return (
    <>
    <div style={{ position: 'relative', minHeight: '40vh', padding: '6rem 0 0 0', display: 'flex', alignItems: 'flex-end', overflow: 'hidden' }}>
      
      {/* Base Image Layer (Carousel Crossfade) */}
      {images.map((imgUrl, idx) => (
        <div 
          key={idx}
          style={{ 
            position: 'absolute', 
            top: 0, left: 0, right: 0, bottom: 0, 
            backgroundImage: `url('${imgUrl}')`, 
            backgroundSize: 'cover', 
            backgroundPosition: 'center 30%', 
            zIndex: -4,
            opacity: idx === currentIndex ? 1 : 0,
            transition: 'opacity 1.5s ease-in-out',
          }} 
        />
      ))}

      {/* Dynamic 2-Tone Gradient Array mimicking the Premium feel with variable Hex Colors */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundImage: `linear-gradient(to right, rgba(${secondaryThemeRgb}, 0.95) 0%, rgba(${secondaryThemeRgb}, 0.75) 40%, rgba(${secondaryThemeRgb}, 0.4) 100%), linear-gradient(to top, rgba(${secondaryThemeRgb}, 1) 0%, transparent 40%)`, zIndex: -3 }}></div>
      
      {/* Light Flare (Uses Primary Theme Hex if Host provided one, otherwise standard Gold) */}
      <div style={{ position: 'absolute', top: '10%', right: '15%', width: '35vw', height: '35vw', background: `radial-gradient(circle, rgba(${themeRgb},0.25) 0%, transparent 70%)`, borderRadius: '50%', filter: 'blur(30px)', zIndex: -2, pointerEvents: 'none' }}></div>
      
      {/* Subtle grid pattern for texture */}
      <div style={{ position: 'absolute', inset: 0, opacity: 0.03, backgroundImage: 'linear-gradient(rgba(78,201,160,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(78,201,160,0.4) 1px, transparent 1px)', backgroundSize: '60px 60px', zIndex: -1 }}></div>
      
      <div className="section-wrapper" style={{ width: '100%', position: 'relative', zIndex: 1 }}>
        <h1 className="hero-headline" style={{ fontSize: 'clamp(1.8rem, 3vw, 3.2rem)', marginBottom: '0.5rem', textShadow: '0 4px 20px rgba(0,0,0,0.8)', maxWidth: '1000px', lineHeight: '1.05' }}>
          {tournament.name}
        </h1>
        <div className="hero-sub" style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap', alignItems: 'center', textShadow: '0 2px 10px rgba(0,0,0,0.8)', color: '#f8faf9', marginTop: '1rem' }}>
          
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.9rem', fontWeight: 500, background: 'rgba(255,255,255,0.06)', padding: '0.4rem 1rem', borderRadius: '50px', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.12)' }}>
            <span style={{ color: isCustomTheme ? `rgb(${themeRgb})` : 'var(--gold)', fontSize: '1rem' }}>📍</span> {tournament.courseName}
          </span>
          
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.9rem', fontWeight: 500, background: 'rgba(255,255,255,0.06)', padding: '0.4rem 1rem', borderRadius: '50px', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.12)' }}>
            <span style={{ color: isCustomTheme ? `rgb(${themeRgb})` : 'var(--gold)', fontSize: '1rem' }}>🗓️</span> {formatDate(tournament.dateStart)}
          </span>
          
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.9rem', fontWeight: 500, background: 'rgba(255,255,255,0.06)', padding: '0.4rem 1rem', borderRadius: '50px', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.12)' }}>
            <span style={{ color: isCustomTheme ? `rgb(${themeRgb})` : 'var(--gold)', fontSize: '1rem' }}>⛳</span> {tournament.format || '18 Hole Round'}
          </span>

        </div>
      </div>
    </div>
      
    {/* GLOWING GOLD ACCENT LINE (replicated from Navbar) */}
    <div className="nav-accent-line"></div>
    </>
  );
}
