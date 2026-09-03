// client/src/pages/NotFound.jsx
import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
      <p className="text-3xl font-semibold text-slate-800 mb-2">404</p>
      <p className="text-slate-500 mb-6">Page not found.</p>
      <Link to="/login" className="btn-primary">Go to Login</Link>
    </div>
  );
}
