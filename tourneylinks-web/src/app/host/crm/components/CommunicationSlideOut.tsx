import React, { useState, useEffect } from 'react';
import { X, Send, Mail, Link as LinkIcon, CreditCard } from 'lucide-react';

interface CommunicationSlideOutProps {
  isOpen: boolean;
  onClose: () => void;
  lead: any; // Using any for brevity, represents sponsor_leads
  onSaveNote: (id: number, notes: string) => Promise<void>;
}

export default function CommunicationSlideOut({ isOpen, onClose, lead, onSaveNote }: CommunicationSlideOutProps) {
  const [internalNote, setInternalNote] = useState('');
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (lead) {
      setInternalNote(lead.notes || '');
      
      // Auto-populate based on pipeline status
      switch (lead.status) {
        case 'TO_CONTACT':
        case 'WAITING':
          setEmailSubject('Sponsorship Opportunity: Local Golf Tournament');
          setEmailBody(`Hi ${lead.contactName || 'there'},\n\nI noticed ${lead.companyName} does great work in our community. We are hosting a charity golf tournament soon and were wondering if you'd be interested in exploring sponsorship opportunities with us?\n\nI'd love to jump on a quick 5-minute call to share the details.\n\nBest,\nOrganizer`);
          break;
        case 'IN_CONVERSATION':
          setEmailSubject('Following up: Golf Tournament Sponsorship');
          setEmailBody(`Hi ${lead.contactName || 'there'},\n\nJust following up on our recent conversation regarding the sponsorship packages for our upcoming golf tournament. Let me know if you have any questions!\n\nBest,\nOrganizer`);
          break;
        case 'COMMITTED':
          setEmailSubject('Welcome Aboard! Next steps for your sponsorship');
          setEmailBody(`Hi ${lead.contactName || 'there'},\n\nWe are thrilled to have ${lead.companyName} as a sponsor for our tournament! I will be sending over the invoice shortly, but please reply with a high-resolution version of your company logo so we can get it printed on the signage.\n\nBest,\nOrganizer`);
          break;
        case 'DECLINED':
          setEmailSubject('Thank you for your time');
          setEmailBody(`Hi ${lead.contactName || 'there'},\n\nNo problem at all! We completely understand. Thank you for taking the time to review the opportunity, and we hope to stay in touch for future events.\n\nBest,\nOrganizer`);
          break;
        default:
          setEmailSubject('');
          setEmailBody('');
      }
    }
  }, [lead]);

  if (!isOpen || !lead) return null;

  const handleSaveNote = async () => {
    setIsSaving(true);
    await onSaveNote(lead.id, internalNote);
    setIsSaving(false);
  };

  const handleSendEmail = () => {
    // In a real implementation, this would hit an API mapping to Resend/Sendgrid
    // and store in communication_threads
    alert(`Email sent to ${lead.contactEmail || lead.companyName}`);
  };

  return (
    <div className="fixed inset-y-0 right-0 w-full md:w-[450px] bg-[#0b1611] border-l border-[rgba(212,175,55,0.2)] shadow-[-10px_0_30px_rgba(0,0,0,0.8)] transform transition-transform duration-300 ease-in-out z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-[rgba(212,175,55,0.15)] bg-[rgba(212,175,55,0.02)] backdrop-blur-md">
        <div className="flex items-center gap-3">
          {lead.companyLogoUrl && (
            <div className="w-10 h-10 bg-white rounded-full p-1 flex items-center justify-center shrink-0 shadow-md">
               <img src={lead.companyLogoUrl} alt="Logo" className="max-w-full max-h-full object-contain" />
            </div>
          )}
          <div>
            <h2 className="text-lg font-bold text-white">{lead.companyName}</h2>
            <p className="text-sm text-neutral-400">{lead.contactName} • {lead.contactEmail}</p>
          </div>
        </div>
        <button onClick={onClose} className="p-2 text-neutral-400 hover:text-white rounded-full hover:bg-[rgba(255,255,255,0.1)] transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6" style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(212,175,55,0.3) transparent' }}>
        {/* Internal Notes Section */}
        <section>
          <label className="block text-sm font-medium text-neutral-300 mb-2">Internal Scratchpad</label>
          <textarea
            className="w-full h-32 p-3 border border-[rgba(212,175,55,0.2)] rounded-lg text-sm focus:ring-2 focus:ring-[var(--gold)] bg-[#13241b] text-white resize-none shadow-inner outline-none transition-all"
            placeholder="Jot down notes from calls, preferences, e.g. 'Loves the 8am shotgun start idea'..."
            value={internalNote}
            onChange={(e) => setInternalNote(e.target.value)}
          />
          <div className="mt-2 flex justify-end">
            <button
              onClick={handleSaveNote}
              disabled={isSaving}
              className="text-xs font-bold tracking-wide text-[var(--gold)] bg-[rgba(212,175,55,0.1)] border border-[rgba(212,175,55,0.3)] hover:bg-[rgba(212,175,55,0.2)] px-3 py-1.5 rounded-md transition-colors"
            >
              {isSaving ? 'Saving...' : 'Save Note'}
            </button>
          </div>
        </section>

        {/* Email Draft Section */}
        <section className="border-t border-[rgba(212,175,55,0.15)] pt-6">
          <div className="flex items-center gap-2 mb-4">
            <Mail className="w-4 h-4 text-[var(--gold)]" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Email Connect</h3>
          </div>
          
          <div className="space-y-3">
            <div>
              <label className="block text-xs text-neutral-400 mb-1">To</label>
              <input
                type="text"
                disabled
                value={lead.contactEmail || `Missing email for ${lead.contactName || 'contact'}`}
                className="w-full bg-[#071510] border border-[rgba(212,175,55,0.1)] rounded-md px-3 py-2 text-sm text-neutral-500 outline-none cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-xs text-neutral-400 mb-1">Subject</label>
              <input
                type="text"
                value={emailSubject}
                onChange={(e) => setEmailSubject(e.target.value)}
                className="w-full bg-[#13241b] text-white border border-[rgba(212,175,55,0.2)] rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-[var(--gold)] outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-xs text-neutral-400 mb-1">Message</label>
              <textarea
                value={emailBody}
                onChange={(e) => setEmailBody(e.target.value)}
                className="w-full h-48 p-3 bg-[#13241b] text-white border border-[rgba(212,175,55,0.2)] rounded-md text-sm focus:ring-1 focus:ring-[var(--gold)] resize-none outline-none transition-all"
              />
            </div>
          </div>

          <div className="flex flex-col gap-4 mt-4">
            {/* Quick Contract Injection Buttons */}
            <div className="flex items-center gap-3">
               <button 
                  onClick={() => setEmailBody(prev => prev + '\n\nPay via Stripe (CC): [Stripe Payment Link]')}
                  className="flex items-center gap-2 px-3 py-1.5 bg-[rgba(99,91,255,0.15)] hover:bg-[rgba(99,91,255,0.3)] border border-[rgba(99,91,255,0.3)] text-[#a39eff] text-xs font-bold rounded-md transition-colors"
               >
                 <CreditCard className="w-3.5 h-3.5" /> Inject Stripe Invoice
               </button>
               <button 
                  onClick={() => setEmailBody(prev => prev + '\n\nPay via PayPal (0-Fee Bank Transfer): [PayPal Push Link]')}
                  className="flex items-center gap-2 px-3 py-1.5 bg-[rgba(0,121,193,0.15)] hover:bg-[rgba(0,121,193,0.3)] border border-[rgba(0,121,193,0.3)] text-[#33a8ff] text-xs font-bold rounded-md transition-colors"
               >
                 <LinkIcon className="w-3.5 h-3.5" /> Inject 0-Fee PayPal
               </button>
            </div>

            <div className="flex justify-end pt-2 border-t border-[rgba(212,175,55,0.1)]">
              <button
                onClick={handleSendEmail}
                className="flex items-center gap-2 bg-[var(--gold)] hover:bg-[#b5952d] text-black px-5 py-2.5 rounded-lg text-sm font-extrabold tracking-wider transition-all shadow-[0_0_15px_rgba(212,175,55,0.4)] hover:scale-105"
              >
                <Send className="w-4 h-4" /> SEND INMAIL
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
