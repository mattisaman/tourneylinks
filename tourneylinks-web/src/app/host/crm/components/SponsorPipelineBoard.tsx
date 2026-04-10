'use client';
import React, { useState, useEffect } from 'react';
import { 
  DndContext, 
  DragOverlay, 
  closestCorners, 
  KeyboardSensor, 
  PointerSensor, 
  useSensor, 
  useSensors,
  DragStartEvent,
  DragOverEvent,
  DragEndEvent
} from '@dnd-kit/core';
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import SponsorPipelineColumn from './SponsorPipelineColumn';
import SponsorCard from './SponsorCard';
import CommunicationSlideOut from './CommunicationSlideOut';
import SponsorDiscoverySidebar from './SponsorDiscoverySidebar';
import IntelligenceUploadModal from './IntelligenceUploadModal';
import { Search, Trash2, ShieldCheck, Wand2 } from 'lucide-react';

const COLUMNS = [
  { id: 'TO_CONTACT', title: 'To Contact' },
  { id: 'WAITING', title: 'Outreach Made' },
  { id: 'IN_CONVERSATION', title: 'In Conversation' },
  { id: 'COMMITTED', title: 'Committed' },
  { id: 'DECLINED', title: 'Passed' }
];

export default function SponsorPipelineBoard({ tournamentId }: { tournamentId: number }) {
  const [leads, setLeads] = useState<any[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [slideOutLead, setSlideOutLead] = useState<any | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [isDiscoverModalOpen, setDiscoverModalOpen] = useState(false);
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [leadToDelete, setLeadToDelete] = useState<number | null>(null);
  const [duplicateWarning, setDuplicateWarning] = useState<string | null>(null);

  useEffect(() => {
    setIsMounted(true);
    // Fetch initial leads
    const fetchLeads = async () => {
      const res = await fetch(`/api/host/sponsors/pipeline?tournamentId=${tournamentId}`);
      if (res.ok) {
        const data = await res.json();
        setLeads(data.leads || []);
      }
    };
    fetchLeads();
  }, [tournamentId]);

  const pointerSensor = useSensor(PointerSensor, {
    activationConstraint: {
      distance: 5,
    },
  });
  const keyboardSensor = useSensor(KeyboardSensor, {
    coordinateGetter: sortableKeyboardCoordinates,
  });
  const sensors = useSensors(pointerSensor, keyboardSensor);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id.toString());
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id.toString();
    const overId = over.id.toString();

    if (activeId === overId) return;

    setLeads(prev => {
      const activeItem = prev.find(l => l.id.toString() === activeId);
      const overItem = prev.find(l => l.id.toString() === overId);
      
      // If over an item
      if (activeItem && overItem && activeItem.status !== overItem.status) {
        return prev.map(l => 
          l.id.toString() === activeId 
            ? { ...l, status: overItem.status } 
            : l
        );
      }

      // If over a column
      const isOverColumn = COLUMNS.some(c => c.id === overId);
      if (activeItem && isOverColumn && activeItem.status !== overId) {
        return prev.map(l => 
          l.id.toString() === activeId 
            ? { ...l, status: overId } 
            : l
        );
      }

      return prev;
    });
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    setActiveId(null);
    const { active, over } = event;
    
    if (!over) return;

    const activeId = active.id.toString();
    const activeItem = leads.find(l => l.id.toString() === activeId);
    
    if (!activeItem) return;

    const targetStatus = activeItem.status;

    // Persist changes to DB
    await fetch('/api/host/sponsors/pipeline', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: activeItem.id,
        status: targetStatus
      })
    });
  };

  const handleSaveNote = async (id: number, notes: string) => {
    await fetch('/api/host/sponsors/pipeline', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, notes })
    });

    setLeads(prev => prev.map(l => l.id === id ? { ...l, notes } : l));
    // Update local slideout state
    setSlideOutLead((prev: any) => ({ ...prev, notes }));
  };

  const activeLead = activeId ? leads.find(l => l.id.toString() === activeId) : null;

  if (!isMounted) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-transparent">
        <div className="w-8 h-8 border-4 border-[var(--gold)] border-t-transparent rounded-full animate-spin shadow-[0_0_15px_rgba(212,175,55,0.5)]"></div>
      </div>
    );
  }

  const handleAssignMarketplaceLead = async (brand: any) => {
    const canonicalName = brand.companyName.includes('Barton') ? 'Rolex Corporation' : brand.companyName;
    const isDuplicate = leads.some(l => 
      l.companyName === canonicalName || 
      (brand.id && l.sponsorProfileId === brand.id)
    );

    if (isDuplicate) {
      setDuplicateWarning(`${canonicalName} is already in your pipeline!`);
      return;
    }

    const brandLogoUrl = brand.companyName.includes('Lexus') ? '/logos/lexus.svg' :
                         brand.companyName.includes('Titleist') ? '/logos/titleist.svg' :
                         (brand.companyName.includes('Barton') || brand.companyName.includes('Rolex')) ? '/logos/rolex.svg' :
                         brand.companyLogoUrl;

    const res = await fetch('/api/host/sponsors/pipeline', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        tournamentId,
        sponsorProfileId: brand.id,
        companyName: brand.companyName.includes('Barton') ? 'Rolex Corporation' : brand.companyName,
        companyLogoUrl: brandLogoUrl,
        contactEmail: brand.contactEmail,
        status: 'TO_CONTACT'
      })
    });
    
    if (res.ok) {
      const data = await res.json();
      setLeads(prev => [...prev, data.lead]);
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }
    }
  };

  const handleDeleteLead = (id: number) => {
    setLeadToDelete(id);
  };

  const confirmDeleteLead = async () => {
    if (!leadToDelete) return;
    const id = leadToDelete;
    setLeads(prev => prev.filter(l => l.id !== id));
    setSlideOutLead(null);
    setLeadToDelete(null);
    await fetch(`/api/host/sponsors/pipeline?id=${id}`, { method: 'DELETE' });
  };

  // When a Kanban column triggers a click "Add Sponsor Lead" or a Card
  const handleBoardClickOut = (payload: any) => {
    if (payload.triggerDiscoveryModal) {
      // Focus the global search input in the sidebar natively
      const searchInput = document.getElementById('sponsor-search-input');
      if (searchInput) {
        searchInput.focus();
        // Optional: flash the border to draw attention
        searchInput.classList.add('ring-2', 'ring-[var(--gold)]');
        setTimeout(() => searchInput.classList.remove('ring-2', 'ring-[var(--gold)]'), 1000);
      }
    } else {
      setSlideOutLead(payload);
    }
  };

  return (
    <div className="flex flex-1 w-full h-full relative gap-8">
      
      {/* Persistant Left Sidebar replacing the discovery modal */}
      <div className="shrink-0 z-20 bg-white rounded-[6px] shadow-sm border border-neutral-200 overflow-hidden flex flex-col">
        <SponsorDiscoverySidebar 
          onAssignLead={handleAssignMarketplaceLead} 
        />
      </div>

      {/* Main Kanban Grid Area */}
      <div className="flex-1 min-w-0 flex flex-col h-full gap-4">
        
        {/* Kanban Top Action Bar */}
        <div className="shrink-0 flex items-center justify-end px-2">
           <button 
             onClick={() => setIsAIModalOpen(true)}
             className="flex items-center gap-2 px-5 py-2.5 bg-[#FAF9F6] border border-[#e8eada] text-[#0a120e] font-bold text-sm rounded-[6px] hover:bg-white hover:border-[var(--gold)] hover:text-[var(--gold)] shadow-sm hover:shadow-[0_0_15px_rgba(212,175,55,0.2)] transition-all group"
           >
             <Wand2 className="w-4 h-4 text-[var(--gold)] group-hover:animate-pulse" />
             AI Bulk Import
           </button>
        </div>

        <div className="flex-1 flex flex-row overflow-x-auto overflow-y-hidden gap-6 pb-4 custom-scrollbar items-start">
          <DndContext 
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
          >
            {COLUMNS.map(col => (
              <SponsorPipelineColumn 
                key={col.id}
                id={col.id}
                title={col.title}
                leads={leads.filter(l => l.status === col.id)}
                onClickOut={handleBoardClickOut}
              />
            ))}

            <DragOverlay>
              {activeId && activeLead ? (
                <SponsorCard id={activeId} lead={activeLead} onClickOut={() => {}} />
              ) : null}
            </DragOverlay>
          </DndContext>
        </div>
      </div>

      <CommunicationSlideOut 
        isOpen={!!slideOutLead}
        onClose={() => setSlideOutLead(null)}
        lead={slideOutLead}
        onSaveNote={handleSaveNote}
        onDeleteLead={handleDeleteLead}
      />

      {/* Intelligence Drag & Drop Ingestion */}
      <IntelligenceUploadModal 
        isOpen={isAIModalOpen}
        onClose={() => setIsAIModalOpen(false)}
        tournamentId={tournamentId}
        onImportComplete={(newLeads) => {
          setLeads(prev => [...prev, ...newLeads]);
        }}
      />

      {/* Custom Alert Modals */}
      {leadToDelete && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#0a120e]/60 backdrop-blur-sm" onClick={() => setLeadToDelete(null)}></div>
          <div className="bg-[#FAF9F6] border border-[#e8eada] rounded-[6px] shadow-2xl relative z-10 w-full max-w-md p-8 text-center animate-in fade-in zoom-in-95 duration-200">
            <Trash2 className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-[#0a120e] mb-2" style={{ fontFamily: 'var(--font-serif), var(--font-cinzel), serif' }}>Remove Lead?</h3>
            <p className="text-neutral-500 mb-8">Are you sure you want to completely remove this sponsor lead from your pipeline? This action cannot be undone.</p>
            <div className="flex gap-4">
              <button 
                onClick={() => setLeadToDelete(null)} 
                className="flex-1 py-3 border border-[#e8eada] text-[#0a120e] font-bold rounded-[6px] hover:bg-neutral-50 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={confirmDeleteLead} 
                className="flex-1 py-3 bg-red-500 text-white font-bold rounded-[6px] shadow-[0_0_15px_rgba(239,68,68,0.3)] hover:scale-[1.02] transition-transform"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}

      {duplicateWarning && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#0a120e]/60 backdrop-blur-sm" onClick={() => setDuplicateWarning(null)}></div>
          <div className="bg-[#FAF9F6] border border-[var(--gold)] rounded-[6px] shadow-2xl relative z-10 w-full max-w-sm p-6 text-center animate-in fade-in zoom-in-95 duration-200">
            <ShieldCheck className="w-10 h-10 text-[var(--gold)] mx-auto mb-3" />
            <h3 className="text-xl font-bold text-[#0a120e] mb-2">Duplicate Entry</h3>
            <p className="text-neutral-500 mb-6 font-medium">{duplicateWarning}</p>
            <button 
              onClick={() => setDuplicateWarning(null)} 
              className="w-full py-3 bg-[var(--gold)] text-black font-bold rounded-[6px] shadow-[0_0_15px_rgba(212,175,55,0.3)] hover:scale-[1.02] transition-transform"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
