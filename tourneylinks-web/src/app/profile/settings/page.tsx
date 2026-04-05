'use client';
import React, { useState } from 'react';
import { ArrowLeft, Bell, Smartphone, Mail, Shield, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function ProfileSettingsPage() {
  const [activeTab, setActiveTab] = useState<'NOTIFICATIONS' | 'SECURITY' | 'BILLING'>('NOTIFICATIONS');
  const [isSaved, setIsSaved] = useState(false);

  // Mock initial state for MVP. This will eventually pull from /api/notifications/settings
  const [preferences, setPreferences] = useState<any>({
    ticketUpdates: { email: true, sms: false, push: true },
    tournamentBroadcasts: { email: true, sms: true, push: true },
    registrationAlerts: { email: true, sms: false, push: false },
    sponsorInquiries: { email: true, sms: true, push: true },
  });

  const handleToggle = (topic: string, channel: 'email' | 'sms' | 'push' | 'mobile_app') => {
    setPreferences((prev: any) => ({
      ...prev,
      [topic]: {
        ...prev[topic],
        [channel]: !prev[topic][channel]
      }
    }));
  };

  const handleSave = async () => {
    // In final implementation, PUT to /api/notifications/settings
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#050B08] pt-[80px]">
      
      {/* Settings Header */}
      <div className="w-full relative border-b border-[rgba(255,255,255,0.05)] bg-[var(--ink)]">
         <div className="absolute inset-0 pointer-events-none opacity-10 bg-[url('/hero-bg-4.jpg')] bg-cover bg-center mix-blend-overlay" />
         <div className="absolute top-0 right-0 w-[40vw] h-[40vh] bg-[var(--gold)] opacity-[0.02] rounded-bl-full pointer-events-none blur-3xl" />
         
         <div className="w-full relative z-10 flex flex-col md:flex-row items-start md:items-end justify-between gap-8" style={{ maxWidth: '1000px', margin: '0 auto', padding: '3rem 2rem' }}>
            <div>
              <Link href="/profile" className="inline-flex items-center gap-2 text-[10px] uppercase font-bold tracking-widest text-[rgba(255,255,255,0.5)] hover:text-[var(--gold)] transition-colors mb-6">
                <ArrowLeft size={14} /> Back to Profile
              </Link>
              <h1 className="text-4xl font-bold text-white tracking-tight" style={{ fontFamily: 'var(--font-serif)' }}>Account Settings</h1>
              <p className="text-[rgba(255,255,255,0.5)] mt-2">Manage your communication routing, privacy protocols, and billing.</p>
            </div>
            
            <Link href="/profile/inbox" className="border border-[rgba(212,175,55,0.3)] bg-[rgba(255,255,255,0.03)] hover:bg-[rgba(212,175,55,0.1)] text-[var(--gold)] transition-colors font-bold uppercase tracking-widest text-[10px] px-6 py-3 rounded shadow-lg flex items-center gap-2">
              <Mail size={14} /> Unified Inbox
            </Link>
         </div>
      </div>

      <main className="flex-1 w-full pb-20">
        <div className="w-full flex flex-col md:flex-row gap-12 items-start" style={{ maxWidth: '1000px', margin: '0 auto', padding: '3rem 2rem' }}>
          
          {/* Side Navigation */}
          <div className="w-full md:w-[250px] flex flex-col gap-2">
             <button onClick={() => setActiveTab('NOTIFICATIONS')} className={`flex items-center gap-3 px-4 py-3 text-sm font-bold uppercase tracking-widest rounded-md transition-colors ${activeTab === 'NOTIFICATIONS' ? 'bg-[rgba(255,255,255,0.05)] text-[var(--gold)] border border-[rgba(212,175,55,0.2)]' : 'text-[rgba(255,255,255,0.4)] hover:text-white hover:bg-[rgba(255,255,255,0.02)] border border-transparent'}`}>
               <Bell size={16} /> Communications
             </button>
             <button onClick={() => setActiveTab('SECURITY')} className={`flex items-center gap-3 px-4 py-3 text-sm font-bold uppercase tracking-widest rounded-md transition-colors ${activeTab === 'SECURITY' ? 'bg-[rgba(255,255,255,0.05)] text-[var(--gold)] border border-[rgba(212,175,55,0.2)]' : 'text-[rgba(255,255,255,0.4)] hover:text-white hover:bg-[rgba(255,255,255,0.02)] border border-transparent'}`}>
               <Shield size={16} /> Privacy & Security
             </button>
          </div>

          {/* Vertical Settings Pane */}
          <div className="flex-1 w-full bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.05)] rounded-xl p-8 relative">
            
            {activeTab === 'NOTIFICATIONS' && (
              <div className="flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-300">
                <div className="flex items-center justify-between mb-8 pb-4 border-b border-[rgba(255,255,255,0.1)]">
                  <div>
                    <h2 className="text-2xl text-white font-bold" style={{ fontFamily: 'var(--font-serif)' }}>Communication Routing</h2>
                    <p className="text-sm text-[rgba(255,255,255,0.5)] mt-1">Control how alerts are delivered to your devices.</p>
                  </div>
                  <button onClick={handleSave} className="bg-[var(--gold)] hover:bg-white text-[#050B08] transition-colors font-bold uppercase tracking-widest text-[10px] px-6 py-3 rounded shadow-[0_0_15px_rgba(212,175,55,0.3)] flex items-center gap-2">
                    {isSaved ? <><CheckCircle2 size={14} /> Saved!</> : 'Save Config'}
                  </button>
                </div>

                {/* Routing Matrix */}
                <div className="flex flex-col gap-8">
                  
                  {/* Topic: Ticket Updates */}
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-[rgba(255,255,255,0.05)]">
                     <div className="max-w-[400px]">
                       <h3 className="text-white font-bold mb-1">Platform Support Tickets</h3>
                       <p className="text-xs text-[rgba(255,255,255,0.4)] leading-relaxed">Alerts from our engineering team regarding bugs you reported or feature request updates.</p>
                     </div>
                     <div className="flex items-center gap-2">
                        <button onClick={() => handleToggle('ticketUpdates', 'email')} className={`flex flex-col items-center justify-center p-3 w-[80px] rounded border ${preferences.ticketUpdates.email ? 'bg-[rgba(90,140,58,0.15)] border-[var(--grass)] text-[#4ade80]' : 'bg-[rgba(255,255,255,0.02)] border-[rgba(255,255,255,0.1)] text-[rgba(255,255,255,0.3)]'} transition-colors`}>
                           <Mail size={16} className="mb-2" />
                           <span className="text-[9px] uppercase font-bold tracking-wider">Email</span>
                        </button>
                        <button onClick={() => handleToggle('ticketUpdates', 'mobile_app')} className={`flex flex-col items-center justify-center p-3 w-[80px] rounded border ${preferences.ticketUpdates.mobile_app ? 'bg-[rgba(90,140,58,0.15)] border-[var(--grass)] text-[#4ade80]' : 'bg-[rgba(255,255,255,0.02)] border-[rgba(255,255,255,0.1)] text-[rgba(255,255,255,0.3)]'} transition-colors blur-[1px] opacity-50 cursor-not-allowed`} title="Coming to the mobile app soon">
                           <Smartphone size={16} className="mb-2" />
                           <span className="text-[9px] uppercase font-bold tracking-wider">Push</span>
                        </button>
                     </div>
                  </div>

                  {/* Topic: Tournament Broadcasts */}
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-[rgba(255,255,255,0.05)]">
                     <div className="max-w-[400px]">
                       <h3 className="text-white font-bold mb-1">Tournament Broadcasts</h3>
                       <p className="text-xs text-[rgba(255,255,255,0.4)] leading-relaxed">Critical mass messaging triggered by Tournament Directors (e.g. Weather delays, shotgun start warnings).</p>
                     </div>
                     <div className="flex items-center gap-2">
                        <button onClick={() => handleToggle('tournamentBroadcasts', 'email')} className={`flex flex-col items-center justify-center p-3 w-[80px] rounded border ${preferences.tournamentBroadcasts.email ? 'bg-[rgba(90,140,58,0.15)] border-[var(--grass)] text-[#4ade80]' : 'bg-[rgba(255,255,255,0.02)] border-[rgba(255,255,255,0.1)] text-[rgba(255,255,255,0.3)]'} transition-colors`}>
                           <Mail size={16} className="mb-2" />
                           <span className="text-[9px] uppercase font-bold tracking-wider">Email</span>
                        </button>
                        <button onClick={() => handleToggle('tournamentBroadcasts', 'push')} className={`flex flex-col items-center justify-center p-3 w-[80px] rounded border ${preferences.tournamentBroadcasts.push ? 'bg-[rgba(90,140,58,0.15)] border-[var(--grass)] text-[#4ade80]' : 'bg-[rgba(255,255,255,0.02)] border-[rgba(255,255,255,0.1)] text-[rgba(255,255,255,0.3)]'} transition-colors blur-[1px] opacity-50 cursor-not-allowed`}>
                           <Smartphone size={16} className="mb-2" />
                           <span className="text-[9px] uppercase font-bold tracking-wider">Push</span>
                        </button>
                     </div>
                  </div>

                  {/* Topic: Host Specific Alerts (For Organizers) */}
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6">
                     <div className="max-w-[400px]">
                       <h3 className="text-white font-bold mb-1 flex items-center gap-2">Host Dashboard Alerts <span className="bg-[var(--gold)] text-black px-2 py-0.5 text-[8px] uppercase font-black rounded-sm tracking-widest">Organizers</span></h3>
                       <p className="text-xs text-[rgba(255,255,255,0.4)] leading-relaxed">Direct messages sent from Golfers to you regarding an event you are hosting. Turn off repeating Emails if you purely operate inside the Host Hub Inbox.</p>
                     </div>
                     <div className="flex items-center gap-2">
                        <button onClick={() => handleToggle('registrationAlerts', 'email')} className={`flex flex-col items-center justify-center p-3 w-[80px] rounded border ${preferences.registrationAlerts.email ? 'bg-[rgba(90,140,58,0.15)] border-[var(--grass)] text-[#4ade80]' : 'bg-[rgba(255,255,255,0.02)] border-[rgba(255,255,255,0.1)] text-[rgba(255,255,255,0.3)]'} transition-colors`}>
                           <Mail size={16} className="mb-2" />
                           <span className="text-[9px] uppercase font-bold tracking-wider">Email</span>
                        </button>
                     </div>
                  </div>

                </div>

              </div>
            )}

            {activeTab !== 'NOTIFICATIONS' && (
               <div className="flex flex-col items-center justify-center py-20 animate-in fade-in text-center">
                  <Shield size={48} className="text-[rgba(255,255,255,0.1)] mb-4" />
                  <p className="text-[rgba(255,255,255,0.4)] font-mono text-sm max-w-[300px]">This secure module is locked behind Clerk's unified Multi-Factor protocol and will be injected upon production build.</p>
               </div>
            )}

          </div>

        </div>
      </main>
    </div>
  );
}
