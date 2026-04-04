"use client";
import React, { useState } from 'react';
import { Send, UserCircle, Search, MailPlus } from 'lucide-react';

export default function CourseInbox({ courseId }: { courseId: number }) {
  const [activeThread, setActiveThread] = useState(1);

  // Mock threads for demonstration
  const threads = [
    { id: 1, name: "David Chen", role: "Tournament Organizer", lastMsg: "Checking on the F&B minimums for next Friday.", time: "2h ago", unread: true },
    { id: 2, name: "Sarah Michaels", role: "Corporate Planning", lastMsg: "We just finalized the contract. Will wire deposit today.", time: "1d ago", unread: false },
    { id: 3, name: "Mark Johnston", role: "Charity Director", lastMsg: "Can we add an extra beverage cart?", time: "3d ago", unread: false }
  ];

  const messages = [
    { id: 1, text: "Hi! We are looking at hosting a tournament next Friday.", sender: 'them', time: "10:00 AM" },
    { id: 2, text: "Hello David! We'd love to host you. Are you thinking morning or afternoon shotgun?", sender: 'me', time: "10:15 AM" },
    { id: 3, text: "Checking on the F&B minimums for next Friday.", sender: 'them', time: "12:30 PM" }
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', background: '#fff', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.05)', overflow: 'hidden', height: '600px' }}>
       {/* Sidebar */}
       <div style={{ borderRight: '1px solid rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '1.5rem', borderBottom: '1px solid rgba(0,0,0,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
             <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>Inbox</h3>
             <MailPlus size={18} color="var(--mist)" style={{ cursor: 'pointer' }} />
          </div>
          <div style={{ padding: '1rem', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
             <div style={{ position: 'relative' }}>
                <Search size={14} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--mist)' }} />
                <input type="text" placeholder="Search messages..." style={{ width: '100%', border: '1px solid #ddd', borderRadius: '20px', padding: '0.5rem 1rem 0.5rem 2rem', fontSize: '0.8rem', background: '#fcfcfc' }} />
             </div>
          </div>
          <div style={{ flex: 1, overflowY: 'auto' }}>
             {threads.map(t => (
                <div key={t.id} onClick={() => setActiveThread(t.id)} style={{ padding: '1.25rem 1rem', borderBottom: '1px solid rgba(0,0,0,0.02)', cursor: 'pointer', background: activeThread === t.id ? '#fafaf5' : '#fff', transition: '0.2s', position: 'relative' }}>
                   {t.unread && <div style={{ position: 'absolute', left: '0.5rem', top: '1.8rem', width: '6px', height: '6px', borderRadius: '50%', background: 'var(--gold)' }} />}
                   <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                      <UserCircle size={36} color="var(--mist)" strokeWidth={1.5} />
                      <div style={{ flex: 1 }}>
                         <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.2rem' }}>
                            <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{t.name}</div>
                            <div style={{ fontSize: '0.7rem', color: 'var(--mist)' }}>{t.time}</div>
                         </div>
                         <div style={{ fontSize: '0.7rem', color: 'var(--mist)', textTransform: 'uppercase', letterSpacing: '0.02em', marginBottom: '0.4rem' }}>{t.role}</div>
                         <div style={{ fontSize: '0.8rem', color: t.unread ? '#111' : '#666', fontWeight: t.unread ? 600 : 400, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '200px' }}>
                            {t.lastMsg}
                         </div>
                      </div>
                   </div>
                </div>
             ))}
          </div>
       </div>

       {/* Main Chat */}
       <div style={{ display: 'flex', flexDirection: 'column', background: '#fafaf5' }}>
          <div style={{ padding: '1.5rem', borderBottom: '1px solid rgba(0,0,0,0.05)', background: '#fff', display: 'flex', alignItems: 'center', gap: '1rem' }}>
             <UserCircle size={40} color="var(--mist)" />
             <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>David Chen</h3>
                <div style={{ fontSize: '0.8rem', color: 'var(--mist)' }}>Tournament Organizer — Exploring May 15th Dates</div>
             </div>
          </div>
          <div style={{ flex: 1, padding: '1.5rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
             {messages.map(m => (
                <div key={m.id} style={{ display: 'flex', flexDirection: 'column', alignItems: m.sender === 'me' ? 'flex-end' : 'flex-start' }}>
                   <div style={{ background: m.sender === 'me' ? 'var(--gold)' : '#fff', color: m.sender === 'me' ? '#000' : '#333', padding: '0.75rem 1rem', borderRadius: '12px', border: m.sender === 'me' ? 'none' : '1px solid rgba(0,0,0,0.05)', maxWidth: '70%', boxShadow: '0 2px 4px rgba(0,0,0,0.02)', fontWeight: 500, fontSize: '0.9rem' }}>
                      {m.text}
                   </div>
                   <div style={{ fontSize: '0.65rem', color: 'var(--mist)', marginTop: '0.4rem', padding: '0 0.5rem' }}>{m.time}</div>
                </div>
             ))}
          </div>
          <div style={{ padding: '1.5rem', background: '#fff', borderTop: '1px solid rgba(0,0,0,0.05)' }}>
             <div style={{ display: 'flex', gap: '1rem' }}>
                <input type="text" placeholder="Type a message to David..." style={{ flex: 1, background: '#fafaf5', border: '1px solid rgba(0,0,0,0.05)', borderRadius: '24px', padding: '0.75rem 1.5rem', fontSize: '0.9rem', outline: 'none' }} />
                <button style={{ background: 'var(--gold)', color: '#000', border: 'none', borderRadius: '50%', width: '45px', height: '45px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                   <Send size={18} />
                </button>
             </div>
          </div>
       </div>
    </div>
  );
}
