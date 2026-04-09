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
    <div className="flex flex-col flex-1 min-w-[320px] max-w-[380px] bg-[#fcfcf9] rounded-2xl overflow-hidden shadow-sm border border-[#e8eada] max-h-[85vh]">
      {/* Column Header */}
      <div className="px-6 pt-6 pb-5 border-b border-[#e8eada] bg-white text-center flex flex-col items-center">
        <h3 
          className="text-lg font-bold tracking-tight mb-1 text-[#0a120e]" 
          style={{ fontFamily: 'var(--font-serif), var(--font-cinzel), serif' }}
        >
          {title}
        </h3>
        <div className="flex items-center gap-3 mt-1">
          <span className="text-neutral-500 text-xs font-semibold tracking-widest uppercase">
            {leads.length} Leads
          </span>
          <span className="text-[rgba(212,175,55,0.4)]">•</span>
          <p className="text-xs font-bold text-[var(--gold)] drop-shadow-md tracking-wider">
            {formattedTotal}
          </p>
        </div>
      </div>

      {/* Sortable Drop Zone */}
      <div 
        ref={setNodeRef} 
        className={`flex-1 p-3 overflow-y-auto space-y-3 transition-colors ${
          isOver ? 'bg-[#FAF9F6]' : ''
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
          <div className="h-24 border border-dashed border-[#e8eada] rounded-xl flex flex-col items-center justify-center text-xs text-neutral-400 font-medium bg-white mb-4 shadow-sm">
            <span>No leads in this stage.</span>
          </div>
        )}

      </div>
    </div>
  );
}
