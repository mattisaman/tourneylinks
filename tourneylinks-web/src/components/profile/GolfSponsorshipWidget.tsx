'use client';
import React, { useState } from 'react';
import { ShieldCheck, ArrowRight, Loader2 } from 'lucide-react';
import WidgetCard from './widgets/WidgetCard';

type HostedEvent = {
   id: number;
   name: string;
   golfApplicationStatus: string | null;
   isCharity: boolean | null;
   charityName: string | null;
};

export default function GolfSponsorshipWidget({ tournaments }: { tournaments: HostedEvent[] }) {
   const [selectedTournamentId, setSelectedTournamentId] = useState<number | ''>('');
   const [causeDesc, setCauseDesc] = useState('');
   const [payoutInfo, setPayoutInfo] = useState('');
   const [isSubmitting, setIsSubmitting] = useState(false);
   const [successParam, setSuccessParam] = useState(false);

   // Only events that haven't applied or got rejected
   const eligibleEvents = tournaments.filter(t => 
      t.golfApplicationStatus === 'none' || t.golfApplicationStatus === 'rejected' || !t.golfApplicationStatus
   );

   const handleApply = async () => {
      if(!selectedTournamentId) return alert('Select an event');
      if(!causeDesc) return alert('Please describe your cause');
      if(!payoutInfo) return alert('Please provide your disbursement info');
      
      setIsSubmitting(true);
      try {
         const res = await fetch(`/api/tournaments/${selectedTournamentId}/golf-apply`, {
            method: 'POST',
            body: JSON.stringify({ cause: causeDesc, payoutInfo })
         });
         if(res.ok) {
            setSuccessParam(true);
         } else {
            alert('Failed to submit application. Please try again or contact support.');
         }
      } catch (e: any) {
         alert('Network error. Try again.');
      }
      setIsSubmitting(false);
   };

   if (successParam) {
      return (
         <WidgetCard className="text-center h-full">
            <h3 className="text-xl font-bold mb-4 font-sans tracking-tight" style={{ color: 'var(--gold)' }}>Application Received!</h3>
            <p className="text-sm font-medium leading-relaxed" style={{ color: 'rgba(245,240,232,0.6)' }}>
               Your application for 501(c)(3) fiscal sponsorship has been securely deposited. The G.O.L.F. Foundation board will review your request and you can expect a status update within <strong style={{ color: 'var(--cream)' }}>48 hours</strong>.
            </p>
            <button onClick={() => window.location.reload()} className="btn-ghost mt-8" style={{ width: 'auto' }}>Acknowledge</button>
         </WidgetCard>
      );
   }

   return (
      <WidgetCard className="h-full" noPadding={true}>
         <div className="p-6 lg:p-8 flex flex-col h-full">
            <h3 className="hero-eyebrow !mb-6 flex items-center gap-3 !bg-none !border-none !shadow-none !backdrop-filter-none !p-0 !text-sm" style={{ borderBottom: '1px solid rgba(245,240,232,0.1)', paddingBottom: '1.5rem' }}>
               <ShieldCheck size={20} style={{ color: 'var(--gold)' }} /> 501(c)(3) Sponsorship
            </h3>

            {eligibleEvents.length === 0 ? (
               <div className="text-center py-6 opacity-50 flex-1 flex flex-col justify-center">
                  <p className="text-sm font-medium">All active events are already covered or pending review.</p>
               </div>
            ) : (
               <div className="flex flex-col gap-4 flex-1">
                  <p className="text-base font-medium leading-relaxed mb-6" style={{ color: 'rgba(245,240,232,0.6)' }}>
                     Request fiscal sponsorship processing. If approved, we will automatically disconnect your localized Stripe and route donor transactions completely tax-free through our audited accounts.
                  </p>

                  <div className="flex flex-col gap-2">
                     <label className="text-[10px] uppercase font-bold tracking-widest" style={{ color: 'var(--gold)' }}>Select Campaign</label>
                     <select 
                        value={selectedTournamentId} 
                        onChange={e => setSelectedTournamentId(e.target.value === '' ? '' : parseInt(e.target.value))}
                        className="p-3 rounded-lg text-sm outline-none w-full appearance-none transition-colors border"
                        style={{ background: 'rgba(255,255,255,0.02)', borderColor: 'rgba(212,175,55,0.15)', color: 'var(--cream)' }}
                     >
                        <option value="" className="text-black">-- Choose Campaign --</option>
                        {eligibleEvents.map(t => (
                           <option key={t.id} value={t.id} className="text-black">{t.name}</option>
                        ))}
                     </select>
                  </div>

                  {selectedTournamentId !== '' && (
                     <div className="flex flex-col gap-4 mt-2 animate-fadeIn flex-1">
                        <div className="flex flex-col gap-2">
                           <label className="text-[10px] uppercase font-bold tracking-widest" style={{ color: 'var(--gold)' }}>Cause Description</label>
                           <textarea 
                              className="p-3 rounded-lg text-sm outline-none w-full min-h-[80px] resize-none transition-colors border"
                              style={{ background: 'rgba(255,255,255,0.02)', borderColor: 'rgba(212,175,55,0.15)', color: 'var(--cream)' }}
                              placeholder="Who or what are we raising money for?"
                              value={causeDesc}
                              onChange={e => setCauseDesc(e.target.value)}
                           />
                        </div>
                        <div className="flex flex-col gap-2">
                           <label className="text-[10px] uppercase font-bold tracking-widest" style={{ color: 'var(--gold)' }}>Disbursement Instructions</label>
                           <input 
                              type="text"
                              className="p-3 rounded-lg text-sm outline-none w-full transition-colors border"
                              style={{ background: 'rgba(255,255,255,0.02)', borderColor: 'rgba(212,175,55,0.15)', color: 'var(--cream)' }}
                              placeholder="Where should the official check be delivered?"
                              value={payoutInfo}
                              onChange={e => setPayoutInfo(e.target.value)}
                           />
                        </div>
                        
                        <div className="mt-auto pt-4 flex justify-end" style={{ borderTop: '1px solid rgba(245,240,232,0.1)' }}>
                           <button 
                              onClick={handleApply}
                              disabled={isSubmitting}
                              className="btn-primary flex items-center gap-2"
                              style={{ padding: '0.8rem 1.5rem' }}
                           >
                              {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : 'Submit for Review'} <ArrowRight size={14} />
                           </button>
                        </div>
                     </div>
                  )}
               </div>
            )}
         </div>
      </WidgetCard>
   );
}
