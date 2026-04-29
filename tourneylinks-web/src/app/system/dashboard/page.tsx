import React from 'react';
import { db, crawlLogs, tournaments } from '@/lib/db';
import { desc, sql, inArray } from 'drizzle-orm';
import SpiderDispatcher from '@/components/system/SpiderDispatcher';
import { Server, Activity, Database, Zap } from 'lucide-react';
import CheckbackTrigger from './CheckbackTrigger';
import CrawlerTrigger from './CrawlerTrigger';
import ApifySyncTrigger from './ApifySyncTrigger';
import PlatformSearchTrigger from './PlatformSearchTrigger';
import SmartSpiderTrigger from '@/components/dashboard/SmartSpiderTrigger';
import { courses } from '@/lib/db';
import { and, isNotNull, or, isNull, lt } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

export default async function NOCDashboard() {
  
  // Quick Reference Global Stats
  const results = await Promise.all([
    db.select({ count: sql<number>`count(*)` }).from(tournaments),
    db.select({ count: sql<number>`count(*)` }).from(tournaments).where(sql`${tournaments.isActive} = true`),
    db.select({ count: sql<number>`count(*)` }).from(crawlLogs),
    db.select({ count: sql<number>`count(*)` }).from(crawlLogs).where(sql`${crawlLogs.status} = 'success'`),
    db.select({ count: sql<number>`count(*)` }).from(tournaments).where(sql`${tournaments.source} = 'eventbrite-apify'`),
    db.select({ count: sql<number>`count(*)` }).from(tournaments).where(sql`${tournaments.source} LIKE '%facebook%'`),
    db.select({ count: sql<number>`count(*)` }).from(tournaments).where(sql`${tournaments.extractedAt} IS NULL`),
    db.select({ count: sql<number>`count(*)` }).from(courses).where(
      and(
        isNotNull(courses.website),
        or(
          isNull(courses.lastCrawledAt),
          lt(courses.lastCrawledAt, new Date(Date.now() - 7 * 24 * 60 * 60 * 1000))
        )
      )
    )
  ]);

  const totalTournaments = Number(results[0][0].count);
  const activeTournaments = Number(results[1][0].count);
  const totalCrawls = Number(results[2][0].count);
  const successfulCrawls = Number(results[3][0].count);
  const eventbriteCount = Number(results[4][0].count);
  const fbCount = Number(results[5][0].count);
  const pendingCheckbacks = Number(results[6][0].count);
  const eligibleCoursesCount = Number(results[7][0].count);
  const successRate = totalCrawls > 0 ? Math.round((successfulCrawls / totalCrawls) * 100) : 0;
  
  // Cost Estimate (Extremely rough: $0.003 per page for Gemini Flash + Search/Scrape overhead)
  const estCost = (totalCrawls * 0.003).toFixed(2);

  // NOC Exclusive Metrics
  const recentLogs = await db.select().from(crawlLogs).orderBy(desc(crawlLogs.crawledAt)).limit(12);
  
  // Fetch the latest 4 globally discovered tournaments, regardless of source
  const recentTournaments = await db.select({
      id: tournaments.id,
      sourceUrl: tournaments.sourceUrl,
      source: tournaments.source,
      name: tournaments.name,
      dateStart: tournaments.dateStart,
      courseCity: tournaments.courseCity,
      courseState: tournaments.courseState,
      entryFee: tournaments.entryFee
  }).from(tournaments).orderBy(desc(tournaments.createdAt)).limit(4);

  const uniqueRecentTournaments = recentTournaments;

  // Check if crawler is actively running (if most recent log is within the last 60 seconds)
  const isActivelyRunning = recentLogs.length > 0 && 
      (new Date().getTime() - new Date(recentLogs[0].crawledAt || 0).getTime() < 60000);

  // Fetch tournaments specifically related to the telemetry logs
  const logUrls = recentLogs.map(l => l.url);
  let tournamentsFromLogs: typeof recentTournaments = [];
  if (logUrls.length > 0) {
    tournamentsFromLogs = await db.select({
      id: tournaments.id,
      sourceUrl: tournaments.sourceUrl,
      source: tournaments.source,
      name: tournaments.name,
      dateStart: tournaments.dateStart,
      courseCity: tournaments.courseCity,
      courseState: tournaments.courseState,
      entryFee: tournaments.entryFee
    }).from(tournaments).where(inArray(tournaments.sourceUrl, logUrls));
  }

  return (
    <div>
        <style dangerouslySetInnerHTML={{__html: `
          .lux-card { transition: transform 0.2s, box-shadow 0.2s; cursor: pointer; }
          .lux-card:hover { transform: translateY(-2px); box-shadow: var(--shadow-md) !important; }
          .tournament-link { transition: all 0.2s; text-decoration: none !important; }
          .tournament-link:hover { background: rgba(76, 175, 80, 0.15) !important; transform: translateX(4px); }
          .pulse-dot { animation: pulse 1.5s infinite; }
          @keyframes pulse { 0% { opacity: 1; transform: scale(1); } 50% { opacity: 0.5; transform: scale(1.2); } 100% { opacity: 1; transform: scale(1); } }
        `}} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div>
             <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
               <h1 style={{ fontSize: '2.5rem', fontWeight: 700, margin: 0, color: 'var(--forest)' }}>NY State Geo-Dispatcher</h1>
               <span style={{ background: '#E0E7FF', color: '#4338CA', padding: '0.2rem 0.6rem', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 600 }}>EXPERIMENTAL</span>
             </div>
             <p style={{ color: 'var(--mist)', margin: 0 }}>Execute targeted geographic sweeps across multiple data sources.</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
            <CrawlerTrigger pendingCount={eligibleCoursesCount} />
            <CheckbackTrigger pendingCount={pendingCheckbacks} />
          </div>
        </div>

        {/* Geographic Sweep Sequence */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(3, 1fr)', 
          gap: '1.5rem', 
          marginBottom: '3rem',
          background: 'var(--sand)',
          padding: '1.5rem',
          borderRadius: '16px',
          border: '1px solid rgba(0,0,0,0.05)'
        }}>
          <ApifySyncTrigger />
          <PlatformSearchTrigger />
          <SmartSpiderTrigger />
        </div>

        {/* System Health Indicators */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '3rem' }}>
          <HealthCard title="Upstash QStash" status="Nominal" icon={<Server color="var(--grass)" />} color="var(--grass)" />
          <HealthCard title="Engine 1: Native" status={isActivelyRunning ? "Processing Payload" : "Standby"} icon={<Activity color={isActivelyRunning ? "var(--emerald)" : "var(--mist)"} />} color={isActivelyRunning ? "var(--emerald)" : "var(--mist)"} isPulsing={isActivelyRunning} />
          <HealthCard title="Engine 2: FireCrawl" status="Standby" icon={<Zap color="var(--gold-dark)" />} color="var(--gold-dark)" />
          <HealthCard title="Neon DB Ingestion" status="Synchronized" icon={<Database color="var(--forest)" />} color="var(--forest)" />
        </div>

        {/* Apify External Link */}
        <div className="lux-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem', background: 'var(--white)', border: '1px solid rgba(0,0,0,0.05)', borderRadius: '12px' }}>
           <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--forest)', marginBottom: '0.25rem' }}>External Scraping Engine</h3>
              <p style={{ color: 'var(--mist)', fontSize: '0.9rem', margin: 0 }}>Configure and launch new webhook payloads from Apify.</p>
           </div>
           <a href="https://console.apify.com" target="_blank" rel="noopener noreferrer" className="btn-hero" style={{ padding: '0.8rem 1.5rem', fontSize: '0.9rem' }}>
              Open Apify Console ↗
           </a>
        </div>

        {/* Quick Reference Dashboard */}
        <div style={{ marginTop: '3.5rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--forest)', marginBottom: '1.25rem' }}>Global Ingestion Metrics</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '1rem' }}>
             <QuickStatCard title="Total Discoveries" value={totalTournaments.toString()} label="Tournaments Extracted to Database" color="var(--emerald)" />
             <QuickStatCard title="Facebook Events" value={fbCount.toString()} label="Native Social Graph Ingest" color="#1877F2" />
             <QuickStatCard title="Eventbrite Events" value={eventbriteCount.toString()} label="Universal Parser Integration" color="#F05537" />
             <QuickStatCard title="Est. Pipeline Cost" value={`$${estCost}`} label="Lifetime Accumulated Overhead" color="var(--gold-dark)" />
          </div>
        </div>



        {/* New Feature: Recently Discovered Tournaments Highlight */}
        {uniqueRecentTournaments.length > 0 && (
          <div style={{ marginTop: '3.5rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--forest)', marginBottom: '1.25rem' }}>Recently Extracted Listings</h2>
            <p style={{ color: 'var(--mist)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>These events were successfully pulled from the latest payloads and are live on the directory.</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
              {uniqueRecentTournaments.map((t, idx) => {
                const isFb = t.source.includes('facebook');
                const isEb = t.source.includes('eventbrite');
                const sourceColor = isFb ? '#1877F2' : isEb ? '#F05537' : 'var(--emerald)';
                const sourceLabel = isFb ? 'Facebook' : isEb ? 'Eventbrite' : 'Native Scraper';

                return (
                <a href={`/tournaments/${t.id}`} target="_blank" rel="noopener noreferrer" key={idx} className="lux-card" style={{ display: 'block', background: 'var(--white)', border: '1px solid rgba(0, 0, 0, 0.05)', padding: '1.25rem', borderRadius: '12px', textDecoration: 'none' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                    <div style={{ fontSize: '0.7rem', fontWeight: 700, color: sourceColor, textTransform: 'uppercase', letterSpacing: '0.5px', display: 'flex', alignItems: 'center', gap: '4px', background: `${sourceColor}15`, padding: '4px 8px', borderRadius: '12px' }}>
                      {sourceLabel}
                    </div>
                    <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--mist)' }}>
                      {t.entryFee ? `$${t.entryFee}` : 'TBD'}
                    </div>
                  </div>
                  <div style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--forest)', lineHeight: 1.3, marginBottom: '0.75rem', height: '2.6rem', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                    {t.name}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--mist)', fontWeight: 500, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ color: 'var(--forest)' }}>📍</span> {t.courseCity}, {t.courseState}
                    </div>
                    <span>{t.dateStart ? new Date(t.dateStart).toLocaleDateString() : 'TBD'}</span>
                  </div>
                </a>
              )})}
            </div>
          </div>
        )}

        {/* Live Server Logs (Glassmorphism List) */}
        <div style={{ marginTop: '3.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
             <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--forest)' }}>Clubhouse Crawler Telemetry</h2>
             <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: isActivelyRunning ? 'var(--emerald)' : 'var(--mist)', background: isActivelyRunning ? 'rgba(76, 175, 80, 0.1)' : 'rgba(0,0,0,0.05)', padding: '0.4rem 0.8rem', borderRadius: '20px', fontWeight: 700 }}>
               <div className={isActivelyRunning ? 'pulse-dot' : ''} style={{ width: '8px', height: '8px', background: isActivelyRunning ? 'var(--emerald)' : 'var(--mist)', borderRadius: '50%' }}></div>
               {isActivelyRunning ? 'Live Feed Active' : 'Standby Mode'}
             </div>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
             <div style={{ display: 'flex', padding: '1rem 1.5rem', borderBottom: '1px solid rgba(0,0,0,0.05)', color: 'var(--mist)', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                <div style={{ flex: 1 }}>Timestamp</div>
                <div style={{ flex: 1 }}>Source Pipeline</div>
                <div style={{ flex: 2.5 }}>Discovered Source & Content</div>
                <div style={{ flex: 1, textAlign: 'right' }}>Extraction Result</div>
             </div>

            {recentLogs.map(log => {
               // Find all unique tournament names extracted from this specific URL, mapped to their ID
               const pulledTournamentsMap = new Map();
               tournamentsFromLogs.filter(t => t.sourceUrl === log.url).forEach(t => {
                  pulledTournamentsMap.set(t.name, t);
               });
               const pulledTournaments = Array.from(pulledTournamentsMap.values());

               return (
               <div key={log.id} className="lux-card" style={{ display: 'flex', alignItems: 'flex-start', background: 'var(--white)', border: '1px solid rgba(0,0,0,0.05)', padding: '1.25rem 1.5rem', borderRadius: '8px', boxShadow: 'var(--shadow-sm)' }}>
                 <div style={{ flex: 1, color: 'var(--mist)', fontSize: '0.9rem', paddingTop: '4px' }}>
                    {new Date(log.crawledAt || '').toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                 </div>
                 <div style={{ flex: 1, paddingTop: '4px' }}>
                    <div style={{ color: 'var(--forest)', fontWeight: 600, fontSize: '0.85rem', textTransform: 'uppercase' }}>{log.sourceId || 'Spider'}</div>
                    <div style={{ fontFamily: 'monospace', color: 'var(--mist)', fontSize: '0.75rem', marginTop: '4px' }}>{log.cycleId.substring(0,8)}</div>
                 </div>
                 <div style={{ flex: 2.5, paddingRight: '1rem' }}>
                    <div style={{ color: 'var(--forest)', fontWeight: 500, wordBreak: 'break-all', fontSize: '0.85rem' }}>
                       {log.url.startsWith('apify://') ? 
                          `[BATCH IMPORT] Social Events — Yield: ${log.tournamentsFound} unique new tournaments saved. (Source: Apify)` : 
                          (log.searchVector || log.url)}
                    </div>
                    {(() => {
                       let detailsObj = null;
                       if (log.details) {
                         try {
                           detailsObj = JSON.parse(log.details);
                         } catch (e) {}
                       }
                       
                       const hasPulledUrlTournaments = pulledTournaments.length > 0;
                       
                       return (
                         <div style={{ marginTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.4rem', alignItems: 'flex-start' }}>
                           {/* Render individual extracted links if it was a single URL crawl */}
                           {hasPulledUrlTournaments && pulledTournaments.map((t, idx) => (
                              <a href={`/tournaments/${t.id}`} target="_blank" rel="noopener noreferrer" key={idx} className="tournament-link" style={{ fontSize: '0.8rem', color: 'var(--grass)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(76, 175, 80, 0.05)', padding: '4px 10px', borderRadius: '6px', border: '1px solid rgba(76, 175, 80, 0.15)' }}>
                                 <span style={{ fontSize: '10px' }}>↳</span> {t.name} <span style={{ fontSize: '12px' }}>↗</span>
                              </a>
                           ))}
                           
                           {/* Render detailed batch breakdown if details JSON exists */}
                           {detailsObj && (
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', marginTop: '0.25rem' }}>
                                {detailsObj.duplicatesSkipped > 0 && (
                                   <div style={{ fontSize: '0.75rem', color: 'var(--mist)', fontWeight: 500 }}>
                                     <span style={{ color: 'var(--admin-pin-red)', fontWeight: 700 }}>{detailsObj.duplicatesSkipped}</span> Duplicates Skipped
                                   </div>
                                )}
                                {detailsObj.titlesFound && detailsObj.titlesFound.length > 0 && (
                                   <div style={{ fontSize: '0.75rem', color: 'var(--forest)', fontWeight: 500, marginTop: '4px' }}>
                                     <strong style={{ color: 'var(--grass)' }}>New Imports:</strong> {detailsObj.titlesFound.join(', ')}
                                   </div>
                                )}
                              </div>
                           )}
                         </div>
                       );
                    })()}
                 </div>
                 <div style={{ flex: 1, textAlign: 'right', paddingTop: '4px' }}>
                   <span style={{ 
                     background: log.status === 'success' ? 'rgba(76,175,80,0.1)' : log.status === 'skipped' ? 'rgba(150,150,150,0.1)' : 'rgba(244,67,54,0.1)', 
                     color: log.status === 'success' ? 'var(--grass)' : log.status === 'skipped' ? 'var(--mist)' : 'var(--admin-pin-red)',
                     padding: '0.4rem 0.8rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 800
                   }}>
                     {log.status === 'success' ? `FETCHED ${log.tournamentsFound}` : log.status === 'skipped' ? 'SKIPPED (IRRELEVANT)' : 'FAILED'}
                   </span>
                   <div style={{ color: 'var(--mist)', fontSize: '0.75rem', marginTop: '8px', fontWeight: 600 }}>{log.durationMs || 0}ms</div>
                   {log.error && <div style={{ fontSize: '0.75rem', color: 'var(--admin-pin-red)', marginTop: '6px', fontWeight: 500 }}>{log.error}</div>}
                 </div>
               </div>
            )})}
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

function HealthCard({ title, status, icon, color, isPulsing = false }: { title: string, status: string, icon: React.ReactNode, color: string, isPulsing?: boolean }) {
  return (
    <div style={{ background: 'var(--white)', border: '1px solid rgba(0,0,0,0.05)', borderRadius: '12px', padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem', boxShadow: 'var(--shadow-sm)' }}>
      <div style={{ background: `color-mix(in srgb, ${color} 15%, transparent)`, padding: '0.85rem', borderRadius: '10px' }}>
         {icon}
      </div>
      <div>
        <div style={{ color: 'var(--mist)', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{title}</div>
        <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--forest)', display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.25rem' }}>
          <div className={isPulsing ? 'pulse-dot' : ''} style={{ width: '8px', height: '8px', borderRadius: '50%', background: color, boxShadow: `0 0 8px ${color}` }}></div>
          {status}
        </div>
      </div>
    </div>
  );
}

function QuickStatCard({ title, value, label, color }: { title: string, value: string, label: string, color: string }) {
  return (
    <div style={{ background: 'var(--white)', border: '1px solid rgba(0,0,0,0.05)', borderRadius: '12px', padding: '1.5rem', boxShadow: 'var(--shadow-sm)' }}>
       <div style={{ color: 'var(--mist)', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.5rem' }}>{title}</div>
       <div style={{ fontSize: '2.5rem', fontWeight: 800, color: color, lineHeight: 1.1 }}>{value}</div>
       <div style={{ color: 'var(--mist)', fontSize: '0.85rem', fontWeight: 500, marginTop: '0.5rem' }}>{label}</div>
    </div>
  );
}
