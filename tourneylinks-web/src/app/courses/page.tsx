import React from 'react';
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';
import CourseDirectory from '../../components/courses/CourseDirectory';

export default function CoursesPage() {
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
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(15,25,15,0.7) 0%, rgba(10,20,10,0.95) 100%)', zIndex: 0 }} />
      
      <div style={{ position: 'relative', zIndex: 1, paddingTop: '60px', paddingBottom: '3rem' }}>
         <div style={{ width: '100%', maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem' }}>
            <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontFamily: "'Clash Display', sans-serif", fontWeight: 600, color: 'var(--white)', marginBottom: '1rem', textShadow: '0 4px 20px rgba(0,0,0,0.5)' }}>
               Global Course Directory
            </h1>
            <p style={{ fontSize: '1.25rem', color: 'rgba(255,255,255,0.7)', maxWidth: '650px', lineHeight: 1.6 }}>
               Search our authoritative database of 16,200+ golf courses to find your next home for a premier tournament.
            </p>
         </div>
      </div>

      <CourseDirectory />
    </div>
  );
}
