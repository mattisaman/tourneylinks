"use client";

import React, { useState, useEffect } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripHorizontal } from 'lucide-react';

// Wrapper for individual sortable widgets
function SortableWidget({ id, children, span = 1 }: { id: string, children: React.ReactNode, span?: number }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 1,
    opacity: isDragging ? 0.9 : 1,
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      className={`relative h-full flex flex-col group ${span === 2 ? 'md:col-span-2' : ''}`}
    >
      {/* Invisible drag handle area at the absolute top of every widget */}
      <div 
        {...attributes} 
        {...listeners}
        className="absolute top-2 left-1/2 -translate-x-1/2 cursor-grab active:cursor-grabbing p-2 text-[rgba(255,255,255,0)] group-hover:text-[rgba(255,255,255,0.2)] hover:!text-[var(--gold)] transition-colors z-20"
      >
        <GripHorizontal size={20} />
      </div>
      <div className="flex-1 rounded-2xl h-full shadow-[0_4px_30px_rgba(0,0,0,0.1)] transition-all">
        {children}
      </div>
    </div>
  );
}

export default function DraggableGrid({ 
  childrenMap, 
  defaultOrder 
}: { 
  childrenMap: Record<string, { component: React.ReactNode, span: number }>, 
  defaultOrder: string[] 
}) {
  const [items, setItems] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Attempt to hydrate layout from localStorage
    const savedLayout = localStorage.getItem('profile_dashboard_layout');
    if (savedLayout) {
      try {
        const parsed = JSON.parse(savedLayout);
        // Ensure all default items exist in parsed layout (in case we add new widgets)
        const missing = defaultOrder.filter(id => !parsed.includes(id));
        setItems([...parsed, ...missing]);
      } catch (e) {
        setItems(defaultOrder);
      }
    } else {
      setItems(defaultOrder);
    }
    setIsLoaded(true);
  }, [defaultOrder]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // 5px drag distance before activating, allows normal item clicks inside the widget
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.indexOf(active.id as string);
        const newIndex = items.indexOf(over.id as string);
        
        const newArray = arrayMove(items, oldIndex, newIndex);
        localStorage.setItem('profile_dashboard_layout', JSON.stringify(newArray));
        return newArray;
      });
    }
  }

  if (!isLoaded) return <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse" style={{ minHeight: '600px' }} />;

  return (
    <DndContext 
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext 
        items={items}
        strategy={rectSortingStrategy}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start w-full">
          {items.map(id => {
            const widget = childrenMap[id];
            if (!widget) return null;
            return (
              <SortableWidget key={id} id={id} span={widget.span}>
                {widget.component}
              </SortableWidget>
            );
          })}
        </div>
      </SortableContext>
    </DndContext>
  );
}
