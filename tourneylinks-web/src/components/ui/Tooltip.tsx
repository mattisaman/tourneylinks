"use client";

import React, { useState, useRef, useEffect } from 'react';

interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  width?: number;
}

export function Tooltip({ content, children, width = 280 }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isVisible && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setPosition({
        top: rect.bottom + 10,
        left: rect.left + (rect.width / 2) - (width / 2),
      });
    }
  }, [isVisible, width]);

  return (
    <div 
      ref={containerRef}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      style={{ display: 'inline-flex', position: 'relative', cursor: 'help' }}
    >
      {children}
      
      {isVisible && (
        <div style={{
          position: 'fixed',
          top: position.top,
          left: position.left,
          width: width,
          background: '#111',
          border: '1px solid var(--admin-bark-brown)',
          color: 'var(--admin-golf-white)',
          padding: '1rem',
          borderRadius: '6px', // Zero-pill strictly enforced
          boxShadow: '0 8px 30px rgba(0,0,0,0.6)',
          zIndex: 9999,
          fontSize: '0.85rem',
          lineHeight: 1.5,
          fontWeight: 400,
          pointerEvents: 'none', // Prevent tooltip from interfering with hovers
          animation: 'tooltipFade 0.2s ease-out forwards'
        }}>
          {/* Internal Max Pro styling hook */}
          <style dangerouslySetInnerHTML={{__html: `
            @keyframes tooltipFade {
              from { opacity: 0; transform: translateY(-4px); }
              to { opacity: 1; transform: translateY(0); }
            }
          `}} />
          {content}
        </div>
      )}
    </div>
  );
}
