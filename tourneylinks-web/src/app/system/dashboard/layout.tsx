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
    <div style={{ display: 'flex', height: '100vh', width: '100vw', background: 'var(--cream)', overflow: 'hidden' }}>
      
      {/* SIDEBAR NAVIGATION - Now with subtle gradient and structural drop shadow */}
      <nav style={{ width: '280px', background: 'linear-gradient(180deg, var(--admin-forest-dark) 0%, #02120b 100%)', color: 'var(--white)', display: 'flex', flexDirection: 'column', padding: '2rem 0', boxShadow: '10px 0 40px rgba(0,0,0,0.15)', zIndex: 10, position: 'relative' }}>
        
        <div style={{ padding: '0 2rem', marginBottom: '3rem' }}>
          <div style={{ background: 'var(--gold-foil)', color: 'var(--ink)', padding: '0.4rem 0.8rem', borderRadius: '4px', fontWeight: 800, fontSize: '0.8rem', letterSpacing: '1px', display: 'inline-block', marginBottom: '0.5rem', boxShadow: 'var(--metallic-shadow)' }}>
            SUPER ADMIN
          </div>
          <div style={{ color: 'var(--admin-sand)', opacity: 0.8, fontSize: '0.85rem' }}>Data Intelligence Hub</div>
        </div>
        
        <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <NavLink href="/system/dashboard" icon={<Activity size={18}/>} label="Network Operations" />
          <NavLink href="/system/dashboard/aggregator" icon={<Globe size={18}/>} label="Global Aggregator" />
          <NavLink href="/system/dashboard/financials" icon={<DollarSign size={18}/>} label="Financial Forensics" />
          <NavLink href="/system/dashboard/quality" icon={<ShieldCheck size={18}/>} label="Quality Control" />
          <NavLink href="/system/dashboard/courses" icon={<Database size={18}/>} label="Course DB Metrics" />
          <NavLink href="/system/dashboard/acquisition" icon={<Target size={18} color="var(--gold)" />} label="M&A Trajectory" />
        </div>

        <div style={{ marginTop: 'auto', padding: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <a href="/" style={{ color: 'var(--gold-light)', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            Exit to Platform ↗
          </a>
        </div>
      </nav>

      {/* MAIN CONTENT AREA - Now with Texture Map */}
      <main style={{ flex: 1, overflowY: 'auto', padding: '3rem', position: 'relative', overflowX: 'hidden' }}>
          
          {/* Subtle Canvas Dot Grid for Physical Texture */}
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundImage: 'radial-gradient(rgba(0, 0, 0, 0.04) 2px, transparent 2px)', backgroundSize: '30px 30px', zIndex: 0, pointerEvents: 'none' }}></div>

          {/* Ambient Glassmorphism Background Washes */}
          <div style={{ position: 'absolute', top: '-5%', right: '-5%', width: '700px', height: '700px', background: 'radial-gradient(circle, rgba(230, 194, 122, 0.25) 0%, rgba(255,255,255,0) 70%)', filter: 'blur(70px)', zIndex: 0, pointerEvents: 'none', mixBlendMode: 'multiply' }}></div>
          <div style={{ position: 'absolute', bottom: '-10%', left: '-5%', width: '900px', height: '900px', background: 'radial-gradient(circle, rgba(91, 123, 97, 0.2) 0%, rgba(255,255,255,0) 80%)', filter: 'blur(90px)', zIndex: 0, pointerEvents: 'none', mixBlendMode: 'multiply' }}></div>
          <div style={{ position: 'absolute', top: '40%', left: '30%', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(126, 99, 238, 0.08) 0%, rgba(255,255,255,0) 70%)', filter: 'blur(100px)', zIndex: 0, pointerEvents: 'none', mixBlendMode: 'multiply' }}></div>
          
          <div style={{ position: 'relative', zIndex: 1 }}>
              {children}
          </div>
      </main>
    </div>
  );
}

function NavLink({ href, icon, label }: { href: string, icon: React.ReactNode, label: string }) {
  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        .sidebar-link { transition: all 0.2s; }
        .sidebar-link:hover { background: rgba(255,255,255,0.05) !important; color: var(--gold-light) !important; }
      `}} />
      <Link href={href} className="sidebar-link" style={{ 
        display: 'flex', alignItems: 'center', gap: '0.75rem', 
        padding: '0.85rem 1rem', borderRadius: '8px', 
        color: 'var(--admin-golf-white)', opacity: 0.9, textDecoration: 'none', fontSize: '0.9rem',
      }}>
        {icon}
        <span style={{ fontWeight: 500 }}>{label}</span>
      </Link>
    </>
  );
}
