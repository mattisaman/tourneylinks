"use client";
import React from 'react';
import { FileSignature, Upload, Link, Download, Settings, Clock, CheckCircle2 } from 'lucide-react';

export default function CourseContracts({ courseId }: { courseId: number }) {
  const contracts = [
    { id: 1, title: 'Charity Scramble Master Agreement', org: "David Chen", sentAt: 'May 10', status: 'SIGNED', docUrl: '#' },
    { id: 2, title: 'Fall Corporate Outing', org: "Sarah Michaels", sentAt: 'June 02', status: 'PENDING', docUrl: '#' }
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)', gap: '2rem' }}>
       
       <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1rem', color: '#05120c' }}>Active E-Signatures</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
               {contracts.map(c => (
                  <div key={c.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.5rem', background: '#fff', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.05)', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                     <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ width: '48px', height: '48px', borderRadius: '8px', background: c.status === 'SIGNED' ? 'rgba(46,125,50,0.1)' : 'rgba(212,175,55,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                           <FileSignature size={24} color={c.status === 'SIGNED' ? '#2e7d32' : 'var(--gold)'} />
                        </div>
                        <div>
                           <div style={{ fontWeight: 800, fontSize: '1rem', color: '#111', marginBottom: '0.2rem' }}>{c.title}</div>
                           <div style={{ color: 'var(--mist)', fontSize: '0.8rem' }}>Sent to {c.org} on {c.sentAt}</div>
                        </div>
                     </div>
                     <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.4rem 0.8rem', background: c.status === 'SIGNED' ? '#e8f5e9' : '#fff8e1', color: c.status === 'SIGNED' ? '#2e7d32' : '#f57f17', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase' }}>
                           {c.status === 'SIGNED' ? <CheckCircle2 size={14} /> : <Clock size={14} />}
                           {c.status}
                        </div>
                        <button style={{ background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--mist)' }}>
                           <Download size={16} /> <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>PDF</span>
                        </button>
                     </div>
                  </div>
               ))}
            </div>
          </div>
       </div>

       <div>
          <div style={{ padding: '2rem', background: '#fff', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.05)', textAlign: 'center' }}>
             <div style={{ width: '64px', height: '64px', borderRadius: '16px', background: 'rgba(201,168,76,0.1)', margin: '0 auto 1.5rem auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Upload size={28} color="var(--gold)" />
             </div>
             <h4 style={{ fontWeight: 800, fontSize: '1.2rem', marginBottom: '0.5rem' }}>Send New Contract</h4>
             <p style={{ fontSize: '0.9rem', color: 'var(--mist)', marginBottom: '2rem', lineHeight: 1.5 }}>
               Upload your standard PDF tournament agreement. We will generate a secure E-Signature link to send directly to your Organizer.
             </p>
             <button className="btn-primary" style={{ width: '100%', padding: '1rem', borderRadius: '8px', background: 'var(--gold)', color: '#000', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', border: 'none', cursor: 'pointer' }}>
                <Link size={18} /> Generate Secure Link
             </button>
          </div>

          <div style={{ marginTop: '2rem', padding: '1.5rem', background: '#fafaf5', borderRadius: '8px', border: '1px dashed #ccc' }}>
             <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                <Settings size={18} color="var(--mist)" />
                <div style={{ fontWeight: 800, fontSize: '0.9rem' }}>Workflow Settings</div>
             </div>
             <div style={{ fontSize: '0.8rem', color: 'var(--mist)', lineHeight: 1.5 }}>
               Automatically send reminder emails to Organizers 3 days before the contract expiry date.
             </div>
          </div>
       </div>

    </div>
  );
}
