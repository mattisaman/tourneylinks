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

  // Query actual Course Staff relations
  const myStaffRecords = await db.select()
     .from(course_staff)
     .where(eq(course_staff.clerkUserId, userId));

  // If Real, fetch the Course Objects they are staff on
  let myCourses: any[] = [];
  if (myStaffRecords.length > 0) {
      for (const record of myStaffRecords) {
         const courseRow = await db.select().from(courses).where(eq(courses.id, record.courseId)).limit(1);
         if (courseRow[0]) {
             myCourses.push(courseRow[0]);
         }
      }
  }

  const isDemo = process.env.NEXT_PUBLIC_IS_DEMO === 'true';

  // Demo fallback strictly if they have no real courses
  if (myCourses.length === 0) {
      if (isDemo) {
          myCourses = [{ id: 10619, name: 'Eagle Vale Golf Course' }];
      }
  }

  return <CourseDashboardClient courseData={myCourses} isDemo={isDemo} />
}
