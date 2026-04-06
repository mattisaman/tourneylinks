'use client';
import React, { useState } from 'react';
import { ShieldCheck, ArrowRight, Loader2 } from 'lucide-react';

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
         <div className="w-full relative bg-[rgba(212,175,55,0.05)] backdrop-blur-2xl border border-[var(--gold)] p-10 lg:p-12 shadow-[0_0_30px_rgba(212,175,55,0.15)] rounded-2xl z-10 text-center">
            <h3 className="text-xl text-[var(--gold)] font-bold mb-4" style={{ fontFamily: 'var(--font-serif)' }}>Application Received!</h3>
            <p className="text-sm text-[rgba(255,255,255,0.7)] font-light leading-relaxed">
               Your application for 501(c)(3) fiscal sponsorship has been securely deposited. The G.O.L.F. Foundation board will review your request and you can expect a status update within <strong className="text-white">48 hours</strong>.
            </p>
            <button onClick={() => window.location.reload()} className="mt-8 bg-transparent border border-white hover:border-[var(--gold)] hover:text-[var(--gold)] text-white px-6 py-3 uppercase text-xs font-bold tracking-widest rounded transition-colors">Acknowledge</button>
         </div>
      );
   }

   return (
      <div className="w-full relative bg-[rgba(255,255,255,0.02)] backdrop-blur-2xl border border-[rgba(255,255,255,0.05)] p-10 lg:p-12 hover:border-[var(--gold)] transition-colors flex flex-col shadow-2xl rounded-2xl z-10">
         <h3 className="text-sm uppercase tracking-[0.15em] font-black mb-6 text-white pb-6 border-b border-[rgba(255,255,255,0.1)] flex items-center gap-3">
            <ShieldCheck size={18} className="text-[var(--gold)]" /> 501(c)(3) Sponsorship
         </h3>

         {eligibleEvents.length === 0 ? (
            <div className="text-center py-6 opacity-50">
               <p className="text-sm font-light">All active events are already covered or pending review.</p>
            </div>
         ) : (
            <div className="flex flex-col gap-4">
               <p className="text-sm text-[rgba(255,255,255,0.6)] font-light leading-relaxed mb-4">
                  Request fiscal sponsorship processing. If approved, we will automatically disconnect your localized Stripe and route donor transactions completely tax-free through our audited accounts.
               </p>

               <div className="flex flex-col gap-2">
                  <label className="text-[10px] text-[var(--gold)] uppercase font-bold tracking-widest">Select Campaign</label>
                  <select 
                     value={selectedTournamentId} 
                     onChange={e => setSelectedTournamentId(e.target.value === '' ? '' : parseInt(e.target.value))}
                     className="bg-[rgba(5,11,8,0.8)] border border-[rgba(255,255,255,0.1)] focus:border-[var(--gold)] text-white p-3 rounded text-sm outline-none w-full appearance-none transition-colors"
                  >
                     <option value="">-- Choose Campaign --</option>
                     {eligibleEvents.map(t => (
                        <option key={t.id} value={t.id}>{t.name}</option>
                     ))}
                  </select>
               </div>

               {selectedTournamentId !== '' && (
                  <div className="flex flex-col gap-4 mt-2 animate-fadeIn">
                     <div className="flex flex-col gap-2">
                        <label className="text-[10px] text-[var(--gold)] uppercase font-bold tracking-widest">Cause Description</label>
                        <textarea 
                           className="bg-[rgba(5,11,8,0.8)] border border-[rgba(255,255,255,0.1)] focus:border-[var(--gold)] text-white p-3 rounded text-sm outline-none w-full min-h-[80px] resize-none transition-colors"
                           placeholder="Who or what are we raising money for?"
                           value={causeDesc}
                           onChange={e => setCauseDesc(e.target.value)}
                        />
                     </div>
                     <div className="flex flex-col gap-2">
                        <label className="text-[10px] text-[var(--gold)] uppercase font-bold tracking-widest">Disbursement Instructions</label>
                        <input 
                           type="text"
                           className="bg-[rgba(5,11,8,0.8)] border border-[rgba(255,255,255,0.1)] focus:border-[var(--gold)] text-white p-3 rounded text-sm outline-none w-full transition-colors"
                           placeholder="Where should the official check be delivered?"
                           value={payoutInfo}
                           onChange={e => setPayoutInfo(e.target.value)}
                        />
                     </div>
                     
                     <div className="mt-4 pt-4 border-t border-[rgba(255,255,255,0.1)] flex justify-end">
                        <button 
                           onClick={handleApply}
                           disabled={isSubmitting}
                           className="bg-[var(--gold)] text-[#050B08] uppercase font-black tracking-widest text-xs px-6 py-3 rounded shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:bg-white hover:shadow-white transition-all flex items-center gap-2"
                        >
                           {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : 'Submit for Review'} <ArrowRight size={14} />
                        </button>
                     </div>
                  </div>
               )}
            </div>
         )}
      </div>
   );
}
