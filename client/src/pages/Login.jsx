// client/src/pages/Login.jsx
// Shared login page for both students and admins - a toggle switches
// which role is being authenticated against.
// Edit this file to change the login screen's look or fields.

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { getErrorMessage } from '../utils/getErrorMessage';
import ErrorBanner from '../components/ErrorBanner';

export default function Login() {
  const [role, setRole] = useState('student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    setSubmitting(true);
    try {
      const user = await login(email, password, role);
      navigate(user.role === 'admin' ? '/admin/dashboard' : '/student/dashboard');
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-6">
          <h1 className="text-xl font-semibold text-primary-700">Faculty Feedback Portal</h1>
          <p className="text-sm text-slate-500 mt-1">Course Evaluation System</p>
        </div>

        <div className="card">
          {/* Role toggle */}
          <div className="grid grid-cols-2 gap-2 mb-5 bg-slate-100 p-1 rounded-lg">
            {['student', 'admin'].map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRole(r)}
                className={`py-1.5 rounded-md text-sm font-medium capitalize transition-colors ${
                  role === r ? 'bg-white shadow-sm text-primary-700' : 'text-slate-500'
                }`}
              >
                {r}
              </button>
            ))}
          </div>

          <ErrorBanner message={error} />

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label-text">Email</label>
              <input
                type="email"
                className="input-field"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={role === 'admin' ? 'admin@example.com' : 'you@example.edu'}
                autoComplete="email"
              />
            </div>
            <div>
              <label className="label-text">Password</label>
              <input
                type="password"
                className="input-field"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
              />
              <p className="text-xs text-slate-400 mt-1">Forgot password? Contact your administrator.</p>
            </div>
            <button type="submit" className="btn-primary w-full" disabled={submitting}>
              {submitting ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>

        <p className="text-xs text-center text-slate-400 mt-4">
          Demo admin: admin@example.com / Admin@123 · Demo student: aarav.patel@example.edu / Student@123
        </p>
      </div>
    </div>
  );
}
