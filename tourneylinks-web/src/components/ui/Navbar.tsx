'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();

  return (
    <div className="site-header">
      <nav>
        <Link className="nav-logo" href="/">
          <img src="/logo.png" alt="TourneyLinks Logo" style={{ width: '40px', height: '40px', objectFit: 'contain' }} />
          <div className="nav-logo-text">Tourney<span>Links</span></div>
        </Link>
        <div className="nav-actions">
          <Link href="/admin" className="btn-ghost">Admin Dashboard</Link>
          <Link href="/tournaments" className="btn-primary">Find a Tournament</Link>
        </div>
      </nav>

      {/* PAGE NAVIGATION TABS */}
      <div className="page-nav hidden md:flex">
        <Link href="/" className={`page-tab ${pathname === '/' ? 'active' : ''}`}>🏠 Home</Link>
        <Link href="/tournaments" className={`page-tab ${pathname?.startsWith('/tournaments') ? 'active' : ''}`}>🏆 Find Tournaments</Link>
        <Link href="/host" className={`page-tab ${pathname?.startsWith('/host') ? 'active' : ''}`}>🚀 Host an Event</Link>
        <Link href="/admin" className={`page-tab ${pathname?.startsWith('/admin') ? 'active' : ''}`}>⚙️ Admin Dashboard</Link>
        <Link href="/courses" className={`page-tab ${pathname?.startsWith('/courses') ? 'active' : ''}`}>⛳ Course Database</Link>
        <Link href="/verify" className={`page-tab ${pathname?.startsWith('/verify') ? 'active' : ''}`}>⛳ Verify Handicap</Link>
      </div>
    </div>
  );
}
