import React from 'react';
import CourseDirectory from '@/components/ui/CourseDirectory';

export const dynamic = 'force-dynamic';

export default async function CoursesPage() {
  return (
    <div style={{ background: 'var(--white)', minHeight: '100vh' }}>
      <CourseDirectory />
    </div>
  );
}
