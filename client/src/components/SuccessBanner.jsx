// client/src/components/SuccessBanner.jsx
// Displays a success confirmation message (e.g. after submitting feedback).
import React from 'react';

export default function SuccessBanner({ message }) {
  if (!message) return null;
  return (
    <div className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg px-4 py-3 mb-4">
      {message}
    </div>
  );
}
