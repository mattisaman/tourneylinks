'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Footer() {
  const pathname = usePathname();

  if (pathname?.includes('/tv') || pathname?.includes('/play') || pathname?.includes('/print')) {
    return null;
  }

  return (
    <footer>
      <div className="footer-inner">
        <div className="footer-grid">
          <div>
            <div className="footer-brand-name">
              <Link href="/system/login">
                <img src="/logo_transparent.png" alt="TourneyLinks Logo" style={{ height: '96px', objectFit: 'contain', marginBottom: '0.75rem', marginLeft: '-15px' }} />
              </Link>
            </div>
              The premier platform for golf tournament discovery, registration, and management. Built for players, loved by organizers.
            <div className="footer-social">
              <a href="https://x.com/tourneylinks" target="_blank" rel="noopener noreferrer" className="social-icon">X</a>
              <a href="https://instagram.com/tourneylinks" target="_blank" rel="noopener noreferrer" className="social-icon">IN</a>
              <a href="https://facebook.com/tourneylinks" target="_blank" rel="noopener noreferrer" className="social-icon">FB</a>
            </div>
          </div>
          <div>
            <div className="footer-col-title">Players</div>
            <ul className="footer-links">
              <li><Link href="/tournaments">Find Tournaments</Link></li>
              <li><Link href="/verify">Verify Handicap</Link></li>
              <li><Link href="/profile">Player Dashboard</Link></li>
              <li><Link href="/support">Tournament Rules</Link></li>
            </ul>
          </div>
          <div>
            <div className="footer-col-title">Organizers</div>
            <ul className="footer-links">
              <li><Link href="/admin">Host an Event</Link></li>
              <li><Link href="/compare">Pricing</Link></li>
              <li><Link href="/compare">Features</Link></li>
              <li><Link href="/courses">Course Database</Link></li>
            </ul>
          </div>
          <div>
            <div className="footer-col-title">Company</div>
            <ul className="footer-links">
              <li><Link href="/support">About Us</Link></li>
              <li><Link href="/support">Contact</Link></li>
              <li><Link href="/support">Careers</Link></li>
              <li><Link href="/support">Blog</Link></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <div>© {new Date().getFullYear()} TourneyLinks Platform. All rights reserved.</div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <Link href="/support" style={{ color: 'inherit', textDecoration: 'none' }}>Privacy Policy</Link>
            <Link href="/support" style={{ color: 'inherit', textDecoration: 'none' }}>Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
