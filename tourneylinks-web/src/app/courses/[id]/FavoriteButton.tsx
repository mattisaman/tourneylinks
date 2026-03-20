'use client';

import React, { useState, useTransition } from 'react';
import { Heart } from 'lucide-react';
import { toggleFavoriteCourse } from '@/app/actions/favoriteCourse';

interface FavoriteButtonProps {
  courseId: number;
  initialFavorited: boolean;
  isSignedIn: boolean;
}

export default function FavoriteButton({ courseId, initialFavorited, isSignedIn }: FavoriteButtonProps) {
  const [isFavorited, setIsFavorited] = useState(initialFavorited);
  const [isPending, startTransition] = useTransition();

  const handleToggle = () => {
    if (!isSignedIn) {
      alert("Please sign in to save this course and receive tournament notifications.");
      return;
    }
    
    // Optimistic UI update masking network latency
    const nextState = !isFavorited;
    setIsFavorited(nextState);

    startTransition(async () => {
      const res = await toggleFavoriteCourse(courseId);
      if (!res.success) {
        // Revert on failure matrix
        setIsFavorited(!nextState);
        alert("Failed to save course. Please securely check your connection.");
      }
    });
  };

  return (
    <button 
      onClick={handleToggle}
      disabled={isPending}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.5rem',
        background: isFavorited ? 'rgba(212,175,55,0.1)' : 'rgba(255,255,255,0.03)',
        border: `1px solid ${isFavorited ? 'rgba(212,175,55,0.4)' : 'rgba(255,255,255,0.1)'}`,
        borderRadius: '50px',
        padding: '0.5rem 1rem',
        color: isFavorited ? 'var(--gold)' : 'var(--white)',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        boxShadow: isFavorited ? '0 4px 15px rgba(212,175,55,0.1)' : 'none'
      }}
      className="hover-highlight"
      title={isFavorited ? "Unsave Course" : "Save Course & Get Tournament Alerts"}
    >
      <Heart 
        size={16} 
        fill={isFavorited ? "var(--gold)" : "none"} 
        strokeWidth={isFavorited ? 0 : 2} 
        color={isFavorited ? "var(--gold)" : "currentColor"} 
      />
      <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>
        {isFavorited ? 'Saved' : 'Save Course'}
      </span>
    </button>
  );
}
