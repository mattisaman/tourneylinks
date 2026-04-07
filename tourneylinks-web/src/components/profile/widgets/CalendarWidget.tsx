"use client";

import React, { useState } from 'react';
import { CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';

export default function CalendarWidget({ registrations, hostedEvents }: { registrations: any[], hostedEvents: any[] }) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  // Create a map of dates to events
  const eventMap: Record<string, { title: string, type: 'play' | 'host' }> = {};
  
  registrations.forEach(r => {
    if (r.tournament.dateStart) {
      // Very basic local date matching parsing YYYY-MM-DD
      const dateStr = r.tournament.dateStart.split('T')[0];
      eventMap[dateStr] = { title: r.tournament.name, type: 'play' };
    }
  });

  hostedEvents.forEach(t => {
     if (t.dateStart) {
        const dateStr = t.dateStart.split('T')[0];
        eventMap[dateStr] = { title: t.name, type: 'host' };
     }
  });

  const getDayElement = (dayNumber: number) => {
     const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(dayNumber).padStart(2, '0')}`;
     const event = eventMap[dateStr];
     const isToday = new Date().toDateString() === new Date(currentDate.getFullYear(), currentDate.getMonth(), dayNumber).toDateString();

     return (
        <div key={dayNumber} className={`relative flex items-center justify-center h-10 w-10 text-sm rounded-full transition-all cursor-pointer hover:bg-[rgba(255,255,255,0.1)] ${isToday ? 'border border-[rgba(255,255,255,0.4)]' : ''}`}>
           {dayNumber}
           {event && (
              <div 
                 title={event.title}
                 className={`absolute bottom-1 w-1.5 h-1.5 rounded-full ${event.type === 'host' ? 'bg-[#f1c40f] shadow-[0_0_8px_rgba(241,196,15,0.8)]' : 'bg-[#4ade80] shadow-[0_0_8px_rgba(74,222,128,0.8)]'}`}
              />
           )}
        </div>
     );
  };

  return (
    <div className="w-full h-full bg-[rgba(2,6,4,0.6)] backdrop-blur-2xl border border-[var(--gold)]/30 p-8 hover:border-[var(--gold)] transition-colors shadow-2xl flex flex-col min-h-[400px] z-10 rounded-2xl relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[rgba(255,255,255,0.02)] to-transparent pointer-events-none" />
      
      <div className="flex items-center justify-between border-b border-[rgba(255,255,255,0.1)] pb-4 mb-4 relative z-10">
         <h3 className="text-sm uppercase tracking-[0.15em] font-black flex items-center gap-3 text-white">
            <CalendarIcon size={18} className="text-[var(--gold)]" /> Calendar
         </h3>
         <div className="flex items-center gap-2">
            <button onClick={prevMonth} className="p-1 hover:bg-[rgba(255,255,255,0.1)] rounded"><ChevronLeft size={16} className="text-white"/></button>
            <span className="text-xs font-bold text-white uppercase tracking-widest min-w-[100px] text-center">{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</span>
            <button onClick={nextMonth} className="p-1 hover:bg-[rgba(255,255,255,0.1)] rounded"><ChevronRight size={16} className="text-white"/></button>
         </div>
      </div>

      <div className="grid grid-cols-7 mb-2 text-center relative z-10">
         {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
            <div key={day} className="text-[10px] text-[rgba(255,255,255,0.4)] font-bold uppercase tracking-widest">{day}</div>
         ))}
      </div>

      <div className="flex-1 grid grid-cols-7 gap-y-2 justify-items-center relative z-10 text-white font-mono">
         {Array.from({ length: firstDayOfMonth }).map((_, i) => <div key={`empty-${i}`} />)}
         {Array.from({ length: daysInMonth }).map((_, i) => getDayElement(i + 1))}
      </div>

      <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t border-[rgba(255,255,255,0.05)] relative z-10">
         <div className="flex items-center gap-2 text-[10px] text-[rgba(255,255,255,0.6)] uppercase tracking-widest">
            <div className="w-2 h-2 rounded-full bg-[#4ade80]" /> Playing
         </div>
         <div className="flex items-center gap-2 text-[10px] text-[rgba(255,255,255,0.6)] uppercase tracking-widest">
            <div className="w-2 h-2 rounded-full bg-[#f1c40f]" /> Hosting
         </div>
      </div>
    </div>
  );
}
