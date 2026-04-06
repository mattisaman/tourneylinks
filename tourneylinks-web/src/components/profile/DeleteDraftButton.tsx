'use client';

import React, { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function DeleteDraftButton({ tournamentId }: { tournamentId: number }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this drafted campaign? This action is irreversible.')) {
      setLoading(true);
      try {
        const res = await fetch(`/api/admin/tournaments/${tournamentId}`, { method: 'DELETE' });
        if (res.ok) {
          router.refresh();
        } else {
          alert('Failed to delete draft.');
        }
      } catch (err) {
        alert('Network error.');
      }
      setLoading(false);
    }
  };

  return (
    <button 
      onClick={handleDelete}
      disabled={loading}
      className={`bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] text-white hover:text-red-400 hover:border-red-400 p-3 rounded transition-colors flex items-center justify-center ${loading ? 'opacity-50' : ''}`}
      title="Delete Draft"
    >
      <Trash2 size={16} />
    </button>
  );
}
