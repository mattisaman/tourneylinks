'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

export default function AdminSidebar({ tournamentId, mockTournaments }: { tournamentId: number, mockTournaments: any[] }) {
   const [activeSection, setActiveSection] = useState('overview');

   useEffect(() => {
       const handleScroll = () => {
           const sections = ['registrants', 'payments', 'flights', 'notifications', 'course-gps', 'vision-scoring', 'store', 'private-link', 'builder', 'sponsor'];
           let current = 'overview';

           for (const id of sections) {
               const elem = document.getElementById(id);
               if (elem) {
                   const rect = elem.getBoundingClientRect();
                   // Trigger when top of section hits the upper third of screen
                   if (rect.top <= 400) { 
                       current = id;
                   }
               }
           }
           setActiveSection(current);
       };

       window.addEventListener('scroll', handleScroll);
       // Initial check
       handleScroll();
       
       return () => window.removeEventListener('scroll', handleScroll);
   }, []);

   const navClick = (id: string, e: React.MouseEvent) => {
       e.preventDefault();
       const elem = document.getElementById(id);
       if (elem) {
           const top = elem.getBoundingClientRect().top + window.scrollY - 100;
           window.scrollTo({ top, behavior: 'smooth' });
       }
   };

   // Styling helpers
   const getNavStyle = (id: string) => ({
       display: 'flex',
       alignItems: 'center',
       gap: '0.8rem',
       padding: '0.8rem 1rem',
       borderRadius: '8px',
       cursor: 'pointer',
       fontSize: '0.85rem',
       fontWeight: activeSection === id ? 700 : 500,
       color: activeSection === id ? '#fff' : 'rgba(255,255,255,0.6)',
       background: activeSection === id ? 'rgba(201,168,76,0.15)' : 'transparent',
       transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
       textDecoration: 'none',
       marginBottom: '0.35rem',
       borderLeft: activeSection === id ? '4px solid var(--gold)' : '4px solid transparent',
       boxShadow: activeSection === id ? '0 4px 15px rgba(0,0,0,0.2)' : 'none',
   });

   return (
        <div className="dash-sidebar" style={{ position: 'sticky', top: '75px', height: 'calc(100vh - 75px)', overflowY: 'auto' }}>
          <div className="dash-logo" style={{ marginBottom: '2.5rem' }}>
            Tourney<span>Links</span> 
            <span style={{ fontSize: '0.7rem', background: 'rgba(201,168,76,0.2)', color: 'var(--gold)', padding: '0.15rem 0.4rem', borderRadius: '2px', fontFamily: "'DM Sans', sans-serif", marginLeft: '0.5rem' }}>
              Admin
            </span>
          </div>

          <div className="dash-section-label" style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.8rem', paddingLeft: '1rem' }}>Active Tournaments</div>
          {mockTournaments.map(mt => (
             <div key={mt.id} style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', padding: '0.8rem 1rem', borderRadius: '8px', fontSize: '0.85rem', fontWeight: mt.id === tournamentId ? 700 : 500, color: mt.id === tournamentId ? '#fff' : 'var(--mist)', background: mt.id === tournamentId ? 'rgba(255,255,255,0.05)' : 'transparent', marginBottom: '0.35rem' }}>
               <span>🏆</span> {mt.name}
             </div>
          ))}
          <Link href="/host" style={{ ...getNavStyle('create'), borderLeft: '4px solid transparent', color: 'var(--gold)' }}>
            <span>➕</span> New Campaign Builder
          </Link>

          <div className="dash-section-label" style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '1px', marginTop: '2rem', marginBottom: '0.8rem', paddingLeft: '1rem' }}>Management Hub</div>
          <a href="#registrants" onClick={(e) => navClick('registrants', e)} style={getNavStyle('registrants')}><span>👥</span> Registrants Tracker</a>
          <a href="#flights" onClick={(e) => navClick('flights', e)} style={getNavStyle('flights')}><span>🏌️</span> Flight Builder</a>

          <div className="dash-section-label" style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '1px', marginTop: '2rem', marginBottom: '0.8rem', paddingLeft: '1rem' }}>Sponsors & Revenue</div>
          <Link href={`/admin/tournaments/${tournamentId}/payments`} style={{ ...getNavStyle('payments'), color: 'rgba(255,255,255,0.5)', borderLeft: '4px solid transparent' }}><span>💰</span> Financial Ledger</Link>
          <Link href={`/admin/tournaments/${tournamentId}/store`} style={{ ...getNavStyle('store'), color: 'rgba(255,255,255,0.5)', borderLeft: '4px solid transparent' }}><span>🛍️</span> Swag Store Items</Link>
          <a href="#sponsor" onClick={(e) => navClick('sponsor', e)} style={getNavStyle('sponsor')}><span>🤝</span> Sponsorship Grid</a>

          <div className="dash-section-label" style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '1px', marginTop: '2rem', marginBottom: '0.8rem', paddingLeft: '1rem' }}>Engagement Tools</div>
          <a href="#private-link" onClick={(e) => navClick('private-link', e)} style={getNavStyle('private-link')}><span>🔒</span> Private Pre-Link</a>
          <a href="#notifications" onClick={(e) => navClick('notifications', e)} style={getNavStyle('notifications')}><span>📢</span> Mass Notifications</a>
          <Link href={`/host?tournamentId=${tournamentId}`} style={{ ...getNavStyle('builder'), color: 'rgba(255,255,255,0.5)', borderLeft: '4px solid transparent' }}><span>✏️</span> Edit Campaign</Link>
          <div className="dash-section-label" style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '1px', marginTop: '2rem', marginBottom: '0.8rem', paddingLeft: '1rem' }}>Game Day Ops</div>
          <Link href={`/admin/tournaments/${tournamentId}/print`} style={{ ...getNavStyle('print'), color: 'rgba(255,255,255,0.5)', borderLeft: '4px solid transparent' }}><span>🖨️</span> Print & Post Hub</Link>
          
          <div className="dash-section-label" style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '1px', marginTop: '2rem', marginBottom: '0.8rem', paddingLeft: '1rem' }}>Advanced Engine</div>
          <Link href={`/admin/tournaments/${tournamentId}/advanced`} style={{ ...getNavStyle('advanced'), color: 'rgba(255,255,255,0.5)', borderLeft: '4px solid transparent' }}><span>⛳</span> Geospatial Settings</Link>
          <Link href="/admin/guides" style={{ ...getNavStyle('guides'), color: 'rgba(255,255,255,0.5)', borderLeft: '4px solid transparent' }}><span>🧠</span> AI Pricing Intel</Link>
        </div>
   )
}
