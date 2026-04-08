'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { SignInButton, UserButton, useAuth, useUser } from '@clerk/nextjs';
import { usePathname } from 'next/navigation';
import { HelpCircle, Menu, X } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const { userId } = useAuth();
  const { user } = useUser();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  if (pathname?.startsWith('/system/dashboard')) return null;

  const superAdminEmails = ['matthewisaman@gmail.com', 'mattisaman@gmail.com', 'joshuafribush@gmail.com', 'matt@tourneylinks.com'];
  const isSuperAdmin = user?.primaryEmailAddress?.emailAddress && superAdminEmails.includes(user.primaryEmailAddress.emailAddress.toLowerCase()) || false;
  const showHubs = process.env.NEXT_PUBLIC_IS_DEMO === 'true' || isSuperAdmin;

  const goldFoilStyle = {
    background: 'rgba(212, 175, 55, 0.05)',
    color: '#D4AF37',
    border: '1px solid rgba(212,175,55,0.6)',
    boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
    padding: '0.3rem 0.75rem',
    borderRadius: '100px',
    textDecoration: 'none',
    fontSize: '0.8rem',
    fontWeight: 600,
    letterSpacing: '0.04em',
    transition: 'all 0.3s ease',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    backdropFilter: 'blur(8px)'
  };

  // Instantly detach the Global Marketing Chrome if we are inside a Live Utility Route
  if (pathname?.includes('/tv') || pathname?.includes('/play')) {
    return null;
  }

  const isHubPage = pathname?.includes('/admin') || pathname?.includes('/courses/dashboard') || pathname?.includes('/sponsor/dashboard');
  const navbarBackground = isHubPage 
    ? 'linear-gradient(135deg, #050B08 0%, #073b22 50%, #050B08 100%)' 
    : 'transparent';

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        .profile-link {
          transition: color 0.2s ease, text-shadow 0.2s ease;
        }
        .profile-link:hover {
          color: var(--gold) !important;
          text-shadow: 0 0 8px rgba(212,175,55,0.4);
        }
      `}} />
      <div className="site-header" style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 1000, background: navbarBackground, borderBottom: isHubPage ? '1px solid rgba(212,175,55,0.1)' : 'none', boxShadow: isHubPage ? '0 4px 24px rgba(0,0,0,0.4)' : 'none' }}>
        <nav style={{ background: 'transparent', backgroundImage: 'none', backgroundColor: 'transparent', borderBottom: 'none', paddingBottom: '1rem', flexWrap: 'nowrap' }}>
          <Link className="nav-logo" href="/" style={{ flexShrink: 0 }}>
             <img src="/logo_horizontal_transparent.png" alt="TourneyLinks Logo" style={{ width: '220px', height: 'auto', objectFit: 'contain', margin: '4px 0 0 0' }} />
          </Link>
          
          {/* INLINE PAGE NAVIGATION TABS */}
          <div className="hidden lg:flex" style={{ gap: '0.5rem' }}>
            <Link href="/" className={`page-tab ${pathname === '/' ? 'active' : ''}`} style={{ background: 'transparent', borderBottom: pathname === '/' ? '2px solid var(--gold)' : '2px solid transparent' }}>🏠 Home</Link>
            <Link href="/tournaments" className={`page-tab ${pathname?.startsWith('/tournaments') ? 'active' : ''}`} style={{ background: 'transparent', borderBottom: pathname?.startsWith('/tournaments') ? '2px solid var(--gold)' : '2px solid transparent' }}>🏆 Find Tournaments</Link>
            <Link href="/host" className={`page-tab ${pathname?.startsWith('/host') ? 'active' : ''}`} style={{ background: 'transparent', borderBottom: pathname?.startsWith('/host') ? '2px solid var(--gold)' : '2px solid transparent' }}>🚀 Host an Event</Link>
            <Link href="/courses" className={`page-tab ${pathname?.startsWith('/courses') ? 'active' : ''}`} style={{ background: 'transparent', borderBottom: pathname?.startsWith('/courses') ? '2px solid var(--gold)' : '2px solid transparent' }}>⛳ Course Database</Link>
          </div>

        <div className="nav-actions">
          {/* Mobile Hamburg Toggle */}
          <button className="flex md:hidden items-center" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} style={{ background: 'none', border: 'none', color: 'var(--gold)', cursor: 'pointer', marginRight: '0.75rem' }}>
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
          
          <Link href="/support" className="btn-ghost" style={{ marginRight: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
             <HelpCircle size={15} /> Support
          </Link>
          {!userId ? (
            <SignInButton mode="modal">
              <button className="btn-primary" style={{ cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>Join the Club</button>
            </SignInButton>
          ) : (
            <>
              {showHubs && (
                <div className="hidden md:flex" style={{ gap: '0.4rem', marginRight: '1rem', alignItems: 'center', flexShrink: 0 }}>
                  <Link href="/admin" style={goldFoilStyle} onMouseOver={e => e.currentTarget.style.filter = 'brightness(1.1) drop-shadow(0 4px 12px rgba(212,175,55,0.6))'} onMouseOut={e => e.currentTarget.style.filter = 'none'}>Host Hub</Link>
                  <Link href="/courses/dashboard" style={goldFoilStyle} onMouseOver={e => e.currentTarget.style.filter = 'brightness(1.1) drop-shadow(0 4px 12px rgba(212,175,55,0.6))'} onMouseOut={e => e.currentTarget.style.filter = 'none'}>Pro Hub</Link>
                  <Link href="/sponsor/dashboard" style={goldFoilStyle} onMouseOver={e => e.currentTarget.style.filter = 'brightness(1.1) drop-shadow(0 4px 12px rgba(212,175,55,0.6))'} onMouseOut={e => e.currentTarget.style.filter = 'none'}>Sponsor Hub</Link>
                </div>
              )}
              <Link href="/profile" className="profile-link" style={{ marginRight: '0.8rem', color: '#f5f2ed', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 600, flexShrink: 0 }}>My Profile</Link>
              <UserButton 
                appearance={{
                  elements: {
                    userButtonAvatarBox: { border: '2px solid var(--gold)', width: '36px', height: '36px' }
                  }
                }}
              />
            </>
          )}
        </div>
        </nav>

      {/* MOBILE NAVIGATION MENU */}
      {isMobileMenuOpen && (
        <div className="md:hidden" style={{ background: 'var(--forest)', borderBottom: '1px solid rgba(212,175,55,0.2)', display: 'flex', flexDirection: 'column' }}>
          <Link onClick={() => setIsMobileMenuOpen(false)} href="/" className={`page-tab ${pathname === '/' ? 'active' : ''}`} style={{ textAlign: 'left', padding: '1.2rem 2rem' }}>🏠 Home</Link>
          <Link onClick={() => setIsMobileMenuOpen(false)} href="/tournaments" className={`page-tab ${pathname?.startsWith('/tournaments') ? 'active' : ''}`} style={{ textAlign: 'left', padding: '1.2rem 2rem' }}>🏆 Find Tournaments</Link>
          <Link onClick={() => setIsMobileMenuOpen(false)} href="/host" className={`page-tab ${pathname?.startsWith('/host') ? 'active' : ''}`} style={{ textAlign: 'left', padding: '1.2rem 2rem' }}>🚀 Host an Event</Link>
          <Link onClick={() => setIsMobileMenuOpen(false)} href="/courses" className={`page-tab ${pathname?.startsWith('/courses') ? 'active' : ''}`} style={{ textAlign: 'left', padding: '1.2rem 2rem' }}>⛳ Course Database</Link>
        </div>
      )}
      </div>
    </>
  );
}
