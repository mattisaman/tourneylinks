import React from 'react';
import { db, tournaments, registrations } from '@/lib/db';
import { eq, desc } from 'drizzle-orm';
import { notFound } from 'next/navigation';

import PrintButton from '@/components/admin/PrintButton';
import SocialMediaHub from '@/components/admin/SocialMediaHub';
import AdminSidebar from '@/components/admin/AdminSidebar';
import DocumentHub from '@/components/admin/DocumentHub';

export const dynamic = 'force-dynamic';

export default async function PrintStationPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const tourneyId = parseInt(resolvedParams.id);
  if (isNaN(tourneyId)) return notFound();

  // Load Tournament
  const tourneys = await db.select().from(tournaments).where(eq(tournaments.id, tourneyId)).limit(1);
  const tourney = tourneys[0];
  if (!tourney) return notFound();

  // Load Players 
  const players = await db.select()
    .from(registrations)
    .where(eq(registrations.tournamentId, tourneyId))
    .orderBy(desc(registrations.createdAt));

  // Determine Teams based on assignedTeam
  const teamsMap: Record<number, typeof players> = {};
  players.forEach(p => {
    if (p.assignedTeam) {
       if (!teamsMap[p.assignedTeam]) teamsMap[p.assignedTeam] = [];
       teamsMap[p.assignedTeam].push(p);
    }
  });
  
  const teamKeys = Object.keys(teamsMap).map(Number).sort((a,b)=>a-b);
  const mockTournaments = [{ id: tourneyId, name: tourney.name || 'Tournament' }];

  return (
    <div style={{ minHeight: 'calc(100vh - 80px)', background: '#F9FAFB' }}>
      
      {/* GLOBAL CSS FOR PRINTING - Hide Navbars & Configure Pages */}
      <style dangerouslySetInnerHTML={{__html: `
        @page { size: letter; margin: 0; }
        @media print {
          body { background: white !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .no-print { display: none !important; }
          nav { display: none !important; }
          header { display: none !important; }
          .page-break { page-break-after: always; break-after: page; }
          .print-container { padding: 0 !important; margin: 0 !important; background: transparent !important; box-shadow: none !important; }
          .dashboard-wrap { display: block !important; padding: 0 !important; }
          .dash-sidebar { display: none !important; }
          .dash-main { padding: 0 !important; margin: 0 !important; max-width: 100% !important; border: none !important; }
        }
        .print-btn {
          position: fixed; bottom: 2rem; right: 2rem;
          background: #4ec9a0; color: #000; padding: 1rem 2rem; border-radius: 50px;
          font-weight: bold; font-size: 1.1rem; border: none; cursor: pointer;
          box-shadow: 0 10px 30px rgba(0,0,0,0.5); z-index: 1000;
        }
        .print-btn:hover { transform: translateY(-2px); }
        .sheet {
          background: white; width: 8.5in; min-height: 11in;
          margin: 2rem auto; padding: 0.5in; box-shadow: 0 5px 20px rgba(0,0,0,0.2);
          position: relative; overflow: hidden;
        }
      `}} />

      {/* TOP NAVIGATION BAR */}
      <div className="no-print" style={{ height: '60px', background: '#05120c', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', padding: '0 2rem', color: 'white', justifyContent: 'space-between' }}>
         <div style={{ fontWeight: 800, fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <a href="/admin" style={{ color: 'var(--mist)', textDecoration: 'none', marginRight: '0.5rem' }}>← Back</a>
            Dashboard <span style={{ color: 'var(--gold)' }}>/</span> {tourney.name} <span style={{ color: 'var(--gold)' }}>/</span> Print Hub
         </div>
         <div style={{ fontSize: '0.85rem', color: 'var(--mist)' }}>Live Organizer Studio</div>
      </div>

      <div className="dashboard-wrap no-print" style={{ minHeight: 'calc(100vh - 60px)', display: 'flex', alignItems: 'stretch' }}>
         <AdminSidebar tournamentId={tourneyId} mockTournaments={mockTournaments} />
         
         <div className="dash-main" style={{ padding: '2rem 3rem' }}>
            <div className="dash-header" style={{ marginBottom: '2rem' }}>
               <div>
                 <div className="dash-greeting">🖨️ The Print & Post Hub</div>
                 <div className="dash-date">Generate your social posts and print physical collateral instantly.</div>
               </div>
               <PrintButton />
            </div>
        
        <div style={{ maxWidth: '1400px', margin: '0 auto', textAlign: 'left' }}>
           <SocialMediaHub tournament={tourney} />
        </div>
        </div> {/* CLOSE dash-main */}
      </div> {/* CLOSE dashboard-wrap */}

      <div className="print-container" style={{ padding: '2rem', background: '#f4f3ef' }}>
         <DocumentHub tourney={tourney} players={players} teamsMap={teamsMap} teamKeys={teamKeys} />
      </div>
    </div>
  );
}
