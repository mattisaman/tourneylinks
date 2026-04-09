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

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative group bg-[#0A120E] border rounded-xl p-4 shadow-[0_4px_12px_rgba(0,0,0,0.8)] transition-all ${
        isDragging ? 'opacity-80 border-[var(--gold)] scale-105 z-50' : 'border-[rgba(212,175,55,0.2)] opacity-100 hover:border-[rgba(212,175,55,0.5)]'
      }`}
    >
      {/* Drag Handle */}
      <div 
        {...attributes} 
        {...listeners}
        className="absolute top-3 right-3 p-1.5 text-[rgba(212,175,55,0.4)] hover:text-[var(--gold)] hover:bg-[rgba(212,175,55,0.1)] rounded-md cursor-grab active:cursor-grabbing transition-colors"
      >
        <GripVertical className="w-4 h-4" />
      </div>

      <div 
        className="cursor-pointer pr-8"
        onClick={() => onClickOut(lead)}
      >
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-full bg-[rgba(212,175,55,0.1)] border border-[rgba(212,175,55,0.2)] flex items-center justify-center text-[var(--gold)]">
            <Building2 className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-bold text-white text-[0.9rem] leading-tight" style={{ fontFamily: "'DM Sans', sans-serif" }}>{lead.companyName}</h4>
            {lead.contactName && <p className="text-xs text-[var(--mist)] mt-0.5">{lead.contactName}</p>}
          </div>
        </div>

        <div className="flex items-center gap-4 mt-4 pt-4 border-t border-[rgba(212,175,55,0.1)]">
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#fafaf5] bg-[rgba(212,175,55,0.15)] border border-[rgba(212,175,55,0.3)] px-2.5 py-1 rounded-md drop-shadow-md">
            <DollarSign className="w-3.5 h-3.5 text-[var(--gold)]" />
            {formattedValue}
          </div>
          {lead.notes && (
            <div className="text-xs text-[var(--mist)] flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--amber)] shadow-[0_0_8px_rgba(215,160,34,0.8)]"></span>
              Has Notes
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
