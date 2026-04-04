import React from 'react';
import { db, course_staff, courses } from '@/lib/db';
import { eq } from 'drizzle-orm';
import { getUserId } from '@/lib/auth-util';
import { redirect } from 'next/navigation';
import CourseDashboardClient from '@/components/courses/CourseDashboardClient';

export const dynamic = 'force-dynamic';

export default async function CourseDashboardServer() {
  const { userId } = await getUserId();
  if (!userId) redirect('/');

  // Query courses they actively own via the new PGA Claim system
  const claimedCourses = await db.select()
     .from(courses)
     .where(eq(courses.claimedByUserId, userId));

  let myCourses: any[] = [...claimedCourses];

  const isDemo = process.env.NEXT_PUBLIC_IS_DEMO === 'true';

  // Demo fallback strictly if they have no real courses
  if (myCourses.length === 0) {
      if (isDemo) {
          myCourses = [{ id: 10619, name: 'Eagle Vale Golf Course' }];
      }
  }

  // Fetch scorecards for the active course
  const { course_scorecards } = await import('@/lib/db');
  let loadedScorecards = [];
  if (myCourses.length > 0) {
      // Map JSONB string back to object array
      const rawScorecards = await db.select().from(course_scorecards).where(eq(course_scorecards.courseId, myCourses[0].id));
      loadedScorecards = rawScorecards.map(s => ({
          teeBoxName: s.teeBoxName,
          teeBoxColorHex: s.teeBoxColorHex,
          gender: s.gender,
          holes: JSON.parse(s.holesData || '[]')
      }));
      // Inject to first course object
      myCourses[0].scorecards = loadedScorecards;
  }

  return <CourseDashboardClient courseData={myCourses} isDemo={isDemo} />
}
