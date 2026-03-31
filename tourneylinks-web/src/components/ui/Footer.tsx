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
              <a href="#" className="social-icon">X</a>
              <a href="#" className="social-icon">IN</a>
              <a href="#" className="social-icon">FB</a>
            </div>
          </div>
          <div>
            <div className="footer-col-title">Players</div>
            <ul className="footer-links">
              <li><a href="#">Find Tournaments</a></li>
              <li><a href="#">Verify Handicap</a></li>
              <li><a href="#">Player Dashboard</a></li>
              <li><a href="#">Tournament Rules</a></li>
            </ul>
          </div>
          <div>
            <div className="footer-col-title">Organizers</div>
            <ul className="footer-links">
              <li><a href="#">Host an Event</a></li>
              <li><a href="#">Pricing</a></li>
              <li><a href="#">Features</a></li>
              <li><a href="#">Course Database</a></li>
            </ul>
          </div>
          <div>
            <div className="footer-col-title">Company</div>
            <ul className="footer-links">
              <li><a href="#">About Us</a></li>
              <li><a href="#">Contact</a></li>
              <li><a href="#">Careers</a></li>
              <li><a href="#">Blog</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <div>© {new Date().getFullYear()} TourneyLinks Platform. All rights reserved.</div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Privacy Policy</a>
            <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
