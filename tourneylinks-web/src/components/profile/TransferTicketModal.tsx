'use client';

import React, { useState } from 'react';
import { Share2, X, CheckCircle } from 'lucide-react';

interface TransferModalProps {
  registrationId: number;
  tournamentName: string;
}

export default function TransferTicketModal({ registrationId, tournamentName }: TransferModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [transferToken, setTransferToken] = useState('');

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/registrations/${registrationId}/transfer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recipientEmail: email })
      });

      const data = await res.json();
      if (res.ok) {
        setTransferToken(data.transferToken); // For local testing only
      } else {
        alert(`Failed: ${data.error}`);
      }
    } catch (err) {
      console.error(err);
      alert('Network Error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <button onClick={() => setIsOpen(true)} className="btn-ghost flex items-center justify-center gap-2 text-xs py-1 px-3 ml-auto border border-[var(--gold)] text-[var(--gold)] hover:bg-[var(--gold)] hover:text-[#000] transition-colors rounded">
         <Share2 size={12} /> Transfer Spot
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#0a1f0d] border border-[rgba(212,175,55,0.4)] rounded-2xl p-8 max-w-lg w-full relative shadow-[0_0_50px_rgba(212,175,55,0.1)]">
            <button onClick={() => setIsOpen(false)} className="absolute top-4 right-4 text-[var(--mist)] hover:text-white">
              <X size={24} />
            </button>
            
            {!transferToken ? (
              <>
                <h2 className="text-2xl font-bold text-[var(--gold)] mb-2 inline-flex items-center gap-2">
                  <Share2 /> Transfer Registration
                </h2>
                <p className="text-[var(--mist)] mb-6 text-sm leading-relaxed">
                  You are transferring your spot in <strong>{tournamentName}</strong>. Enter the email address of the player replacing you. We will send them a secure Magic Link to claim your ticket.
                </p>

                <form onSubmit={handleTransfer} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-[var(--cream)] uppercase tracking-wider mb-2">Recipient Email</label>
                    <input 
                      type="email" 
                      required 
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="w-full bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] text-white p-3 rounded-lg outline-none focus:border-[var(--gold)]"
                      placeholder="golfer@example.com"
                    />
                  </div>
                  <button type="submit" disabled={isSubmitting} className="btn-primary w-full py-3 text-lg mt-4 bg-gradient-to-r from-[#d4af37] to-[#aa8529] text-black border-none font-bold">
                    {isSubmitting ? 'Generating Secure Token...' : 'Dispatch Transfer Link'}
                  </button>
                  <p className="text-xs text-center text-[var(--mist)] italic mt-3 opacity-60">
                    Warning: Once the recipient accepts the transfer, you will lose access to this event roster.
                  </p>
                </form>
              </>
            ) : (
              <div className="text-center py-6">
                <CheckCircle size={64} className="text-[var(--gold)] mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-[var(--cream)] mb-2">Transfer Initiated!</h2>
                <p className="text-[var(--mist)] mb-6">
                  Normally, we would dispatch an email via SendGrid right now. For local testing, here is the generated Magic Link for the recipient:
                </p>
                <div className="bg-black/50 border border-[var(--gold)] p-4 rounded text-left overflow-x-auto text-sm text-[var(--grass)] break-all mb-6">
                  {`${typeof window !== 'undefined' ? window.location.origin : ''}/transfer/claim?token=${transferToken}`}
                </div>
                <button onClick={() => setIsOpen(false)} className="btn-ghost w-full">Close Window</button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
