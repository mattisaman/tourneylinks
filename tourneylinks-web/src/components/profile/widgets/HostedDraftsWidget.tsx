"use client";

import React, { useState } from 'react';
import { Edit3, ShieldCheck, ArrowRight, Loader2 } from 'lucide-react';
import DeleteDraftButton from '@/components/profile/DeleteDraftButton';
import WidgetCard from './WidgetCard';

export default function HostedDraftsWidget({ hostedEvents }: { hostedEvents: any[] }) {
  const [activeTab, setActiveTab] = useState<'events' | 'sponsor'>('events');

  // Sponsorship State
  const [selectedTournamentId, setSelectedTournamentId] = useState<number | ''>('');
  const [causeDesc, setCauseDesc] = useState('');
  const [payoutInfo, setPayoutInfo] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successParam, setSuccessParam] = useState(false);

  const eligibleEvents = hostedEvents.filter(t => 
     t.golfApplicationStatus === 'none' || t.golfApplicationStatus === 'rejected' || !t.golfApplicationStatus
  );

  const handleApply = async () => {
     if(!selectedTournamentId) return alert('Select an event');
     if(!causeDesc) return alert('Please describe your cause');
     if(!payoutInfo) return alert('Please provide your disbursement info');
     
     setIsSubmitting(true);
     try {
        const res = await fetch(`/api/tournaments/${selectedTournamentId}/golf-apply`, {
           method: 'POST', body: JSON.stringify({ cause: causeDesc, payoutInfo })
        });
        if(res.ok) setSuccessParam(true);
        else alert('Failed to submit application.');
     } catch (e: any) { alert('Network error. Try again.'); }
     setIsSubmitting(false);
  };

  return (
    <WidgetCard className="h-full">
       <div className="flex items-center justify-between pb-4 mb-4 shrink-0" style={{ borderBottom: '1px solid rgba(245,240,232,0.1)' }}>
         <div className="flex items-center gap-6">
            <h3 
               onClick={() => setActiveTab('events')}
               className={`hero-eyebrow !mb-0 flex items-center gap-3 !bg-none !border-none !shadow-none !backdrop-filter-none !p-0 !text-base lg:!text-lg cursor-pointer transition-colors ${activeTab === 'events' ? '' : 'opacity-40 hover:opacity-100'}`}
            >
               <Edit3 size={18} style={{ color: activeTab === 'events' ? 'var(--gold)' : 'var(--mist)' }} /> My Events
            </h3>
            <h3 
               onClick={() => setActiveTab('sponsor')}
               className={`hero-eyebrow !mb-0 flex items-center gap-3 !bg-none !border-none !shadow-none !backdrop-filter-none !p-0 !text-base lg:!text-lg cursor-pointer transition-colors ${activeTab === 'sponsor' ? '' : 'opacity-40 hover:opacity-100'}`}
            >
               <ShieldCheck size={18} style={{ color: activeTab === 'sponsor' ? 'var(--gold)' : 'var(--mist)' }} /> 501(c)(3)
            </h3>
         </div>
         {activeTab === 'events' && <a href="/host" className="btn-ghost scale-90 origin-right text-base px-6 py-2.5">+ Create</a>}
       </div>
       
       <div className="flex-1 flex flex-col pt-2 overflow-y-auto custom-scrollbar">
         {activeTab === 'events' ? (
           hostedEvents.length === 0 ? (
             <div className="w-full h-full flex flex-col items-center justify-center py-12 opacity-50">
               <p className="text-base lg:text-lg font-medium text-center">No hosted events found.</p>
             </div>
           ) : (
             <div className="flex flex-col gap-2">
               {hostedEvents.map((t: any) => (
                 <div key={t.id} className="py-4 flex flex-col gap-4 group hover:bg-white/[0.03] px-3 rounded-xl transition-colors" style={{ borderBottom: '1px solid rgba(245,240,232,0.05)' }}>
                   <div className="min-w-0 pr-2">
                     <div className="text-2xl font-semibold group-hover:text-[var(--gold)] transition-colors" style={{ color: 'var(--cream)', fontFamily: 'var(--font-serif), serif' }}>{t.name}</div>
                     <div className="flex items-center gap-3 text-sm font-medium mt-3 uppercase tracking-wider" style={{ color: 'rgba(245,240,232,0.6)' }}>
                       <span className="flex items-center gap-1"><span style={{ color: 'var(--gold)' }}>DATE</span> {t.dateStart ? new Date(t.dateStart).toLocaleDateString() : 'TBD'}</span>
                       <span className="w-px h-3" style={{ background: 'rgba(245,240,232,0.2)' }} />
                       {t.isActive ? (
                         <span className="font-bold text-[#4ade80]">LIVE</span>
                       ) : (
                         <span className="font-bold" style={{ color: 'rgba(245,240,232,0.4)' }}>DRAFT</span>
                       )}
                     </div>
                   </div>
                   <div className="flex flex-wrap items-center gap-4 mt-3 transition-opacity">
                      <a href={`/host?tournamentId=${t.id}`} className="btn-ghost flex items-center gap-2 px-5 py-2.5 text-base">Edit</a>
                      {t.isActive ? (
                         <a href={`/tournaments/${t.id}`} className="btn-primary flex items-center gap-2 px-5 py-2.5 text-base">View Live</a>
                      ) : (
                         <div className="scale-110 origin-left ml-2"><DeleteDraftButton tournamentId={t.id} /></div>
                      )}
                   </div>
                 </div>
               ))}
             </div>
           )
         ) : (
           /* Sponsorship Form Logic */
           successParam ? (
             <div className="text-center h-full flex flex-col justify-center">
               <h3 className="text-xl font-bold mb-4 font-sans tracking-tight" style={{ color: 'var(--gold)' }}>Application Received!</h3>
               <p className="text-sm font-medium leading-relaxed" style={{ color: 'rgba(245,240,232,0.6)' }}>
                  Your application for 501(c)(3) fiscal sponsorship has been securely deposited. Check your inbox within 48 hours.
               </p>
               <button onClick={() => setSuccessParam(false)} className="btn-ghost mx-auto mt-8">Submit Another</button>
             </div>
           ) : eligibleEvents.length === 0 ? (
             <div className="text-center py-6 opacity-50 flex-1 flex flex-col justify-center">
                <p className="text-sm font-medium">All active events are already covered or pending review.</p>
             </div>
           ) : (
             <div className="flex flex-col gap-4 flex-1 pb-4">
                <p className="text-sm font-medium leading-relaxed mb-4" style={{ color: 'rgba(245,240,232,0.8)' }}>
                   Request fiscal sponsorship processing to automatically disconnect your local Stripe and route donations tax-free through our audited Foundation API.
                </p>
                <div className="flex flex-col gap-2">
                   <select value={selectedTournamentId} onChange={e => setSelectedTournamentId(e.target.value === '' ? '' : parseInt(e.target.value))} className="p-3 rounded-lg text-sm outline-none w-full appearance-none transition-colors border" style={{ background: 'rgba(255,255,255,0.02)', borderColor: 'rgba(212,175,55,0.15)', color: 'var(--cream)' }}>
                      <option value="" className="text-black">-- Choose Campaign --</option>
                      {eligibleEvents.map((t: any) => <option key={t.id} value={t.id} className="text-black">{t.name}</option>)}
                   </select>
                </div>
                {selectedTournamentId !== '' && (
                   <div className="flex flex-col gap-4 mt-2 animate-fadeIn flex-1">
                      <textarea className="p-3 rounded-lg text-sm outline-none w-full min-h-[80px] resize-none transition-colors border" style={{ background: 'rgba(255,255,255,0.02)', borderColor: 'rgba(212,175,55,0.15)', color: 'var(--cream)' }} placeholder="Who or what are we raising money for?" value={causeDesc} onChange={e => setCauseDesc(e.target.value)} />
                      <input type="text" className="p-3 rounded-lg text-sm outline-none w-full transition-colors border" style={{ background: 'rgba(255,255,255,0.02)', borderColor: 'rgba(212,175,55,0.15)', color: 'var(--cream)' }} placeholder="Disbursement Instructions / Target" value={payoutInfo} onChange={e => setPayoutInfo(e.target.value)} />
                      <div className="mt-4 flex justify-end">
                         <button onClick={handleApply} disabled={isSubmitting} className="btn-primary w-full flex justify-center items-center gap-2 py-3">
                            {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : 'Submit for Review'} <ArrowRight size={14} />
                         </button>
                      </div>
                   </div>
                )}
             </div>
           )
         )}
       </div>
    </WidgetCard>
  );
}
