"use client";

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import WidgetCard from './WidgetCard';

export default function CalendarWidget({ registrations, hostedEvents, radarTournaments = [] }: { registrations: any[], hostedEvents: any[], radarTournaments?: any[] }) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  // Create a map of dates to events
  const eventMap: Record<string, { title: string, type: 'play' | 'host' | 'radar' }[]> = {};
  
  const addEventToMap = (dateStr: string, event: { title: string, type: 'play' | 'host' | 'radar' }) => {
     if (!eventMap[dateStr]) eventMap[dateStr] = [];
     eventMap[dateStr].push(event);
  };

  registrations.forEach(r => {
    if (r.tournament?.dateStart) {
      const dateStr = r.tournament.dateStart.split('T')[0];
      addEventToMap(dateStr, { title: r.tournament.name, type: 'play' });
    }
  });

  hostedEvents.forEach(t => {
     if (t.dateStart) {
        const dateStr = t.dateStart.split('T')[0];
        addEventToMap(dateStr, { title: t.name, type: 'host' });
     }
  });

  radarTournaments.forEach(t => {
     if (t.dateStart) {
        const dateStr = t.dateStart.split('T')[0];
        addEventToMap(dateStr, { title: t.name, type: 'radar' });
     }
  });

  const getDayElement = (dayNumber: number) => {
     const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(dayNumber).padStart(2, '0')}`;
     const events = eventMap[dateStr] || [];
     const isToday = new Date().toDateString() === new Date(currentDate.getFullYear(), currentDate.getMonth(), dayNumber).toDateString();
     
     const hasPlay = events.some(e => e.type === 'play');
     const hasHost = events.some(e => e.type === 'host');
     const hasRadar = events.some(e => e.type === 'radar');

     return (
        <div key={dayNumber} className="relative flex items-center justify-center h-10 w-10 lg:h-12 lg:w-12 text-sm lg:text-base transition-all cursor-pointer group">
           {/* Background hover / selection states for neumorphic feel */}
           <div className={`absolute inset-0 rounded-full transition-all duration-300 ${isToday ? 'bg-[var(--gold)] opacity-20 ring-1 ring-[var(--gold)]' : 'group-hover:bg-white/5'} ${hasRadar && !hasPlay ? 'bg-[rgba(40,80,50,0.3)] ring-1 ring-[rgba(74,222,128,0.2)]' : ''}`} />
           
           <span className={`relative z-10 ${hasPlay ? 'font-black text-[var(--cream)]' : 'font-medium text-[rgba(245,240,232,0.7)]'}`}>
              {dayNumber}
           </span>

           {/* Event Indicators */}
           <div className="absolute bottom-1.5 flex gap-1 z-10">
              {hasPlay && <div className="w-1 h-1 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]" title="Registered to Play" />}
              {hasHost && <div className="w-1 h-1 rounded-full bg-[var(--gold)] shadow-[0_0_8px_rgba(212,175,55,0.8)]" title="Hosting Event" />}
              {hasRadar && !hasPlay && <div className="w-1 h-1 rounded-full bg-[#4ade80] opacity-60" title="Radar Tournament" />}
           </div>
        </div>
     );
  };

  return (
    <WidgetCard>
      <div className="flex items-center justify-between pb-4 lg:pb-6 relative z-10">
         <h3 className="text-3xl lg:text-4xl font-medium tracking-tight" style={{ color: 'var(--cream)', fontFamily: 'var(--font-serif), serif' }}>
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
         </h3>
         <div className="flex items-center gap-2">
            <button onClick={prevMonth} className="p-2 hover:bg-white/5 rounded-full transition-colors"><ChevronLeft size={20} strokeWidth={1.5} className="text-[rgba(245,240,232,0.6)] hover:text-white"/></button>
            <button onClick={nextMonth} className="p-2 hover:bg-white/5 rounded-full transition-colors"><ChevronRight size={20} strokeWidth={1.5} className="text-[rgba(245,240,232,0.6)] hover:text-white"/></button>
         </div>
      </div>

      <div className="grid grid-cols-7 mb-6 text-center relative z-10">
         {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-sm uppercase tracking-widest font-bold" style={{ color: 'rgba(245,240,232,0.5)' }}>{day}</div>
         ))}
      </div>

      <div className="flex-1 grid grid-cols-7 gap-y-2 justify-items-center relative z-10 font-sans">
         {Array.from({ length: firstDayOfMonth }).map((_, i) => <div key={`empty-${i}`} />)}
         {Array.from({ length: daysInMonth }).map((_, i) => getDayElement(i + 1))}
      </div>

      <div className="flex items-center justify-start gap-6 mt-auto pt-6 relative z-10" style={{ borderTop: '1px solid rgba(245,240,232,0.05)' }}>
         <div className="flex items-center gap-2 text-sm" style={{ color: 'rgba(245,240,232,0.6)' }}>
            <div className="w-2 h-2 rounded-full border border-white/20 bg-white/10 flex items-center justify-center">
               <div className="w-1 h-1 bg-white rounded-full" />
            </div> 
            Registered
         </div>
         <div className="flex items-center gap-2 text-sm" style={{ color: 'rgba(245,240,232,0.6)' }}>
            <div className="w-2 h-2 rounded-full border border-green-500/30 bg-green-500/10" /> 
            Radar Match
         </div>
      </div>
    </WidgetCard>
  );
}
