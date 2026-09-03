// client/src/components/EmptyState.jsx
// Shown when a list/table has no data - e.g. "no feedback submitted yet".
import React from 'react';

export default function EmptyState({ title = 'Nothing here yet', message = '' }) {
  return (
    <div className="text-center py-12 text-slate-400">
      <p className="text-base font-medium text-slate-500">{title}</p>
      {message && <p className="text-sm mt-1">{message}</p>}
    </div>
  );
}
