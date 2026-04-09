import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import SponsorCard from './SponsorCard';

interface SponsorPipelineColumnProps {
  id: string; // The status string (e.g., 'TO_CONTACT')
  title: string;
  leads: any[];
  onClickOut: (lead: any) => void;
}

export default function SponsorPipelineColumn({ id, title, leads, onClickOut }: SponsorPipelineColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id });

  // Compute total pipeline value for this column
  const columnTotal = leads.reduce((sum, lead) => sum + (lead.expectedValue || 0), 0);
  const formattedTotal = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(columnTotal / 100);

  return (
    <div className="flex flex-col flex-shrink-0 w-[340px] bg-[rgba(15,25,20,0.65)] backdrop-blur-md rounded-2xl overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.4)] border border-[rgba(212,175,55,0.15)] max-h-[85vh]">
      {/* Column Header */}
      <div className="px-5 pt-5 pb-4 border-b border-[rgba(212,175,55,0.1)] bg-[rgba(5,11,8,0.4)] text-center relative flex flex-col items-center">
        <div className="flex flex-col items-center justify-center mb-2 gap-1.5">
          <h3 className="font-semibold text-white tracking-wider uppercase text-[0.8rem]" style={{ letterSpacing: '0.12em' }}>{title}</h3>
          <span className="text-[var(--mist)] text-xs font-semibold tracking-wide">
            {leads.length} Leads
          </span>
        </div>
        <p className="text-xs font-semibold text-[var(--gold)] drop-shadow-md">
          {formattedTotal} Pipeline
        </p>
      </div>

      {/* Sortable Drop Zone */}
      <div 
        ref={setNodeRef} 
        className={`flex-1 p-3 overflow-y-auto space-y-3 transition-colors ${
          isOver ? 'bg-[rgba(212,175,55,0.05)]' : ''
        }`}
        style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(212,175,55,0.3) transparent' }}
      >
        <SortableContext 
          id={id}
          items={React.useMemo(() => leads.map(l => l.id.toString()), [leads])} 
          strategy={verticalListSortingStrategy}
        >
          {leads.map(lead => (
            <SponsorCard 
              key={lead.id} 
              id={lead.id.toString()} 
              lead={lead} 
              onClickOut={onClickOut} 
            />
          ))}
        </SortableContext>
        
        {leads.length === 0 && (
          <div className="h-24 border-2 border-dashed border-[rgba(212,175,55,0.2)] rounded-xl flex items-center justify-center text-xs text-[var(--mist)] font-medium bg-[rgba(0,0,0,0.1)]">
            Drop lead here
          </div>
        )}
      </div>
    </div>
  );
}
