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

  return (
    <div className="flex h-full w-full overflow-x-auto overflow-y-hidden p-8 gap-8 bg-transparent" style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(212,175,55,0.2) transparent' }}>
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
            onClickOut={(lead) => setSlideOutLead(lead)}
          />
        ))}

        <DragOverlay>
          {activeId && activeLead ? (
            <SponsorCard id={activeId} lead={activeLead} onClickOut={() => {}} />
          ) : null}
        </DragOverlay>
      </DndContext>

      <CommunicationSlideOut 
        isOpen={!!slideOutLead}
        onClose={() => setSlideOutLead(null)}
        lead={slideOutLead}
        onSaveNote={handleSaveNote}
      />
    </div>
  );
}
