import { NextResponse } from 'next/server';
import { db, courses } from '@/lib/db';
import { eq, or, ilike, and, like, desc, sql } from 'drizzle-orm';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q') || '';
  const state = searchParams.get('state') || '';
  const type = searchParams.get('type') || '';
  const pageStr = searchParams.get('page') || '1';
  const limitStr = searchParams.get('limit') || '20';
  
  const page = parseInt(pageStr, 10) || 1;
  const limit = parseInt(limitStr, 10) || 20;
  const offset = (page - 1) * limit;

  try {
    const conditions = [];
    
    // State Filter
    if (state) {
      conditions.push(eq(courses.state, state));
    }
    
    // Type Filter (Public, Private, Semi-Private, etc)
    if (type) {
      if (type === 'Private') {
         conditions.push(or(eq(courses.type, 'Private'), ilike(courses.type, '%Private%')));
      } else if (type === 'Public') {
         conditions.push(or(eq(courses.type, 'Public'), ilike(courses.type, '%Public%')));
      } else if (type === 'Resort') {
         conditions.push(or(eq(courses.type, 'Resort'), ilike(courses.type, '%Resort%')));
      } else if (type === 'Semi-Private') {
         conditions.push(or(eq(courses.type, 'Semi-Private'), ilike(courses.type, '%Semi-Private%')));
      } else if (type === 'Municipal') {
         conditions.push(or(eq(courses.type, 'Municipal'), ilike(courses.type, '%Municipal%')));
      }
    }

    // Search query (name, city, zip)
    if (q) {
      const qs = `%${q}%`;
      conditions.push(
        or(
          ilike(courses.name, qs),
          ilike(courses.city, qs),
          like(courses.zip, qs)
        )
      );
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const data = await db
      .select()
      .from(courses)
      .where(whereClause)
      .limit(limit)
      .offset(offset);
      
    // Get total count
    const [countResult] = await db
      .select({ count: sql<number>`count(*)` })
      .from(courses)
      .where(whereClause);
      
    const totalCount = countResult.count;
    
    // Get distinct states
    const statesResult = await db
      .selectDistinct({ state: courses.state })
      .from(courses)
      .orderBy(courses.state);

    return NextResponse.json({
      data,
      totalCount,
      page,
      limit,
      states: statesResult.map(s => s.state).filter(Boolean)
    });
  } catch (error: any) {
    console.error('Failed to fetch courses:', error);
    return NextResponse.json({ error: 'Failed to fetch courses' }, { status: 500 });
  }
}
