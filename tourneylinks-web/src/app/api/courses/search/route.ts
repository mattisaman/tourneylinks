import { NextResponse } from 'next/server';
import { db, courses } from '@/lib/db';
import { ilike, or } from 'drizzle-orm';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q') || '';
  const page = parseInt(searchParams.get('page') || '1');
  const limit = 24;
  const offset = (page - 1) * limit;

  try {
    const conditions = query ? or(ilike(courses.name, `%${query}%`), ilike(courses.city, `%${query}%`)) : undefined;

    const results = await db.select()
      .from(courses)
      .where(conditions)
      .limit(limit)
      .offset(offset);

    // Get simple count (not highly optimized, but sufficient for MVP)
    const allMatches = await db.select({ id: courses.id }).from(courses).where(conditions);
    const totalCount = allMatches.length;

    return NextResponse.json({ courses: results, total: totalCount });
  } catch (error) {
    console.error('Course search error:', error);
    return NextResponse.json({ error: 'Failed to search courses' }, { status: 500 });
  }
}
