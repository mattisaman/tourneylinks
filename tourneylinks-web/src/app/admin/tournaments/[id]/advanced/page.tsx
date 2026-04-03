import React from 'react';
import Link from 'next/link';
import { db, tournaments } from '@/lib/db';
import { eq } from 'drizzle-orm';
import { notFound } from 'next/navigation';

import CourseGPSMapper from '@/components/admin/CourseGPSMapper';
import ScorecardVisionScanner from '@/components/admin/ScorecardVisionScanner';
import AdminSidebar from '@/components/admin/AdminSidebar';

export const dynamic = 'force-dynamic';

export default async function AdvancedGeospatialPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const tournamentId = parseInt(resolvedParams.id);
  if (isNaN(tournamentId)) return notFound();

  const tourneyResult = await db.select().from(tournaments).where(eq(tournaments.id, tournamentId)).limit(1);
  const tourney = tourneyResult[0];
  if (!tourney) return notFound();

  return (
    <div style={{ minHeight: 'calc(100vh - 80px)' }}>
      <div className="dashboard-wrap" style={{ minHeight: '100%' }}>
        {/* We can temporarily disable mockTournaments on this secondary page to focus on tools */}
        <AdminSidebar tournamentId={tournamentId} mockTournaments={[]} />

        {/* Main Content */}
        <div className="dash-main">
          
          <div style={{ paddingBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2rem', fontWeight: 800, color: 'var(--forest)', marginBottom: '0.5rem' }}>Advanced Setup Toolkit</h1>
              <div style={{ color: 'var(--mist)', fontSize: '0.9rem' }}>
                Geospatial routing and Vision AI mapping. Configuration here handles background scaling for the mobile app.
              </div>
            </div>
            
            <Link href="/admin" className="btn-ghost" style={{ color: 'var(--forest)', border: '1px solid rgba(26,46,26,0.2)' }}>
              ← Return to Main Dashboard
            </Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)', gap: '1.5rem' }}>
             
             {/* Phase 6: Gemini Vision OCR Dropzone */}
             <div id="vision-scoring">
                <ScorecardVisionScanner courseId={(tourney as any).courseId || 1} />
             </div>

             {/* Phase 7: GPS Coordinate Definition (Haversine Source) */}
             <div id="course-gps">
                <CourseGPSMapper courseId={(tourney as any).courseId || 1} />
             </div>

          </div>
        </div>
      </div>
    </div>
  );
}
