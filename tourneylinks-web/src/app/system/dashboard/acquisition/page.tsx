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
      charityCount: sql<number>`sum(case when is_charity = true then 1 else 0 end)`
  }).from(tournaments);
  
  const [userStats] = await db.select({ 
      total: sql<number>`count(*)`
  }).from(users);

  // Derive Current Run Rate (For the sake of the dashboard, calculate average transaction values)
  const currentTournaments = parseInt(tourneyStats?.total?.toString() || '0');
  const currentGolfers = parseInt(userStats?.total?.toString() || '0');
  // Assume a conservative average of $25k processed GMV per tournament indexed
  const currentGMV = currentTournaments * 25000; 

  // Calculate Progression Percentages
  const pctTournaments = Math.min((currentTournaments / GOAL_TOURNAMENTS) * 100, 100).toFixed(2);
  const pctGolfers = Math.min((currentGolfers / GOAL_GOLFERS) * 100, 100).toFixed(2);
  const pctGMV = Math.min((currentGMV / GOAL_GMV) * 100, 100).toFixed(2);

  // Live Valuation estimate based on standard 8x Rev Multiple w/ 2% GMV take rate
  const liveImpliedValuation = currentGMV * 0.02 * 8; 

  return (
    <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
          <div>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 800, margin: '0 0 0.5rem 0', color: 'var(--gold)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Target size={36} color="var(--gold)"/> Project Titleist
            </h1>
            <p style={{ color: '#888', margin: 0, fontSize: '0.95rem' }}>Target: $30M Golf Genius / GolfNow Acquisition Trajectory</p>
          </div>
          
          <div style={{ background: 'rgba(212, 175, 55, 0.1)', padding: '1rem 1.75rem', borderRadius: '12px', border: '1px solid rgba(212, 175, 55, 0.2)', textAlign: 'right' }}>
              <div style={{ color: 'var(--gold)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.2rem' }}>Live Implied Valuation</div>
              <div style={{ fontSize: '2.2rem', fontWeight: 900, color: '#fff', letterSpacing: '-1px' }}>
                 ${liveImpliedValuation.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </div>
          </div>
        </div>

        {/* CORE METRIC GAUGES */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '3rem' }}>
            
            {/* Metric 1 */}
            <div style={{ background: '#111', border: '1px solid #222', borderRadius: '12px', padding: '1.75rem', position: 'relative', overflow: 'hidden' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <div style={{ color: '#888', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>Platform GMV</div>
                    <BarChart3 size={20} color="var(--gold)" />
                </div>
                <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#fff', marginBottom: '0.5rem' }}>
                    ${(currentGMV/1000000).toFixed(2)}M
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#666', fontSize: '0.8rem', marginBottom: '0.75rem', fontWeight: 500 }}>
                    <span>Target: ${(GOAL_GMV/1000000).toFixed(0)}M</span>
                    <span>{pctGMV}%</span>
                </div>
                <div style={{ width: '100%', background: '#222', height: '6px', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: `${pctGMV}%`, background: 'var(--gold)', height: '100%', borderRadius: '4px' }}></div>
                </div>
            </div>

            {/* Metric 2 */}
            <div style={{ background: '#111', border: '1px solid #222', borderRadius: '12px', padding: '1.75rem', position: 'relative', overflow: 'hidden' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <div style={{ color: '#888', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>Network Events</div>
                    <Database size={20} color="#4CAF50" />
                </div>
                <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#fff', marginBottom: '0.5rem' }}>
                    {currentTournaments.toLocaleString()}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#666', fontSize: '0.8rem', marginBottom: '0.75rem', fontWeight: 500 }}>
                    <span>Target: {GOAL_TOURNAMENTS.toLocaleString()}</span>
                    <span>{pctTournaments}%</span>
                </div>
                <div style={{ width: '100%', background: '#222', height: '6px', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: `${pctTournaments}%`, background: '#4CAF50', height: '100%', borderRadius: '4px' }}></div>
                </div>
            </div>

            {/* Metric 3 */}
            <div style={{ background: '#111', border: '1px solid #222', borderRadius: '12px', padding: '1.75rem', position: 'relative', overflow: 'hidden' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <div style={{ color: '#888', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>Unique Golfers</div>
                    <Users size={20} color="#2196F3" />
                </div>
                <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#fff', marginBottom: '0.5rem' }}>
                    {currentGolfers.toLocaleString()}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#666', fontSize: '0.8rem', marginBottom: '0.75rem', fontWeight: 500 }}>
                    <span>Target: {GOAL_GOLFERS.toLocaleString()}</span>
                    <span>{pctGolfers}%</span>
                </div>
                <div style={{ width: '100%', background: '#222', height: '6px', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: `${pctGolfers}%`, background: '#2196F3', height: '100%', borderRadius: '4px' }}></div>
                </div>
            </div>
        </div>

        {/* Global Strategy Heatmap */}
        <div style={{ background: '#111', border: '1px solid #222', borderRadius: '12px', padding: '2rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, margin: '0 0 1.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <TrendingUp size={24} color="var(--gold)" /> M&A Trigger Tiers
            </h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
               <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', padding: '1.5rem', border: '1px dashed #333', borderRadius: '8px', opacity: 0.5 }}>
                  <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#222', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>🇺🇸</div>
                  <div style={{ flex: 1 }}>
                     <h3 style={{ margin: '0 0 0.25rem 0', color: '#fff', fontSize: '1.1rem' }}>Phase 1: U.S. Beachhead</h3>
                     <p style={{ margin: 0, color: '#888', fontSize: '0.85rem', lineHeight: 1.5 }}>Establish monopoly in 3 prime DMAs (e.g., Scottsdale, Dallas, Orlando) to prove organic repeatability before marketing spend scaling. Required metric: 1,000 U.S. Tournaments.</p>
                  </div>
                  <div><span style={{ padding: '0.4rem 0.8rem', background: 'rgba(255,255,255,0.05)', color: '#888', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 600 }}>IN PROGRESS</span></div>
               </div>

               <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', padding: '1.5rem', border: '1px solid rgba(212, 175, 55, 0.2)', borderRadius: '8px', background: 'linear-gradient(90deg, rgba(212, 175, 55, 0.05) 0%, rgba(0,0,0,0) 100%)' }}>
                  <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#000', border: '2px solid var(--gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>🌎</div>
                  <div style={{ flex: 1 }}>
                     <h3 style={{ margin: '0 0 0.25rem 0', color: 'var(--gold)', fontSize: '1.1rem' }}>Phase 2: Global Scalability (The M&A Trigger)</h3>
                     <p style={{ margin: 0, color: '#bbb', fontSize: '0.85rem', lineHeight: 1.5 }}>Expand natively into Canada & Mexico via Stripe Cross-Border currency aggregation. Add complex multi-round play once our charity ecosystem absorbs all OPEX.</p>
                  </div>
                  <div><span style={{ padding: '0.4rem 0.8rem', background: 'var(--gold)', color: '#000', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 800 }}>M&A THRESHOLD</span></div>
               </div>
            </div>
        </div>
    </div>
  );
}
