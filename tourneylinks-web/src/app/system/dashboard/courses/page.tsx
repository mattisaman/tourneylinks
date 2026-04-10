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
          <h1 style={{ fontSize: '2.5rem', fontWeight: 700, margin: '0 0 0.5rem 0', color: 'var(--forest)' }}>Course Intelligence</h1>
          <p style={{ color: 'var(--mist)', margin: 0 }}>RapidAPI Global Database Adoption & Enrichment Metrics</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '3rem' }}>
            {/* Global Seeded (White Glass) */}
            <div style={{ background: 'var(--white)', border: '1px solid rgba(0,0,0,0.05)', borderRadius: '12px', padding: '1.5rem', boxShadow: 'var(--shadow-sm)' }}>
                <div style={{ color: 'var(--mist)', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>Global Courses Seeded</div>
                <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--forest)', marginTop: '0.5rem' }}>{stats?.total?.toLocaleString()}</div>
            </div>
            
            {/* Pros Claimed (Green Gradient) */}
            <div style={{ background: 'var(--admin-gradient-green)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '1.5rem', boxShadow: 'var(--admin-glow-green)' }}>
                <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>PGA Pros Claimed</div>
                <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--white)', marginTop: '0.5rem' }}>{stats?.claimed?.toLocaleString()}</div>
                <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', marginTop: '0.5rem', fontWeight: 500 }}>
                  {stats?.total ? ((stats.claimed / stats.total) * 100).toFixed(2) : 0}% Adoption Rate
                </div>
            </div>

            {/* Rich Media (Gold Gradient) */}
            <div style={{ background: 'var(--admin-gradient-gold)', border: '1px solid rgba(255,255,255,0.4)', borderRadius: '12px', padding: '1.5rem', boxShadow: 'var(--admin-glow-gold)' }}>
                <div style={{ color: 'rgba(0,0,0,0.6)', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>Rich Media Enrichment</div>
                <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--forest)', marginTop: '0.5rem' }}>{stats?.hasHero?.toLocaleString()}</div>
                <div style={{ fontSize: '0.85rem', color: 'rgba(0,0,0,0.6)', marginTop: '0.5rem', fontWeight: 500 }}>Courses with uploaded hero imagery</div>
            </div>
        </div>

        {/* Phase 15 Callout Box */}
        <div style={{ background: 'rgba(230, 194, 122, 0.1)', border: '1px dashed rgba(200, 150, 50, 0.3)', padding: '2rem', borderRadius: '12px', textAlign: 'center', boxShadow: 'var(--shadow-sm)' }}>
            <h3 style={{ color: 'var(--gold-dark)', margin: '0 0 0.5rem 0', fontSize: '1.25rem' }}>B2B Pro Outreach Funnel</h3>
            <p style={{ color: 'var(--mist)', fontSize: '0.95rem', margin: 0, maxWidth: '600px', display: 'inline-block', lineHeight: 1.6 }}>
                Currently awaiting Phase 15 activation. This ledger will eventually map to Salesforce workflows, tracking outbound automated AI emails inviting General Managers to claim their organic footprint on TourneyLinks.
            </p>
        </div>
    </div>
  );
}
