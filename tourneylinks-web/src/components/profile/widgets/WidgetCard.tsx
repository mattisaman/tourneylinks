import React from 'react';

interface WidgetCardProps {
  children: React.ReactNode;
  className?: string;
  noPadding?: boolean;
}

export default function WidgetCard({ children, className = '', noPadding = false }: WidgetCardProps) {
  return (
    <div className={`hero-pillar-card w-full ${noPadding ? '!p-0' : '!p-6 lg:!p-8'} ${className}`} style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div className="relative z-10 h-full flex flex-col w-full text-white font-medium" style={{ fontFamily: 'var(--font-cormorant), serif', fontSize: '1.1rem' }}>
         {children}
      </div>
    </div>
  );
}
