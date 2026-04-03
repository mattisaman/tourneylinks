'use client';

import React from 'react';

export default function PrintButton() {
  return (
    <button 
      className="print-btn no-print" 
      onClick={() => window.print()}
    >
      Print All Documents (8.5x11)
    </button>
  );
}
