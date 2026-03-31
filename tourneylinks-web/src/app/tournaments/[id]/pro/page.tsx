import React from 'react';
import { db, tournaments } from '@/lib/db';
import { eq } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import LiveTelemetry from '@/components/admin/LiveTelemetry';

export const dynamic = 'force-dynamic';

export default async function CourseProDashboard({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const tourneyId = parseInt(resolvedParams.id);
  
  const tourneyList = await db.select().from(tournaments).where(eq(tournaments.id, tourneyId));
  if (tourneyList.length === 0) return notFound();
  
  const tournament = tourneyList[0];

  return (
    <div style={{ background: '#05120c', minHeight: '100vh', color: 'white', fontFamily: 'sans-serif' }}>
      
      {/* Ranger Top Nav */}
      <div style={{ background: 'linear-gradient(180deg, rgba(201,168,76,0.1) 0%, rgba(5,18,12,0) 100%)', padding: '1.5rem', borderBottom: '1px solid rgba(212,175,55,0.2)' }}>
         <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
               <div style={{ fontSize: '0.8rem', color: 'var(--mist)', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600 }}>Pro Shop Radar</div>
               <div style={{ fontSize: '1.5rem', fontFamily: 'serif', fontWeight: 800 }}>{tournament.name}</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
               <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#4CAF50', boxShadow: '0 0 10px #4CAF50' }}></span>
               <span style={{ fontSize: '0.8rem', color: 'var(--mist)', textTransform: 'uppercase' }}>GPS Link Active</span>
            </div>
         </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '2rem auto', padding: '0 1.5rem' }}>
         <p style={{ color: 'var(--mist)', marginBottom: '2rem', lineHeight: '1.6' }}>
            <strong>Course Staff:</strong> This terminal tracks live pace-of-play metrics for the active tournament. Any scramble team exceeding 16+ minutes per hole will automatically trigger a red proximity alert below.
         </p>
         
         <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '12px', padding: '2rem', border: '1px solid rgba(255,255,255,0.05)' }}>
            <LiveTelemetry tournamentId={tourneyId} />
         </div>
      </div>
      
    </div>
  );
}
