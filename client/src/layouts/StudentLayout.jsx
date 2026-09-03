// client/src/layouts/StudentLayout.jsx
// Shared shell for all student-facing pages: a top navbar + content area.
// Edit this file to change the student-side navigation/header.
import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function StudentLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <div className="min-h-screen bg-surface">
      <nav className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between">
        <Link to="/student/dashboard" className="font-semibold text-primary-700 text-lg">
          Faculty Feedback Portal
        </Link>
        <div className="flex items-center gap-4">
          <span className="text-sm text-slate-600">{user?.name}</span>
          <button onClick={handleLogout} className="btn-secondary text-sm py-1.5">
            Logout
          </button>
        </div>
      </nav>
      <main className="max-w-6xl mx-auto px-6 py-8">
        <Outlet />
      </main>
    </div>
  );
}
