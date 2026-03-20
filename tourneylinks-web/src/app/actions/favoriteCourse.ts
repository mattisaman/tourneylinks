'use server';

import { db, saved_courses } from '@/lib/db';
import { eq, and } from 'drizzle-orm';
import { auth } from '@clerk/nextjs/server';

export async function toggleFavoriteCourse(courseId: number) {
  const { userId } = await auth();
  if (!userId) return { success: false, error: 'Unauthorized' };

  try {
    const existing = await db.select()
      .from(saved_courses)
      .where(and(eq(saved_courses.userId, userId), eq(saved_courses.courseId, courseId)))
      .limit(1);

    if (existing.length > 0) {
      // Unfavorite
      await db.delete(saved_courses).where(eq(saved_courses.id, existing[0].id));
      return { success: true, isFavorited: false };
    } else {
      // Favorite
      await db.insert(saved_courses).values({
        userId,
        courseId,
        notifyOnNewTournament: true // Opt-in logic is native for rapid ecosystem alerts
      });
      return { success: true, isFavorited: true };
    }
  } catch (error) {
    console.error("toggleFavoriteCourse error:", error);
    return { success: false, error: 'Database error' };
  }
}

export async function getIsFavorited(courseId: number) {
  const { userId } = await auth();
  if (!userId) return false;

  try {
    const existing = await db.select()
      .from(saved_courses)
      .where(and(eq(saved_courses.userId, userId), eq(saved_courses.courseId, courseId)))
      .limit(1);
    return existing.length > 0;
  } catch (error) {
    return false;
  }
}
