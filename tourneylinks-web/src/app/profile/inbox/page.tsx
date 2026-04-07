'use client';
import React, { useState } from 'react';
import { ArrowLeft, MessageSquare, LifeBuoy, Send, Clock, CheckCircle2, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export default function UnifiedInboxPage() {
  const [activeChat, setActiveChat] = useState<number | null>(null);
  
  // Mock Thread Data
  const threads = [
    {
      id: 1,
      contextType: 'SUPPORT_TICKET',
      subject: '[Ticket #842] Login Issue with Secondary Email',
      status: 'RESOLVED',
      lastMessageAt: '2 hrs ago',
      unread: false,
      with: 'Platform Engineering',
      icon: <LifeBuoy size={16} />
    },
    {
      id: 2,
      contextType: 'GOLFER_TO_HOST',
      subject: 'Question regarding Mulligan Packages limit',
      status: 'OPEN',
      lastMessageAt: 'Just now',
      unread: true,
      with: 'Host: The Masters Charity Scramble',
      icon: <MessageSquare size={16} />
    }
  ];

  const currentThread = activeChat ? threads.find(t => t.id === activeChat) : null;

  return (
    <div className="min-h-[100vh] flex flex-col bg-[#071510] pt-[120px] relative overflow-hidden">
      
      {/* Shared Background Mechanics */}
      <div className="fixed inset-0 pointer-events-none z-0">
         <div className="ambient-orb ambient-orb-1" />
         <div className="ambient-orb ambient-orb-2" />
         <div className="absolute inset-0" style={{
             backgroundImage: `
               linear-gradient(to right, rgba(7, 21, 16, 0.85) 0%, rgba(7, 21, 16, 0.60) 40%, rgba(7, 21, 16, 0.20) 100%),
               linear-gradient(to bottom, rgba(7, 21, 16, 0.80) 0%, transparent 60%),
               linear-gradient(to top, rgba(7, 21, 16, 0.90) 0%, transparent 40%),
               url('/profile-bg.jpg')
             `,
             backgroundSize: 'cover',
             backgroundPosition: 'left 20%',
             backgroundRepeat: 'no-repeat'
         }} />
         <div className="hero-grid absolute inset-0 pointer-events-none z-10 opacity-[0.04]" />
         <div className="hero-dots absolute inset-0 pointer-events-none z-20 opacity-[0.05]" />
      </div>

      {/* Inbox Header */}
      <div className="w-full relative z-10 mb-8 px-6 lg:px-0" style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
            <div>
              <Link href="/profile" className="inline-flex items-center gap-2 text-xs uppercase font-bold tracking-widest text-[rgba(255,255,255,0.6)] hover:text-[var(--gold)] transition-colors mb-4">
                <ArrowLeft size={16} /> Back to Profile
              </Link>
              <h1 className="text-4xl lg:text-5xl font-medium tracking-tight" style={{ fontFamily: 'var(--font-serif), serif', backgroundImage: 'linear-gradient(to bottom, #fffdf2 0%, #dfb962 100%)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>
                 Unified Inbox
              </h1>
            </div>
            
            <Link href="/profile/settings" className="border border-[rgba(212,175,55,0.3)] bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.1)] text-white transition-colors font-bold uppercase tracking-widest text-[11px] px-8 py-3.5 rounded shadow-[0_0_15px_rgba(212,175,55,0.1)] flex items-center gap-2 backdrop-blur-md">
              Routing Config
            </Link>
          </div>
      </div>

      <main className="flex-1 w-full flex relative z-30 mb-20 hero-pillar-card !p-0 overflow-hidden shadow-2xl mx-auto border border-[rgba(212,175,55,0.2)]" style={{ maxWidth: '1200px', maxHeight: 'calc(100vh - 250px)' }}>
          
          {/* Left: Thread List */}
          <div className={`w-full md:w-[320px] lg:w-[400px] border-r border-[rgba(255,255,255,0.05)] flex-col overflow-y-auto custom-scrollbar bg-[rgba(0,0,0,0.2)] ${activeChat ? 'hidden md:flex' : 'flex'}`}>
             {threads.map(thread => (
                <button 
                  key={thread.id}
                  onClick={() => setActiveChat(thread.id)}
                  className={`w-full text-left p-6 lg:p-8 border-b border-[rgba(255,255,255,0.05)] transition-colors flex flex-col gap-3 relative ${activeChat === thread.id ? 'bg-[rgba(255,255,255,0.08)] border-l-[4px] border-l-[var(--gold)] shadow-inner' : 'hover:bg-[rgba(255,255,255,0.04)] border-l-[4px] border-l-transparent'}`}
                >
                  {thread.unread && <div className="absolute top-8 right-6 w-2.5 h-2.5 rounded-full bg-[var(--gold)] shadow-[0_0_12px_rgba(212,175,55,0.8)] animate-pulse" />}
                  <div className="flex items-center gap-2 text-[11px] uppercase tracking-widest font-bold text-[rgba(255,255,255,0.6)]">
                     <span className={thread.contextType === 'SUPPORT_TICKET' ? 'text-[var(--gold)]' : 'text-[#4ade80]'}>{thread.icon}</span>
                     {thread.contextType === 'SUPPORT_TICKET' ? 'Eng Ticket' : 'Host Direct'}
                  </div>
                  <h3 className={`font-semibold text-lg leading-tight w-[90%] ${thread.unread ? 'text-white' : 'text-[rgba(255,255,255,0.6)]'}`}>{thread.subject}</h3>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-2">
                     <span className="text-sm font-medium text-[rgba(255,255,255,0.6)] truncate max-w-[150px]">{thread.with}</span>
                     <span className="w-1 h-1 rounded-full bg-[rgba(255,255,255,0.2)] hidden sm:block" />
                     <span className="text-xs font-mono font-medium text-[rgba(255,255,255,0.4)] flex items-center gap-1.5"><Clock size={12} /> {thread.lastMessageAt}</span>
                  </div>
                </button>
             ))}
          </div>

          {/* Right: Active Chat Area */}
          <div className={`flex-1 flex-col bg-[rgba(0,0,0,0.1)] relative ${!activeChat ? 'hidden md:flex' : 'flex'}`}>
            {!activeChat ? (
               <div className="w-full h-full flex flex-col items-center justify-center text-center p-8 opacity-60">
                  <MessageSquare size={56} className="text-[var(--gold)] opacity-30 mb-6 drop-shadow-lg" />
                  <p className="text-lg font-medium text-white">Select a transmission thread to view the secure payload.</p>
               </div>
            ) : (
               <div className="flex flex-col h-full w-full relative">
                  
                  {/* Chat Header */}
                  <div className="w-full p-6 lg:p-8 border-b border-[rgba(255,255,255,0.05)] bg-[rgba(255,255,255,0.02)] backdrop-blur-md flex items-center justify-between shadow-sm z-10">
                     <div className="flex items-center gap-4">
                        <button onClick={() => setActiveChat(null)} className="md:hidden p-2 -ml-2 text-white hover:text-[var(--gold)] transition-colors">
                           <ArrowLeft size={20} />
                        </button>
                        <div>
                           <h2 className="text-white text-xl font-bold">{currentThread?.subject}</h2>
                           <p className="text-xs uppercase tracking-widest text-[rgba(255,255,255,0.5)] mt-1 font-bold">Secure connection with {currentThread?.with}</p>
                        </div>
                     </div>
                     <div className={`px-4 py-1.5 rounded-sm text-[10px] uppercase tracking-widest font-black shadow-sm ${currentThread?.status === 'RESOLVED' ? 'bg-[#4ade80]/20 text-[#4ade80] border border-[#4ade80]/30' : 'bg-[var(--gold)]/20 text-[var(--gold)] border border-[var(--gold)]/30'}`}>
                        {currentThread?.status}
                     </div>
                  </div>

                  {/* Chat History Container */}
                  <div className="flex-1 overflow-y-auto p-6 md:p-8 lg:p-12 flex flex-col gap-6" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
                     
                     <div className="flex flex-col gap-2 w-full md:w-[85%] lg:w-[70%] self-start">
                        <div className="text-xs uppercase tracking-widest font-bold text-[rgba(255,255,255,0.4)] ml-2">You</div>
                        <div className="bg-[rgba(255,255,255,0.1)] border border-[rgba(255,255,255,0.15)] text-white p-5 lg:p-6 rounded-2xl rounded-tl-sm text-base leading-relaxed shadow-lg backdrop-blur-md">
                           {currentThread?.contextType === 'SUPPORT_TICKET' ? 'I signed up using Google but my second email is attached to my GHIN profile. How do I link them so my handicap transfers?' : 'Hi, we have 5 guys that want to play, but the system only allows max 2 mulligans per player. Can we buy additional mulligans at the desk?'}
                        </div>
                     </div>

                     <div className="flex flex-col gap-2 w-full md:w-[85%] lg:w-[70%] self-end">
                         <div className="text-xs uppercase tracking-widest font-bold text-[var(--gold)] mr-2 text-right">{currentThread?.with}</div>
                         <div className="bg-gradient-to-br from-[var(--forest)]/90 to-[#0A1A12]/90 border border-[var(--grass)]/40 text-white p-5 lg:p-6 rounded-2xl rounded-tr-sm text-base leading-relaxed shadow-[0_10px_30px_rgba(0,0,0,0.5)] backdrop-blur-md">
                           {currentThread?.contextType === 'SUPPORT_TICKET' ? 'Currently, account merging is restricted securely for anti-fraud. Our engineers are lifting that protocol next week. For now, you can manually override your GHIN in the Profile Settings panel. I will mark this resolved as the engineering fix is staged for V1.2. Let me know if you need anything else!' : 'Our maximum policy is heavily enforced so the game moves quickly. If you want a 5th, your team will have to forfeit their mulligans entirely to keep the pace of play fair.'}
                         </div>
                     </div>

                  </div>

                  {/* Chat Input */}
                  <div className="w-full p-4 lg:p-6 border-t border-[rgba(255,255,255,0.05)] bg-[rgba(255,255,255,0.02)] backdrop-blur-md z-10">
                     <div className="flex items-center gap-3 relative">
                        <input 
                           type="text" 
                           placeholder="Transmit payload..." 
                           className="w-full bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.15)] text-white p-4 pr-16 rounded-xl text-base outline-none focus:border-[var(--gold)] focus:bg-[rgba(255,255,255,0.1)] transition-all shadow-inner"
                           disabled={currentThread?.status === 'RESOLVED'}
                        />
                        <button className={`absolute right-2 p-3 rounded-lg transition-colors shadow-md ${currentThread?.status === 'RESOLVED' ? 'bg-[rgba(255,255,255,0.05)] text-[rgba(255,255,255,0.2)] cursor-not-allowed' : 'bg-[var(--gold)] text-black hover:bg-white hover:text-black'}`}>
                           <Send size={18} className="ml-0.5" />
                        </button>
                     </div>
                     {currentThread?.status === 'RESOLVED' && (
                        <p className="text-center text-xs text-[#4ade80] mt-4 font-bold uppercase tracking-widest flex items-center justify-center gap-2">
                           <CheckCircle2 size={16} /> This transmission thread has been successfully resolved and locked.
                        </p>
                     )}
                  </div>

               </div>
            )}
          </div>

      </main>
    </div>
  );
}
