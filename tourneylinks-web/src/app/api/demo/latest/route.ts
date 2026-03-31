import { NextResponse } from 'next/server';
import { db, tournaments } from '@/lib/db';
import { desc } from 'drizzle-orm';

export async function GET() {
  try {
     const latest = await db.select().from(tournaments).orderBy(desc(tournaments.id)).limit(1);
     if (latest.length > 0) {
        return NextResponse.json({ id: latest[0].id });
     }
     return NextResponse.json({ id: 1 });
  } catch(err: any) {
     return NextResponse.json({ id: 1 });
  }
}
