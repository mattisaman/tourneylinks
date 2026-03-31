import { NextResponse } from 'next/server';
import { db, course_holes } from '@/lib/db';
import { eq } from 'drizzle-orm';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
     const resolvedParams = await params;
     const courseId = parseInt(resolvedParams.id);
     if (isNaN(courseId)) {
        return NextResponse.json({ error: "Invalid course ID" }, { status: 400 });
     }
     const holes = await db.select().from(course_holes).where(eq(course_holes.courseId, courseId));
     return NextResponse.json(holes);
  } catch(err: any) {
     return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
