"use client";

import React, { useState } from 'react';
import { CheckCircle2, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ApproveClaimButton({ claimId, currentStatus }: { claimId: number, currentStatus: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleApprove = async () => {
    setLoading(true);
    try {
       await fetch('/api/admin/courses/claims/' + claimId + '/approve', { method: 'POST' });
       router.refresh();
    } catch (e) {
       console.error(e);
       setLoading(false);
    }
  };

  if (currentStatus === 'APPROVED') {
    return (
      <button disabled className="w-full bg-white/5 text-white/30 font-bold uppercase tracking-widest text-xs py-3 rounded-lg flex items-center justify-center gap-2 cursor-not-allowed">
         <CheckCircle2 size={16} /> Verified Active
      </button>
    );
  }

  return (
    <button 
      onClick={handleApprove}
      disabled={loading}
      className="w-full bg-[var(--gold)] text-black font-bold uppercase tracking-widest text-xs py-3 rounded-lg hover:bg-white transition-colors flex items-center justify-center gap-2"
    >
       {loading ? <Loader2 size={16} className="animate-spin" /> : 'Approve Pro Access'}
    </button>
  );
}
