import React from 'react';
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';
import CourseDirectory from '@/components/courses/CourseDirectory';

export default function CoursesPage() {
  return (
    <div style={{ background: 'var(--white)', minHeight: '100vh' }}>
      <Navbar />
      
      {/* Premium Sub-Hero */}
      <div style={{ paddingTop: '100px', paddingBottom: '3rem', background: 'linear-gradient(180deg, #fafaf5 0%, #ffffff 100%)' }}>
         <div className="container">
            <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontFamily: "'Clash Display', sans-serif", fontWeight: 600, color: 'var(--forest)', marginBottom: '1rem' }}>
               Global Course Directory
            </h1>
            <p style={{ fontSize: '1.2rem', color: 'var(--mist)', maxWidth: '600px', lineHeight: 1.6 }}>
               Search our authoritative database of 16,300+ golf courses to find your next home for a premier tournament.
            </p>
         </div>
      </div>

      <CourseDirectory />
      <Footer />
    </div>
  );
}
