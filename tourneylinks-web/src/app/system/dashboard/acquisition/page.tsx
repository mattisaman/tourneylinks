import React from 'react';
import { db, tournaments, users, registrations } from '@/lib/db';
import { sql } from 'drizzle-orm';
import { Target, TrendingUp, Users, Activity, BarChart3, Database } from 'lucide-react';

export const dynamic = 'force-dynamic';

// --- STRATEGIC MILESTONES DEFINED HERE --- //
const MNA_TARGET_VALUATION = 30000000;
const GOAL_TOURNAMENTS = 8000;
const GOAL_GOLFERS = 800000;
const GOAL_GMV = 200000000;

export default async function AcquisitionTracker() {
  
  // Real-time Database Polling
  const [tourneyStats] = await db.select({ 
      total: sql<number>`count(*)`,
      managedCount: sql<number>`sum(case when host_user_id is not null then 1 else 0 end)`,
      crawledCount: sql<number>`sum(case when host_user_id is null then 1 else 0 end)`
  }).from(tournaments);
  
  const [userStats] = await db.select({ 
      total: sql<number>`count(*)`
  }).from(users);

  // Derive Current Run Rate
  const currentTournaments = parseInt(tourneyStats?.total?.toString() || '0');
  const managedTournaments = parseInt(tourneyStats?.managedCount?.toString() || '0');
  const crawledTournaments = parseInt(tourneyStats?.crawledCount?.toString() || '0');
  const currentGolfers = parseInt(userStats?.total?.toString() || '0');
  
  // Apply Platform Multipliers
  const managedGMV = managedTournaments * 25000; 
  const crawledAssetValue = crawledTournaments * 100;
  const currentGMV = managedGMV + crawledAssetValue;

  // Calculate Progression Percentages
  const pctTournaments = Math.min((currentTournaments / GOAL_TOURNAMENTS) * 100, 100).toFixed(2);
  const pctManaged = Math.min((managedTournaments / GOAL_TOURNAMENTS) * 100, 100).toFixed(2);
  const pctCrawled = Math.min((crawledTournaments / GOAL_TOURNAMENTS) * 100, 100).toFixed(2);
  const pctGolfers = Math.min((currentGolfers / GOAL_GOLFERS) * 100, 100).toFixed(2);
  const pctGMV = Math.min((currentGMV / GOAL_GMV) * 100, 100).toFixed(2);

  // Live Valuation estimate based on standard 8x Rev Multiple w/ 2% GMV take rate (Applies to Managed GMV only) + Data Asset Value
  const liveImpliedValuation = (managedGMV * 0.02 * 8) + (crawledAssetValue); 

  return (
    <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
          <div>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 800, margin: '0 0 0.5rem 0', color: 'var(--forest)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Target size={36} color="var(--gold-dark)"/> Project Titleist
            </h1>
            <p style={{ color: 'var(--mist)', margin: 0, fontSize: '0.95rem', fontWeight: 600 }}>Target: $30M Golf Genius / GolfNow Acquisition Trajectory</p>
          </div>
          
          <div style={{ background: 'var(--admin-gradient-gold)', padding: '1.25rem 2rem', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.4)', textAlign: 'right', boxShadow: 'var(--admin-glow-gold)' }}>
              <div style={{ color: 'rgba(0,0,0,0.6)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.2rem' }}>Live Implied Valuation</div>
              <div style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--forest)', letterSpacing: '-1px' }}>
                 ${liveImpliedValuation.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </div>
          </div>
        </div>

        {/* CORE METRIC GAUGES (Glassmorphism Core) */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '3rem' }}>
            
            {/* GMV Metric */}
            <div style={{ background: 'var(--white)', border: '1px solid rgba(0,0,0,0.05)', borderRadius: '12px', padding: '1.75rem', position: 'relative', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <div style={{ color: 'var(--mist)', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>Platform GMV</div>
                    <BarChart3 size={20} color="var(--gold-dark)" />
                </div>
                <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--forest)', marginBottom: '0.5rem' }}>
                    ${(currentGMV/1000000).toFixed(2)}M
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#666', fontSize: '0.8rem', marginBottom: '0.75rem', fontWeight: 600 }}>
                    <span>Target: ${(GOAL_GMV/1000000).toFixed(0)}M</span>
                    <span>{pctGMV}%</span>
                </div>
                <div style={{ width: '100%', background: 'rgba(0,0,0,0.05)', height: '8px', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: `${pctGMV}%`, background: 'var(--gold-dark)', height: '100%', borderRadius: '4px' }}></div>
                </div>
            </div>

            {/* Network Events */}
            <div style={{ background: 'var(--white)', border: '1px solid rgba(0,0,0,0.05)', borderRadius: '12px', padding: '1.75rem', position: 'relative', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <div style={{ color: 'var(--mist)', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>Network Events</div>
                    <Database size={20} color="var(--grass)" />
                </div>
                <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--forest)', marginBottom: '0.5rem' }}>
                    {currentTournaments.toLocaleString()}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#666', fontSize: '0.8rem', marginBottom: '0.75rem', fontWeight: 600 }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ color: 'var(--grass)' }}>{managedTournaments.toLocaleString()} active</span> | 
                        <span style={{ opacity: 0.6 }}>{crawledTournaments.toLocaleString()} indexed</span>
                    </span>
                    <span>{pctTournaments}%</span>
                </div>
                <div style={{ width: '100%', background: 'rgba(0,0,0,0.05)', height: '8px', borderRadius: '4px', overflow: 'hidden', display: 'flex' }}>
                    {/* The green bar represents fully managed/active tournaments */}
                    <div style={{ width: `${pctManaged}%`, background: 'var(--grass)', height: '100%', borderRight: managedTournaments > 0 ? '1px solid rgba(255,255,255,0.5)' : 'none' }}></div>
                    {/* The muted bar represents crawled/indexed volume */}
                    <div style={{ width: `${pctCrawled}%`, background: 'var(--emerald)', height: '100%' }}></div>
                </div>
            </div>

            {/* Unique Golfers */}
            <div style={{ background: 'var(--white)', border: '1px solid rgba(0,0,0,0.05)', borderRadius: '12px', padding: '1.75rem', position: 'relative', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <div style={{ color: 'var(--mist)', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>Unique Golfers</div>
                    <Users size={20} color="var(--primary)" />
                </div>
                <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--forest)', marginBottom: '0.5rem' }}>
                    {currentGolfers.toLocaleString()}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#666', fontSize: '0.8rem', marginBottom: '0.75rem', fontWeight: 600 }}>
                    <span>Target: {GOAL_GOLFERS.toLocaleString()}</span>
                    <span>{pctGolfers}%</span>
                </div>
                <div style={{ width: '100%', background: 'rgba(0,0,0,0.05)', height: '8px', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: `${pctGolfers}%`, background: 'var(--primary)', height: '100%', borderRadius: '4px' }}></div>
                </div>
            </div>
        </div>

        {/* Global Strategy Heatmap */}
        <div style={{ background: 'var(--white)', border: '1px solid rgba(0,0,0,0.05)', borderRadius: '12px', padding: '2.5rem', boxShadow: 'var(--shadow-md)' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, margin: '0 0 2rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--forest)' }}>
              <TrendingUp size={24} color="var(--gold-dark)" /> M&A Trigger Tiers
            </h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
               <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', padding: '1.5rem', border: '1px dashed rgba(0,0,0,0.1)', borderRadius: '12px', background: 'var(--admin-golf-white)' }}>
                  <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem' }}>🇺🇸</div>
                  <div style={{ flex: 1 }}>
                     <h3 style={{ margin: '0 0 0.25rem 0', color: 'var(--mist)', fontSize: '1.1rem', fontWeight: 700 }}>Phase 1: U.S. Beachhead</h3>
                     <p style={{ margin: 0, color: '#666', fontSize: '0.9rem', lineHeight: 1.6 }}>Establish monopoly in 3 prime DMAs (e.g., Scottsdale, Dallas, Orlando) to prove organic repeatability before marketing spend scaling. Required metric: 1,000 U.S. Tournaments.</p>
                  </div>
                  <div><span style={{ padding: '0.5rem 1rem', background: 'rgba(0,0,0,0.05)', color: 'var(--mist)', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 700 }}>IN PROGRESS</span></div>
               </div>

               <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', padding: '1.5rem', border: '1px solid rgba(200, 150, 50, 0.3)', borderRadius: '12px', background: 'linear-gradient(90deg, rgba(230, 194, 122, 0.1) 0%, rgba(255,255,255,0) 100%)', boxShadow: '0 4px 12px rgba(200, 150, 50, 0.1)' }}>
                  <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--white)', border: '2px solid var(--gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', boxShadow: 'var(--shadow-sm)' }}>🌎</div>
                  <div style={{ flex: 1 }}>
                     <h3 style={{ margin: '0 0 0.25rem 0', color: 'var(--gold-dark)', fontSize: '1.15rem', fontWeight: 800 }}>Phase 2: Global Scalability (The M&A Trigger)</h3>
                     <p style={{ margin: 0, color: 'var(--forest)', fontSize: '0.9rem', lineHeight: 1.6, fontWeight: 500 }}>Expand natively into Canada & Mexico via Stripe Cross-Border currency aggregation. Add complex multi-round play once our charity ecosystem absorbs all OPEX.</p>
                  </div>
                  <div><span style={{ padding: '0.6rem 1.25rem', background: 'var(--gold-foil)', color: 'var(--ink)', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 800, boxShadow: 'var(--metallic-shadow)' }}>M&A THRESHOLD</span></div>
               </div>
            </div>
        </div>
    </div>
  );
}
