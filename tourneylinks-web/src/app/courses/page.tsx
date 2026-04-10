import React from 'react';
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';
import CourseDirectory from '../../components/courses/CourseDirectory';
import { db, courses } from '@/lib/db';
import { sql } from 'drizzle-orm';

export default async function CoursesPage() {
  // SSR pre-fetch the top 24 courses and the total count
  const initialData = await db.select().from(courses).limit(24);
  const totalCountResult = await db.select({ count: sql<number>`count(*)` }).from(courses);
  const initialTotal = Number(totalCountResult[0].count);
  return (
    <div style={{ 
      minHeight: '100vh', 
      position: 'relative',
      backgroundImage: 'url("/aerial-course.jpg")',
      backgroundAttachment: 'fixed',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      overflow: 'hidden'
    }}>
      {/* Immersive Dark Radial Overlay */}
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(10,15,10,0.88) 0%, rgba(5,10,5,0.99) 100%)', zIndex: 0 }} />
      
      <div style={{ position: 'relative', zIndex: 1, paddingTop: '100px', paddingBottom: '2rem' }}>
          <div className="flex flex-col items-center justify-center text-center" style={{ width: '100%', maxWidth: '1400px', margin: '0 auto', padding: '0 2rem' }}>
            <h1 className="hero-headline drop-shadow-[0_4px_10px_rgba(0,0,0,0.8)]" style={{ 
               fontSize: 'clamp(3rem, 7vw, 6rem)', 
               fontFamily: 'var(--font-serif), var(--font-cinzel), serif', 
               backgroundImage: 'linear-gradient(to bottom, #fffdf2 0%, #dfb962 100%)',
               WebkitBackgroundClip: 'text',
               backgroundClip: 'text',
               color: 'transparent',
               marginBottom: '1.5rem',
               lineHeight: 1.1,
               textShadow: '0 4px 20px rgba(0,0,0,0.05)'
            }}>
               Course Directory
            </h1>
            <p style={{ fontSize: 'clamp(1.1rem, 2vw, 1.35rem)', color: 'rgba(255,255,255,0.95)', maxWidth: '850px', lineHeight: 1.6, fontWeight: 400 }}>
               Search our authoritative database of 16,200+ golf courses nationwide to find your next home for a premier tournament.
            </p>
         </div>
         
         <CourseDirectory initialCourses={initialData} initialTotal={initialTotal} />
      </div>
    </div>
  );
}
