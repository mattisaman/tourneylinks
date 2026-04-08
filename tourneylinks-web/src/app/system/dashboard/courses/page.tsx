import React from 'react';
import { db, courses } from '@/lib/db';
import { sql, isNotNull } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

export default async function CoursesDashboard() {
  
  const [stats] = await db.select({ 
      total: sql<number>`count(*)`,
      claimed: sql<number>`sum(case when claimed_by_user_id is not null then 1 else 0 end)`,
      hasHero: sql<number>`sum(case when hero_image_url is not null then 1 else 0 end)`
  }).from(courses);

  return (
    <div>
        <div style={{ marginBottom: '3rem' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 700, margin: '0 0 0.5rem 0', color: '#fff' }}>Course Intelligence</h1>
          <p style={{ color: '#888', margin: 0 }}>RapidAPI Global Database Adoption & Enrichment Metrics</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '3rem' }}>
            <div style={{ background: '#111', border: '1px solid #222', borderRadius: '12px', padding: '1.5rem' }}>
                <div style={{ color: '#888', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>Global Courses Seeded</div>
                <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#fff', marginTop: '0.5rem' }}>{stats?.total?.toLocaleString()}</div>
            </div>
            
            <div style={{ background: '#111', border: '1px solid #222', borderRadius: '12px', padding: '1.5rem' }}>
                <div style={{ color: '#888', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>PGA Pros Claimed</div>
                <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--grass)', marginTop: '0.5rem' }}>{stats?.claimed?.toLocaleString()}</div>
                <div style={{ fontSize: '0.85rem', color: '#666', marginTop: '0.5rem' }}>
                  {stats?.total ? ((stats.claimed / stats.total) * 100).toFixed(2) : 0}% Adoption Rate
                </div>
            </div>

            <div style={{ background: '#111', border: '1px solid #222', borderRadius: '12px', padding: '1.5rem' }}>
                <div style={{ color: '#888', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>Rich Media Enrichment</div>
                <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--gold)', marginTop: '0.5rem' }}>{stats?.hasHero?.toLocaleString()}</div>
                <div style={{ fontSize: '0.85rem', color: '#666', marginTop: '0.5rem' }}>Courses with uploaded hero imagery</div>
            </div>
        </div>

        <div style={{ background: 'rgba(212,175,55,0.05)', border: '1px dashed rgba(212,175,55,0.3)', padding: '2rem', borderRadius: '12px', textAlign: 'center' }}>
            <h3 style={{ color: 'var(--gold)', margin: '0 0 0.5rem 0' }}>B2B Pro Outreach Funnel</h3>
            <p style={{ color: '#888', fontSize: '0.9rem', margin: 0, maxWidth: '600px', display: 'inline-block' }}>
                Currently awaiting Phase 15 activation. This ledger will eventually map to Salesforce workflows, tracking outbound automated AI emails inviting General Managers to claim their organic footprint on TourneyLinks.
            </p>
        </div>
    </div>
  );
}
