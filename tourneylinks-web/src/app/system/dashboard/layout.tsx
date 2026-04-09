import React from 'react';
import { currentUser } from '@clerk/nextjs/server';
import { redirect, notFound } from 'next/navigation';
import Link from 'next/link';
import { Activity, DollarSign, Database, ShieldCheck, Globe, Target } from 'lucide-react';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  // Security Layer: Enterprise Clerk Whitelist Authentication
  const user = await currentUser();
  
  if (!user) {
      redirect('/sign-in?redirect_url=/system/dashboard');
  }

  const userEmail = user.emailAddresses[0]?.emailAddress?.toLowerCase();
  const allowedEmails = (process.env.SUPER_ADMIN_EMAILS || "")
      .split(',')
      .map(e => e.trim().toLowerCase());

  if (!userEmail || !allowedEmails.includes(userEmail)) {
      // Stealth Block: Return a 404 instead of a flashy "Hacked" screen to trick unauthorized scanners
      return notFound();
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0a0a0a', color: '#fff', fontFamily: "'Inter', sans-serif" }}>
      {/* LEFT NAVIGATION SIDEBAR */}
      <nav style={{ width: '280px', background: '#111', borderRight: '1px solid #222', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '2rem 1.5rem', borderBottom: '1px solid #222' }}>
          <div style={{ background: 'var(--gold)', color: '#000', padding: '0.4rem 0.8rem', borderRadius: '4px', fontWeight: 800, fontSize: '0.8rem', letterSpacing: '1px', display: 'inline-block', marginBottom: '0.5rem' }}>
            SUPER ADMIN
          </div>
          <div style={{ color: '#888', fontSize: '0.85rem' }}>Data Intelligence Hub</div>
        </div>
        
        <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <NavLink href="/system/dashboard" icon={<Activity size={18}/>} label="Network Operations" />
          <NavLink href="/system/dashboard/aggregator" icon={<Globe size={18}/>} label="Global Aggregator" />
          <NavLink href="/system/dashboard/financials" icon={<DollarSign size={18}/>} label="Financial Forensics" />
          <NavLink href="/system/dashboard/quality" icon={<ShieldCheck size={18}/>} label="Quality Control" />
          <NavLink href="/system/dashboard/courses" icon={<Database size={18}/>} label="Course DB Metrics" />
          <NavLink href="/system/dashboard/acquisition" icon={<Target size={18} color="var(--gold)" />} label="M&A Trajectory" />
        </div>

        <div style={{ marginTop: 'auto', padding: '1.5rem', borderTop: '1px solid #222' }}>
          <a href="/" style={{ color: 'var(--gold)', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            Exit to Platform ↗
          </a>
        </div>
      </nav>

      {/* MAIN CONTENT AREA */}
      <main style={{ flex: 1, overflowY: 'auto', padding: '3rem', position: 'relative' }}>
          {children}
      </main>
    </div>
  );
}

function NavLink({ href, icon, label }: { href: string, icon: React.ReactNode, label: string }) {
  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        .sidebar-link { transition: all 0.2s; }
        .sidebar-link:hover { background: #222 !important; color: #fff !important; }
      `}} />
      <Link href={href} className="sidebar-link" style={{ 
        display: 'flex', alignItems: 'center', gap: '0.75rem', 
        padding: '0.85rem 1rem', borderRadius: '8px', 
        color: '#ccc', textDecoration: 'none', fontSize: '0.9rem',
      }}>
        {icon}
        <span style={{ fontWeight: 500 }}>{label}</span>
      </Link>
    </>
  );
}
