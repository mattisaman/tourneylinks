import React from 'react';
import { db, tournaments } from '@/lib/db';
import { eq, desc } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export const dynamic = 'force-dynamic';

async function approveEvent(id: number) {
  'use server';
  await db.update(tournaments).set({ status: 'active' }).where(eq(tournaments.id, id));
  revalidatePath('/system/dashboard/duplicates');
}

async function archiveEvent(id: number) {
  'use server';
  await db.update(tournaments).set({ status: 'archived', isActive: false }).where(eq(tournaments.id, id));
  revalidatePath('/system/dashboard/duplicates');
}

export default async function DuplicatesPage() {
  const ambiguousEvents = await db.select().from(tournaments)
    .where(eq(tournaments.status, 'needs_review'))
    .orderBy(desc(tournaments.createdAt));

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 700, margin: 0, color: 'var(--forest)' }}>Duplicate Resolution</h1>
          <p style={{ color: 'var(--mist)', margin: 0 }}>Review ambiguous events that share a date and city but have different course names.</p>
        </div>
      </div>

      <div style={{ background: 'var(--white)', borderRadius: '16px', border: '1px solid rgba(0,0,0,0.05)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
        {ambiguousEvents.length === 0 ? (
          <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--mist)' }}>
            <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🎉</div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--forest)' }}>No ambiguous events to review!</h3>
            <p>Your pipeline is clean. Run an Apify Sync to ingest more data.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1.5fr', padding: '1rem 1.5rem', borderBottom: '1px solid rgba(0,0,0,0.05)', background: 'var(--cream)', color: 'var(--mist)', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              <div>Tournament Name</div>
              <div>Date</div>
              <div>City</div>
              <div>Course Extracted</div>
              <div style={{ textAlign: 'right' }}>Actions</div>
            </div>

            {ambiguousEvents.map(event => (
              <div key={event.id} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1.5fr', padding: '1.5rem', borderBottom: '1px solid rgba(0,0,0,0.05)', alignItems: 'center', transition: 'background 0.2s' }}>
                <div>
                  <a href={event.sourceUrl} target="_blank" rel="noopener noreferrer" style={{ fontWeight: 700, color: 'var(--forest)', textDecoration: 'none', fontSize: '1rem' }}>
                    {event.name} ↗
                  </a>
                  <div style={{ color: 'var(--mist)', fontSize: '0.8rem', marginTop: '4px' }}>Source: {event.source}</div>
                </div>
                
                <div style={{ fontWeight: 600, color: 'var(--ink)' }}>
                  {event.dateStart ? new Date(event.dateStart).toLocaleDateString() : 'TBD'}
                </div>
                
                <div style={{ color: 'var(--mist)', fontWeight: 500 }}>
                  {event.courseCity}, {event.courseState}
                </div>

                <div style={{ color: 'var(--admin-pin-red)', fontWeight: 600, fontSize: '0.9rem', padding: '4px 8px', background: 'rgba(244,67,54,0.05)', borderRadius: '6px', display: 'inline-block', width: 'fit-content' }}>
                  {event.courseName}
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                  <form action={approveEvent.bind(null, event.id)}>
                    <button type="submit" style={{ padding: '0.6rem 1rem', background: 'rgba(76, 175, 80, 0.1)', color: 'var(--grass)', border: 'none', borderRadius: '6px', fontWeight: 700, cursor: 'pointer', fontSize: '0.85rem', transition: 'all 0.2s' }}>
                      Approve as New
                    </button>
                  </form>
                  <form action={archiveEvent.bind(null, event.id)}>
                    <button type="submit" style={{ padding: '0.6rem 1rem', background: 'rgba(244,67,54,0.1)', color: 'var(--admin-pin-red)', border: 'none', borderRadius: '6px', fontWeight: 700, cursor: 'pointer', fontSize: '0.85rem', transition: 'all 0.2s' }}>
                      Reject (Duplicate)
                    </button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
