import React from 'react';
import WidgetCard from './WidgetCard';
import { Edit3 } from 'lucide-react';

export default function ProfileWidget({ dbUser }: { dbUser: any }) {
  return (
    <WidgetCard>
      <div className="flex flex-col items-center text-center h-full justify-center lg:items-start lg:text-left">
        <div className="flex flex-col lg:flex-row items-center gap-6 w-full">
          <div className="relative group shrink-0">
             <div className="absolute -inset-1 bg-gradient-to-tr from-[var(--gold)] to-[var(--amber)] rounded-full blur-md opacity-40 group-hover:opacity-100 transition-opacity duration-1000" />
             <img 
               src={dbUser.avatarUrl || '/placeholder_avatar.png'} 
               alt="Profile Avatar" 
               className="relative w-24 h-24 lg:w-32 lg:h-32 object-cover rounded-full shadow-2xl bg-[var(--forest)] p-1 border border-[var(--gold)]"
             />
          </div>
          
          <div className="flex-1">
             <h2 className="text-2xl font-bold tracking-wide" style={{ color: 'var(--cream)', fontFamily: 'var(--font-serif), serif' }}>{dbUser.fullName}</h2>
             <p className="text-sm mb-4" style={{ color: 'rgba(245,240,232,0.65)' }}>{dbUser.email}</p>
             
             <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3">
               <div className="border rounded-xl px-4 py-2 flex items-center gap-3" style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(212,175,55,0.2)' }}>
                  <span className="text-[10px] uppercase tracking-widest font-semibold" style={{ color: 'var(--gold)' }}>GHIN</span>
                  <span className="w-px h-4" style={{ background: 'rgba(245,240,232,0.2)' }} />
                  <span className="font-mono text-lg font-bold" style={{ color: 'var(--cream)' }}>
                    {dbUser.verifiedGhin ? dbUser.handicapIndex : '--.--'}
                  </span>
               </div>
             </div>
          </div>
        </div>

        <div className="mt-8 pt-6 w-full flex justify-between items-center" style={{ borderTop: '1px solid rgba(245,240,232,0.1)' }}>
            {dbUser.role === 'HOST' && (
              <span className="px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-widest" style={{ background: 'rgba(212,175,55,0.15)', color: 'var(--gold)', border: '1px solid rgba(212,175,55,0.3)' }}>
                 Director
              </span>
            )}
            <a href="/profile/settings" className="ml-auto transition-colors px-4 py-2 rounded-lg flex items-center gap-2 text-xs uppercase tracking-widest font-semibold" style={{ color: 'rgba(245,240,232,0.65)', background: 'rgba(255,255,255,0.05)' }}>
               <Edit3 size={14} /> Settings
            </a>
        </div>
      </div>
    </WidgetCard>
  );
}
