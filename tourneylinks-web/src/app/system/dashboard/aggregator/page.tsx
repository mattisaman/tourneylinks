import React from 'react';
import { db, tournaments } from '@/lib/db';
import { sql, desc } from 'drizzle-orm';
import { Download } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AggregatorDashboard() {
  
  // For MVP, pulling top 500. Next phase will require pagination or Infinite Scroll.
  const allTournaments = await db.select().from(tournaments).orderBy(desc(tournaments.createdAt)).limit(500);

  const [stats] = await db.select({ 
      total: sql<number>`count(*)`,
      charityCount: sql<number>`sum(case when is_charity = true then 1 else 0 end)`
  }).from(tournaments);

  return (
    <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 700, margin: '0 0 0.5rem 0', color: '#fff' }}>Global Aggregator</h1>
            <p style={{ color: '#888', margin: 0 }}>The Master Data Mine for Sponsorships and Analytics</p>
          </div>
          
          {/* Mock Export Button for future CSV Hook */}
          <button style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.25rem', background: '#222', color: '#fff', border: '1px solid #333', borderRadius: '6px', fontWeight: 600, cursor: 'pointer' }}>
            <Download size={16} /> Export to CSV
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '2rem' }}>
            <div style={{ background: '#111', border: '1px solid #222', borderRadius: '12px', padding: '1.5rem' }}>
                <div style={{ color: '#888', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>Total Indexed Events</div>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: '#fff', marginTop: '0.5rem' }}>{stats?.total?.toLocaleString()}</div>
            </div>
            <div style={{ background: '#111', border: '1px solid #222', borderRadius: '12px', padding: '1.5rem' }}>
                <div style={{ color: '#888', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>Charity Events</div>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--blue)', marginTop: '0.5rem' }}>{stats?.charityCount?.toLocaleString()}</div>
            </div>
            <div style={{ background: '#111', border: '1px dashed var(--gold)', borderRadius: '12px', padding: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gold)', fontWeight: 600 }}>
                Interactive Filtering Engine Coming Phase 40
            </div>
        </div>

        <div style={{ background: '#111', border: '1px solid #222', borderRadius: '12px', overflow: 'scroll', maxHeight: '70vh' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem', whiteSpace: 'nowrap' }}>
                <thead style={{ position: 'sticky', top: 0, background: '#1a1a1a', zIndex: 10 }}>
                    <tr>
                        <th style={{ padding: '1rem', color: '#888', fontWeight: 500, borderBottom: '1px solid #333' }}>TOURNAMENT NAME</th>
                        <th style={{ padding: '1rem', color: '#888', fontWeight: 500, borderBottom: '1px solid #333' }}>STATE</th>
                        <th style={{ padding: '1rem', color: '#888', fontWeight: 500, borderBottom: '1px solid #333' }}>COURSE</th>
                        <th style={{ padding: '1rem', color: '#888', fontWeight: 500, borderBottom: '1px solid #333' }}>DATE</th>
                        <th style={{ padding: '1rem', color: '#888', fontWeight: 500, borderBottom: '1px solid #333' }}>TYPE</th>
                        <th style={{ padding: '1rem', color: '#888', fontWeight: 500, borderBottom: '1px solid #333' }}>ENTRY FEE</th>
                    </tr>
                </thead>
                <tbody>
                    {allTournaments.map(t => (
                    <tr key={t.id} style={{ borderBottom: '1px solid #222' }}>
                        <td style={{ padding: '1rem', color: '#fff', fontWeight: 500, maxWidth: '250px', overflow: 'hidden', textOverflow: 'ellipsis' }}>{t.name}</td>
                        <td style={{ padding: '1rem', color: '#ccc' }}>
                           <span style={{ background: '#222', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>{t.courseState}</span>
                        </td>
                        <td style={{ padding: '1rem', color: '#ccc', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis' }}>{t.courseName}</td>
                        <td style={{ padding: '1rem', color: '#ccc' }}>{t.dateStart}</td>
                        <td style={{ padding: '1rem' }}>
                            {t.isCharity ? (
                                <span style={{ color: '#4CAF50', background: 'rgba(76,175,80,0.1)', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem' }}>Charity</span>
                            ) : (
                                <span style={{ color: '#888', background: 'rgba(255,255,255,0.05)', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem' }}>Private/Open</span>
                            )}
                        </td>
                        <td style={{ padding: '1rem', color: 'var(--gold)', fontWeight: 600 }}>
                            {t.entryFee ? `$${t.entryFee}` : 'TBD'}
                        </td>
                    </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
  );
}
