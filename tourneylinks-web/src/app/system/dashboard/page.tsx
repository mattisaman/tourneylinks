import React from 'react';
import { db, crawlLogs } from '@/lib/db';
import { desc } from 'drizzle-orm';
import SpiderDispatcher from '@/components/system/SpiderDispatcher';
import { Server, Activity, Database, Zap } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function NOCDashboard() {
  
  // NOC Exclusive Metrics
  const recentLogs = await db.select().from(crawlLogs).orderBy(desc(crawlLogs.crawledAt)).limit(8);

  return (
    <div>
        <style dangerouslySetInnerHTML={{__html: `
          .lux-card { transition: transform 0.2s, box-shadow 0.2s; cursor: pointer; }
          .lux-card:hover { transform: translateY(-2px); box-shadow: var(--shadow-md) !important; }
        `}} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div>
             <h1 style={{ fontSize: '2.5rem', fontWeight: 700, margin: '0 0 0.5rem 0', color: 'var(--forest)' }}>Network Operations</h1>
             <p style={{ color: 'var(--mist)', margin: 0 }}>Global Spider Engine Telemetry Hub</p>
          </div>
        </div>

        {/* System Health Indicators */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '3rem' }}>
          <HealthCard title="Upstash QStash" status="Nominal" icon={<Server color="var(--grass)" />} color="var(--grass)" />
          <HealthCard title="Engine 1: Native" status="Active" icon={<Activity color="var(--emerald)" />} color="var(--emerald)" />
          <HealthCard title="Engine 2: FireCrawl" status="Standby" icon={<Zap color="var(--gold-dark)" />} color="var(--gold-dark)" />
          <HealthCard title="Neon DB Ingestion" status="Synchronized" icon={<Database color="var(--forest)" />} color="var(--forest)" />
        </div>

        {/* Global Dispatch Terminal */}
        <div style={{ filter: 'drop-shadow(var(--shadow-md))' }}>
           <SpiderDispatcher />
        </div>

        {/* Live Server Logs (Glassmorphism List) */}
        <div style={{ marginTop: '3.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
             <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--forest)' }}>Autonomous Fleet Telemetry</h2>
             <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--grass)', background: 'rgba(76, 175, 80, 0.1)', padding: '0.4rem 0.8rem', borderRadius: '20px', fontWeight: 700 }}>
               <div style={{ width: '8px', height: '8px', background: 'var(--grass)', borderRadius: '50%' }}></div>
               Live Feed
             </div>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
             <div style={{ display: 'flex', padding: '1rem 1.5rem', borderBottom: '1px solid rgba(0,0,0,0.05)', color: 'var(--mist)', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                <div style={{ flex: 1 }}>Timestamp</div>
                <div style={{ flex: 1.5 }}>Worker ID</div>
                <div style={{ flex: 2 }}>Target State</div>
                <div style={{ flex: 1 }}>Performance</div>
                <div style={{ flex: 1, textAlign: 'right' }}>Status</div>
             </div>

            {recentLogs.map(log => (
               <div key={log.id} className="lux-card" style={{ display: 'flex', alignItems: 'center', background: 'var(--white)', border: '1px solid rgba(0,0,0,0.05)', padding: '1.25rem 1.5rem', borderRadius: '8px', boxShadow: 'var(--shadow-sm)' }}>
                 <div style={{ flex: 1, color: 'var(--mist)', fontSize: '0.9rem' }}>{new Date(log.crawledAt || '').toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</div>
                 <div style={{ flex: 1.5, fontFamily: 'monospace', color: 'var(--forest)', fontWeight: 600, fontSize: '0.95rem' }}>{log.cycleId.substring(0,12)}...</div>
                 <div style={{ flex: 2, color: 'var(--forest)', fontWeight: 500 }}>{log.searchVector || log.url}</div>
                 <div style={{ flex: 1, color: 'var(--mist)', fontSize: '0.85rem' }}>
                   <div style={{ fontWeight: 600 }}>{log.durationMs || 0}ms</div>
                   {log.fireCrawlCreditsUsed ? <div style={{ color: 'var(--gold-dark)', fontSize: '0.75rem', marginTop: '4px', fontWeight: 700 }}>🔥 {log.fireCrawlCreditsUsed} Credits</div> : null}
                 </div>
                 <div style={{ flex: 1, textAlign: 'right' }}>
                   <span style={{ 
                     background: log.status === 'SUCCESS' ? 'rgba(76,175,80,0.1)' : 'rgba(244,67,54,0.1)', 
                     color: log.status === 'SUCCESS' ? 'var(--grass)' : 'var(--admin-pin-red)',
                     padding: '0.4rem 0.8rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 800
                   }}>
                     {log.status === 'SUCCESS' ? `FETCHED ${log.tournamentsFound}` : 'FAILED'}
                   </span>
                   {log.error && <div style={{ fontSize: '0.75rem', color: 'var(--admin-pin-red)', marginTop: '6px', fontWeight: 500 }}>{log.error}</div>}
                 </div>
               </div>
            ))}
            {recentLogs.length === 0 && (
               <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--mist)', background: 'var(--white)', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.05)' }}>
                  No recent crawler activity found in logs.
               </div>
            )}
          </div>
        </div>

    </div>
  );
}

function HealthCard({ title, status, icon, color }: { title: string, status: string, icon: React.ReactNode, color: string }) {
  return (
    <div style={{ background: 'var(--white)', border: '1px solid rgba(0,0,0,0.05)', borderRadius: '12px', padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem', boxShadow: 'var(--shadow-sm)' }}>
      <div style={{ background: `color-mix(in srgb, ${color} 15%, transparent)`, padding: '0.85rem', borderRadius: '10px' }}>
         {icon}
      </div>
      <div>
        <div style={{ color: 'var(--mist)', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{title}</div>
        <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--forest)', display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.25rem' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: color, boxShadow: `0 0 8px ${color}` }}></div>
          {status}
        </div>
      </div>
    </div>
  );
}
