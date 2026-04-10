import React from 'react';
import { db, tournaments } from '@/lib/db';
import { sql, desc } from 'drizzle-orm';
import { Download } from 'lucide-react';
import { Tooltip } from '@/components/ui/Tooltip';

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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2.5rem' }}>
          <div>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 800, margin: '0 0 0.5rem 0', color: 'var(--forest)', letterSpacing: '-0.5px' }}>Global Aggregator</h1>
            <p style={{ color: 'var(--mist)', margin: 0, fontSize: '0.95rem' }}>The Master Data Mine and Crawler Control Center</p>
          </div>
          
          <div style={{ display: 'flex', gap: '1rem' }}>
             <button style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.8rem 1.5rem', background: 'var(--white)', color: 'var(--forest)', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s', boxShadow: 'var(--shadow-sm)' }}>
               <Download size={16} /> Export CSV
             </button>
             <button style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.8rem 1.5rem', background: 'var(--gold-foil)', color: 'var(--ink)', border: 'none', borderRadius: '8px', fontWeight: 800, cursor: 'pointer', boxShadow: 'var(--metallic-shadow)', transition: 'transform 0.2s' }}>
               Deploy Regional Crawlers
             </button>
          </div>
        </div>

        {/* Master Statistics */}
        {/* Master Statistics (Glassmorphism Core) */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '3rem' }}>
            {/* Soft Green Card */}
            <div style={{ background: 'var(--admin-gradient-green)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '1.75rem', boxShadow: 'var(--admin-glow-green)' }}>
                <Tooltip content={
                    <div>
                        <strong style={{ color: 'var(--admin-gold-light)' }}>What is this?</strong> Represents the total size of your current data asset spanning the entire US Golf network.
                    </div>
                }>
                    <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', borderBottom: '1px dotted rgba(255,255,255,0.4)', display: 'inline-block' }}>Global Indexed Volume</div>
                </Tooltip>
                <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--white)', marginTop: '0.5rem' }}>{stats?.total?.toLocaleString()}</div>
            </div>
            
            {/* Gold Card */}
            <div style={{ background: 'var(--admin-gradient-gold)', border: '1px solid rgba(255,255,255,0.4)', borderRadius: '12px', padding: '1.75rem', boxShadow: 'var(--admin-glow-gold)' }}>
                <Tooltip content={
                    <div>
                        <strong style={{ color: 'var(--admin-gold-light)' }}>Why track this?</strong> Fortune 500 companies exclusively deploy their golf marketing budgets toward fully verified 501(c)(3) events to claim corporate tax write-offs. This density metric proves the premium acquisition value of your network.
                    </div>
                }>
                    <div style={{ color: 'rgba(0,0,0,0.6)', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', borderBottom: '1px dotted rgba(0,0,0,0.3)', display: 'inline-block' }}>Verified Charity Density</div>
                </Tooltip>
                <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--forest)', marginTop: '0.5rem' }}>{stats?.charityCount?.toLocaleString()}</div>
            </div>
            
            {/* Dark Forest Node Card */}
            <div style={{ background: 'var(--admin-gradient-dark)', border: '1px solid var(--emerald)', borderRadius: '12px', padding: '1.75rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', boxShadow: 'var(--admin-glow-dark)' }}>
                <Tooltip content={
                    <div>
                        <strong style={{ color: 'var(--admin-gold-light)' }}>System Health:</strong> These are the live scraping engines pulling fresh network data continuously into your central database.
                    </div>
                }>
                    <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem', borderBottom: '1px dotted rgba(255,255,255,0.3)', display: 'inline-block' }}>Active Crawler Nodes</div>
                </Tooltip>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                   <div style={{ width: '12px', height: '12px', background: 'var(--teal-light)', borderRadius: '50%', boxShadow: '0 0 12px var(--teal-light)' }}></div>
                   <span style={{ color: 'var(--white)', fontWeight: 700, fontSize: '1.2rem' }}>14 Nodes Operational</span>
                </div>
            </div>
        </div>

        {/* Data Cards Feed (Light Luxury Overhaul) */}
        <div>
            <style dangerouslySetInnerHTML={{__html: `
              .lux-card { transition: transform 0.2s, box-shadow 0.2s; cursor: pointer; }
              .lux-card:hover { transform: translateY(-2px); box-shadow: var(--shadow-md) !important; }
            `}} />
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--forest)', marginBottom: '1rem', borderBottom: '1px solid rgba(0,0,0,0.1)', paddingBottom: '1rem' }}>Latest Indexed Tournaments</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {allTournaments.map(t => (
                   <div key={t.id} className="lux-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--white)', border: '1px solid rgba(0,0,0,0.05)', padding: '1.25rem 1.5rem', borderRadius: '8px', boxShadow: 'var(--shadow-sm)' }}>
                      
                      <div style={{ flex: 2 }}>
                         <h3 style={{ margin: '0 0 0.25rem 0', color: 'var(--forest)', fontSize: '1.1rem', fontWeight: 700 }}>{t.name}</h3>
                         <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--mist)', fontSize: '0.85rem' }}>
                            <span>{t.courseName}</span>
                            <span>•</span>
                            <span style={{ fontWeight: 600 }}>{t.courseCity}, {t.courseState}</span>
                         </div>
                      </div>

                      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                         <div style={{ color: 'var(--mist)', fontSize: '0.85rem', marginBottom: '0.2rem' }}>Event Date</div>
                         <div style={{ color: 'var(--forest)', fontWeight: 600 }}>{t.dateStart || 'TBD'}</div>
                      </div>

                      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                         <div style={{ color: 'var(--mist)', fontSize: '0.85rem', marginBottom: '0.2rem' }}>Classification</div>
                         {t.isCharity ? (
                             <span style={{ color: 'var(--admin-green-soft)', background: 'rgba(91, 123, 97, 0.1)', border: '1px solid rgba(91, 123, 97, 0.2)', padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 700 }}>Charity Asset</span>
                         ) : (
                             <span style={{ color: 'var(--mist)', background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.05)', padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600 }}>Private / Corp</span>
                         )}
                      </div>

                      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                         <div style={{ color: 'var(--mist)', fontSize: '0.85rem', marginBottom: '0.2rem' }}>Entry Fee</div>
                         <div style={{ color: 'var(--gold-dark)', fontWeight: 800, fontSize: '1.2rem' }}>{t.entryFee ? `$${t.entryFee}` : 'TBD'}</div>
                      </div>

                   </div>
                ))}
            </div>
        </div>
    </div>
  );
}
