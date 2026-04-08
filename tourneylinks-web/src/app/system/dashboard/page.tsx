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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div>
             <h1 style={{ fontSize: '2.5rem', fontWeight: 700, margin: '0 0 0.5rem 0', color: '#fff' }}>Network Operations</h1>
             <p style={{ color: '#888', margin: 0 }}>Global Spider Engine Telemetry Hub</p>
          </div>
        </div>

        {/* System Health Indicators */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '3rem' }}>
          <HealthCard title="Upstash QStash" status="Nominal" icon={<Server color="#4CAF50" />} color="#4CAF50" />
          <HealthCard title="Engine 1: Native" status="Active" icon={<Activity color="#2196F3" />} color="#2196F3" />
          <HealthCard title="Engine 2: FireCrawl" status="Standby" icon={<Zap color="var(--gold)" />} color="var(--gold)" />
          <HealthCard title="Neon DB Ingestion" status="Synchronized" icon={<Database color="#9C27B0" />} color="#9C27B0" />
        </div>

        {/* Global Dispatch Terminal */}
        <SpiderDispatcher />

        {/* Live Server Logs */}
        <div style={{ marginTop: '3rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
             <h2 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Autonomous Fleet Telemetry</h2>
             <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#4CAF50', background: 'rgba(76, 175, 80, 0.1)', padding: '0.4rem 0.8rem', borderRadius: '20px' }}>
               <div style={{ width: '8px', height: '8px', background: '#4CAF50', borderRadius: '50%' }}></div>
               Live Feed
             </div>
          </div>
          
          <div style={{ background: '#111', border: '1px solid #222', borderRadius: '12px', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ background: '#1a1a1a', borderBottom: '1px solid #333' }}>
                  <th style={{ padding: '1rem', color: '#888', fontWeight: 500 }}>TIMESTAMP</th>
                  <th style={{ padding: '1rem', color: '#888', fontWeight: 500 }}>WORKER ID</th>
                  <th style={{ padding: '1rem', color: '#888', fontWeight: 500 }}>TARGET STATE</th>
                  <th style={{ padding: '1rem', color: '#888', fontWeight: 500 }}>PERFORMANCE</th>
                  <th style={{ padding: '1rem', color: '#888', fontWeight: 500 }}>STATUS</th>
                </tr>
              </thead>
              <tbody>
                {recentLogs.map(log => (
                  <tr key={log.id} style={{ borderBottom: '1px solid #222' }}>
                    <td style={{ padding: '1rem', color: '#ccc' }}>{new Date(log.crawledAt || '').toLocaleString()}</td>
                    <td style={{ padding: '1rem', fontFamily: 'monospace', color: '#666' }}>{log.cycleId.substring(0,12)}...</td>
                    <td style={{ padding: '1rem', color: '#ccc' }}>{log.searchVector || log.url}</td>
                    <td style={{ padding: '1rem', color: '#888', fontSize: '0.85rem' }}>
                      <div>{log.durationMs || 0}ms</div>
                      {log.fireCrawlCreditsUsed ? <div style={{ color: 'var(--gold)', fontSize: '0.75rem', marginTop: '4px' }}>🔥 {log.fireCrawlCreditsUsed} Credits</div> : null}
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <span style={{ 
                        background: log.status === 'SUCCESS' ? 'rgba(76,175,80,0.1)' : 'rgba(244,67,54,0.1)', 
                        color: log.status === 'SUCCESS' ? '#4CAF50' : '#F44336',
                        padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600
                      }}>
                        {log.status === 'SUCCESS' ? `FETCHED ${log.tournamentsFound}` : 'FAILED'}
                      </span>
                      {log.error && <div style={{ fontSize: '0.7rem', color: '#f44336', marginTop: '4px', maxWidth: '150px' }}>{log.error}</div>}
                    </td>
                  </tr>
                ))}
                {recentLogs.length === 0 && (
                  <tr>
                    <td colSpan={5} style={{ padding: '2rem', textAlign: 'center', color: '#666' }}>No recent crawler activity found in logs.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

    </div>
  );
}

function HealthCard({ title, status, icon, color }: { title: string, status: string, icon: React.ReactNode, color: string }) {
  return (
    <div style={{ background: '#111', border: '1px solid #222', borderRadius: '12px', padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
      <div style={{ background: `color-mix(in srgb, ${color} 10%, transparent)`, padding: '0.75rem', borderRadius: '8px' }}>
         {icon}
      </div>
      <div>
        <div style={{ color: '#888', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{title}</div>
        <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.25rem' }}>
          <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: color }}></div>
          {status}
        </div>
      </div>
    </div>
  );
}
