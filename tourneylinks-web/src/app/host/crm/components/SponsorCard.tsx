import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, DollarSign, Building2 } from 'lucide-react';

interface SponsorCardProps {
  id: string;
  lead: any; // The sponsor_leads object
  onClickOut: (lead: any) => void;
}

export default function SponsorCard({ id, lead, onClickOut }: SponsorCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const formattedValue = lead.expectedValue 
    ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(lead.expectedValue / 100)
    : 'TBD';

    const logoToRender = lead.companyName?.includes('Lexus') ? '/logos/lexus.svg' :
                         lead.companyName?.includes('Titleist') ? '/logos/titleist.svg' :
                         (lead.companyName?.includes('Barton') || lead.companyName?.includes('Rolex')) ? '/logos/rolex.svg' :
                         lead.companyLogoUrl;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative group bg-white rounded-[6px] p-6 shadow-sm transition-all mb-4 border ${
        isDragging ? 'opacity-90 border-[var(--gold)] scale-105 z-50 shadow-md' : 'border-[#e8eada] opacity-100 hover:border-[rgba(212,175,55,0.4)] hover:shadow-md'
      }`}
    >
      {/* Drag Handle */}
      <div 
        {...attributes} 
        {...listeners}
        className="absolute top-4 right-4 p-2 text-neutral-300 hover:text-[var(--gold)] hover:bg-[#FAF9F6] rounded-[6px] cursor-grab active:cursor-grabbing transition-colors"
      >
        <GripVertical className="w-5 h-5" />
      </div>

      <div 
        className="cursor-pointer pr-10"
        onClick={() => onClickOut(lead)}
      >
        <div className="flex items-center gap-4 mb-4">
          {logoToRender ? (
            <div className="w-12 h-12 rounded-[6px] bg-white p-2 border border-neutral-100 shadow-sm flex items-center justify-center shrink-0">
               <img src={logoToRender} alt="Logo" className="w-full h-full object-contain" />
            </div>
          ) : (
            <div className="w-12 h-12 rounded-[6px] bg-[#FAF9F6] border border-[#e8eada] flex items-center justify-center text-neutral-400 shrink-0 shadow-sm">
              <Building2 className="w-5 h-5" />
            </div>
          )}
          <div>
            <h4 className="text-xl font-bold text-[#0a120e] tracking-wide" style={{ fontFamily: 'var(--font-serif), var(--font-cinzel), serif' }}>{lead.companyName}</h4>
            {lead.contactName && <p className="text-xs font-semibold text-neutral-500 uppercase tracking-widest mt-1">{lead.contactName}</p>}
          </div>
        </div>

        <div className="flex items-center gap-4 pt-5 mt-1 border-t border-[#e8eada]">
          <div className="flex items-center gap-2 text-sm font-bold text-[#0a120e] bg-white border border-[#e8eada] px-3 py-1.5 rounded-[6px] shadow-sm tracking-wider">
            <DollarSign className="w-3.5 h-3.5 text-[var(--gold)]" />
            {formattedValue}
          </div>
          {lead.notes && (
            <div className="text-xs text-neutral-500 flex items-center gap-1.5 font-medium ml-auto">
              <span className="w-1.5 h-1.5 rounded-[6px] bg-[#f39c12] shadow-[0_0_8px_rgba(243,156,18,0.8)]"></span>
              Notes
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
