import React, { useState, useEffect } from 'react';
import { X, Send, Mail, Link as LinkIcon, CreditCard, Trash2 } from 'lucide-react';

interface CommunicationSlideOutProps {
  isOpen: boolean;
  onClose: () => void;
  lead: any; // Using any for brevity, represents sponsor_leads
  onSaveNote: (id: number, notes: string) => Promise<void>;
  onDeleteLead?: (id: number) => void;
}

export default function CommunicationSlideOut({ isOpen, onClose, lead, onSaveNote, onDeleteLead }: CommunicationSlideOutProps) {
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
    <div className={`fixed inset-y-0 right-0 bg-white border-l border-[#e8eada] shadow-[-10px_0_30px_rgba(0,0,0,0.05)] transform transition-transform duration-300 ease-in-out z-[100] flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`} style={{ width: '100%', maxWidth: '500px' }}>
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#e8eada] bg-[#FAF9F6] shrink-0" style={{ padding: '24px' }}>
        <div className="flex items-center gap-3">
          {lead.companyLogoUrl && (
            <div className="w-10 h-10 bg-white rounded-[6px] p-1 flex items-center justify-center shrink-0 shadow-md">
               <img src={lead.companyLogoUrl} alt="Logo" className="max-w-full max-h-full object-contain" />
            </div>
          )}
          <div>
            <h2 className="text-lg font-bold text-[#0a120e]">{lead.companyName}</h2>
            <p className="text-sm text-neutral-500">{lead.contactName} • {lead.contactEmail}</p>
          </div>
        </div>
        <button onClick={onClose} className="flex items-center gap-2 px-3 py-2 text-neutral-500 hover:text-[#0a120e] font-bold text-sm bg-white border border-neutral-200 rounded-[6px] shadow-sm hover:bg-neutral-50 transition-all">
          <X className="w-4 h-4" />
          Close
        </button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-8" style={{ padding: '32px', paddingBottom: '64px', scrollbarWidth: 'thin', scrollbarColor: 'rgba(212,175,55,0.3) transparent' }}>
        {/* Internal Notes Section */}
        <section>
          <label className="block text-sm font-bold text-[#0a120e] mb-2">Internal Scratchpad</label>
          <textarea
            className="w-full p-3 border border-[#e8eada] rounded-[6px] text-sm focus:ring-2 focus:ring-[var(--gold)] bg-[#FAF9F6] text-[#0a120e] resize-none shadow-sm outline-none transition-all leading-relaxed"
            style={{ lineHeight: '1.6', paddingTop: '16px', minHeight: '128px' }}
            placeholder="Jot down notes from calls, preferences, e.g. 'Loves the 8am shotgun start idea'..."
            value={internalNote}
            onChange={(e) => setInternalNote(e.target.value)}
          />
          <div className="mt-2 flex justify-end">
            <button
              onClick={handleSaveNote}
              disabled={isSaving}
              className="text-xs font-bold tracking-wide text-[var(--gold)] bg-white border border-[#e8eada] hover:bg-[#FAF9F6] px-3 py-1.5 rounded-[6px] transition-colors shadow-sm"
            >
              {isSaving ? 'Saving...' : 'Save Note'}
            </button>
          </div>
        </section>

        {/* Email Draft Section */}
        <section className="border-t border-[#e8eada] pt-6">
          <div className="flex items-center gap-2 mb-4">
            <Mail className="w-4 h-4 text-[var(--gold)]" />
            <h3 className="text-sm font-bold text-[#0a120e] uppercase tracking-wider">Email Connect</h3>
          </div>
          
          <div className="space-y-3">
            <div>
              <label className="block text-xs text-neutral-400 mb-1">To</label>
              <input
                type="text"
                disabled
                style={{ lineHeight: '1.6', paddingTop: '10px' }}
                value={lead.contactEmail || `Missing email for ${lead.contactName || 'contact'}`}
                className="w-full bg-neutral-50 border border-[#e8eada] rounded-[6px] px-3 pb-2 text-sm text-neutral-500 outline-none cursor-not-allowed leading-relaxed"
              />
            </div>
            <div>
              <label className="block text-xs text-neutral-400 mb-1">Subject</label>
              <input
                type="text"
                style={{ lineHeight: '1.6', paddingTop: '10px' }}
                value={emailSubject}
                onChange={(e) => setEmailSubject(e.target.value)}
                className="w-full bg-white border border-[#e8eada] rounded-[6px] px-3 pb-2 text-sm focus:ring-1 focus:ring-[var(--gold)] outline-none transition-all leading-relaxed"
              />
            </div>
            <div>
              <label className="block text-xs text-neutral-400 mb-1">Message</label>
              <textarea
                value={emailBody}
                rows={15}
                style={{ lineHeight: '1.6', paddingTop: '16px' }}
                onChange={(e) => setEmailBody(e.target.value)}
                className="w-full px-3 pb-3 bg-white border border-[#e8eada] rounded-[6px] text-sm focus:ring-1 focus:ring-[var(--gold)] resize-y outline-none transition-all leading-relaxed"
              />
            </div>
          </div>

          <div className="flex flex-col gap-4 mt-4">
            {/* Quick Contract Injection Buttons */}
            <div className="flex items-center gap-3">
               <button 
                  onClick={() => setEmailBody(prev => prev + '\n\nPitch Deck: [Link]')}
                  className="flex items-center gap-2 px-3 py-2 bg-white border border-[#e8eada] shadow-sm text-neutral-500 rounded-[6px] hover:text-[var(--gold)] transition-colors text-xs font-semibold"
               >
                 <LinkIcon className="w-4 h-4" /> Pitch Link
               </button>
               <button 
                  onClick={() => setEmailBody(prev => prev + '\n\nPay via Stripe: [Link]')}
                  className="flex items-center gap-2 px-3 py-2 bg-white border border-[#e8eada] shadow-sm text-[#2ecc71] rounded-[6px] hover:bg-[rgba(46,204,113,0.1)] transition-colors text-xs font-semibold"
               >
                 <CreditCard className="w-4 h-4" /> Payment Link
               </button>
            </div>
          </div>
        </section>
      </div>

      {/* Footer Actions */}
      <div className="flex items-center justify-between border-t border-[#e8eada] bg-[#FAF9F6] p-6 shrink-0 relative z-10">
        <button 
          onClick={() => onDeleteLead && onDeleteLead(lead.id)}
          className="flex items-center gap-2 px-4 py-2 text-red-500 font-bold hover:bg-red-50 rounded-[6px] transition-colors border border-transparent hover:border-red-100 text-sm"
        >
          <Trash2 className="w-4 h-4" />
          Remove Sponsor Lead
        </button>
        <div className="flex items-center gap-3">
          <button 
            onClick={onClose}
            className="px-4 py-2 font-bold text-neutral-500 hover:text-[#0a120e] text-sm transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={handleSendEmail}
            className="flex items-center gap-2 bg-[var(--gold)] hover:bg-[#b5952d] text-black px-6 py-2.5 rounded-[6px] text-sm font-extrabold tracking-wider transition-all shadow-[0_0_15px_rgba(212,175,55,0.4)] hover:scale-105"
          >
            <Send className="w-4 h-4" />
            SEND INMAIL
          </button>
        </div>
      </div>
    </div>
  );
}
