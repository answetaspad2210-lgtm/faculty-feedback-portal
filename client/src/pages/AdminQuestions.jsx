// client/src/pages/AdminQuestions.jsx
// Admin page to view, add, and deactivate feedback questions - lets the
// admin build the multi-section feedback form students see.
// Edit this file to change how question management works.

import React, { useEffect, useState } from 'react';
import * as adminService from '../services/adminService';
import { getErrorMessage } from '../utils/getErrorMessage';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorBanner from '../components/ErrorBanner';
import SuccessBanner from '../components/SuccessBanner';
import EmptyState from '../components/EmptyState';

const QUESTION_TYPES = ['star', 'numeric', 'slider', 'yes_no', 'multiple_choice', 'text'];

const EMPTY_FORM = {
  question: '',
  category: '',
  questionType: 'star',
  options: '', // comma-separated, only used for multiple_choice
  minValue: 1,
  maxValue: 5,
};

export default function AdminQuestions() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);

  function loadQuestions() {
    setLoading(true);
    adminService
      .getAllQuestions()
      .then(setQuestions)
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  }

  useEffect(loadQuestions, []);

  async function handleAdd(e) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const payload = {
        question: form.question,
        category: form.category,
        questionType: form.questionType,
        minValue: Number(form.minValue),
        maxValue: Number(form.maxValue),
        options: form.questionType === 'multiple_choice'
          ? form.options.split(',').map((o) => o.trim()).filter(Boolean)
          : [],
      };
      await adminService.createQuestion(payload);
      setSuccess('Question added successfully.');
      setForm(EMPTY_FORM);
      setShowForm(false);
      loadQuestions();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDeactivate(id) {
    if (!window.confirm('Deactivate this question? It will no longer appear on new feedback forms.')) return;
    try {
      await adminService.deleteQuestion(id);
      setSuccess('Question deactivated.');
      loadQuestions();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-slate-800">Feedback Questions</h1>
        <button className="btn-primary" onClick={() => setShowForm((s) => !s)}>
          {showForm ? 'Cancel' : '+ Add Question'}
        </button>
      </div>

      <ErrorBanner message={error} />
      <SuccessBanner message={success} />

      {showForm && (
        <form onSubmit={handleAdd} className="card mb-6 grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="label-text">Question</label>
            <input className="input-field" value={form.question} onChange={(e) => setForm({ ...form, question: e.target.value })} required />
          </div>
          <div>
            <label className="label-text">Category</label>
            <input className="input-field" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="e.g. Course Content" required />
          </div>
          <div>
            <label className="label-text">Question Type</label>
            <select className="input-field" value={form.questionType} onChange={(e) => setForm({ ...form, questionType: e.target.value })}>
              {QUESTION_TYPES.map((t) => (
                <option key={t} value={t}>{t.replace('_', ' ')}</option>
              ))}
            </select>
          </div>

          {['star', 'numeric', 'slider'].includes(form.questionType) && (
            <>
              <div>
                <label className="label-text">Min Value</label>
                <input type="number" className="input-field" value={form.minValue} onChange={(e) => setForm({ ...form, minValue: e.target.value })} />
              </div>
              <div>
                <label className="label-text">Max Value</label>
                <input type="number" className="input-field" value={form.maxValue} onChange={(e) => setForm({ ...form, maxValue: e.target.value })} />
              </div>
            </>
          )}

          {form.questionType === 'multiple_choice' && (
            <div className="col-span-2">
              <label className="label-text">Options (comma-separated)</label>
              <input className="input-field" value={form.options} onChange={(e) => setForm({ ...form, options: e.target.value })} placeholder="Excellent, Good, Average, Poor" />
            </div>
          )}

          <div className="col-span-2 flex justify-end">
            <button type="submit" className="btn-primary" disabled={submitting}>
              {submitting ? 'Saving...' : 'Save Question'}
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <LoadingSpinner />
      ) : questions.length === 0 ? (
        <EmptyState title="No questions yet" message="Add your first feedback question using the button above." />
      ) : (
        <div className="card p-0 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-500 text-left">
              <tr>
                <th className="px-4 py-3 font-medium">Question</th>
                <th className="px-4 py-3 font-medium">Category</th>
                <th className="px-4 py-3 font-medium">Type</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {questions.map((q) => (
                <tr key={q._id} className="border-t border-slate-100">
                  <td className="px-4 py-3">{q.question}</td>
                  <td className="px-4 py-3 text-slate-500">{q.category}</td>
                  <td className="px-4 py-3 capitalize">{q.questionType.replace('_', ' ')}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${q.isActive ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                      {q.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    {q.isActive && (
                      <button onClick={() => handleDeactivate(q._id)} className="text-xs text-red-600 hover:underline">
                        Deactivate
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
