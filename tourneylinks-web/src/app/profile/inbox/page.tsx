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
    <div className="min-h-[100vh] flex flex-col bg-[#050B08] pt-[80px]">
      
      {/* Inbox Header */}
      <div className="w-full relative border-b border-[rgba(255,255,255,0.05)] bg-[var(--ink)]">
         <div className="absolute inset-0 pointer-events-none opacity-10 bg-[url('/hero-bg-4.jpg')] bg-cover bg-center mix-blend-overlay" />
         
         <div className="w-full relative z-10 flex flex-col md:flex-row items-start md:items-end justify-between gap-8" style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 2rem' }}>
            <div>
              <Link href="/profile" className="inline-flex items-center gap-2 text-[10px] uppercase font-bold tracking-widest text-[rgba(255,255,255,0.5)] hover:text-[var(--gold)] transition-colors mb-4">
                <ArrowLeft size={14} /> Back to Profile
              </Link>
              <h1 className="text-3xl font-bold text-white tracking-tight" style={{ fontFamily: 'var(--font-serif)' }}>Unified Inbox</h1>
            </div>
            
            <Link href="/profile/settings" className="border border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.02)] hover:bg-[rgba(255,255,255,0.05)] text-white transition-colors font-bold uppercase tracking-widest text-[10px] px-6 py-3 rounded shadow flex items-center gap-2">
              Routing Config
            </Link>
         </div>
      </div>

      <main className="flex-1 w-full flex overflow-hidden max-h-[calc(100vh-180px)]" style={{ maxWidth: '1200px', margin: '0 auto' }}>
          
          {/* Left: Thread List */}
          <div className={`w-full md:w-[350px] lg:w-[400px] border-r border-[rgba(255,255,255,0.05)] flex-col overflow-y-auto ${activeChat ? 'hidden md:flex' : 'flex'}`}>
             {threads.map(thread => (
                <button 
                  key={thread.id}
                  onClick={() => setActiveChat(thread.id)}
                  className={`w-full text-left p-6 border-b border-[rgba(255,255,255,0.02)] transition-colors flex flex-col gap-2 relative ${activeChat === thread.id ? 'bg-[rgba(212,175,55,0.05)] border-l-[3px] border-l-[var(--gold)]' : 'hover:bg-[rgba(255,255,255,0.02)] border-l-[3px] border-l-transparent'}`}
                >
                  {thread.unread && <div className="absolute top-6 right-6 w-2 h-2 rounded-full bg-[var(--gold)] shadow-[0_0_8px_rgba(212,175,55,0.5)]" />}
                  <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold text-[rgba(255,255,255,0.5)]">
                     <span className={thread.contextType === 'SUPPORT_TICKET' ? 'text-[var(--gold)]' : 'text-[#4ade80]'}>{thread.icon}</span>
                     {thread.contextType === 'SUPPORT_TICKET' ? 'Eng Ticket' : 'Host Direct'}
                  </div>
                  <h3 className={`font-bold truncate w-full ${thread.unread ? 'text-white' : 'text-[rgba(255,255,255,0.8)]'}`}>{thread.subject}</h3>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-1">
                     <span className="text-xs text-[rgba(255,255,255,0.5)] truncate">{thread.with}</span>
                     <span className="w-px h-3 bg-[rgba(255,255,255,0.2)] hidden sm:block" />
                     <span className="text-[10px] font-mono text-[rgba(255,255,255,0.3)] flex items-center gap-1"><Clock size={10} /> {thread.lastMessageAt}</span>
                  </div>
                </button>
             ))}
          </div>

          {/* Right: Active Chat Area */}
          <div className={`flex-1 flex-col bg-[#050B08] ${!activeChat ? 'hidden md:flex' : 'flex'}`}>
            {!activeChat ? (
               <div className="w-full h-full flex flex-col items-center justify-center text-center p-8">
                  <MessageSquare size={48} className="text-[rgba(255,255,255,0.05)] mb-4" />
                  <p className="text-[rgba(255,255,255,0.4)] text-sm font-light">Select a transmission thread to view the secure payload.</p>
               </div>
            ) : (
               <div className="flex flex-col h-full w-full relative">
                  
                  {/* Chat Header */}
                  <div className="w-full p-6 border-b border-[rgba(255,255,255,0.05)] bg-[rgba(255,255,255,0.01)] flex items-center justify-between">
                     <div className="flex items-center gap-4">
                        <button onClick={() => setActiveChat(null)} className="md:hidden p-2 -ml-2 text-[rgba(255,255,255,0.5)] hover:text-white">
                           <ArrowLeft size={16} />
                        </button>
                        <div>
                           <h2 className="text-white font-bold">{currentThread?.subject}</h2>
                           <p className="text-[10px] uppercase tracking-widest text-[rgba(255,255,255,0.4)] mt-1 font-bold">Secure connection with {currentThread?.with}</p>
                        </div>
                     </div>
                     <div className={`px-3 py-1 rounded text-[9px] uppercase tracking-widest font-black ${currentThread?.status === 'RESOLVED' ? 'bg-[#4ade80]/10 text-[#4ade80] border border-[#4ade80]/20' : 'bg-[var(--gold)]/10 text-[var(--gold)] border border-[var(--gold)]/20'}`}>
                        {currentThread?.status}
                     </div>
                  </div>

                  {/* Chat History Container (Mock MVP) */}
                  <div className="flex-1 overflow-y-auto p-6 md:p-10 flex flex-col gap-6" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.01) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.01) 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
                     
                     <div className="flex flex-col gap-1 w-[80%] self-start">
                        <div className="text-[10px] text-[rgba(255,255,255,0.3)] ml-2 mb-1">You</div>
                        <div className="bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.05)] text-white p-4 rounded-xl rounded-tl-sm text-sm leading-relaxed shadow-sm">
                           {currentThread?.contextType === 'SUPPORT_TICKET' ? 'I signed up using Google but my second email is attached to my GHIN profile. How do I link them so my handicap transfers?' : 'Hi, we have 5 guys that want to play, but the system only allows max 2 mulligans per player. Can we buy additional mulligans at the desk?'}
                        </div>
                     </div>

                     <div className="flex flex-col gap-1 w-[80%] self-end">
                         <div className="text-[10px] text-[var(--gold)] mr-2 mb-1 text-right">{currentThread?.with}</div>
                         <div className="bg-gradient-to-br from-[var(--forest)] to-[#0A1A12] border border-[var(--grass)] text-white p-4 rounded-xl rounded-tr-sm text-sm leading-relaxed shadow-[0_10px_20px_rgba(0,0,0,0.3)]">
                           {currentThread?.contextType === 'SUPPORT_TICKET' ? 'Currently, account merging is restricted securely for anti-fraud. Our engineers are lifting that protocol next week. For now, you can manually override your GHIN in the Profile Settings panel. I will mark this resolved as the engineering fix is staged for V1.2. Let me know if you need anything else!' : 'Our maximum policy is heavily enforced so the game moves quickly. If you want a 5th, your team will have to forfeit their mulligans entirely to keep the pace of play fair.'}
                         </div>
                     </div>

                  </div>

                  {/* Chat Input */}
                  <div className="w-full p-4 border-t border-[rgba(255,255,255,0.05)] bg-[rgba(255,255,255,0.02)]">
                     <div className="flex items-center gap-2 relative">
                        <input 
                           type="text" 
                           placeholder="Transmit payload..." 
                           className="w-full bg-[#030604] border border-[rgba(255,255,255,0.1)] text-white p-4 pr-16 rounded-lg text-sm outline-none focus:border-[var(--gold)] transition-colors"
                           disabled={currentThread?.status === 'RESOLVED'}
                        />
                        <button className={`absolute right-2 p-2 rounded-md transition-colors ${currentThread?.status === 'RESOLVED' ? 'text-[rgba(255,255,255,0.2)] cursor-not-allowed' : 'bg-[var(--gold)] text-black hover:bg-white'}`}>
                           <Send size={16} />
                        </button>
                     </div>
                     {currentThread?.status === 'RESOLVED' && (
                        <p className="text-center text-[10px] text-[#4ade80] mt-3 font-bold uppercase tracking-widest flex items-center justify-center gap-1">
                           <CheckCircle2 size={12} /> This transmission thread has been successfully resolved and locked.
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
