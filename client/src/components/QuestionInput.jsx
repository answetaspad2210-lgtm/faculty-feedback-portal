// client/src/components/QuestionInput.jsx
// Renders the correct input control for a feedback question depending
// on its questionType (star / numeric / slider / yes_no / multiple_choice / text).
// Keeping this separate from FeedbackForm.jsx keeps that page focused on
// layout/submission rather than input-type branching.

import React from 'react';
import StarRating from './StarRating';

export default function QuestionInput({ question, value, onChange }) {
  const { questionType, minValue = 1, maxValue = 5, options = [] } = question;

  switch (questionType) {
    case 'star':
      return <StarRating value={Number(value) || 0} onChange={onChange} max={maxValue} />;

    case 'numeric':
      return (
        <div className="flex gap-2">
          {Array.from({ length: maxValue - minValue + 1 }, (_, i) => minValue + i).map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => onChange(n)}
              className={`h-8 w-8 rounded-full text-sm font-medium border transition-colors ${
                Number(value) === n
                  ? 'bg-primary-600 text-white border-primary-600'
                  : 'border-slate-300 text-slate-600 hover:border-primary-400'
              }`}
            >
              {n}
            </button>
          ))}
        </div>
      );

    case 'slider':
      return (
        <div className="flex items-center gap-3">
          <input
            type="range"
            min={minValue}
            max={maxValue}
            value={value || minValue}
            onChange={(e) => onChange(Number(e.target.value))}
            className="w-full accent-primary-600"
          />
          <span className="text-sm font-medium text-slate-600 w-6 text-center">{value || minValue}</span>
        </div>
      );

    case 'yes_no':
      return (
        <div className="flex gap-2">
          {['Yes', 'No'].map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => onChange(opt)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
                value === opt
                  ? 'bg-primary-600 text-white border-primary-600'
                  : 'border-slate-300 text-slate-600 hover:border-primary-400'
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      );

    case 'multiple_choice':
      return (
        <div className="flex flex-wrap gap-2">
          {options.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => onChange(opt)}
              className={`px-3 py-1.5 rounded-lg text-sm border transition-colors ${
                value === opt
                  ? 'bg-primary-600 text-white border-primary-600'
                  : 'border-slate-300 text-slate-600 hover:border-primary-400'
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      );

    case 'text':
      return (
        <textarea
          className="input-field"
          rows={3}
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Type your response (optional)..."
        />
      );

    default:
      return null;
  }
}
