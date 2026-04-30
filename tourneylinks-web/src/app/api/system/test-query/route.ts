import { NextResponse } from 'next/server';
import { db, tournaments } from '@/lib/db';
import { sql } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

export async function GET() {
  const result = await db.select({ count: sql<number>`count(*)` }).from(tournaments).where(sql`${tournaments.extractedAt} IS NULL AND ${tournaments.status} = 'active'`);
  const total = await db.select({ count: sql<number>`count(*)` }).from(tournaments).where(sql`${tournaments.status} = 'active'`);
  return NextResponse.json({ 
    pending: result[0].count, 
    total: total[0].count,
    db_url: process.env.DATABASE_URL ? process.env.DATABASE_URL.substring(0, 30) : 'none'
  });
}
