import React, { useState, useEffect } from 'react';
import { X, Send, Mail } from 'lucide-react';

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
    <div className="fixed inset-y-0 right-0 w-full md:w-[450px] bg-white border-l border-neutral-200 shadow-2xl transform transition-transform duration-300 ease-in-out z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-neutral-200 bg-neutral-50/80 backdrop-blur-md">
        <div>
          <h2 className="text-lg font-semibold text-neutral-900">{lead.companyName}</h2>
          <p className="text-sm text-neutral-500">{lead.contactName} • {lead.contactEmail}</p>
        </div>
        <button onClick={onClose} className="p-2 text-neutral-400 hover:text-neutral-600 rounded-full hover:bg-neutral-200/50 transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Internal Notes Section */}
        <section>
          <label className="block text-sm font-medium text-neutral-700 mb-2">Internal Scratchpad</label>
          <textarea
            className="w-full h-32 p-3 border border-neutral-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-neutral-50 resize-none"
            placeholder="Jot down notes from calls, preferences, e.g. 'Loves the 8am shotgun start idea'..."
            value={internalNote}
            onChange={(e) => setInternalNote(e.target.value)}
          />
          <div className="mt-2 flex justify-end">
            <button
              onClick={handleSaveNote}
              disabled={isSaving}
              className="text-xs font-medium text-emerald-600 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-md transition-colors"
            >
              {isSaving ? 'Saving...' : 'Save Note'}
            </button>
          </div>
        </section>

        {/* Email Draft Section */}
        <section className="border-t border-neutral-200 pt-6">
          <div className="flex items-center gap-2 mb-4">
            <Mail className="w-4 h-4 text-neutral-500" />
            <h3 className="text-sm font-medium text-neutral-800">Email Draft</h3>
          </div>
          
          <div className="space-y-3">
            <div>
              <label className="block text-xs text-neutral-500 mb-1">To</label>
              <input
                type="text"
                disabled
                value={lead.contactEmail || `Missing email for ${lead.contactName || 'contact'}`}
                className="w-full bg-neutral-100 border border-neutral-200 rounded-md px-3 py-2 text-sm text-neutral-600"
              />
            </div>
            <div>
              <label className="block text-xs text-neutral-500 mb-1">Subject</label>
              <input
                type="text"
                value={emailSubject}
                onChange={(e) => setEmailSubject(e.target.value)}
                className="w-full border border-neutral-200 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs text-neutral-500 mb-1">Message</label>
              <textarea
                value={emailBody}
                onChange={(e) => setEmailBody(e.target.value)}
                className="w-full h-48 p-3 border border-neutral-200 rounded-md text-sm focus:ring-2 focus:ring-emerald-500 resize-none"
              />
            </div>
          </div>

          <div className="mt-4 flex justify-end">
            <button
              onClick={handleSendEmail}
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm"
            >
              <Send className="w-4 h-4" />
              Send Email
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
