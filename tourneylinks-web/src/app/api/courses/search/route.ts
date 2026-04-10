import { NextResponse } from 'next/server';
import { db, courses } from '@/lib/db';
import { ilike, or, and, sql } from 'drizzle-orm';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q') || '';
  const zip = searchParams.get('zip') || '';
  const radius = parseInt(searchParams.get('radius') || '50');
  const state = searchParams.get('state') || 'All';
  
  const page = parseInt(searchParams.get('page') || '1');
  const limit = 24;
  const offset = (page - 1) * limit;

  try {
    const filters = [];

    if (query) {
      filters.push(or(
        ilike(courses.name, `%${query}%`), 
        ilike(courses.city, `%${query}%`),
        ilike(courses.state, `%${query}%`),
        ilike(courses.zip, `%${query}%`)
      ));
    }

    if (state && state !== 'All') {
      filters.push(ilike(courses.state, state));
    }

    if (zip && zip.length >= 3) {
      if (radius < 500) {
         const matchLength = radius <= 20 ? 5 : 3;
         const searchVal = zip.substring(0, matchLength);
         filters.push(or(
             ilike(courses.zip, `${searchVal}%`),
             ilike(courses.city, `%${zip}%`)
         ));
      }
    }

    const conditions = filters.length > 0 ? and(...filters) : undefined;

    const results = await db.select()
      .from(courses)
      .where(conditions)
      .limit(limit)
      .offset(offset);

    // Advanced counting logic relying on Postgres native aggregates
    const totalCountResult = await db.select({ count: sql<number>`count(*)` }).from(courses).where(conditions);
    const totalCount = Number(totalCountResult[0].count);

    return NextResponse.json({ courses: results, total: totalCount });
  } catch (error) {
    console.error('Course search error:', error);
    return NextResponse.json({ error: 'Failed to search courses' }, { status: 500 });
  }
}

