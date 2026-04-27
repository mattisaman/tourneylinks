import React, { Suspense } from 'react';
import Link from 'next/link';
import { db, tournaments } from '@/lib/db';
import { desc, sql, and, gte, isNotNull, eq } from 'drizzle-orm';
import AnalyticsFilters from '@/components/system/AnalyticsFilters';
import AnalyticsTable from '@/components/system/AnalyticsTable';
import { ArrowLeft } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AnalyticsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const state = typeof searchParams.state === 'string' ? searchParams.state : undefined;
  const format = typeof searchParams.format === 'string' ? searchParams.format : undefined;
  const year = typeof searchParams.year === 'string' ? searchParams.year : undefined;
  const month = typeof searchParams.month === 'string' ? searchParams.month : undefined;

  // Build the dynamic WHERE clause based on filters
  const conditions = [];

  // Exclude bad dates or incredibly old data (keep 2023 onwards as requested)
  conditions.push(isNotNull(tournaments.dateStart));
  conditions.push(gte(tournaments.dateStart, '2023-01-01'));

  if (state) {
    conditions.push(eq(tournaments.courseState, state));
  }
  if (format) {
    conditions.push(eq(tournaments.format, format as any));
  }
  
  if (year || month) {
    // If we have date filters, we construct a pattern for SQL LIKE or exact matches.
    // Drizzle with raw SQL for date parts:
    if (year && month) {
      conditions.push(sql`${tournaments.dateStart} LIKE ${`${year}-${month}-%`}`);
    } else if (year) {
      conditions.push(sql`${tournaments.dateStart} LIKE ${`${year}-%`}`);
    } else if (month) {
      conditions.push(sql`${tournaments.dateStart} LIKE ${`%-${month}-%`}`);
    }
  }

  const baseWhere = and(...conditions);

  // Execute Dynamic Aggregations
  const stateAggregations = await db.select({
    state: tournaments.courseState,
    count: sql<number>`count(*)`
  })
  .from(tournaments)
  .where(and(baseWhere, isNotNull(tournaments.courseState), sql`length(${tournaments.courseState}) = 2`))
  .groupBy(tournaments.courseState)
  .orderBy(desc(sql`count(*)`))
  .limit(6);

  const formatAggregations = await db.select({
    format: tournaments.format,
    count: sql<number>`count(*)`
  })
  .from(tournaments)
  .where(and(baseWhere, isNotNull(tournaments.format)))
  .groupBy(tournaments.format)
  .orderBy(desc(sql`count(*)`))
  .limit(5);

  const avgFeeResult = await db.select({
    avgFee: sql<number>`avg(${tournaments.entryFee})`
  })
  .from(tournaments)
  .where(and(baseWhere, isNotNull(tournaments.entryFee), sql`${tournaments.entryFee} > 0`, sql`${tournaments.entryFee} < 5000`));
  
  const averageEntryFee = avgFeeResult[0]?.avgFee ? Math.round(Number(avgFeeResult[0].avgFee)) : 0;

  // Execute Raw Data Fetch
  const rawTournaments = await db.select({
    id: tournaments.id,
    name: tournaments.name,
    dateStart: tournaments.dateStart,
    courseCity: tournaments.courseCity,
    courseState: tournaments.courseState,
    format: tournaments.format,
    entryFee: tournaments.entryFee,
    formatDetails: tournaments.formatDetails
  })
  .from(tournaments)
  .where(baseWhere)
  .orderBy(desc(tournaments.dateStart))
  .limit(100);

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '3rem 2rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <Link href="/system/dashboard" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--mist)', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 600, marginBottom: '1.5rem' }}>
           <ArrowLeft size={16} /> Back to Network Operations
        </Link>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 700, margin: '0 0 0.5rem 0', color: 'var(--forest)' }}>Market Intelligence</h1>
        <p style={{ color: 'var(--mist)', margin: 0 }}>Filterable insights derived from the tournament database.</p>
      </div>

      <Suspense fallback={<div style={{ padding: '2rem', textAlign: 'center' }}>Loading filters...</div>}>
         <AnalyticsFilters />
      </Suspense>

      {/* Dynamic Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '3.5rem' }}>
        {/* State Volume */}
        <div style={{ background: 'var(--white)', border: '1px solid rgba(0,0,0,0.05)', borderRadius: '12px', padding: '1.5rem', boxShadow: 'var(--shadow-sm)' }}>
           <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--forest)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>📍 Top Regions by Volume</h3>
           <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
             {stateAggregations.length > 0 ? stateAggregations.map(s => (
               <div key={s.state} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0', borderBottom: '1px solid rgba(0,0,0,0.03)' }}>
                 <span style={{ fontWeight: 600, color: 'var(--ink)' }}>{s.state}</span>
                 <span style={{ background: 'rgba(76,175,80,0.1)', color: 'var(--grass)', padding: '0.2rem 0.6rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 700 }}>{s.count} events</span>
               </div>
             )) : <div style={{ color: 'var(--mist)', fontSize: '0.85rem', fontStyle: 'italic' }}>Insufficient data</div>}
           </div>
        </div>

        {/* Format Popularity */}
        <div style={{ background: 'var(--white)', border: '1px solid rgba(0,0,0,0.05)', borderRadius: '12px', padding: '1.5rem', boxShadow: 'var(--shadow-sm)' }}>
           <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--forest)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>⛳ Most Popular Formats</h3>
           <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
             {formatAggregations.length > 0 ? formatAggregations.map(f => (
               <div key={f.format} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0', borderBottom: '1px solid rgba(0,0,0,0.03)' }}>
                 <span style={{ fontWeight: 600, color: 'var(--ink)', textTransform: 'capitalize' }}>{f.format || 'Unknown'}</span>
                 <span style={{ background: 'rgba(212,175,55,0.1)', color: 'var(--gold-dark)', padding: '0.2rem 0.6rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 700 }}>{f.count} events</span>
               </div>
             )) : <div style={{ color: 'var(--mist)', fontSize: '0.85rem', fontStyle: 'italic' }}>Insufficient data</div>}
           </div>
        </div>

        {/* Financial Averages */}
        <div style={{ background: 'var(--white)', border: '1px solid rgba(0,0,0,0.05)', borderRadius: '12px', padding: '1.5rem', boxShadow: 'var(--shadow-sm)', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
           <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--forest)', marginBottom: '1rem', width: '100%' }}>💰 Average Market Pricing</h3>
           <div style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--emerald)', lineHeight: 1 }}>${averageEntryFee}</div>
           <div style={{ color: 'var(--mist)', fontSize: '0.85rem', fontWeight: 500, marginTop: '0.5rem' }}>Average Entry Fee per Player</div>
           <div style={{ width: '100%', marginTop: '1.5rem', padding: '0.8rem', background: 'rgba(0,0,0,0.02)', borderRadius: '8px', fontSize: '0.8rem', color: 'var(--mist)', fontWeight: 600 }}>
             Use this to guide sponsors and hosts on competitive pricing.
           </div>
        </div>
      </div>

      <div style={{ marginBottom: '1rem' }}>
         <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--forest)' }}>Raw Extracted Data</h2>
      </div>

      <AnalyticsTable tournaments={rawTournaments} />
    </div>
  );
}
