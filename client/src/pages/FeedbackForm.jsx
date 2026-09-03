// client/src/pages/FeedbackForm.jsx
// Multi-section feedback form for a single course. Fetches the active
// question set, groups it by category, and validates that every
// question has an answer before submitting.
// Edit this file to change the feedback form UI/flow.

import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getFeedbackQuestions, submitFeedback } from '../services/studentService';
import { getErrorMessage } from '../utils/getErrorMessage';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorBanner from '../components/ErrorBanner';
import StarRating from '../components/StarRating';
import QuestionInput from '../components/QuestionInput';

export default function FeedbackForm() {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({}); // { questionId: value }
  const [overallRating, setOverallRating] = useState(0);
  const [anonymous, setAnonymous] = useState(false);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    getFeedbackQuestions()
      .then(setQuestions)
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  }, []);

  // Group questions by category so we can render them as sections,
  // e.g. { "Course Content": [...], "Faculty Teaching": [...] }
  const grouped = useMemo(() => {
    return questions.reduce((acc, q) => {
      acc[q.category] = acc[q.category] || [];
      acc[q.category].push(q);
      return acc;
    }, {});
  }, [questions]);

  function handleAnswerChange(questionId, value) {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    // Frontend validation (backend re-validates everything regardless -
    // see server/services/feedbackService.js).
    if (!overallRating) {
      setError('Please provide an overall rating before submitting.');
      return;
    }
    const missing = questions.find((q) => q.questionType !== 'text' && !answers[q._id]);
    if (missing) {
      setError(`Please answer: "${missing.question}"`);
      return;
    }

    const payload = {
      courseId,
      overallRating,
      anonymous,
      answers: questions.map((q) => ({
        question: q._id,
        value: answers[q._id] ?? '',
      })),
    };

    setSubmitting(true);
    try {
      await submitFeedback(payload);
      navigate('/student/dashboard', { state: { feedbackSubmitted: true } });
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <LoadingSpinner label="Loading feedback form..." />;

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-xl font-semibold text-slate-800 mb-1">Course Feedback</h1>
      <p className="text-sm text-slate-500 mb-6">
        Your responses help improve teaching quality. Please answer honestly.
      </p>

      <ErrorBanner message={error} />

      <form onSubmit={handleSubmit} className="space-y-6">
        {Object.entries(grouped).map(([category, categoryQuestions]) => (
          <div key={category} className="card">
            <h2 className="text-sm font-semibold text-primary-700 mb-4">{category}</h2>
            <div className="space-y-5">
              {categoryQuestions.map((q) => (
                <div key={q._id}>
                  <label className="label-text">{q.question}</label>
                  <QuestionInput
                    question={q}
                    value={answers[q._id]}
                    onChange={(val) => handleAnswerChange(q._id, val)}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="card">
          <h2 className="text-sm font-semibold text-primary-700 mb-3">Overall Rating</h2>
          <p className="text-sm text-slate-600 mb-2">How would you rate this course/faculty overall?</p>
          <StarRating value={overallRating} onChange={setOverallRating} />
        </div>

        <div className="card flex items-start gap-3">
          <input
            type="checkbox"
            id="anonymous"
            checked={anonymous}
            onChange={(e) => setAnonymous(e.target.checked)}
            className="mt-1"
          />
          <label htmlFor="anonymous" className="text-sm text-slate-600">
            <span className="font-medium text-slate-700">Submit feedback anonymously.</span>{' '}
            Your identity will be hidden from standard administrative reports. Backend safeguards
            still prevent duplicate submissions, but individual reviewers will not see your name.
          </label>
        </div>

        <div className="flex justify-end gap-3">
          <button type="button" className="btn-secondary" onClick={() => navigate('/student/dashboard')}>
            Cancel
          </button>
          <button type="submit" className="btn-primary" disabled={submitting}>
            {submitting ? 'Submitting...' : 'Submit Feedback'}
          </button>
        </div>
      </form>
    </div>
  );
}
