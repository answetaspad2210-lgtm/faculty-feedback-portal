// client/src/components/StarRating.jsx
// A small interactive 1-5 star rating input, used both for individual
// feedback questions and the "overall rating" field.
import React from 'react';

export default function StarRating({ value = 0, onChange, max = 5 }) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: max }, (_, i) => i + 1).map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          className={`text-2xl transition-colors ${
            star <= value ? 'text-amber-400' : 'text-slate-300'
          } hover:text-amber-400`}
          aria-label={`Rate ${star} out of ${max}`}
        >
          ★
        </button>
      ))}
    </div>
  );
}
